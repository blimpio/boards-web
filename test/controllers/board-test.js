describe('BoardController', function() {
  var BoardController = require('controllers/board');

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
    var boardController;

    beforeEach(function() {
      boardController = new BoardController();
    });

    it('should exist.', function() {
      expect(boardController).to.exist;
    });

    it('should have a name property.', function() {
      expect(boardController.name).to.exist;
      expect(boardController.name).to.equal('BoardController');
    });

    it('should have a template property.', function() {
      expect(boardController.template).to.exist;
    });

    it('should render and insert.', function() {
      expect(boardController.isRendered).to.be.true;
      expect(boardController.isInserted).to.be.true;
    });

    it('should have a boardSlug property.', function() {
      expect(boardController.boardSlug).to.exist;
    });

    afterEach(function() {
      boardController.unplug(true);
    });
  });

  describe('fetchBoards()', function() {
    var boardController, renderCurrentBoardSpy;

    beforeEach(function() {
      renderCurrentBoardSpy = sinon.spy(BoardController.prototype, 'renderCurrentBoard');
      boardController = new BoardController();
    });

    it('should immediately call renderCurrentBoard if the collection has boards.', function() {
      boardController.fetchBoards();
      expect(renderCurrentBoardSpy).to.have.been.called;
    });

    afterEach(function() {
      boardController.unplug(true);
      BoardController.prototype.renderCurrentBoard.restore();
    });
  });

  describe('fetchCards()', function() {
    var boardController, renderCardsSpy;

    beforeEach(function() {
      renderCardsSpy = sinon.spy(BoardController.prototype, 'renderCards');
      boardController = new BoardController();
    });

    it('should immediately call renderCards if the collection has cards.', function() {
      boardController.fetchCards({id: 2});
      expect(renderCardsSpy).to.have.been.called;
    });

    afterEach(function() {
      boardController.unplug(true);
      BoardController.prototype.renderCards.restore();
    });
  });

  describe('initChildren()', function() {
    var boardController;

    beforeEach(function() {
      boardController = new BoardController();
    });

    it('should init and render child views.', function() {
      boardController.initChildren();
      expect(boardController.children.header).to.exist;
      expect(boardController.children.allBoards).to.exist;
      expect(boardController.children.currentBoard).to.exist;
      expect(boardController.children.cardsList).to.exist;
    });

    afterEach(function() {
      boardController.unplug(true);
    });
  });

  describe('renderCurrentBoard()', function() {
    var boardController;

    beforeEach(function() {
      boardController = new BoardController();
    });

    it('should render the current board.', function() {
      boardController.renderCurrentBoard();
      expect(document.title).to.equal('Blimp | Designs_');
      expect(boardController.children.allBoards.isRendered).to.be.true;
      expect(boardController.children.currentBoard.isRendered).to.be.true;
    });

    afterEach(function() {
      boardController.unplug(true);
    });
  });

  describe('changeCurrentBoard()', function() {
    var boardController;

    beforeEach(function() {
      boardController = new BoardController();
    });

    it('should render the current board.', function() {
      boardController.changeCurrentBoard(App.Boards.get(2));
      expect(boardController.children.allBoards.isRendered).to.be.true;
      expect(boardController.children.currentBoard.isRendered).to.be.true;
      expect(boardController.children.currentBoard.model.id).to.equal(2);

      boardController.changeCurrentBoard(App.Boards.get(1));
      expect(boardController.children.allBoards.isRendered).to.be.true;
      expect(boardController.children.currentBoard.isRendered).to.be.true;
      expect(boardController.children.currentBoard.model.id).to.equal(1);
    });

    afterEach(function() {
      boardController.unplug(true);
    });
  });

  describe('renderCards()', function() {
    var boardController;

    beforeEach(function() {
      boardController = new BoardController();
    });

    it('should render the cards from the current board.', function() {
      boardController.renderCards();
      expect(_.size(boardController.children.cardsList._itemViews)).to.equal(1);
    });

    afterEach(function() {
      boardController.unplug(true);
    });
  });
});
