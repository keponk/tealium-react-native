import test from 'ava';
import { lex, parse, toLines } from '../scripts/gradle-build-file-parser';

test('Empty string reconstructs', t => {
    const expectedResult = '';

    const lines = expectedResult.split('\n');
    const tokens = lines.map(lex);
    const ast = parse(tokens);
    const actualResult = toLines(ast).join('\n');
    t.is(actualResult, expectedResult);
});

test('Content reconstructs', t => {
    const expectedResult =
`
apply plugin: "com.android.application"
`;

    const lines = expectedResult.split('\n');
    const tokens = lines.map(lex);
    const ast = parse(tokens);
    const actualResult = toLines(ast).join('\n');
    t.is(actualResult, expectedResult);
});

test('Large build.gradle reconstructs', t => {
    const expectedResult =
`
apply plugin: "com.android.application"

import com.android.build.OutputFile

/**
 * The react.gradle file registers a task for each build variant (e.g. bundleDebugJsAndAssets
 * and bundleReleaseJsAndAssets).
 * These basically call \`react-native bundle\` with the correct arguments during the Android build
 * cycle. By default, bundleDebugJsAndAssets is skipped, as in debug/dev mode we prefer to load the
 * bundle directly from the development server. Below you can see all the possible configurations
 * and their defaults. If you decide to add a configuration block, make sure to add it before the
 * \`apply from: "../../node_modules/react-native/react.gradle"\` line.
 *
 * project.ext.react = [
 *   // the name of the generated asset file containing your JS bundle
 *   bundleAssetName: "index.android.bundle",
 *
 *   // the entry file for bundle generation
 *   entryFile: "index.android.js",
 *
 *   // whether to bundle JS and assets in debug mode
 *   bundleInDebug: false,
 *
 *   // whether to bundle JS and assets in release mode
 *   bundleInRelease: true,
 *
 *   // whether to bundle JS and assets in another build variant (if configured).
 *   // See http://tools.android.com/tech-docs/new-build-system/user-guide#TOC-Build-Variants
 *   // The configuration property can be in the following formats
 *   //         'bundleIn\${productFlavor}\${buildType}'
 *   //         'bundleIn\${buildType}'
 *   // bundleInFreeDebug: true,
 *   // bundleInPaidRelease: true,
 *   // bundleInBeta: true,
 *
 *   // whether to disable dev mode in custom build variants (by default only disabled in release)
 *   // for example: to disable dev mode in the staging build type (if configured)
 *   devDisabledInStaging: true,
 *   // The configuration property can be in the following formats
 *   //         'devDisabledIn\${productFlavor}\${buildType}'
 *   //         'devDisabledIn\${buildType}'
 *
 *   // the root of your project, i.e. where "package.json" lives
 *   root: "../../",
 *
 *   // where to put the JS bundle asset in debug mode
 *   jsBundleDirDebug: "$buildDir/intermediates/assets/debug",
 *
 *   // where to put the JS bundle asset in release mode
 *   jsBundleDirRelease: "$buildDir/intermediates/assets/release",
 *
 *   // where to put drawable resources / React Native assets, e.g. the ones you use via
 *   // require('./image.png')), in debug mode
 *   resourcesDirDebug: "$buildDir/intermediates/res/merged/debug",
 *
 *   // where to put drawable resources / React Native assets, e.g. the ones you use via
 *   // require('./image.png')), in release mode
 *   resourcesDirRelease: "$buildDir/intermediates/res/merged/release",
 *
 *   // by default the gradle tasks are skipped if none of the JS files or assets change; this means
 *   // that we don't look at files in android/ or ios/ to determine whether the tasks are up to
 *   // date; if you have any other folders that you want to ignore for performance reasons (gradle
 *   // indexes the entire tree), add them here. Alternatively, if you have JS files in android/
 *   // for example, you might want to remove it from here.
 *   inputExcludes: ["android/**", "ios/**"],
 *
 *   // override which node gets called and with what additional arguments
 *   nodeExecutableAndArgs: ["node"],
 *
 *   // supply additional arguments to the packager
 *   extraPackagerArgs: []
 * ]
 */

project.ext.react = [
    entryFile: "index.js"
]

apply from: "../../node_modules/react-native/react.gradle"

/**
 * Set this to true to create two separate APKs instead of one:
 *   - An APK that only works on ARM devices
 *   - An APK that only works on x86 devices
 * The advantage is the size of the APK is reduced by about 4MB.
 * Upload all the APKs to the Play Store and people will download
 * the correct one based on the CPU architecture of their device.
 */
def enableSeparateBuildPerCPUArchitecture = false

/**
 * Run Proguard to shrink the Java bytecode in release builds.
 */
def enableProguardInReleaseBuilds = false

android {
    compileSdkVersion 23
    buildToolsVersion "23.0.1"

    defaultConfig {
        applicationId "com.testtealiumreactnative"
        minSdkVersion 16
        targetSdkVersion 22
        versionCode 1
        versionName "1.0"
        ndk {
            abiFilters "armeabi-v7a", "x86"
        }
    }
    splits {
        abi {
            reset()
            enable enableSeparateBuildPerCPUArchitecture
            universalApk false  // If true, also generate a universal APK
            include "armeabi-v7a", "x86"
        }
    }
    buildTypes {
        release {
            minifyEnabled enableProguardInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }
    // applicationVariants are e.g. debug, release
    applicationVariants.all { variant ->
        variant.outputs.each { output ->
            // For each separate APK per architecture, set a unique version code as described here:
            // http://tools.android.com/tech-docs/new-build-system/user-guide/apk-splits
            def versionCodes = ["armeabi-v7a":1, "x86":2]
            def abi = output.getFilter(OutputFile.ABI)
            if (abi != null) {  // null for the universal-debug, universal-release variants
                output.versionCodeOverride =
                        versionCodes.get(abi) * 1048576 + defaultConfig.versionCode
            }
        }
    }
}

dependencies {
    compile project(':tealium-react-native')
    compile fileTree(include: ['*.jar'], dir: 'libs')
    compile 'com.android.support:appcompat-v7:23.0.1'
    compile 'com.facebook.react:react-native:+'
    // From node_modules
}

// Run this once to be able to run the application with BUCK
// puts all compile dependencies into folder libs for BUCK to use
task copyDownloadableDepsToLibs(type: Copy) {
    from configurations.compile
    into 'libs'
}
`;

    const lines = expectedResult.split('\n');
    const tokens = lines.map(lex);
    const ast = parse(tokens);
    const actualResult = toLines(ast).join('\n');
    t.is(actualResult, expectedResult);
});

