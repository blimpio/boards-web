var Board = require('core/models/board'),
    Account = require('core/models/account');

module.exports = Zeppelin.Controller.extend({
  title: 'Blimp Boards',

  layouts: {
    main: require('public-board/layouts/main'),
    content: require('public-board/layouts/content'),
    comments: require('account/layouts/comments'),
    settings: require('settings/layouts/main')
  },

  firstLoad: true,

  subscriptions: {
    'cardDetail:closed': 'onCardDetailClose'
  },

  initialize: function() {
    _.bindAll(this, ['onAccountFetch', 'onBoardFetch',
    'onCollaboratorsFetch', 'onCardsFetch', 'onCommentsFetch']);

    this.board = new Board({id: App.PUBLIC_BOARD.id});
    this.account = new Account({id: App.PUBLIC_BOARD.account});

    this.getLayout('main').render();

    if (App.User.isSignedIn()) {
      this.getLayout('settings').setElement('div.settings').render();
    }

    this.fetchAccount(this.account);
  },

  listen: function() {
    this.listenTo(App.Cards, 'change:current', this.onCardSelected);
  },

  fetchAccount: function(account) {
    account = account || this.account;

    return account.fetch({
      success: this.onAccountFetch
    });
  },

  onAccountFetch: function() {
    App.Accounts.current = this.account;

    if (App.Accounts.current.id) {
      this.getLayout('main')
        .renderHeader(this.account)
        .toggleLoadingContentState();

      this.fetchBoard(this.board);
    }
  },

  fetchBoard: function(board) {
    board = board || this.board;

    return board.fetch({
      success: this.onBoardFetch
    });
  },

  onBoardFetch: function() {
    App.Boards.add(this.board);
    App.Boards.current = this.board;
    this.fetchCollaborators(this.board.id);
  },

  fetchCollaborators: function(board) {
    board = board || this.board.id;

    App.BoardCollaborators.setUrl(board);

    return App.BoardCollaborators.fetch({
      reset: true,
      success: this.onCollaboratorsFetch
    });
  },

  onCollaboratorsFetch: function() {
    if (App.User.isSignedIn()) {
      App.BoardCollaborators.setCurrent(App.User.id);
    }

    this.fetchCards(this.board.id);
  },

  fetchCards: function(board) {
    board = board || this.board.id;

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
      this.getLayout('content').setElement('div.account-page-content');
      this.getLayout('comments').setElement('div.card-detail-comments').render();
    }

    this.getLayout('content').showCards({
      board: this.board,
      canEdit: false,
    }).toggleEmptyCardsState(App.Cards.isEmpty());

    if (this.options.card) {
      App.Cards.setCurrent(this.options.card);
      App.Cards.current.select({navigate: false});
    }
  },

  onCardSelected: function(card) {
    this.getLayout('content').showCard({
      card: card,
      board: this.board,
      canEdit: false
    });

    this.getLayout('comments').toggleLoadingState();
    this.fetchComments(App.Cards.current.id);
  },

  onCardDetailClose: function() {
    this.options.card = null;

    this.getLayout('content')
      .closeCard()
      .showCards({
        board: this.board,
        canEdit: false,
        triggerLayout: true
      }).toggleEmptyCardsState(App.Cards.isEmpty());
  },

  onCardAdded: function() {
    this.getLayout('content').toggleEmptyCardsState(App.Cards.isEmpty());
  },

  onCardRemoved: function() {
    if (this.getLayout('content').getRegion('detail').isShown()) {
      this.broadcast('router:navigate', this.board.getUrl(), {
        trigger: false
      });

      this.getLayout('content').showCards({
        board: this.board,
        canEdit: false,
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

  onCommentsFetch: function() {
    this.getLayout('comments').showCollaboratorComments();
    this.getLayout('comments').toggleLoadingState();
  }
});
