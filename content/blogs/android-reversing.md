---
title: "Android Application Reversing"
date: "2026-09-15"
description: "Notes on APK analysis using JADX, Apktool, ADB, MobSF and Frida."
---

# Android Application Reversing

Reversing Android applications is a core skill for any mobile security researcher. This post covers the essential tools and techniques for analyzing APKs.

## The Toolkit

- **JADX**: Excellent decompiler that converts DEX bytecode back to readable Java/Kotlin source code.
- **Apktool**: A tool for reverse engineering 3rd party, closed, binary Android apps. It can decode resources to nearly original form and rebuild them after making some modifications.
- **ADB (Android Debug Bridge)**: Command-line tool that lets you communicate with a device.
- **MobSF (Mobile Security Framework)**: Automated, all-in-one mobile application (Android/iOS/Windows) pen-testing, malware analysis, and security assessment framework.
- **Frida**: Dynamic instrumentation toolkit for developers, reverse-engineers, and security researchers.

## Basic Workflow

1.  **Extract the APK**: Use ADB to pull the APK from the device.
    ```bash
    adb shell pm path com.example.app
    adb pull /data/app/~~.../base.apk
    ```
2.  **Static Analysis**:
    - Open the APK in **JADX-GUI** to read the decompiled Java/Kotlin code.
    - Look for hardcoded secrets, insecure API configurations, and exported components (Activities, Services, Receivers, Providers).
    - Use **Apktool** to decode the `AndroidManifest.xml` and other resources.
3.  **Dynamic Analysis**:
    - Run the application in a rooted emulator or physical device.
    - Proxy traffic through Burp Suite (make sure to install a user-level certificate and bypass network security config).
    - Use **Frida** to hook functions at runtime, bypass SSL pinning, or manipulate application logic.

```javascript
// Example Frida script to bypass simple SSL pinning
Java.perform(function() {
    var array_list = Java.use("java.util.ArrayList");
    var ApiClient = Java.use('com.example.app.network.ApiClient');
    
    ApiClient.checkCertificate.implementation = function(cert) {
        console.log("[*] Bypassing certificate check!");
        return true;
    };
});
```
