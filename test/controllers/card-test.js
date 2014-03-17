describe('CardController', function() {
  var CardController = require('controllers/card');

  beforeEach(function() {
    App.Cache.set('current_account', 1, {silent: true});

    App.Boards.reset([{
      account: 1,
      created_by: 2,
      date_created: '2014-02-24T21:21:54.134Z',
      date_modified: '2014-02-24T21:39:39.283Z',
      id: 2,
      is_shared: false,
      name: 'Designs_',
      slug: 'designs-1',
      thumbnail_lg_path: '',
      thumbnail_md_path: '',
      thumbnail_sm_path: ''
    }, {
      account: 1,
      created_by: 2,
      date_created: '2014-02-24T21:19:43.334Z',
      date_modified: '2014-02-24T21:21:12.674Z',
      id: 1,
      is_shared: false,
      name: 'Inspiration',
      slug: 'designs',
      thumbnail_lg_path: '',
      thumbnail_md_path: '',
      thumbnail_sm_path: ''
    }], {silent: true});

    App.Boards.setCurrent('designs-1');

    App.Cards.reset([{
      'created_by':2,
      'id':2,
      'date_created':'2014-02-28T18:25:56.961Z',
      'date_modified':'2014-02-28T18:25:56.966Z',
      'name':'Another note',
      'type':'note',
      'slug':'another-note',
      'board':2,
      'featured':false,
      'origin_url':'',
      'content':'With some other content...',
      'is_shared':false,
      'thumbnail_sm_path':'',
      'thumbnail_md_path':'',
      'thumbnail_lg_path':'',
      'file_size':null,
      'file_extension':'',
      'cards':[]
    }], {silent: true});
  });

  afterEach(function() {
    App.Boards.reset([], {silent: true});
    App.Cards.reset([], {silent: true});
    App.Cache.clear({silent: true}).destroyCache();
    $('#application').empty();
  });

  describe('when instantiated.', function() {
    var cardController;

    beforeEach(function() {
      cardController = new CardController();
    });

    it('should exist.', function() {
      expect(cardController).to.exist;
    });

    it('should have a name property.', function() {
      expect(cardController.name).to.exist;
      expect(cardController.name).to.equal('CardController');
    });

    it('should have a template property.', function() {
      expect(cardController.template).to.exist;
    });

    it('should render and insert.', function() {
      expect(cardController._isRendered).to.be.true;
      expect(cardController._isInserted).to.be.true;
    });

    it('should have a boardSlug property.', function() {
      expect(cardController.boardSlug).to.exist;
    });

    it('should have child views.', function() {
      expect(cardController.getView('header')).to.exist;
      expect(cardController.getView('allBoards')).to.exist;
      expect(cardController.getView('currentBoard')).to.exist;
      expect(cardController.getView('currentCard')).to.exist;
    });

    afterEach(function() {
      cardController.unplug(true);
    });
  });

  describe('fetchBoards()', function() {
    var cardController, renderCurrentBoardSpy;

    beforeEach(function() {
      renderCurrentBoardSpy = sinon.spy(CardController.prototype, 'renderCurrentBoard');
      cardController = new CardController();
    });

    it('should immediately call renderCurrentBoard if the collection has boards.', function() {
      cardController.fetchBoards();
      expect(renderCurrentBoardSpy).to.have.been.called;
    });

    afterEach(function() {
      cardController.unplug(true);
      CardController.prototype.renderCurrentBoard.restore();
    });
  });

  describe('fetchCards()', function() {
    var cardController, renderCurrentCardSpy;

    beforeEach(function() {
      renderCurrentCardSpy = sinon.spy(CardController.prototype, 'renderCurrentCard');
      cardController = new CardController();
    });

    it('should immediately call renderCurrentCard if the collection has cards.', function() {
      cardController.fetchCards({id: 2});
      expect(renderCurrentCardSpy).to.have.been.called;
    });

    afterEach(function() {
      cardController.unplug(true);
      CardController.prototype.renderCurrentCard.restore();
    });
  });

  describe('renderCurrentBoard()', function() {
    var cardController;

    beforeEach(function() {
      cardController = new CardController();
    });

    it('should render the current board.', function() {
      cardController.renderCurrentBoard();
      expect(cardController.getView('allBoards')._isRendered).to.be.true;
      expect(cardController.getView('currentBoard')._isRendered).to.be.true;
    });

    afterEach(function() {
      cardController.unplug(true);
    });
  });

  describe('renderCurrentCard()', function() {
    var cardController;

    beforeEach(function() {
      cardController = new CardController();
      cardController.cardSlug = 'another-note';
    });

    it('should render the cards from the current board.', function() {
      cardController.renderCurrentCard();
      expect(document.title).to.equal('Blimp | Another note');
      expect(cardController.getView('currentCard')._isRendered).to.be.true;
      expect(cardController.getView('currentCard').model.id).to.equal(2);
    });

    afterEach(function() {
      cardController.unplug(true);
    });
  });
});
