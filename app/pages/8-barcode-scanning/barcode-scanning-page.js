import { fromObject } from 'data/observable';

const pageVm = fromObject({
  torchOn: false,
  barcodes: []
});

export function onLoaded({ object: page }) {
  page.bindingContext = pageVm;
}

export function onBarcodeScanResult(scanResult) {
  const result = scanResult.value;
  pageVm.barcodes = result.barcodes;
}

export function goBack(args) {
  args.object.page.frame.goBack();
};
