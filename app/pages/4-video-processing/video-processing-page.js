import { WebViewInterface } from 'nativescript-webview-interface';
import { webViewHandler } from '~/shared/webview-util';
let webViewInterface;
let page;

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

    setTimeout(() => {
      webViewInterface.callJSFunction('app', null, async function(net){
        
      });
    }, 3000);
}

export const webViewLoaded = webViewHandler;
