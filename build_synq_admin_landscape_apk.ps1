$ErrorActionPreference = "Stop"

$Project = "C:\projects\synq-android-apps"
$Module = "synq-admin"
$PackageName = "com.synq.admin"
$AdminUrl = "https://synq-tv.vercel.app/admin"
$OutputDir = "$env:USERPROFILE\Desktop\SYNQ_APK"
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

if (!(Test-Path $Project)) {
    throw "Android project not found: $Project"
}

New-Item -ItemType Directory -Force "$Project\$Module\src\main\java\com\synq\admin" | Out-Null
New-Item -ItemType Directory -Force "$Project\$Module\src\main\res\values" | Out-Null
New-Item -ItemType Directory -Force $OutputDir | Out-Null

$settingsPath = "$Project\settings.gradle"
$settings = Get-Content $settingsPath -Raw -Encoding UTF8

if ($settings -notmatch "include ':$Module'") {
    $settings = $settings.TrimEnd() + "`r`ninclude ':$Module'`r`n"
    Write-Utf8NoBom $settingsPath $settings
}

$buildGradle = @'
plugins {
    id 'com.android.application'
}

android {
    namespace 'com.synq.admin'
    compileSdk 35

    defaultConfig {
        applicationId 'com.synq.admin'
        minSdk 23
        targetSdk 35
        versionCode 1
        versionName '1.0'
    }

    compileOptions {
        encoding 'UTF-8'
    }
}

tasks.withType(JavaCompile).configureEach {
    options.encoding = 'UTF-8'
}
'@

Write-Utf8NoBom "$Project\$Module\build.gradle" $buildGradle

$styles = @'
<resources>
    <style name="AppTheme" parent="android:style/Theme.Material.Light.NoActionBar">
        <item name="android:windowNoTitle">true</item>
        <item name="android:windowActionBar">false</item>
        <item name="android:windowFullscreen">true</item>
        <item name="android:fontFamily">sans</item>
        <item name="android:colorAccent">#7e4bb5</item>
        <item name="android:windowLightStatusBar">false</item>
    </style>
</resources>
'@

Write-Utf8NoBom "$Project\$Module\src\main\res\values\styles.xml" $styles

$manifest = @'
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:theme="@style/AppTheme"
        android:label="SYNQ Admin"
        android:usesCleartextTraffic="true"
        android:allowBackup="false"
        android:supportsRtl="true"
        android:resizeableActivity="true">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:screenOrientation="landscape"
            android:configChanges="keyboard|keyboardHidden|orientation|screenSize">

            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
                <category android:name="android.intent.category.LEANBACK_LAUNCHER" />
            </intent-filter>

        </activity>
    </application>
</manifest>
'@

Write-Utf8NoBom "$Project\$Module\src\main\AndroidManifest.xml" $manifest

$java = @"
package com.synq.admin;

import android.app.Activity;
import android.graphics.Color;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.Window;
import android.webkit.CookieManager;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.ProgressBar;
import android.widget.TextView;

public class MainActivity extends Activity {
    private static final String ADMIN_URL = "$AdminUrl";
    private WebView webView;
    private ProgressBar progressBar;
    private TextView errorText;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        hideSystemUi();
        buildUi();
        loadAdmin();
    }

    @Override
    protected void onResume() {
        super.onResume();
        hideSystemUi();

        if (webView != null) {
            webView.onResume();
            webView.resumeTimers();
        }
    }

    @Override
    protected void onPause() {
        if (webView != null) {
            webView.onPause();
            webView.pauseTimers();
        }

        super.onPause();
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
            return;
        }

        super.onBackPressed();
    }

    private void hideSystemUi() {
        getWindow().getDecorView().setSystemUiVisibility(
            View.SYSTEM_UI_FLAG_FULLSCREEN |
            View.SYSTEM_UI_FLAG_HIDE_NAVIGATION |
            View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY |
            View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |
            View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION |
            View.SYSTEM_UI_FLAG_LAYOUT_STABLE
        );
    }

    private void buildUi() {
        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.rgb(251, 247, 255));

        webView = new WebView(this);
        root.addView(webView, new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT,
            FrameLayout.LayoutParams.MATCH_PARENT
        ));

        progressBar = new ProgressBar(this);
        FrameLayout.LayoutParams progressParams = new FrameLayout.LayoutParams(90, 90, Gravity.CENTER);
        root.addView(progressBar, progressParams);

        errorText = new TextView(this);
        errorText.setText("SYNQ Admin נטען...");
        errorText.setTextSize(20);
        errorText.setTextColor(Color.rgb(91, 49, 153));
        errorText.setGravity(Gravity.CENTER);
        errorText.setVisibility(View.GONE);
        errorText.setPadding(40, 40, 40, 40);
        root.addView(errorText, new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT,
            FrameLayout.LayoutParams.MATCH_PARENT
        ));

        setContentView(root);
    }

    private void loadAdmin() {
        WebSettings settings = webView.getSettings();

        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setMediaPlaybackRequiresUserGesture(false);

        // Admin should behave like a normal mobile/tablet app, not desktop zoom-out.
        settings.setUseWideViewPort(false);
        settings.setLoadWithOverviewMode(false);
        settings.setTextZoom(100);
        settings.setSupportZoom(true);
        settings.setBuiltInZoomControls(true);
        settings.setDisplayZoomControls(false);

        settings.setCacheMode(WebSettings.LOAD_DEFAULT);

        CookieManager.getInstance().setAcceptCookie(true);
        CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true);

        webView.setBackgroundColor(Color.rgb(251, 247, 255));
        webView.setWebChromeClient(new WebChromeClient());

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                progressBar.setVisibility(View.GONE);
                errorText.setVisibility(View.GONE);

                view.evaluateJavascript(
                    "(function(){" +
                    "document.documentElement.style.overflow='auto';" +
                    "document.body.style.overflow='auto';" +
                    "document.body.style.zoom='1';" +
                    "var m=document.querySelector('meta[name=viewport]');" +
                    "if(!m){m=document.createElement('meta');m.name='viewport';document.head.appendChild(m);}" +
                    "m.content='width=device-width, initial-scale=1.0, maximum-scale=3.0, user-scalable=yes';" +
                    "})()",
                    null
                );
            }

            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                progressBar.setVisibility(View.GONE);
                errorText.setText("שגיאה בטעינת SYNQ Admin\n" + description);
                errorText.setVisibility(View.VISIBLE);
            }
        });

        webView.clearCache(false);
        webView.loadUrl(ADMIN_URL);
    }
}
"@

Write-Utf8NoBom "$Project\$Module\src\main\java\com\synq\admin\MainActivity.java" $java

Push-Location $Project
try {
    .\gradlew.bat :synq-admin:assembleDebug --stacktrace
    Stop-IfFailed "Gradle build"

    $apk = "$Project\$Module\build\outputs\apk\debug\synq-admin-debug.apk"

    if (!(Test-Path $apk)) {
        throw "APK not found after build: $apk"
    }

    Copy-Item $apk "$OutputDir\SYNQ_ADMIN_LANDSCAPE.apk" -Force
}
finally {
    Pop-Location
}

Write-Host ""
Write-Host "DONE"
Write-Host "$OutputDir\SYNQ_ADMIN_LANDSCAPE.apk"
Write-Host ""
Write-Host "Install:"
Write-Host "adb uninstall $PackageName"
Write-Host "adb install -r `"$OutputDir\SYNQ_ADMIN_LANDSCAPE.apk`""
Write-Host "adb shell monkey -p $PackageName 1"
