describe('AccountController', function() {
  var server,
      AccountController = require('controllers/account');

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
    var accountController;

    before(function() {
      accountController = new AccountController();
    });

    it('should exist.', function() {
      expect(accountController).to.exist;
    });

    it('should have a name property.', function() {
      expect(accountController.name).to.exist;
      expect(accountController.name).to.equal('AccountController');
    });

    it('should have a template property.', function() {
      expect(accountController.template).to.exist;
    });

    it('should render and insert.', function() {
      expect(accountController.isRendered).to.be.true;
      expect(accountController.isInserted).to.be.true;
    });

    after(function() {
      accountController.unplug(true);
    });
  });

  describe('initChildren()', function() {
    var accountController;

    before(function() {
      accountController = new AccountController();
    });

    it('should init and render child views.', function() {
      accountController.initChildren();
      expect(accountController.children.header).to.exist;
      expect(accountController.children.header.isRendered).to.be.true;
      expect(accountController.children.sidebar).to.exist;
      expect(accountController.children.sidebar.isRendered).to.be.true;
      expect(accountController.children.boardHeader).to.exist;
    });

    after(function() {
      accountController.unplug(true);
    });
  });

  describe('onBoardsSync()', function() {
    var accountController, publishSpy;

    before(function() {
      publishSpy = sinon.spy(AccountController.prototype, 'publish');
      accountController = new AccountController();
    });

    it('should publish a board:selected event if there is a board selected from cache.', function() {
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

      App.Cache.set('current_board', 2).saveCache();

      accountController.onBoardsSync();
      expect(publishSpy).to.have.been.calledWith('board:selected', App.Boards.at(0));
    });

    it('should publish a board:selected event if is at least one board available.', function() {
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

      accountController.onBoardsSync();
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

      accountController.onBoardsSync();
      expect(accountController.children.boardHeader.isRendered).to.be.true;
      expect(accountController.children.boardHeader.model.id).to.equal(App.Boards.at(0).id);
    });

    after(function() {
      App.Cache.clear({silent: true}).destroyCache();
      App.Boards.reset([], {silent: true});
      App.Cache.clear({silent: true});
      accountController.unplug(true);
      AccountController.prototype.publish.restore();
    });
  });
});
