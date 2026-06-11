$ErrorActionPreference = "Stop"

$Project = "C:\projects\synq-android-apps"
$Module = "synq-tv"
$PackageName = "com.synq.tv"
$OutputDir = "$env:USERPROFILE\Desktop\SYNQ_APK"
$ManifestPath = "$Project\$Module\src\main\AndroidManifest.xml"
$MainActivityPath = "$Project\$Module\src\main\java\com\synq\tv\MainActivity.java"
$PatchJs = "$env:TEMP\patch_synq_generic_launcher.cjs"
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

$backupDir = "$Project\_backups"
New-Item -ItemType Directory -Force $backupDir | Out-Null
Copy-Item $MainActivityPath "$backupDir\MainActivity.before_generic_launcher.java" -Force
Copy-Item $ManifestPath "$backupDir\AndroidManifest.before_generic_launcher.xml" -Force

$patchJsContent = @'
const fs = require("fs");

const javaPath = process.argv[2];
let java = fs.readFileSync(javaPath, "utf8");

function addImport(importLine) {
  if (!java.includes(importLine)) {
    java = java.replace(/(package\s+com\.synq\.tv;\s*)/, `$1\n${importLine}\n`);
  }
}

addImport("import android.content.Intent;");
addImport("import android.content.pm.PackageManager;");
addImport("import android.content.pm.ResolveInfo;");
addImport("import java.util.List;");

const method = `
    public void openOldHome() {
        runOnUiThread(() -> {
            try {
                PackageManager pm = getPackageManager();

                Intent homeIntent = new Intent(Intent.ACTION_MAIN);
                homeIntent.addCategory(Intent.CATEGORY_HOME);

                List<ResolveInfo> launchers = pm.queryIntentActivities(homeIntent, PackageManager.MATCH_DEFAULT_ONLY);

                for (ResolveInfo info : launchers) {
                    if (info == null || info.activityInfo == null) {
                        continue;
                    }

                    String packageName = info.activityInfo.packageName;
                    String activityName = info.activityInfo.name;

                    if (packageName == null || activityName == null) {
                        continue;
                    }

                    if (packageName.equals(getPackageName())) {
                        continue;
                    }

                    if (packageName.equals("android")) {
                        continue;
                    }

                    Intent launcherIntent = new Intent(Intent.ACTION_MAIN);
                    launcherIntent.addCategory(Intent.CATEGORY_LAUNCHER);
                    launcherIntent.setClassName(packageName, activityName);
                    launcherIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(launcherIntent);
                    return;
                }

                Intent appSettingsIntent = new Intent(android.provider.Settings.ACTION_APPLICATION_SETTINGS);
                appSettingsIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(appSettingsIntent);
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
`;

function replaceMethod(src, methodName, replacement) {
  const signatureIndex = src.indexOf(`public void ${methodName}()`);
  let index = signatureIndex;

  if (index === -1) {
    index = src.indexOf(`void ${methodName}()`);
  }

  if (index === -1) {
    const lastBrace = src.lastIndexOf("}");
    if (lastBrace === -1) {
      throw new Error("Cannot find class closing brace");
    }
    return src.slice(0, lastBrace) + "\n" + replacement + "\n" + src.slice(lastBrace);
  }

  const methodStart = src.lastIndexOf("\n", index) + 1;
  const openBrace = src.indexOf("{", index);

  if (openBrace === -1) {
    throw new Error("Cannot find method open brace");
  }

  let depth = 0;
  let end = -1;

  for (let i = openBrace; i < src.length; i++) {
    const ch = src[i];

    if (ch === "{") {
      depth++;
    }

    if (ch === "}") {
      depth--;

      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }

  if (end === -1) {
    throw new Error("Cannot find method closing brace");
  }

  return src.slice(0, methodStart) + replacement + src.slice(end);
}

java = replaceMethod(java, "openOldHome", method);

// Balance braces only if the previous file was missing class ending braces.
const openCount = (java.match(/\{/g) || []).length;
const closeCount = (java.match(/\}/g) || []).length;

if (openCount > closeCount) {
  java = java.trimEnd() + "\n" + "}\n".repeat(openCount - closeCount);
}

fs.writeFileSync(javaPath, java, "utf8");
console.log("Patched openOldHome with generic launcher detection");
'@

Write-Utf8NoBom $PatchJs $patchJsContent
node $PatchJs $MainActivityPath
Stop-IfFailed "Java launcher patch"

# Make SYNQ TV eligible as a Home app, but keep it generic for any streamer.
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

New-Item -ItemType Directory -Force $OutputDir | Out-Null

Push-Location $Project
try {
    .\gradlew.bat :synq-tv:assembleDebug --stacktrace
    Stop-IfFailed "Gradle build"

    $apk = "$Project\$Module\build\outputs\apk\debug\synq-tv-debug.apk"
    if (!(Test-Path $apk)) {
        throw "APK not found after successful build: $apk"
    }

    Copy-Item $apk "$OutputDir\SYNQ_TV_HOME_GENERIC_LAUNCHER.apk" -Force
}
finally {
    Pop-Location
}

Write-Host ""
Write-Host "DONE"
Write-Host "$OutputDir\SYNQ_TV_HOME_GENERIC_LAUNCHER.apk"
Write-Host ""
Write-Host "Install:"
Write-Host "adb uninstall $PackageName"
Write-Host "adb install -r `"$OutputDir\SYNQ_TV_HOME_GENERIC_LAUNCHER.apk`""
Write-Host "adb shell monkey -p $PackageName 1"
Write-Host ""
Write-Host "Important:"
Write-Host "On each real streamer, set SYNQ TV as the default Home app manually once:"
Write-Host "Settings > Apps > Default apps > Home app > SYNQ TV"
