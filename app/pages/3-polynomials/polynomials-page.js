const tf = require('@tensorflow/tfjs');
const createViewModel = require("./polynomials-view-model").createViewModel;
const pageData = createViewModel();
const generateData = require('./data').generateData;

exports.onNavigatingTo = function(args) {
    const page = args.object;
    page.bindingContext = pageData;
}

exports.onTrain = function() {
  learnCoefficients();
};

exports.goBack = function(args) {
  args.object.page.frame.goBack();
};

/**
 * We want to learn the coefficients that give correct solutions to the
 * following cubic equation:
 *      y = a * x^3 + b * x^2 + c * x + d
 * In other words we want to learn values for:
 *      a
 *      b
 *      c
 *      d
 * Such that this function produces 'desired outputs' for y when provided
 * with x. We will provide some examples of 'xs' and 'ys' to allow this model
 * to learn what we mean by desired outputs and then use it to produce new
 * values of y that fit the curve implied by our example.
 */

// Step 1. Set up variables, these are the things we want the model
// to learn in order to do prediction accurately. We will initialize
// them with random values.
let a, b, c, d;
// we'll set this in learnCoefficients()


// Step 2. Create an optimizer, we will use this later. You can play
// with some of these values to see how the model performs.
const numIterations = 100;
const numTrainingSet = 100;
const learningRate = 0.5;
const optimizer = tf.train.sgd(learningRate);

// Step 3. Write our training process functions.

/*
 * This function represents our 'model'. Given an input 'x' it will try and
 * predict the appropriate output 'y'.
 *
 * It is also sometimes referred to as the 'forward' step of our training
 * process. Though we will use the same function for predictions later.
 *
 * @return number predicted y value
 */
function predict(x) {
  // y = a * x ^ 3 + b * x ^ 2 + c * x + d
  return tf.tidy(() => {
    return a.mul(x.pow(tf.scalar(3, 'int32')))
      .add(b.mul(x.square()))
      .add(c.mul(x))
      .add(d);
  });
}

/*
 * This will tell us how good the 'prediction' is given what we actually
 * expected.
 *
 * prediction is a tensor with our predicted y values.
 * labels is a tensor with the y values the model should have predicted.
 */
function loss(prediction, labels) {
  // Having a good error function is key for training a machine learning model
  const error = prediction.sub(labels).square().mean();
  return error;
}

/*
 * This will iteratively train our model.
 *
 * xs - training data x values
 * ys — training data y values
 */
async function train(xs, ys, numIterations) {
  for (let iter = 0; iter < numIterations; iter++) {
    // optimizer.minimize is where the training happens.

    // The function it takes must return a numerical estimate (i.e. loss)
    // of how well we are doing using the current state of
    // the variables we created at the start.

    // This optimizer does the 'backward' step of our training process
    // updating variables defined previously in order to minimize the
    // loss.
    optimizer.minimize(() => {
      // Feed the examples into the model
      const pred = predict(xs);
      return loss(pred, ys);
    });

    // Use tf.nextFrame to not block the browser.
    await tf.nextFrame();
  }
}

async function learnCoefficients() {
  a = tf.variable(tf.scalar(Math.random()));
  b = tf.variable(tf.scalar(Math.random()));
  c = tf.variable(tf.scalar(Math.random()));
  d = tf.variable(tf.scalar(Math.random()));
  const trueCoefficients = {a: -.8, b: -.2, c: .9, d: .5};
  const trainingData = generateData(numTrainingSet, trueCoefficients);
  // Plot original data
  const chartPoints1 = await plotData(trainingData.xs, trainingData.ys)

  pageData.set('originalData', chartPoints1);
  pageData.set('trueCoefficients', stringifyCoefficients(trueCoefficients));
  
  // See what the predictions look like with random coefficients
  pageData.set('randomCoefficients', stringifyCoefficients({
    a: a.dataSync()[0],
    b: b.dataSync()[0],
    c: c.dataSync()[0],
    d: d.dataSync()[0],
  }));

  const predictionsBefore = predict(trainingData.xs);
  const chartPoints2 = await plotDataAndPredictions(trainingData.xs, trainingData.ys, predictionsBefore);
  
  pageData.set('predictionBefore', chartPoints2);

  // Train the model!
  await train(trainingData.xs, trainingData.ys, numIterations);

  // See what the final results predictions are after training.
  pageData.set('finalCoefficients', stringifyCoefficients({
    a: a.dataSync()[0],
    b: b.dataSync()[0],
    c: c.dataSync()[0],
    d: d.dataSync()[0],
  }));

  const predictionsAfter = predict(trainingData.xs);
  const chartPoints3 = await plotDataAndPredictions(trainingData.xs, trainingData.ys, predictionsAfter);

  pageData.set('predictionAfter', chartPoints3);

  predictionsBefore.dispose();
  predictionsAfter.dispose();
}

async function plotData(xs, ys) {
    const xvals = await xs.data();
    const yvals = await ys.data();
 
    const values = Array.from(yvals).map((y, i) => {
      return {'x': xvals[i], 'y': yvals[i]};
    });
 
    return values;
}

async function plotDataAndPredictions(xs, ys, preds) {
  const xvals = await xs.data();
  const yvals = await ys.data();
  const predVals = await preds.data();

  const values = Array.from(yvals).map((y, i) => {
    return {'x': xvals[i], 'y': yvals[i], pred: predVals[i]};
  });

  return values;
}

function stringifyCoefficients(coeff) {
  return `a=${coeff.a.toFixed(3)}, b=${coeff.b.toFixed(3)}, c=${
          coeff.c.toFixed(3)},  d=${coeff.d.toFixed(3)}`;
}
