module.exports = Zeppelin.ModelView.extend({
  className: function() {
    var className = 'user-dropdown';
    className += this.model.isSignedIn() ? ' signed-in' : ' signed-out';
    return className;
  },

  template: require('core/templates/user-dropdown'),

  events: {
    'click [data-settings=general]': 'onClickGeneral',
    'click [data-settings=accounts]': 'onClickAccounts',
    'click [data-settings=notifications]': 'onClickNotifications',
    'click [data-settings=password]': 'onClickPassword',
    'click [data-settings=advanced]': 'onClickAdvanced'
  },

  model: function() {
    return App.User;
  },

  context: function() {
    return _.extend({}, this.model.attributes, {
      name: this.model.getName(),
      isSignedIn: this.model.isSignedIn()
    });
  },

  onClickGeneral: function(event) {
    event.preventDefault();
    this.broadcast('settings:user:open');
  },

  onClickAccounts: function(event) {
    event.preventDefault();
    this.broadcast('settings:accounts:open');
  },

  onClickNotifications: function(event) {
    event.preventDefault();
    this.broadcast('settings:notifications:open');
  },

  onClickPassword: function(event) {
    event.preventDefault();
    this.broadcast('settings:password:open');
  },

  onClickAdvanced: function(event) {
    event.preventDefault();
    this.broadcast('settings:advanced:open');
  }
});

