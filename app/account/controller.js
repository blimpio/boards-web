module.exports = Zeppelin.Controller.extend({
  title: 'Blimp Boards',

  layouts: {
    main: require('account/layouts/main'),
    content: require('account/layouts/content')
  },

  firstLoad: true,

  subscriptions: {
    'cardDetail:closed': 'showCurrentBoard'
  },

  initialize: function() {
    _.bindAll(this, ['onAccountsFetch', 'onBoardsFetch', 'onCardsFetch', 'onCommentsFetch']);
    this.getLayout('main').render();
    this.getLayout('content').setElement('div.content').setHeight();
    this.fetchAccounts();
  },

  listen: function() {
    this.listenTo(App.Boards, 'add', this.onBoardsChange);
    this.listenTo(App.Boards, 'remove', this.onBoardsChange);
    this.listenTo(App.Boards, 'change:current', this.renderBoard);
    this.listenTo(App.Cards, 'add', this.onCardsChange);
    this.listenTo(App.Cards, 'remove', this.onCardsChange);
    this.listenTo(App.Cards, 'change:current', this.renderCard);
  },

  fetchAccounts: function() {
    App.Accounts.fetch({
      reset: true
    }).done(this.onAccountsFetch);

    return this;
  },

  onAccountsFetch: function(response) {
    var currentAccount = App.Accounts.where({slug: this.options.account})[0];

    if (currentAccount) {
      App.Accounts.current = currentAccount;
      App.Cache.saveCurrent('account', currentAccount.attributes);
      this.getLayout('main').showHeader().toggleLoadingBoardsState();
      this.fetchBoards(App.Accounts.current.id);
    }
  },

  fetchBoards: function(account) {
    account = account || App.Accounts.current.id;

    App.Boards.fetch({
      data: {account: account},
      reset: true
    }).done(this.onBoardsFetch);

    return this;
  },

  onBoardsFetch: function(response) {
    var currentBoard = App.Boards.where({slug: this.options.board})[0];

    this.getLayout('main').showBoards();
    this.getLayout('main').toggleEmptyBoardsState(App.Boards.isEmpty());

    if (!App.Boards.isEmpty()) {
      if (currentBoard) {
        App.Boards.current = currentBoard;
        App.Cache.saveCurrent('boards', App.Boards.current.attributes);
      } else if (App.Cache.has('board')) {
        App.Boards.current = App.Boards.get(App.Cache.get('board').id);
      } else {
        App.Boards.current = App.Boards.at(0);
        App.Cache.saveCurrent('boards', App.Boards.current.attributes);
      }

      if (!this.options.card) {
        App.Boards.current.select();
        this.getLayout('content').showBoardDetail(App.Boards.current);
      } else {
        App.Boards.current.select({navigate: false});
      }

      this.fetchCards(App.Boards.current);
    } else {
      if (this.firstLoad) this.listen();
      this.firstLoad = false;
    }
  },

  renderBoard: function(board) {
    this.getLayout('content').showBoardDetail(board);
    this.fetchCards(board);
  },

  showCurrentBoard: function() {
    this.getLayout('main').enableFileUploader();
    this.getLayout('content').showBoardDetail(App.Boards.current);
    this.getLayout('content').showCards();
    this.options.card = null;
  },

  onBoardsChange: function() {
    if (App.Boards.isEmpty()) {
      this.getLayout('main').toggleEmptyBoardsState(true);
      this.getLayout('content').closeBoardDetail();
      this.broadcast('router:navigate', '/' + App.Accounts.current.get('slug') + '/', {
        trigger: false
      });
    }
  },

  fetchCards: function(board) {
    board = board.id || App.Boards.current.id;

    App.Cards.fetch({
      data: {board: board},
      reset: true
    }).done(this.onCardsFetch);

    return this;
  },

  onCardsFetch: function(response) {
    var currentCard;

    if (this.firstLoad) this.listen();
    this.firstLoad = false;

    this.getLayout('main').showFileUploader(App.Boards.current.attributes);
    this.getLayout('main').showCreateNoteModal(App.Boards.current.attributes);
    this.getLayout('content').toggleEmptyCardsState(App.Cards.isEmpty());

    if (!App.Cards.isEmpty()) {
      this.getLayout('content').showCards();
    }

    if (this.options.card) {
      currentCard = App.Cards.where({slug: this.options.card})[0];

      if (currentCard) {
        App.Cards.current = currentCard;
        App.Cards.current.select();
      }
    }
  },

  onCardsChange: function() {
    this.getLayout('content').toggleEmptyCardsState(App.Cards.isEmpty());
  },

  renderCard: function(card) {
    this.getLayout('main').disableFileUploader();
    this.getLayout('content').showCardDetail(card, App.Boards.current);
    this.fetchComments(card);
  },

  fetchComments: function(card) {
    card = card.id || App.Card.current.id;
    App.Comments.fetchComments(card).done(this.onCommentsFetch);
    return this;
  },

  onCommentsFetch: function(response) {
    this.getLayout('content').showRegion('cardComments');
  }
});
