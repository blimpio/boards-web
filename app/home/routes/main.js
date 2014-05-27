module.exports = function() {
  if (this.User.isSignedIn()) {
    this.navigate('/accounts/', {trigger: true});
  } else {
    this.setController(require('home/controller'));
  }
};
