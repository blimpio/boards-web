module.exports = function() {
  App.User.signout();
  this.navigate('/signin/', {trigger: true});
};
