import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {WebView} from 'react-native-webview';
import {
  prepareHtmlForWebView,
  WEBVIEW_HEIGHT_SCRIPT,
} from '../../../utils/mailHtml';

const shouldAllowMailNavigation = request => {
  const url = String(request?.url || '');
  return url.startsWith('about:blank') || url === 'about:blank';
};

const HtmlWebView = ({
  html,
  width,
  height,
  minHeight = 48,
  scrollEnabled = false,
  backgroundColor = 'transparent',
  autoHeight = false,
}) => {
  const webViewRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(minHeight);

  useEffect(() => {
    setContentHeight(minHeight);
  }, [html, minHeight]);

  const onMessage = useCallback(
    event => {
      const nextHeight = Number(event.nativeEvent.data);
      if (!Number.isNaN(nextHeight) && nextHeight > 0) {
        setContentHeight(Math.max(minHeight, nextHeight + 12));
      }
    },
    [minHeight],
  );

  if (!html) {
    return null;
  }

  const resolvedHeight = autoHeight ? contentHeight : height;

  return (
    <WebView
      ref={webViewRef}
      key={html.slice(0, 120)}
      originWhitelist={['about:blank']}
      source={{html, baseUrl: 'about:blank'}}
      style={{
        width,
        height: resolvedHeight,
        backgroundColor,
      }}
      containerStyle={{
        backgroundColor,
      }}
      scrollEnabled={scrollEnabled}
      showsVerticalScrollIndicator={scrollEnabled}
      javaScriptEnabled
      domStorageEnabled={false}
      setSupportMultipleWindows={false}
      automaticallyAdjustContentInsets={false}
      onShouldStartLoadWithRequest={shouldAllowMailNavigation}
      injectedJavaScript={autoHeight ? WEBVIEW_HEIGHT_SCRIPT : undefined}
      onMessage={autoHeight ? onMessage : undefined}
      onLoadEnd={() => {
        if (autoHeight) {
          webViewRef.current?.injectJavaScript(WEBVIEW_HEIGHT_SCRIPT);
        }
      }}
    />
  );
};

export const MailMessage = ({
  message,
  textColor = '#4b5563',
  screenWidth,
}) => {
  if (!message) {
    return null;
  }

  const html = prepareHtmlForWebView(message, textColor);

  return (
    <View style={{width: '100%'}}>
      <HtmlWebView
        html={html}
        width={screenWidth - 32}
        minHeight={64}
        autoHeight
        backgroundColor="transparent"
      />
    </View>
  );
};

export const MailHtmlBody = ({
  mailHTML,
  screenWidth,
  height = 360,
}) => {
  if (!mailHTML) {
    return (
      <View
        style={{
          width: '100%',
          height: Math.min(height, 160),
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
        }}>
        <ActivityIndicator size="small" color="#45B39D" />
      </View>
    );
  }

  const html = prepareHtmlForWebView(mailHTML);

  return (
    <View style={{width: '100%', height, backgroundColor: '#fff'}}>
      <HtmlWebView
        html={html}
        width={screenWidth - 32}
        height={height}
        scrollEnabled
        backgroundColor="#fff"
      />
    </View>
  );
};
