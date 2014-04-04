var Board = require('core/models/board'),
    Account = require('core/models/account');

module.exports = Zeppelin.Controller.extend({
  title: 'Blimp Boards',

  layouts: {
    main: require('public-board/layouts/main'),
    content: require('public-board/layouts/content')
  },

  firstLoad: true,

  subscriptions: {
    'cardDetail:closed': 'showCurrentBoard'
  },

  initialize: function() {
    _.bindAll(this, ['onAccountFetch', 'onBoardFetch',
    'onCardsFetch', 'onCommentsFetch']);

    this.board = new Board({id: App.PUBLIC_BOARD.id});
    this.account = new Account({id: App.PUBLIC_BOARD.account});

    this.getLayout('main').render();
    this.getLayout('content').setElement('div.content').setHeight();

    this.fetchAccount();
    this.fetchBoard();
  },

  listen: function() {
    this.listenTo(App.Cards, 'change:current', this.renderCard);
  },

  fetchAccount: function(account) {
    account = account || this.account;
    account.fetch().done(this.onAccountFetch);
    return this;
  },

  onAccountFetch: function(response) {
    App.Accounts.current = this.account;
    this.getLayout('main').toggleLoadingMainState().renderHeader(this.account);
  },

  fetchBoard: function(board) {
    board = board || this.board;
    board.fetch().done(this.onBoardFetch);
    return this;
  },

  onBoardFetch: function(response) {
    App.Boards.add(this.board);
    App.Boards.current = this.board;

    this.fetchCollaborators(this.board.id);
    this.fetchCards(this.board.id);

    this.getLayout('main').toggleEmptyBoardState(false);

    if (!this.options.card) {
      this.getLayout('content').renderBoardDetail(this.board);
    }
  },

  showCurrentBoard: function() {
    this.getLayout('content').renderBoardDetail(this.board);
    this.getLayout('content').showCards();
  },

  fetchCollaborators: function(board) {
    board = board || this.board.id;

    App.Collaborators.fetch({
      data: {board: board},
      reset: true
    });

    return this;
  },

  fetchCards: function(board) {
    board = board || this.board.id;

    App.Cards.fetch({
      data: {board: board},
      reset: true
    }).done(this.onCardsFetch);

    return this;
  },

  onCardsFetch: function(response) {
    if (this.firstLoad) this.listen();
    this.firstLoad = false;

    this.getLayout('content').getRegion('cardsList').show();
    this.getLayout('content').toggleEmptyCardsState(App.Cards.isEmpty());

    if (this.options.card) {
      currentCard = App.Cards.where({slug: this.options.card})[0];

      if (currentCard) {
        App.Cards.current = currentCard;
        App.Cards.current.select();
      }
    }
  },

  renderCard: function(card) {
    var creator = App.Collaborators.getCollaborator(card.get('created_by'));

    creator = {
      name: creator.getFullName(),
      avatar: creator.get('gravatar_url')
    };

    this.getLayout('content').showCardDetail(card, App.Boards.current, creator);
    this.fetchComments(card);
    return this;
  },

  fetchComments: function(card) {
    card = card.id || App.Card.current.id;
    App.Comments.fetchComments(card).done(this.onCommentsFetch);
    return this;
  },

  onCommentsFetch: function(response) {
    App.Comments.addCreatorsData(App.Collaborators.getCollaborators(
      _.unique(App.Comments.pluck('created_by'))
    ));

    this.getLayout('content').showRegion('cardComments');
  }
});
