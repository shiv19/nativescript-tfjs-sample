# NativeScript TensorflowJS Demo

Documentation - WIP

## How to run this project

- Install NativeScript 5.x
- Clone this repo
- Create a firebase app, and download your google-services.json
- npm i
- run this via
    - npm run android 
    - npm run ios


That's about it, you're good to go. Explore the NativeScript + TFjs examples.

## How to install TFjs into your NativeScript Application

You have 2 methods to do this each with its own pros and cons,

### Method 1: Install as an npm package

To install TFjs into your NativeScript app, just run `npm i -S @tensorflow/tfjs`.

After installing this, your app builds will work fine, but if you try to import
anything from `@tensorflow/tfjs`, your app crashes, because Tensorflow JS does not understand
NativeScript environment. To overcome this, we're just going to tell Tensorflow JS that
it is running inside a Node.js environment. To do this,

In your `app.ts` (or `main.ts` or `app.vue`) add the following lines,

```js
//noinspection JSUnresolvedVariable,JSUnusedLocalSymbols
global.setImmediate = setTimeout;
global.clearImmediate = clearTimeout;
global.performance = {
  now() {
    if (global.android) {
      return java.lang.System.nanoTime() / 1000000;
    } else {
      return CACurrentMediaTime();
    }
  }
};
global.process = {
  versions: {
    node: '10.0'
  }
};
```

Tensorflow also requires setImmediate and clearImmediate methods, in case of
NativeScript, just aliasing them to setTimeout and clearTimeout does the job.
It also requires a way to get current system time via `performance.now()` method,
in case of NativeScript we're just tapping into Android/iOS Native APIs to fetch
the same.
After that you can see that we're creating a new global variable called `process`,
if you're already familiar with Node.js you might know that `process` is the global
object in Node. All that Tensorflow checks to figure out the environment it is in
is to check `process.versions.node`, so we've defined just that and nothing else.

With that in place, when you import something from `@tensorflow/tfjs` your app
no longer crashes.

#### Pros of Method 1

- Easiest way to get started with using TFjs in NativeScript
- Faster training performance
- No WebView needed
- You're directly using Tensorflow JS with JavaScript runtime of the device
- Good for small datasets, where you can afford to train everytime the app
 opens, because it usually takes only 2 to 3 seconds for small datasets (upto a few thousand data points)

#### Cons of Method 1

- No support to save/load a trained model, because the save/load implementations in
 TFjs are currently relying on browser APIs, which aren't available in NativeScript.
- You can't do image, audio or video processing because, the APIs of TFjs that do
 these kind of tasks expect to receive a HTML Image, Audio or Video element, which isn't
 available when working with Pure NativeScript.

### Method 2: Use it inside a WebView and communicate to it via {N} WebView interface

To use TFjs from a WebView in your NativeScript app, create a `www` (or any name), directory
inside your `app` folder, this is where the webpages where TFjs is used will live.
Inside `www` folder, create a `lib` folder, and place `tf.min.js` inside it, so that
the machine learning capabilities can be used offline, and there is no download time when
the WebView loads. If you are using any other supporting libraries for Tfjs for example,
Mobilenet model, Knn-classifier, etc, you can place them in this lib folder.
Next, create HTML files inside `www` folder which import these libraries.

Next, setup the NativeScript WebView interface,

```sh
tns plugin add nativescript-webview-interface
cp node_modules/nativescript-webview-interface/www/nativescript-webview-interface.js app/www/lib/

# replace the destination folder names with the one relavant to your project
```

Refer the [README](https://github.com/shripalsoni04/nativescript-webview-interface/blob/master/README.md) of nativescript-webview-interface to understand how to community
between NativeScript and a WebView.

#### Pros of Method 2

- Let's you utilize everything that TFjs has to offer

#### Cons of Method 2

- Can be a bit intimidating to setup the first time.

## Is it worth training models on device

WIP

## How to use existing model to perform inference

WIP

## How to use ML Kit

Refer the [README](https://github.com/EddyVerbruggen/nativescript-plugin-firebase/blob/master/docs/ML_KIT.md) of nativescript-plugin-firebase

## Final Thoughts

WIP
