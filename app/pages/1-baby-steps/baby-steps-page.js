import { sequential, layers, tensor2d } from '@tensorflow/tfjs';

import { fromObject } from 'data/observable';

export function loaded({ object: page }) {
    page.bindingContext = fromObject({
        trainingComplete: false,
        input: null,
        output: null
    })
}

export function onTrain({ object: btn }) {
    const ctx = btn.bindingContext;
    ctx.trainingComplete = false;
    
    // Define a model for linear regression.
    ctx.model = sequential();
    ctx.model.add(layers.dense({units: 1, inputShape: [1]}));

    // Prepare the model for training: Specify the loss and the optimizer.
    ctx.model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

    // Generate some synthetic data for training.
    const xs = tensor2d([1, 2, 3, 4], [4, 1]);
    const ys = tensor2d([1, 3, 5, 7], [4, 1]);
    // const ys = tensor2d([2, 4, 6, 8], [4, 1]);

    // Train the model using the data.
    ctx.model.fit(xs, ys, {epochs: 10}).then(async () => {
        ctx.trainingComplete = true;
    });
}

export function onPredict({ object: btn }) {
    const input = btn.page.getViewById('input');
    input.dismissSoftInput();
    const ctx = btn.bindingContext;

    const result = ctx.model.predict(
        tensor2d([ctx.input], [1, 1])
    ).dataSync();

    ctx.output = Math.round(result);
}

export function goBack(args) {
    args.object.page.frame.goBack();
};
