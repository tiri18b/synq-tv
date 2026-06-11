param(
    [Parameter(Mandatory=$true)]
    [string]$BaseUrl,

    [string]$ProjectPath = "C:\projects\synq-android-apps",

    [string]$CompileSdk = "35",

    [string]$MinSdk = "23",

    [string]$GradleVersion = "8.10.2",

    [switch]$Build
)

$ErrorActionPreference = "Stop"

$BaseUrl = $BaseUrl.TrimEnd("/")

Write-Host ""
Write-Host "Creating SYNQ Android apps project" -ForegroundColor Cyan
Write-Host "Base URL: $BaseUrl" -ForegroundColor Cyan
Write-Host "Path: $ProjectPath" -ForegroundColor Cyan
Write-Host ""

New-Item -ItemType Directory -Force $ProjectPath | Out-Null
Set-Location $ProjectPath

New-Item -ItemType Directory -Force ".\synq-tv\src\main\java\com\synq\tv" | Out-Null
New-Item -ItemType Directory -Force ".\synq-admin\src\main\java\com\synq\admin" | Out-Null

@'
pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "SYNQAndroidApps"
include ":synq-tv"
include ":synq-admin"
'@ | Set-Content -Encoding UTF8 ".\settings.gradle"

@'
plugins {
    id "com.android.application" version "8.7.3" apply false
}
'@ | Set-Content -Encoding UTF8 ".\build.gradle"

@"
plugins {
    id "com.android.application"
}

android {
    namespace "com.synq.tv"
    compileSdk $CompileSdk

    defaultConfig {
        applicationId "com.synq.tv"
        minSdk $MinSdk
        targetSdk $CompileSdk
        versionCode 1
        versionName "1.0.0"
    }
}
"@ | Set-Content -Encoding UTF8 ".\synq-tv\build.gradle"

@"
plugins {
    id "com.android.application"
}

android {
    namespace "com.synq.admin"
    compileSdk $CompileSdk

    defaultConfig {
        applicationId "com.synq.admin"
        minSdk $MinSdk
        targetSdk $CompileSdk
        versionCode 1
        versionName "1.0.0"
    }
}
"@ | Set-Content -Encoding UTF8 ".\synq-admin\build.gradle"

@'
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />

    <uses-feature android:name="android.software.leanback" android:required="false" />
    <uses-feature android:name="android.hardware.touchscreen" android:required="false" />

    <application
        android:theme="@style/AppTheme"
        android:label="SYNQ TV"
        android:usesCleartextTraffic="false"
        android:resizeableActivity="true"
        android:hardwareAccelerated="true">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:screenOrientation="landscape"
            android:configChanges="keyboardHidden|orientation|screenSize">

            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
                <category android:name="android.intent.category.LEANBACK_LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
'@ | Set-Content -Encoding UTF8 ".\synq-tv\src\main\AndroidManifest.xml"

@'
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:theme="@style\AppTheme"
        android:label="SYNQ Admin"
        android:usesCleartextTraffic="false"
        android:resizeableActivity="true"
        android:hardwareAccelerated="true">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:screenOrientation="unspecified"
            android:configChanges="keyboardHidden|orientation|screenSize">

            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
'@ | Set-Content -Encoding UTF8 ".\synq-admin\src\main\AndroidManifest.xml"

New-Item -ItemType Directory -Force ".\synq-tv\src\main\res\values" | Out-Null
New-Item -ItemType Directory -Force ".\synq-admin\src\main\res\values" | Out-Null

@'
<resources>
    <style name="AppTheme" parent="@android:style/Theme.Material.Light.NoActionBar">
        <item name="android:windowNoTitle">true</item>
        <item name="android:windowActionBar">false</item>
        <item name="android:windowFullscreen">true</item>
        <item name="android:fontFamily">sans</item>
        <item name="android:colorAccent">#7E4BB5</item>
    </style>
</resources>
'@ | Set-Content -Encoding UTF8 ".\synq-tv\src\main\res\values\styles.xml"

