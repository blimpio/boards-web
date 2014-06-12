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
    this.getLayout('header').setElement('div.header-container');

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
    }
  },

  fetchNotifications: function(account, board) {
    if (account) {
      App.Notifications.url = App.API_URL + '/accounts/' + account + '/activity/';
    } else {
      App.Notifications.url = App.API_URL + '/accounts/' + App.Accounts.current.id + '/activity/';
    }

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
    var myAccount = App.Accounts.getPersonalAccount();

    if (!this.firstLoad) {
      this.getLayout('content').toggleLoadingContentState();
    }

    if (App.Boards.current) App.Boards.current.deselect();
    this.options.board = null;
    App.Boards.current = null;

    this.setTitle('Blimp Boards | All Activity');
    this.fetchNotifications(myAccount.id);
    this.broadcast('router:navigate', myAccount.get('slug') + '/activity/', {
      navigate: false
    });
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

    if (!App.Boards.isEmpty()) {
      if (this.options.board) {
        App.Boards.setCurrent(this.options.board);
        App.Boards.current.select({navigate: false});
        this.fetchNotifications(App.Accounts.current.id, App.Boards.current.id);
      } else {
        this.getLayout('main').selectAllActivity();
        this.onAllActivityClicked();
      }
    }

    if (this.firstLoad) {
      this.getLayout('content')
        .setElement('div.account-page-content')
        .showNotifications({
          board: this.options.board && App.Boards.current
            ? App.Boards.current
            : this.allActivityModel
        }).toggleEmptyNotificationsState(false);

      if (this.options.board) this.onBoardSelected(App.Boards.current);
      this.broadcast('app:loaded');
      this.listen();
    }
  },

  onBoardSelected: function(board) {
    this.options.board = board.get('slug');
    App.Boards.setCurrent(board.get('slug'));
    this.setTitle('Blimp Boards | ' + App.Boards.current.get('name') + ' activity');
    this.getLayout('content').toggleLoadingContentState();
    this.fetchNotifications(board.get('account'), board.id);
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
