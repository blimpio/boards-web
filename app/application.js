var Alert = require('core/views/alert'),
    User = require('core/models/user'),
    Cards = require('core/collections/cards'),
    Boards = require('core/collections/boards'),
    Socket = require('lib/socket'),
    Accounts = require('core/collections/accounts'),
    Comments = require('core/collections/comments'),
    Notifications = require('core/collections/notifications'),
    BoardCollaborators = require('core/collections/board-collaborators');

module.exports = (function() {
  var Application = Zeppelin.Application.extend({
    routes: {
      '': require('home/routes/main'),
      'signin/?invite=:token(/)': require('signin/routes/invite'),
      'signin(/)': require('signin/routes/main'),
      'signup/?invite=:token(/)': require('signup/routes/invite'),
      'signup/?token=:token(/)': require('signup/routes/token'),
      'signup/step/:step(/)': require('signup/routes/step'),
      'signup(/)': require('signup/routes/main'),
      'signout(/)': require('core/routes/signout'),
      'forgot_password(/)': require('forgot-password/routes/main'),
      'reset_password/?token=:token(/)': require('reset-password/routes/main'),
      'reset_password(/)': require('reset-password/routes/main'),
      'accounts(/)': require('accounts/routes/main'),
      ':account/activity(/)': require('activity/routes/main'),
      ':account/activity/:board(/)': require('activity/routes/board'),
      ':account(/)': require('account/routes/main'),
      ':account/:board(/)': require('account/routes/board'),
      ':account/:board/:card(/)(?:action)': require('account/routes/card'),
    },

    subscriptions: {
      'app:loaded': 'onAppLoaded',
      'router:navigate': 'goTo'
    },

    hasSocketConnection: false,

    socket: null,

    goTo: function(fragment, options) {
      options = options || {
        trigger: true
      };

      this.navigate(fragment, options);

      if (!options.trigger) {
        ga('send', 'pageview');
      }
    },

    initialize: function() {
      require('lib/config');
      require('lib/helpers');

      this.User = new User();
      this.Cards = new Cards();
      this.Boards = new Boards();
      this.Accounts = new Accounts();
      this.Comments = new Comments();
      this.Notifications = new Notifications();
      this.BoardCollaborators = new BoardCollaborators();

      this.User.signinFromCache();

      $(document).on('ajaxError.app', _.bind(function(event, xhr, settings) {
        if (xhr.statusText === 'UNAUTHORIZED' && xhr.status === 401) {
          window.alert('Your session has expired. Please signin again.');
          this.User.signout();
          this.navigate('signin', {trigger: true});
        }
      }, this));

      this.alert = new Alert();
      $('#application').after(this.alert.render().el);

      this.on('route', this.onRoute, this);
    },

    displayAlert: function(msg) {
      this.alert.open(msg);
    },

    connectToSocket: function() {
      if (!this.SOCKETS_URL) return;

      var rooms = ['u' + this.User.id];

      _.forEach(_.unique(this.Boards.pluck('account')), function(id) {
        rooms.push('a' + id);
      }, this);

      this.socket = new Socket({
        url: this.SOCKETS_URL,
        query: 'token=' + this.User.get('token'),
        rooms: rooms
      });

      try {
        this.socket.connect();
      } catch(error) {

        if (!this.DEBUG) {
          Raven.captureMessage('Socket error.');
          Raven.captureException(error);
        }

        this.displayAlert('There are problems with realtime updates. Refresh to see realtime updates.');
      }
    },

    onAppLoaded: function() {
      this.connectToSocket();
    },

    onRoute: function() {
      ga('send', 'pageview');
    }
  });

  window.App = window.App || {};
  window.App = _.extend(new Application(), window.App);

  App.start({pushState: true});
})();
