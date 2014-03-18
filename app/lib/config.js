Swag.Config.partialsPath = 'templates/';
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
