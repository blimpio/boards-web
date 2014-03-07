describe('AccountController', function() {
  var AccountController = require('controllers/account');

  beforeEach(function() {
    App.Accounts.reset([{
      id: 1,
      name: 'ACME Inc',
      slug: 'acme-inc',
      image_url: ''
    }, {
      id: 4,
      name: 'Blimp LLC',
      slug: 'blimp',
      image_url: ''
    }], {silent: true});

    App.Accounts.setCurrent('acme-inc');
  });

  afterEach(function() {
    App.Boards.reset([], {silent: true});
    App.Accounts.reset([], {silent: true});
    App.Cache.clear({silent: true}).destroyCache();
    $('#application').empty();
  });

  describe('when instantiated.', function() {
    var accountController;

    beforeEach(function() {
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

    afterEach(function() {
      accountController.unplug(true);
    });
  });

  describe('setDocumentTitle()', function() {
    var accountController;

    beforeEach(function() {
      accountController = new AccountController();
    });

    it('should set the document title.', function() {
      accountController.setDocumentTitle();
      expect(document.title).to.equal('Blimp | ACME Inc');
    });

    afterEach(function() {
      accountController.unplug(true);
    });
  });

  describe('fetchBoards()', function() {
    var accountController, onBoardsSyncSpy;

    beforeEach(function() {
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

      onBoardsSyncSpy = sinon.spy(AccountController.prototype, 'onBoardsSync');
      accountController = new AccountController();
    });

    it('should immediately call onBoardsSync if the collection has boards.', function() {
      accountController.fetchBoards();
      expect(onBoardsSyncSpy).to.have.been.called;
    });

    afterEach(function() {
      accountController.unplug(true);
      App.Boards.reset([], {silent: true});
      AccountController.prototype.onBoardsSync.restore();
    });
  });

  describe('initChildren()', function() {
    var accountController;

    beforeEach(function() {
      accountController = new AccountController();
    });

    it('should init and render child views.', function() {
      accountController.initChildren();
      expect(accountController.children.header).to.exist;
      expect(accountController.children.header.isRendered).to.be.true;
      expect(accountController.children.allBoards).to.exist;
    });

    afterEach(function() {
      accountController.unplug(true);
    });
  });

  describe('onBoardsSync()', function() {
    var accountController;

    beforeEach(function() {
      accountController = new AccountController();
    });

    it('should insert the allBoards child view.', function() {
      accountController.onBoardsSync();
      expect(accountController.children.allBoards.isInserted).to.be.true;
    });

    afterEach(function() {
      accountController.unplug(true);
    });
  });
});
