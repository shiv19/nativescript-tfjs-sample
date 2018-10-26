import { fromObject } from 'data/observable';

const pageVm = fromObject({
  torchOn: false,
  blocks: []
});

export function onLoaded({ object: page }) {
  page.bindingContext = pageVm;
}

export function onTextRecognitionResult(scanResult) {
  const value = scanResult.value;
  pageVm.blocks = value.blocks;
}

export function goBack(args) {
  args.object.page.frame.goBack();
};