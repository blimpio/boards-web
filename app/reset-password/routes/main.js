module.exports = function(token) {
  if (!token) {
    this.navigate('', {trigger: true});
  } else {
    this.setController(require('reset-password/controller'));
    this.controller.continueWithToken(token);
  }
};
