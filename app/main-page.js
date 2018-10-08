const routes = require('~/shared/routes');

exports.gotoRegression = function(args) {
  args.object.page.frame.navigate(routes.Regression);
};

exports.gotoClassification = function(args) {
  args.object.page.frame.navigate(routes.Classification);
};
