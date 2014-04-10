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
    'cardDetail:closed': 'showCurrentBoard'
  },

  initialize: function() {
    _.bindAll(this, ['onAccountsFetch', 'onBoardsFetch', 'onCollaboratorsFetch',
    'onCardsFetch', 'onCommentsFetch']);

    this.getLayout('main').render();
    this.getLayout('content').setElement('div.content').setHeight();
    this.getLayout('settings').setElement('div#settings').render();
    this.getLayout('shareBoard').setElement('div#share-board').render();

    this.fetchAccounts();
  },

  listen: function() {
    this.listenTo(App.Cards, 'add', this.onCardAdded);
    this.listenTo(App.Cards, 'remove', this.onCardRemoved);
    this.listenTo(App.Cards, 'change:current', this.renderCard);
    this.listenTo(App.Boards, 'add', this.onBoardsChange);
    this.listenTo(App.Boards, 'remove', this.onBoardsChange);
    this.listenTo(App.Boards, 'change:current', this.fetchCollaborators);
  },

  fetchAccounts: function() {
    if (App.Accounts.isEmpty()) {
      App.Accounts.fetch({
        reset: true
      }).done(this.onAccountsFetch);
    } else {
      this.onAccountsFetch();
    }

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
        App.Cache.saveCurrent('board', App.Boards.current.attributes);
      } else if (App.Cache.has('board')) {
        App.Boards.current = App.Boards.get(App.Cache.get('board').id);
      } else {
        App.Boards.current = App.Boards.at(0);
        App.Cache.saveCurrent('board', App.Boards.current.attributes);
      }

      if (!this.options.card) {
        App.Boards.current.select();
      } else {
        App.Boards.current.select({navigate: false});
      }

      this.fetchCollaborators(App.Boards.current);
    } else {
      if (this.firstLoad) this.listen();
      this.firstLoad = false;
    }
  },

  renderBoard: function(board) {
    var canEdit = App.BoardCollaborators.current.canEdit();

    this.getLayout('comments').remove();
    this.getLayout('content').closeCardDetail();
    this.getLayout('content').closeBoardDetail();

    this.getLayout('content').showBoardDetail(board, canEdit);
    this.getLayout('main').showFileUploader(board.attributes);
    this.getLayout('main').showCreateNoteModal(board.attributes);
  },

  showCurrentBoard: function() {
    var canEdit = App.BoardCollaborators.current.canEdit();

    this.getLayout('main').enableFileUploader();
    this.getLayout('content').showBoardDetail(App.Boards.current, canEdit);
    this.getLayout('comments').remove();
    this.getLayout('content').showCards(canEdit);
    this.options.card = null;
  },

  onBoardsChange: function() {
    if (App.Boards.isEmpty()) {
      this.getLayout('main').toggleEmptyBoardsState(true);
      this.getLayout('content').closeBoardDetail();
      this.broadcast('router:navigate', App.Accounts.current.getUrl(), {
        trigger: false
      });
    }
  },

  fetchCollaborators: function(board) {
    board = board.id || App.Boards.current.id;

    $.when(
      App.AccountCollaborators.fetch({
        reset: true
      }),

      App.BoardCollaborators.fetch({
        data: {board: board},
        reset: true
      })
    ).done(this.onCollaboratorsFetch);

    return this;
  },

  onCollaboratorsFetch: function() {
    App.BoardCollaborators.current = App.BoardCollaborators.getCollaborator(App.User.id);
    App.AccountCollaborators.current = App.AccountCollaborators.getCollaborator(App.User.id);

    this.renderBoard(App.Boards.current);
    this.fetchCards(App.Boards.current);
    this.getLayout('shareBoard').renderSettings(App.Boards.current);
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
    var canEdit = App.BoardCollaborators.current.canEdit(),
        currentCard;

    if (this.firstLoad) this.listen();
    this.firstLoad = false;

    this.getLayout('content').getRegion('cardsList').showList(canEdit);
    this.getLayout('content').toggleEmptyCardsState(App.Cards.isEmpty());

    if (this.options.card) {
      currentCard = App.Cards.where({slug: this.options.card})[0];

      if (currentCard) {
        App.Cards.current = currentCard;
        App.Cards.current.select();
      }
    }
  },

  onCardAdded: function() {
    this.getLayout('content').toggleEmptyCardsState(App.Cards.isEmpty());
  },

  onCardRemoved: function() {
    if (this.getLayout('content').cardDetailIsShow()) {
      this.broadcast('router:navigate', App.Boards.current.getUrl(), {
        trigger: false
      });

      this.showCurrentBoard();
      this.broadcast('cardsList:layout');
    }

    this.getLayout('content').toggleEmptyCardsState(App.Cards.isEmpty());
  },

  renderCard: function(card) {
    var creator = App.BoardCollaborators.getCollaborator(card.get('created_by')),
        canEdit = App.BoardCollaborators.current.canEdit();

    creator = {
      name: creator.getName(),
      avatar: creator.getAvatar()
    };

    this.getLayout('main').disableFileUploader();
    this.getLayout('content').showCardDetail(card, App.Boards.current, creator, canEdit);

    this.getLayout('comments').options = {
      card: card,
      canEdit: canEdit,
      creator: creator,
      currentUser: {
        name: App.User.getFullName(),
        avatar: App.User.get('gravatar_url')
      },
      isPublicBoard: App.Boards.current.get('is_shared')
    };

    this.getLayout('comments').setElement('div#comments-layout').render();

    this.fetchComments(card);
    return this;
  },

  fetchComments: function(card) {
    card = card.id || App.Card.current.id;
    App.Comments.fetchComments(card).done(this.onCommentsFetch);
    return this;
  },

  onCommentsFetch: function(response) {
    App.Comments.addCreatorsData(App.BoardCollaborators.getCollaborators(
      _.unique(App.Comments.pluck('created_by'))
    ));

    this.getLayout('comments').renderCommentForm();
    this.getLayout('comments').showCollaboratorComments();
  }
});
