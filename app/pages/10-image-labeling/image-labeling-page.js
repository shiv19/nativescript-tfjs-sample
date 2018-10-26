import { fromObject } from 'data/observable';

const pageVm = fromObject({
  torchOn: false,
  labels: []
});

export function onLoaded({ object: page }) {
  page.bindingContext = pageVm;
}

export function onImageLabelingResult(scanResult) {
  const value = scanResult.value;
  value.labels.forEach(label => {
    label.confidence = label.confidence.toFixed(2);
  })
  pageVm.labels = value.labels;
}

export function goBack(args) {
  args.object.page.frame.goBack();
};
