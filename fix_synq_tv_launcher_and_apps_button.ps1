$ErrorActionPreference = "Stop"

$Project = "C:\projects\synq-android-apps"
$Module = "synq-tv"
$PackageName = "com.synq.tv"
$OutputDir = "$env:USERPROFILE\Desktop\SYNQ_APK"
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

function Write-Utf8NoBom($Path, $Content) {
    $dir = Split-Path $Path -Parent
    if ($dir -and !(Test-Path $dir)) {
        New-Item -ItemType Directory -Force $dir | Out-Null
    }
    [System.IO.File]::WriteAllText($Path, $Content, $utf8NoBom)
}

function Find-MainActivityPath {
    $candidates = @(
        "$Project\$Module\src\main\java\com\synq\tv\MainActivity.java",
        "$Project\$Module\src\main\java\com\synq\tvnative\MainActivity.java"
    )

    foreach ($candidate in $candidates) {
        if (Test-Path $candidate) {
            return $candidate
        }
    }

    $found = Get-ChildItem "$Project\$Module\src\main\java" -Recurse -Filter "MainActivity.java" | Select-Object -First 1
    if ($found) {
        return $found.FullName
    }

    throw "MainActivity.java not found"
}

$ManifestPath = "$Project\$Module\src\main\AndroidManifest.xml"
$MainActivityPath = Find-MainActivityPath

if (!(Test-Path $ManifestPath)) {
    throw "AndroidManifest.xml not found: $ManifestPath"
}

$manifest = Get-Content $ManifestPath -Raw -Encoding UTF8

# Make SYNQ TV eligible as a real HOME launcher.
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

# Keep normal app icon in launcher too.
if ($manifest -notmatch 'android\.intent\.category\.LEANBACK_LAUNCHER') {
    $manifest = $manifest -replace '(<category android:name="android.intent.category.LAUNCHER" />)', "`$1`n                <category android:name=`"android.intent.category.LEANBACK_LAUNCHER`" />"
}

Write-Utf8NoBom $ManifestPath $manifest

$java = Get-Content $MainActivityPath -Raw -Encoding UTF8

# Add imports if missing.
if ($java -notmatch 'import android\.content\.ComponentName;') {
    $java = $java -replace 'import android\.content\.Intent;', "import android.content.Intent;`nimport android.content.ComponentName;"
}

if ($java -notmatch 'import android\.content\.pm\.PackageManager;') {
    $java = $java -replace 'import android\.content\.ComponentName;', "import android.content.ComponentName;`nimport android.content.pm.PackageManager;`nimport android.content.pm.ResolveInfo;`nimport java.util.List;"
}

# Replace or add openOldHome method with explicit launcher opening.
$openOldHomeMethod = @'
    public void openOldHome() {
        runOnUiThread(() -> {
            try {
                String[] launcherPackages = new String[] {
                    "com.htc.launcher",
                    "com.htc.launcher.en",
                    "com.htc.android.launcher",
                    "com.android.tvlauncher",
                    "com.google.android.tvlauncher",
                    "com.google.android.apps.tv.launcherx",
                    "com.android.launcher3",
                    "com.droidlogic.mboxlauncher",
                    "com.mitv.tvhome"
                };

                PackageManager pm = getPackageManager();

                for (String packageName : launcherPackages) {
                    Intent launchIntent = pm.getLaunchIntentForPackage(packageName);
                    if (launchIntent != null) {
                        launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        startActivity(launchIntent);
                        return;
                    }
                }

                Intent appsIntent = new Intent(android.provider.Settings.ACTION_APPLICATION_SETTINGS);
                appsIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(appsIntent);
            } catch (Exception e) {
                try {
                    Intent settingsIntent = new Intent(android.provider.Settings.ACTION_SETTINGS);
                    settingsIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(settingsIntent);
                } catch (Exception ignored) {
                }
            }
        });
    }
'@

if ($java -match 'public void openOldHome\(\)\s*\{[\s\S]*?\n    \}') {
    $java = [regex]::Replace($java, '    public void openOldHome\(\)\s*\{[\s\S]*?\n    \}', $openOldHomeMethod, 1)
}
elseif ($java -match 'void openOldHome\(\)\s*\{[\s\S]*?\n    \}') {
    $java = [regex]::Replace($java, '    void openOldHome\(\)\s*\{[\s\S]*?\n    \}', $openOldHomeMethod, 1)
}
else {
    $java = $java -replace '\n}\s*$', "`n$openOldHomeMethod`n}`n"
}

Write-Utf8NoBom $MainActivityPath $java

New-Item -ItemType Directory -Force $OutputDir | Out-Null

Push-Location $Project
try {
    .\gradlew.bat :synq-tv:assembleDebug --stacktrace

    $apk = "$Project\$Module\build\outputs\apk\debug\synq-tv-debug.apk"
    if (!(Test-Path $apk)) {
        throw "APK not found after build: $apk"
    }

    Copy-Item $apk "$OutputDir\SYNQ_TV_HOME_LAUNCHER.apk" -Force
}
finally {
    Pop-Location
}

Write-Host ""
Write-Host "DONE"
Write-Host "$OutputDir\SYNQ_TV_HOME_LAUNCHER.apk"
Write-Host ""
Write-Host "Install:"
Write-Host "adb uninstall $PackageName"
Write-Host "adb install -r `"$OutputDir\SYNQ_TV_HOME_LAUNCHER.apk`""
Write-Host "adb shell monkey -p $PackageName 1"
Write-Host ""
Write-Host "Set as home if supported:"
Write-Host "adb shell cmd package set-home-activity $PackageName/.MainActivity"
