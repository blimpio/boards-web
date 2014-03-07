describe('BoardController', function() {
  var server,
      BoardController = require('controllers/board');

  before(function() {
    server = sinon.fakeServer.create()
    server.autoRespond = true;
  });

  beforeEach(function() {
    server.respondWith('GET', '/api/boards/', function(req) {
      req.respond(200, {'Content-Type': 'application/json'}, '[]');
    });
  });

  afterEach(function() {
    server.restore();
  });

  after(function() {
    $('#application').empty();
    App.Boards.reset([], {silent: true});
  });

  describe('when instantiated.', function() {
    var boardController;

    before(function() {
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

    after(function() {
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

    before(function() {
      boardController = new BoardController();
    });

    it('should init and render child views.', function() {
      boardController.initChildren();
      expect(boardController.children.header).to.exist;
      expect(boardController.children.header.isRendered).to.be.true;
      expect(boardController.children.sidebar).to.exist;
      expect(boardController.children.sidebar.isRendered).to.be.true;
      expect(boardController.children.boardHeader).to.exist;
    });

    after(function() {
      boardController.unplug(true);
    });
  });

  describe('onBoardsSync()', function() {
    var boardController, publishSpy;

    before(function() {
      publishSpy = sinon.spy(BoardController.prototype, 'publish');
      boardController = new BoardController({boardSlug: 'designs-1'});
    });

    it('should publish a board:selected event with the for the board.', function() {
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
      }], {silent: true});

      boardController.onBoardsSync();
      expect(publishSpy).to.have.been.calledWith('board:selected', App.Boards.at(0));
    });

    it('should render the board header with the current board model.', function() {
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
      }], {silent: true});

      boardController.onBoardsSync();
      expect(boardController.children.boardHeader.isRendered).to.be.true;
      expect(boardController.children.boardHeader.model.id).to.equal(App.Boards.at(0).id);
    });

    after(function() {
      App.Cache.clear({silent: true}).destroyCache();
      App.Boards.reset([], {silent: true});
      boardController.unplug(true);
      BoardController.prototype.publish.restore();
    });
  });
});
