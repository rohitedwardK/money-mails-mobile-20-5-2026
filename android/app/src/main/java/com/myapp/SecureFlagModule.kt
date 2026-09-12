package com.moneymails.app

import android.view.WindowManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.UiThreadUtil

class SecureFlagModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "SecureFlag"

  @ReactMethod
  fun setSecure(enabled: Boolean) {
    UiThreadUtil.runOnUiThread {
      val activity = reactContext.currentActivity ?: return@runOnUiThread
      if (enabled) {
        activity.window.setFlags(
          WindowManager.LayoutParams.FLAG_SECURE,
          WindowManager.LayoutParams.FLAG_SECURE,
        )
      } else {
        activity.window.clearFlags(WindowManager.LayoutParams.FLAG_SECURE)
      }
    }
  }
}
