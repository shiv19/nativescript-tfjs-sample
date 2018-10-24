import { WebViewInterface } from 'nativescript-webview-interface';
import { webViewHandler } from '~/shared/webview-util';
import { fromObject } from 'data/observable';
let webViewInterface;
let page;
let recordTimer;

export function loaded({ object: page }) {
  page.bindingContext = fromObject({
      mobileNetLoaded: false,
      prediction: null,
      probability: null,
      label: null,
      loaded: true,
      isRecording: false
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
    webViewInterface = new WebViewInterface(webView, '~/www/video-processing.html');

    webViewInterface.on('mobileNetReady', function(isReady) {
      if (isReady) {
        page.bindingContext.mobileNetLoaded = true;
      } else {
        page.bindingContext.mobileNetLoaded = false;
        alert('Something went wrong when loading mobilenet');
      }
    })

    webViewInterface.on('onPredict', function(result) {
      page.bindingContext.prediction = result.prediction;
      page.bindingContext.probability = (result.probability * 100) + '%';
    })

    setTimeout(() => {
      webViewInterface.callJSFunction('init', {
        debug: true
      }, () => {
        
      });
    }, 3000);
}

export function onRecord({ object }) {
  const ctx = object.bindingContext;
  ctx.isRecording = true;

  recordTimer = setInterval(() => {
    webViewInterface.callJSFunction('addSample', ctx.label, () => {

    });
  }, 250);
}

export function onStop({ object }) {
  const ctx = object.bindingContext;
  
  clearInterval(recordTimer);

  ctx.isRecording = false;
}

export const webViewLoaded = webViewHandler;
