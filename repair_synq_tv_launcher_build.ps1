$ErrorActionPreference = "Stop"

$Project = "C:\projects\synq-android-apps"
$Module = "synq-tv"
$PackageName = "com.synq.tv"
$OutputDir = "$env:USERPROFILE\Desktop\SYNQ_APK"
$ManifestPath = "$Project\$Module\src\main\AndroidManifest.xml"
$MainActivityPath = "$Project\$Module\src\main\java\com\synq\tv\MainActivity.java"
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

function Write-Utf8NoBom($Path, $Content) {
    $dir = Split-Path $Path -Parent
    if ($dir -and !(Test-Path $dir)) {
        New-Item -ItemType Directory -Force $dir | Out-Null
    }
    [System.IO.File]::WriteAllText($Path, $Content, $utf8NoBom)
}

function Stop-IfFailed($StepName) {
    if ($LASTEXITCODE -ne 0) {
        throw "$StepName failed with exit code $LASTEXITCODE"
    }
}

if (!(Test-Path $MainActivityPath)) {
    throw "MainActivity.java not found: $MainActivityPath"
}

if (!(Test-Path $ManifestPath)) {
    throw "AndroidManifest.xml not found: $ManifestPath"
}

# Backup before repair
$backupDir = "$Project\_backups"
New-Item -ItemType Directory -Force $backupDir | Out-Null
Copy-Item $MainActivityPath "$backupDir\MainActivity.before_launcher_repair.java" -Force
Copy-Item $ManifestPath "$backupDir\AndroidManifest.before_launcher_repair.xml" -Force

# Fix broken Java file from previous regex replacement by balancing closing braces.
# This is intentionally minimal so it does not destroy the working WebView app.
$java = Get-Content $MainActivityPath -Raw -Encoding UTF8

$openBraces = ([regex]::Matches($java, "\{")).Count
$closeBraces = ([regex]::Matches($java, "\}")).Count
$missing = $openBraces - $closeBraces

if ($missing -gt 0) {
    Write-Host "MainActivity.java is missing $missing closing brace(s). Repairing..."
    $java = $java.TrimEnd() + ("`r`n}" * $missing) + "`r`n"
    Write-Utf8NoBom $MainActivityPath $java
}
elseif ($missing -lt 0) {
    throw "MainActivity.java has too many closing braces. Restore backup needed."
}
else {
    Write-Host "MainActivity.java braces are already balanced."
}

# Make SYNQ TV available as a Home Launcher.
$manifest = Get-Content $ManifestPath -Raw -Encoding UTF8

if ($manifest -notmatch 'android\.intent\.category\.HOME') {
    $homeFilter = @'

            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.HOME" />
                <category android:name="android.intent.category.DEFAULT" />
            </intent-filter>
'@
    $manifest = $manifest -replace '(</activity>)', ($homeFilter + "`n        `$1")
}

if ($manifest -notmatch 'android\.intent\.category\.LEANBACK_LAUNCHER') {
    $manifest = $manifest -replace '(<category android:name="android.intent.category.LAUNCHER" />)', "`$1`n                <category android:name=`"android.intent.category.LEANBACK_LAUNCHER`" />"
}

Write-Utf8NoBom $ManifestPath $manifest

# Build and stop immediately if it fails.
New-Item -ItemType Directory -Force $OutputDir | Out-Null

Push-Location $Project
try {
    .\gradlew.bat :synq-tv:assembleDebug --stacktrace
    Stop-IfFailed "Gradle build"

    $apk = "$Project\$Module\build\outputs\apk\debug\synq-tv-debug.apk"
    if (!(Test-Path $apk)) {
        throw "APK not found after successful build: $apk"
    }

    Copy-Item $apk "$OutputDir\SYNQ_TV_HOME_LAUNCHER_FIXED.apk" -Force
}
finally {
    Pop-Location
}

Write-Host ""
Write-Host "DONE"
Write-Host "$OutputDir\SYNQ_TV_HOME_LAUNCHER_FIXED.apk"
Write-Host ""
Write-Host "Install commands:"
Write-Host "adb uninstall $PackageName"
Write-Host "adb install -r `"$OutputDir\SYNQ_TV_HOME_LAUNCHER_FIXED.apk`""
Write-Host "adb shell monkey -p $PackageName 1"
Write-Host ""
Write-Host "Then set Home app manually on streamer if needed:"
Write-Host "Settings > Apps > Default apps > Home app > SYNQ TV"