@'
<resources>
    <style name="AppTheme" parent="@android:style/Theme.Material.Light.NoActionBar">
        <item name="android:windowNoTitle">true</item>
        <item name="android:windowActionBar">false</item>
        <item name="android:fontFamily">sans</item>
        <item name="android:colorAccent">#7E4BB5</item>
    </style>
</resources>
'@ | Set-Content -Encoding UTF8 ".\synq-admin\src\main\res\values\styles.xml"

$tvUrl = "$BaseUrl/tv"
$adminUrl = "$BaseUrl/admin"

@"
package com.synq.tv;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.CookieManager;

public class MainActivity extends Activity {
    private WebView webView;
    private static final String START_URL = "$tvUrl";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().getDecorView().setSystemUiVisibility(
            View.SYSTEM_UI_FLAG_FULLSCREEN |
            View.SYSTEM_UI_FLAG_HIDE_NAVIGATION |
            View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY |
            View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |
            View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION |
            View.SYSTEM_UI_FLAG_LAYOUT_STABLE
        );

        webView = new WebView(this);
        setContentView(webView);

        CookieManager.getInstance().setAcceptCookie(true);
        CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setTextZoom(100);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);

        webView.setWebViewClient(new WebViewClient());
        webView.setWebChromeClient(new WebChromeClient());
        webView.loadUrl(START_URL);
    }

    @Override
    public void onBackPressed() {
        webView.loadUrl(START_URL);
    }

    @Override
    protected void onResume() {
        super.onResume();
        getWindow().getDecorView().setSystemUiVisibility(
            View.SYSTEM_UI_FLAG_FULLSCREEN |
            View.SYSTEM_UI_FLAG_HIDE_NAVIGATION |
            View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY |
            View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |
            View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION |
            View.SYSTEM_UI_FLAG_LAYOUT_STABLE
        );
    }
}
"@ | Set-Content -Encoding UTF8 ".\synq-tv\src\main\java\com\synq\tv\MainActivity.java"

@"
package com.synq.admin;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.CookieManager;

public class MainActivity extends Activity {
    private WebView webView;
    private static final String START_URL = "$adminUrl";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        webView = new WebView(this);
        setContentView(webView);

        CookieManager.getInstance().setAcceptCookie(true);
        CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setTextZoom(100);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);

        webView.setWebViewClient(new WebViewClient());
        webView.setWebChromeClient(new WebChromeClient());
        webView.loadUrl(START_URL);
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
            return;
        }

        super.onBackPressed();
    }
}
"@ | Set-Content -Encoding UTF8 ".\synq-admin\src\main\java\com\synq\admin\MainActivity.java"

Write-Host ""
Write-Host "Android project created." -ForegroundColor Green
Write-Host "TV URL: $tvUrl" -ForegroundColor Green
Write-Host "Admin URL: $adminUrl" -ForegroundColor Green

if ($Build) {
    Write-Host ""
    Write-Host "Preparing Gradle wrapper..." -ForegroundColor Cyan

    if (!(Test-Path ".\gradlew.bat")) {
        $gradleCmd = Get-Command gradle -ErrorAction SilentlyContinue

        if ($null -eq $gradleCmd) {
            Write-Host "Gradle command not found. Open this folder in Android Studio or install Gradle, then run the build." -ForegroundColor Yellow
            exit 0
        }

        gradle wrapper --gradle-version $GradleVersion
    }

    Write-Host ""
    Write-Host "Building debug APKs..." -ForegroundColor Cyan
    .\gradlew.bat :synq-tv:assembleDebug :synq-admin:assembleDebug

    Write-Host ""
    Write-Host "APKs created:" -ForegroundColor Green
    Write-Host "$ProjectPath\synq-tv\build\outputs\apk\debug\synq-tv-debug.apk"
    Write-Host "$ProjectPath\synq-admin\build\outputs\apk\debug\synq-admin-debug.apk"
}
