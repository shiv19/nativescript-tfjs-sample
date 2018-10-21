import { WebViewInterface } from 'nativescript-webview-interface';
import { fromObject } from 'data/observable';
let webViewInterface;
let page;

import { isAndroid } from 'platform';

export function loaded({ object: page }) {
  page.bindingContext = fromObject({
      trainingComplete: false,
      input: null,
      output: null
  })
}

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
    webViewInterface = new WebViewInterface(webView, '~/www/starting-to-walk.html');

    setTimeout(() => {
      webViewInterface.callJSFunction('init', {
        modelName: 'num-seq',
        debug: true
      }, function(result) {
        if (result) {
          page.bindingContext.trainingComplete = true;
        }
      });
    }, 1000);
}

export function onTrain({ object: btn }) {
  const ctx = btn.bindingContext;
  ctx.trainingComplete = false;

  webViewInterface.callJSFunction('train', {
    x_input: [1, 2, 3, 4],
    y_input: [2, 4, 6, 8],
    epochs: 1000
  }, function(result) {
    ctx.trainingComplete = true;
  });
}

export function onPredict({ object: btn }) {
  const input = btn.page.getViewById('input');
  input.dismissSoftInput();
  const ctx = btn.bindingContext;

  webViewInterface.callJSFunction('predict', ctx.input, function(result){
    ctx.output = Math.round(result);
  });
}

export function webViewLoaded (args) {
  const webview = args.object;
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
