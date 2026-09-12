export const hasHtmlTags = value =>
  /<\/?[a-z][\s\S]*>/i.test(String(value || ''));

export const decodeHtmlEntities = value => {
  const str = String(value || '');
  if (!str.includes('&') || hasHtmlTags(str)) {
    return str;
  }

  if (/&lt;|&gt;|&amp;|&quot;|&#39;|&#x/i.test(str)) {
    return str
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&#x27;/gi, "'")
      .replace(/&#x2F;/gi, '/');
  }

  return str;
};

export const isFullHtmlDocument = html =>
  /^\s*(<!doctype|<html[\s>])/i.test(String(html || ''));

const BLOCKED_TAGS =
  /<\/?(?:script|iframe|object|embed|form|meta|link|base|style)\b[^>]*>/gi;
const EVENT_HANDLER_ATTRS = /\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;
const JAVASCRIPT_URLS =
  /((?:href|src|xlink:href)\s*=\s*["'])\s*javascript:[^"']*(["'])/gi;

export const sanitizeMailHtml = html => {
  let sanitized = String(html || '');
  sanitized = sanitized.replace(BLOCKED_TAGS, '');
  sanitized = sanitized.replace(EVENT_HANDLER_ATTRS, '');
  sanitized = sanitized.replace(JAVASCRIPT_URLS, '$1#$2');
  return sanitized;
};

export const buildHtmlDocument = (html, textColor = '#111827') => `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      <style>
        body {
          margin: 0;
          padding: 0;
          color: ${textColor};
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          font-size: 16px;
          line-height: 1.65;
          overflow-wrap: anywhere;
          word-break: break-word;
        }
        img, video {
          max-width: 100%;
          height: auto;
        }
        table {
          max-width: 100%;
        }
        a {
          color: #2563eb;
        }
      </style>
    </head>
    <body>${html || ''}</body>
  </html>
`;

export const prepareHtmlForWebView = (html, textColor = '#111827') => {
  const decoded = decodeHtmlEntities(html);
  const sanitized = sanitizeMailHtml(decoded);
  if (isFullHtmlDocument(sanitized)) {
    return sanitized;
  }
  return buildHtmlDocument(sanitized, textColor);
};

export const WEBVIEW_HEIGHT_SCRIPT = `
  (function() {
    function sendHeight() {
      var height = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight
      );
      window.ReactNativeWebView.postMessage(String(height));
    }
    sendHeight();
    window.addEventListener('load', sendHeight);
    setTimeout(sendHeight, 100);
    setTimeout(sendHeight, 400);
  })();
  true;
`;
