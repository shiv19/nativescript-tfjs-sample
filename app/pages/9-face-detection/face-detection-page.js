import { fromObject } from 'data/observable';

const pageVm = fromObject({
  torchOn: false,
  faces: [],
  mlKitAllOK: null
});

export function onLoaded({ object: page }) {
  page.bindingContext = pageVm;
}

export function onFaceDetectionResult(scanResult) {
  const value = scanResult.value;
  if (value.faces.length > 0) {
    pageVm.faces = value.faces;
    console.log(pageVm.faces);

    let allSmilingAndEyesOpen = true;
    value.faces.forEach(face => {
      allSmilingAndEyesOpen = allSmilingAndEyesOpen && face.smilingProbability && face.leftEyeOpenProbability && face.rightEyeOpenProbability &&
          face.smilingProbability > 0.7 && face.leftEyeOpenProbability > 0.7 && face.rightEyeOpenProbability > 0.7;
    });
    pageVm.mlKitAllOK = `All smiling and eyes open? ${allSmilingAndEyesOpen ? 'Yes!' : 'Nope'}`;
  }
}

export function goBack(args) {
  args.object.page.frame.goBack();
};