test('build.gradle with Tealium added reconstructs', t => {
    const expectedResult =
`
// Top-level build file where you can add configuration options common to all sub-projects/modules.

buildscript {
    repositories {
        jcenter()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:3.0.0'

        // NOTE: Do not place your application dependencies here; they belong
        // in the individual module build.gradle files
    }
}

allprojects {
    repositories {
        mavenLocal()
        jcenter()
        maven {
            // All of React Native (JS, Obj-C sources, Android binaries) is installed from npm
            url "$rootDir/../node_modules/react-native/android"
        }
        maven {
            url "http://maven.tealiumiq.com/android/releases/"
        }
    }
}
`;

    const lines = expectedResult.split('\n');
    const tokens = lines.map(lex);
    const ast = parse(tokens);
    const actualResult = toLines(ast).join('\n');
    t.is(actualResult, expectedResult);
});

test('default build.gradle reconstructs', t => {
    const expectedResult =
`
// Top-level build file where you can add configuration options common to all sub-projects/modules.

buildscript {
    repositories {
        jcenter()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:3.0.0'

        // NOTE: Do not place your application dependencies here; they belong
        // in the individual module build.gradle files
    }
}

allprojects {
    repositories {
        mavenLocal()
        jcenter()
        maven {
            // All of React Native (JS, Obj-C sources, Android binaries) is installed from npm
            url "$rootDir/../node_modules/react-native/android"
        }
    }
}
`;

    const lines = expectedResult.split('\n');
    const tokens = lines.map(lex);
    const ast = parse(tokens);
    const actualResult = toLines(ast).join('\n');
    t.is(actualResult, expectedResult);
});
