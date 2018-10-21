import { webViewHandler } from '~/shared/webview-util';

export function goBack(args) {
  args.object.page.frame.goBack();
};

export const webViewLoaded = webViewHandler;