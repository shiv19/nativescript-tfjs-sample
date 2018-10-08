const WebViewInterface = require('nativescript-webview-interface').WebViewInterface;
let webViewInterface;
let page;

const isAndroid = require('platform').isAndroid;

function onNavigatedTo(args) {
    if (args.isBackNavigation) {
      return;
    }

    page = args.object;

    console.log("setting up webview");
    setupWebViewInterface(page);
}

// Initializes plugin with a webView
function setupWebViewInterface(page){
    var webView = page.getViewById('webView');
    webViewInterface = new WebViewInterface(webView, '~/www/index.html');

    setTimeout(() => {
      webViewInterface.callJSFunction('app', null, async function(net){
        
      });
    }, 3000);
}

exports.webViewLoaded = function (args) {
  var webview = args.object;
  var TNSWebViewClient =
    android.webkit.WebViewClient.extend({
      shouldOverrideUrlLoading: function (view, url) {
        if (url != null && url.startsWith("http://")) {
          console.log(url);
          // use openUrl form utils module to open the page in a browser
          return true;
        } else {
          return false;
        }
      }

    });
  var TNSWebChromeClient =
    android.webkit.WebChromeClient.extend({
      onPermissionRequest: function (request) {
        request.grant(request.getResources());
      }
    });
  if (isAndroid) {
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

exports.onNavigatedTo = onNavigatedTo;
