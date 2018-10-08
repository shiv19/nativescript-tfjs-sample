/*
In NativeScript, the app.js file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/

var application = require("application");

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
process.versions = {};
process.versions.node = '10.0';

application.run({ moduleName: "app-root" });

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
