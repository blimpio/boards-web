Swag.registerHelpers();

$.ajaxSetup({
  beforeSend: function(xhr, settings) {
    var token = Boards.User.get('token');
    if (token) xhr.setRequestHeader('Authorization', 'JWT ' + token);
  },

  contentType: 'application/json; charset=utf-8'
});
