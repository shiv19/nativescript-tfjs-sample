import { WebViewInterface } from 'nativescript-webview-interface';
let webViewInterface;
let page;

import { isAndroid } from 'platform';

export function onNavigatedTo(args) {
    if (args.isBackNavigation) {
      return;
    }

    page = args.object;

    console.log("setting up webview");
    setupWebViewInterface(page);
}

export function goBack(args) {
  args.object.page.frame.goBack();
};

// Initializes plugin with a webView
function setupWebViewInterface(page){
    const webView = page.getViewById('webView');
    webViewInterface = new WebViewInterface(webView, '~/www/video-processing.html');

    setTimeout(() => {
      webViewInterface.callJSFunction('app', null, async function(net){
        
      });
    }, 3000);
}

export function webViewLoaded (args) {
  const webview = args.object;

  if (isAndroid) {
    const TNSWebViewClient =
    android.webkit.WebViewClient.extend({
      shouldOverrideUrlLoading: function (view, url) {
        if (url != null && url.startsWith("http://")) {
          // use openUrl form utils module to open the page in a browser
          return true;
        } else {
          return false;
        }
      }

    });
    const TNSWebChromeClient =
      android.webkit.WebChromeClient.extend({
        onPermissionRequest: function (request) {
          request.grant(request.getResources());
        }
      });
    webview.android.getSettings().setDisplayZoomControls(false);
    webview.android.getSettings().setBuiltInZoomControls(false);
    webview.android.getSettings().setAllowFileAccessFromFileURLs(true);
    webview.android.getSettings().setAllowUniversalAccessFromFileURLs(true);
    webview.android.getSettings().setMediaPlaybackRequiresUserGesture(false);
    webview.android.getSettings().setUseWideViewPort(true);
    webview.android.getSettings().setDomStorageEnabled(true);
    webview.android.setWebViewClient(new TNSWebViewClient());
    webview.android.setWebChromeClient(new TNSWebChromeClient());
  }
}
