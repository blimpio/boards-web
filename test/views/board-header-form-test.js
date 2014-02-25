describe('BoardHeaderForm', function() {
  var BoardHeaderForm = require('views/board-header-form');

  before(function() {
    $('#application').html(require('templates/account')());
  });

  after(function() {
    $('#application').empty();
  });

  describe('when instantiated.', function() {
    var boardHeaderForm;

    before(function() {
      boardHeaderForm = new BoardHeaderForm();
    });

    it('should exist.', function() {
      expect(boardHeaderForm).to.exist;
    });

    it('should have a name property.', function() {
      expect(boardHeaderForm.name).to.exist;
      expect(boardHeaderForm.name).to.equal('BoardHeaderForm');
    });

    it('should have a events property.', function() {
      expect(boardHeaderForm.events).to.exist;
    });

    it('should have a bindings property.', function() {
      expect(boardHeaderForm.bindings).to.exist;
    });

    it('should have a elements property.', function() {
      expect(boardHeaderForm.elements).to.exist;
    });

    it('should have a subscriptions property.', function() {
      expect(boardHeaderForm.subscriptions).to.exist;
    });

    it('should have a template property.', function() {
      expect(boardHeaderForm.template).to.exist;
    });

    after(function() {
      boardHeaderForm.unplug(true);
    });
  });

  describe('context()', function() {
    var boardHeaderForm;

    before(function() {
      boardHeaderForm = new BoardHeaderForm();
    });

    it('should return the template context.', function() {
      var context = boardHeaderForm.context();
      expect(context).to.exist;
      expect(_.keys(context)).to.eql(['name', 'thumbnail_sm_path']);
    });

    after(function() {
      boardHeaderForm.unplug(true);
    });
  });

  describe('showEditMode()', function() {
    var board, boardHeaderForm;

    before(function() {
      board = _.createModel('board', {
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
      });

      boardHeaderForm = new BoardHeaderForm();
      boardHeaderForm.setModel(board).render();
    });

    it('should add an is-selected class to the view element.', function() {
      boardHeaderForm.showEditMode();
      expect(boardHeaderForm.$el.hasClass('is-editing')).to.be.true;
    });

    after(function() {
      boardHeaderForm.unplug(true);
    });
  });

  describe('hideEditModel()', function() {
    var board, boardHeaderForm;

    before(function() {
      board = _.createModel('board', {
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
      });

      boardHeaderForm = new BoardHeaderForm();
      boardHeaderForm.setModel(board).render();
    });

    it('should remove the is-selected class from the view element.', function() {
      boardHeaderForm.showEditMode();
      boardHeaderForm.hideEditMode();
      expect(boardHeaderForm.$el.hasClass('is-editing')).to.be.false;
    });

    after(function() {
      boardHeaderForm.unplug(true);
    });
  });

  describe('cancelEdit()', function() {
    var board, boardHeaderForm;

    before(function() {
      board = _.createModel('board', {
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
      });

      boardHeaderForm = new BoardHeaderForm();
      boardHeaderForm.setModel(board).render();
    });

    it('should reset the board header.', function() {
      boardHeaderForm.showEditMode();
      boardHeaderForm.cancelEdit();
      expect(boardHeaderForm.$el.hasClass('is-editing')).to.be.false;
      expect(boardHeaderForm.$nameInput.val()).to.equal('Designs_');
    });

    after(function() {
      boardHeaderForm.unplug(true);
    });
  });

  describe('onSubmit()', function() {
    var board, server, boardHeaderForm;

    before(function() {
      server = sinon.fakeServer.create();
      server.autoRespond = true;
      boardHeaderForm = new BoardHeaderForm();
      boardHeaderForm.setModel(_.createModel('board', {account: 1})).render();
    });

    it('should save the model.', function(done) {
      server.respondWith('POST', '/api/boards/', function(req) {
        req.respond(200, {'Content-Type': 'application/json'}, '{"name": "Design"}');
        done();
      });

      boardHeaderForm.getAttributeElement('name').val('Design');
      boardHeaderForm.onSubmit({preventDefault: function() {}});
    });

    after(function() {
      server.restore();
      boardHeaderForm.unplug(true);
    });
  });

  describe('onEdited()', function() {
    var boardHeaderForm, renderSpy;

    before(function() {
      renderSpy = sinon.spy(BoardHeaderForm.prototype, 'render');
      boardHeaderForm = new BoardHeaderForm();
      boardHeaderForm.setModel(_.createModel('board')).render();
    });

    it('should render the view given a hash of changes from the model.', function() {
      boardHeaderForm.onEdited({name: 'Design1'});
      expect(renderSpy).to.be.called;
    });

    after(function() {
      boardHeaderForm.unplug(true);
      BoardHeaderForm.prototype.render.restore();
    });
  });

  describe('changeBoard()', function() {
    var boardHeaderForm;

    before(function() {
      boardHeaderForm = new BoardHeaderForm();
    });

    it('should set the given board as the view model and render.', function() {
      boardHeaderForm.changeBoard(_.createModel('board', {
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
      }));

      expect(boardHeaderForm.model.get('id')).to.equal(2);
      expect(boardHeaderForm.isRendered).to.be.true;
    });

    after(function() {
      boardHeaderForm.unplug(true);
    });
  });

});
