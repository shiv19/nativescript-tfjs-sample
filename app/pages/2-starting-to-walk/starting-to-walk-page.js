import { WebViewInterface } from 'nativescript-webview-interface';
import { fromObject } from 'data/observable';
import { webViewHandler } from '~/shared/webview-util';
let webViewInterface;
let page;

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

    console.log('setting up webview');
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
    y_input: [1, 3, 5, 7],
    epochs: 10
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

export const webViewLoaded = webViewHandler;
