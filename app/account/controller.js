module.exports = Zeppelin.Controller.extend({
  title: 'Blimp Boards',

  layouts: {
    main: require('account/layouts/main'),
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

    this.getLayout('main').render();
    this.getLayout('settings').setElement('#settings').render();
    this.getLayout('shareBoard').setElement('#share-board').render();

    this.fetchAccounts();
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
      this.getLayout('main')
        .showHeader()
        .toggleLoadingContentState();

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

      App.Boards.current.select({navigate: this.options.card === undefined});
      this.fetchCollaborators(App.Boards.current.id);
    } else {
      if (this.firstLoad) {
        this.firstLoad = false;
        this.listen();
      }
    }
  },

  onBoardSelected: function(board) {
    this.options.card = null;
    this.getLayout('content').toggleLoadingContentState();
    this.fetchCollaborators(board.id);
  },

  onBoardAdded: function(board) {
    this.getLayout('main').toggleEmptyBoardsState(false);
  },

  onBoardRemoved: function() {
    if (App.Boards.isEmpty()) {
      this.getLayout('main').toggleEmptyBoardsState(true);
      this.broadcast('router:navigate', App.Accounts.current.getUrl(), {
        trigger: false
      });
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
    if (this.firstLoad) {
      this.firstLoad = false;
      this.listen();
      this.getLayout('content').setElement('#account-page-content');
      this.getLayout('comments').setElement('#card-detail-comments').render();
    }

    this.getLayout('content').showCards({
      board: App.Boards.current,
      canEdit: App.BoardCollaborators.current.canEdit(),
    }).toggleEmptyCardsState(App.Cards.isEmpty());

    if (this.options.card) {
      App.Cards.setCurrent(this.options.card);
      App.Cards.current.select({navigate: false});
    }
  },

  onCardSelected: function(card) {
    this.getLayout('content').showCard({
      card: card,
      board: App.Boards.current,
      canEdit: App.BoardCollaborators.current.canEdit()
    });

    this.getLayout('comments').toggleLoadingState();
    this.fetchComments(App.Cards.current.id);
  },

  onCardDetailClose: function() {
    this.options.card = null;

    this.getLayout('content')
      .closeCard()
      .showCards({
        board: App.Boards.current,
        canEdit: App.BoardCollaborators.current.canEdit(),
        triggerLayout: true
      }).toggleEmptyCardsState(App.Cards.isEmpty());
  },

  onCardAdded: function() {
    this.getLayout('content').toggleEmptyCardsState(App.Cards.isEmpty());
  },

  onCardRemoved: function() {
    if (this.getLayout('content').getRegion('detail').isShown()) {
      this.broadcast('router:navigate', App.Boards.current.getUrl(), {
        trigger: false
      });

      this.getLayout('content').showCards({
        board: App.Boards.current,
        canEdit: App.BoardCollaborators.current.canEdit(),
        triggerLayout: true
      });
    }

    this.getLayout('content').toggleEmptyCardsState(App.Cards.isEmpty());
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
