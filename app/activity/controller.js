var Board = require('core/models/board');

module.exports = Zeppelin.Controller.extend({
  name: 'Activity',

  title: 'Blimp Boards | All Activity',

  layouts: {
    header: require('core/layouts/header'),
    content: require('activity/layouts/content'),
    settings: require('settings/layouts/main')
  },

  firstLoad: true,

  subscriptions: {
    'allActivity:clicked': 'onAllActivityClicked'
  },

  initialize: function() {
    _.bindAll(this, ['onAccountsFetch', 'onBoardsFetch',
    'onNotificationsFetch']);

    this.allActivityModel = new Board({
      name: 'All Activity'
    });

    if (this.options.comesFromAccountPage) {
      this.addLayout('main', require('activity/layouts/main'), {
        comesFromAccountPage: true
      });
    } else {
      this.addLayout('main', require('activity/layouts/main'));
    }

    this.getLayout('main').render();
    this.getLayout('header').setElement('div.header');

    if (!this.options.comesFromAccountPage) {
      this.getLayout('main').toggleLoadingMainState();
      this.getLayout('header').render({
        account: this.options.account,
        activitySelected: true
      });
    }

    this.getLayout('settings').setElement('div.settings').render();

    if (this.options.comesFromAccountPage) {
      this.onAccountsFetch();
    } else {
      this.fetchAccounts();
    }
  },

  listen: function() {
    this.listenTo(App.Boards, 'add', this.onBoardAdded);
    this.listenTo(App.Boards, 'remove', this.onBoardRemoved);
    this.listenTo(App.Boards, 'change:current', this.onBoardSelected);
  },

  fetchAccounts: function() {
    return App.Accounts.fetch({
      reset: true,
      success: this.onAccountsFetch
    });
  },

  onAccountsFetch: function() {
    App.Accounts.setCurrent(this.options.account);

    if (App.Accounts.current) {
      this.getLayout('header').showRegions();

      if (!this.options.comesFromAccountPage) {
        this.getLayout('main').toggleLoadingContentState();
        this.fetchBoards(App.Accounts.current.id);
      } else {
        this.onBoardsFetch();
      }

      App.Cache.saveCurrent('account', App.Accounts.current.id);
    }
  },

  fetchNotifications: function(account, board) {
    account = account || App.Accounts.current.id;

    App.Notifications.url = '/api/accounts/' + account + '/activity/';

    return App.Notifications.fetch({
      data: board ? {board: board} : void 0,
      reset: true,
      success: this.onNotificationsFetch
    });
  },

  onNotificationsFetch: function() {
    if (!this.firstLoad) {
      this.getLayout('content').showNotifications({
        board: App.Boards.current || this.allActivityModel
      }).toggleEmptyNotificationsState(App.Notifications.isEmpty());
    }

    this.firstLoad = false;
  },

  onAllActivityClicked: function() {
    App.Boards.current = null;
    this.setTitle('Blimp Boards | All Activity');
    this.getLayout('content').toggleLoadingContentState();
    this.fetchNotifications();
  },

  fetchBoards: function(account) {
    account = account || App.Accounts.current.id;

    return App.Boards.fetch({
      data: {account: account},
      reset: true,
      success: this.onBoardsFetch
    });
  },

  onBoardsFetch: function() {
    this.getLayout('main')
      .showBoards()
      .toggleEmptyBoardsState(App.Boards.isEmpty());

    this.fetchNotifications();

    if (this.firstLoad) {
      this.getLayout('content')
        .setElement('div.account-page-content')
        .showNotifications({
          board: this.allActivityModel
        });

      this.broadcast('app:loaded');
      this.listen();
    }
  },

  onBoardSelected: function(board) {
    console.log('hey');
    this.options.card = null;
    this.options.board = board.get('slug');
    this.options.forceCardsShow = true;
    App.Accounts.setCurrent(App.Accounts.get(board.get('account')).get('slug'));
    App.Cache.saveCurrent('account', App.Accounts.current.id);
    this.setTitle('Blimp Boards | ' + App.Boards.current.get('name') + ' activity');
    this.getLayout('content').toggleLoadingContentState();
    this.fetchNotifications(App.Accounts.current.id, board.id);
  },

  onBoardAdded: function(board) {
    this.getLayout('main').toggleEmptyBoardsState(false);
  },

  onBoardRemoved: function() {
    if (App.Boards.isEmpty()) {
      this.getLayout('content').closeCards();
      this.getLayout('main').toggleEmptyBoardsState(true);
      this.broadcast('router:navigate', App.Accounts.current.getUrl(), {
        trigger: false
      });
    }
  }
});
