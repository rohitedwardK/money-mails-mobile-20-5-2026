# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:


# Keep all React Native classes
-keep class com.facebook.react.** { *; }
-dontwarn com.facebook.react.**

# Keep your Application class
-keep class com.yourappname.** { *; }

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep annotations
-keepattributes *Annotation*

# Gson (if used)
-keep class com.google.gson.** { *; }

# Retrofit (if used)
-keep class retrofit2.** { *; }
-dontwarn retrofit2.**

# OkHttp (if used)
-dontwarn okhttp3.**


# Keep Glide v3 classes used by rxgalleryfinal
-keep class com.bumptech.glide.** { *; }
-dontwarn com.bumptech.glide.**

# Keep RxGalleryFinal
-keep class cn.finalteam.rxgalleryfinal.** { *; }
-dontwarn cn.finalteam.rxgalleryfinal.**
