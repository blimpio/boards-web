var originalSync = Backbone.sync;

Backbone.sync = function(method, model, options) {
  var lastXHR;

  lastXHR = model._lastXHR && model._lastXHR[method];

  if ((lastXHR && lastXHR.readyState !== 4) &&
  (options && options.safe !== false)) {
    lastXHR.abort('stale');
  }

  if (!model._lastXHR) {
    model._lastXHR = {};
  }

  return model._lastXHR[method] = originalSync.apply(this, arguments);
};


Swag.registerHelpers();

$.ajaxSetup({
  beforeSend: function(xhr, settings) {
    var token = App.User.get('token'),
        s3Url = /^https:\/\/s3.amazonaws.com\//;

    if (settings.url && settings.url.match(s3Url)) return;
    if (token) xhr.setRequestHeader('Authorization', 'JWT ' + token);
  },

  contentType: 'application/json; charset=utf-8'
});
