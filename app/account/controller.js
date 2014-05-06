module.exports = Zeppelin.Controller.extend({
  name: 'Account',

  title: 'Blimp Boards',

  layouts: {
    header: require('core/layouts/header'),
    content: require('account/layouts/content'),
    settings: require('settings/layouts/main'),
    comments: require('account/layouts/comments'),
    shareBoard: require('account/layouts/share-board')
  },

  firstLoad: true,

  subscriptions: {
    'cardDetail:closed': 'onCardDetailClose'
  },

  initialize: function() {
    _.bindAll(this, ['onAccountsFetch', 'onBoardsFetch',
    'onCollaboratorsFetch', 'onCardsFetch', 'onCommentsFetch']);

    if (this.options.comesFromAccountPage) {
      this.addLayout('main', require('account/layouts/main'), {
        comesFromAccountPage: true
      });
    } else {
      this.addLayout('main', require('account/layouts/main'));
    }

    this.getLayout('main').render();
    this.getLayout('header').setElement('div.header');

    if (!this.options.comesFromAccountPage) {
      this.getLayout('main').toggleLoadingMainState();
      this.getLayout('header').render({
        account: this.options.account,
        boardsSelected: true
      });
    }

    this.getLayout('settings').setElement('div.settings').render();
    this.getLayout('shareBoard').setElement('div.share-board').render();

    if (this.options.comesFromAccountPage) {
      this.onBoardsFetch();
    } else {
      this.fetchAccounts();
    }
  },

  listen: function() {
    this.listenTo(App.Cards, 'add', this.onCardAdded);
    this.listenTo(App.Cards, 'remove', this.onCardRemoved);
    this.listenTo(App.Cards, 'change:current', this.onCardSelected);
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
      this.getLayout('main').toggleLoadingContentState();
      this.fetchBoards(App.Accounts.current.id);
      App.Cache.saveCurrent('account', App.Accounts.current.id);
    }
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
        App.Cache.saveCurrent('board', App.Boards.current.id);
      } else if (App.Cache.has('board')) {
        App.Boards.current = App.Boards.get(App.Cache.get('board'));
      } else {
        App.Boards.current = App.Boards.at(0);
        App.Cache.saveCurrent('board', App.Boards.current.id);
      }

      this.setTitle(App.Boards.current.get('name') + ' - Blimp Boards');
      App.Boards.current.select({navigate: this.options.card === undefined});
      this.fetchCollaborators(App.Boards.current.id);
    } else {
      if (this.firstLoad) {
        this.firstLoad = false;
        this.getLayout('content').setElement('div.account-page-content');
        this.getLayout('comments').setElement('div.card-detail-comments').render();
        this.broadcast('app:loaded');
        this.listen();
      }
    }
  },

  onBoardSelected: function(board) {
    this.options.card = null;
    this.options.board = board.get('slug');
    this.options.forceCardsShow = true;
    this.setTitle(App.Boards.current.get('name') + ' - Blimp Boards');
    this.getLayout('content').toggleLoadingContentState();
    this.fetchCollaborators(board.id);
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
  },

  onBoardRoute: function(slug) {
    var canEdit;

    if (this.options.board === slug) {
      canEdit = App.BoardCollaborators.current.canEdit();
      this.options.card = null;
      this.options.forceCardsShow = false;
      this.getLayout('content').showCards({
        board: App.Boards.current,
        canEdit: canEdit,
        forceShow: false
      }).toggleEmptyCardsState(App.Cards.isEmpty(), canEdit);
    } else {
      this.options.board = slug;
      App.Boards.setCurrent(slug);
      App.Cache.saveCurrent('board', App.Boards.current.id);
      App.Boards.current.select({navigate: false});
    }
  },

  fetchCollaborators: function(board) {
    board = board || App.Boards.current.id;

    App.BoardCollaborators.setUrl(board);

    return App.BoardCollaborators.fetch({
      reset: true,
      success: this.onCollaboratorsFetch
    });
  },

  onCollaboratorsFetch: function() {
    App.BoardCollaborators.setCurrent(App.User.id);
    this.getLayout('shareBoard').showSettings(App.Boards.current);
    this.fetchCards(App.Boards.current.id);
  },

  fetchCards: function(board) {
    board = board || App.Boards.current.id;

    return App.Cards.fetch({
      data: {board: board},
      reset: true,
      success: this.onCardsFetch
    });
  },

  onCardsFetch: function() {
    var canEdit = App.BoardCollaborators.current.canEdit();

    if (this.firstLoad) {
      this.firstLoad = false;
      this.getLayout('content').setElement('div.account-page-content');
      this.getLayout('comments').setElement('div.card-detail-comments').render();
      this.broadcast('app:loaded');
      this.listen();
    }

    this.getLayout('content').showCards({
      board: App.Boards.current,
      canEdit: canEdit,
      forceShow: this.options.forceCardsShow
    }).toggleEmptyCardsState(App.Cards.isEmpty(), canEdit);

    this.getLayout('comments').reset();

    if (this.options.card) {
      App.Cards.setCurrent(this.options.card);
      App.Cards.current.select({navigate: false});
    }

    this.options.forceCardsShow = false;
  },

  onCardSelected: function(card) {
    this.setTitle(App.Cards.current.get('name') + ' - Blimp Boards');

    this.getLayout('content').showCard({
      card: card,
      board: App.Boards.current,
      canEdit: App.BoardCollaborators.current.canEdit()
    });

    this.getLayout('comments').toggleLoadingState();
    this.fetchComments(App.Cards.current.id);
  },

  onCardDetailClose: function() {
    var canEdit = App.BoardCollaborators.current.canEdit();
    this.options.card = null;

    this.setTitle(App.Boards.current.get('name') + ' - Blimp Boards');

    this.getLayout('content')
      .closeCard()
      .showCards({
        board: App.Boards.current,
        canEdit: canEdit,
        triggerLayout: true
      }).toggleEmptyCardsState(App.Cards.isEmpty(), canEdit);

      this.getLayout('comments').reset();
  },

  onCardAdded: function() {
    this.getLayout('content').toggleEmptyCardsState(false);
  },

  onCardRemoved: function() {
    var canEdit = App.BoardCollaborators.current.canEdit();

    if (this.getLayout('content').getRegion('detail').isShown()) {
      this.broadcast('router:navigate', App.Boards.current.getUrl(), {
        trigger: false
      });

      this.getLayout('content').showCards({
        board: App.Boards.current,
        canEdit: canEdit,
        triggerLayout: true
      });

      this.getLayout('comments').reset();
    }

    this.getLayout('content').toggleEmptyCardsState(App.Cards.isEmpty(), canEdit);
  },

  onCardRoute: function(boardSlug, cardSlug) {
    if (this.options.board === boardSlug) {
      this.options.card = cardSlug;
      App.Cards.setCurrent(cardSlug);
      App.Cards.current.select({navigate: false});
    } else {
      this.options.card = cardSlug;
      this.options.board = boardSlug;
      App.Boards.setCurrent(boardSlug);
      App.Cache.saveCurrent('board', App.Boards.current.id);
      App.Boards.current.select({navigate: false});
    }
  },

  fetchComments: function(card) {
    card = card || App.Card.current.id;
    App.Comments.fetchComments(card).done(this.onCommentsFetch);
    return this;
  },

  onCommentsFetch: function(response) {
    this.getLayout('comments').showComments({
      card: App.Cards.current.id,
      user: App.User.attributes
    });
  }
});
