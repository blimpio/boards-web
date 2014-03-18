describe('Board', function() {
  var BoardModel = require('models/board'),
      Board = require('views/board');

  describe('when instantiated.', function() {
    var board;

    before(function() {
      board = new Board();
      board.insert('#application');
    });

    it('should exist.', function() {
      expect(board).to.exist;
    });

    it('should have a name property.', function() {
      expect(board.name).to.exist;
      expect(board.name).to.equal('Board');
    });

    it('should have a tagName property.', function() {
      expect(board.tagName).to.exist;
    });

    it('should have a className property.', function() {
      expect(board.className).to.exist;
    });

    it('should have a template property.', function() {
      expect(board.template).to.exist;
    });

    it('should have a events property.', function() {
      expect(board.events).to.exist;
    });

    it('should have a elements property.', function() {
      expect(board.elements).to.exist;
    });

    it('should have a bindings property.', function() {
      expect(board.bindings).to.exist;
    });

    it('should have a model property.', function() {
      expect(board.model).to.exist;
    });

    it('should have a isDetail property.', function() {
      expect(board.isDetail).to.exist;
    });

    it('should have a isDetail property.', function() {
      expect(board.canEdit).to.exist;
    });

    after(function() {
      board.unplug(true);
    });
  });

  describe('context().', function() {
    var board;

    before(function() {
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

      board = new Board({model: App.Boards.at(0)});
      board.insert('#application');
    });

    it('should return the template context.', function() {
      expect(_.keys(board.context())).to.eql(['name', 'image']);
    });

    after(function() {
      board.unplug(true);
      App.Boards.reset([], {silent: true});
    });
  });

  describe('update().', function() {
    var board;

    before(function() {
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

      board = new Board({model: App.Boards.at(0)});
      board.insert('#application');
    });

    it('should update the model preview.', function() {
      board.$preview.find('.board-name').text('123');
      board.update();
      expect(board.$preview.find('.board-name').text()).to.equal('Designs_');
    });

    after(function() {
      board.unplug(true);
      App.Boards.reset([], {silent: true});
    });
  });

  describe('initActions().', function() {
    var board;

    before(function() {
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

      board = new Board();
      board.insert('#application');
    });

    it('should init and insert the board actions child view.', function() {
      board.initActions();
      expect(board.getView('actions')).to.exist;
    });

    after(function() {
      board.unplug(true);
      App.Boards.reset([], {silent: true});
    });
  });

  describe('select().', function() {
    var board;

    before(function() {
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

      board = new Board({model: App.Boards.at(0)});
      board.insert('#application');
    });

    it('should add the is-selected class to the view element.', function() {
      board.select();
      expect(board.$el.hasClass('is-selected')).to.be.true;
    });

    it('should set the current board.', function() {
      board.select();
      expect(App.Boards.current).to.equal(2);
    });

    after(function() {
      board.unplug(true);
      App.Boards.reset([], {silent: true});
    });
  });

  describe('onClick().', function() {
    var board, publishSpy;

    before(function() {
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

      publishSpy = sinon.spy(Board.prototype, 'publish');
      board = new Board({model: App.Boards.at(0)});
      board.insert('#application');
    });

    it('should not publish a board:selected event if the view is a detail view.', function() {
      board.isDetail = true;
      board.onClick();
      expect(publishSpy).to.have.not.called;
    });

    it('should publish a board:selected event.', function() {
      board.isDetail = false;
      board.onClick();
      expect(publishSpy).to.have.been.called;
    });

    after(function() {
      board.unplug(true);
      App.Boards.reset([], {silent: true});
      Board.prototype.publish.restore();
    });
  });

  describe('initEditForm().', function() {
    var board;

    before(function() {
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

      board = new Board();
      board.insert('#application');
    });

    it('should init and insert the board edit form child view.', function() {
      board.initEditForm();
      expect(board.getView('editForm')).to.exist;
    });

    after(function() {
      board.unplug(true);
      App.Boards.reset([], {silent: true});
    });
  });

  describe('onClickEdit().', function() {
    var board, initEditFormSpy, showEditModeSpy;

    before(function() {
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

      initEditFormSpy = sinon.spy(Board.prototype, 'initEditForm');
      showEditModeSpy = sinon.spy(Board.prototype, 'showEditMode');
      board = new Board({model: App.Boards.at(0)});
      board.insert('#application');
    });

    it('should do nothing if the view cant be edited.', function() {
      board.onClickEdit();
      expect(initEditFormSpy).to.have.not.called;
      expect(showEditModeSpy).to.have.not.called;
    });

    it('should call showEditMode().', function() {
      board.canEdit = true;
      board.onClickEdit();
      expect(initEditFormSpy).to.have.called;
      expect(showEditModeSpy).to.have.called;
    });

    after(function() {
      board.unplug(true);
      App.Boards.reset([], {silent: true});
      Board.prototype.initEditForm.restore();
      Board.prototype.showEditMode.restore();
    });
  });

  describe('showEditMode().', function() {
    var board;

    before(function() {
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

      board = new Board({model: App.Boards.at(0)});
      board.insert('#application');
    });

    it('should add the is-editing class to the view element.', function() {
      board.initEditForm();
      board.showEditMode();
      expect(board.$el.hasClass('is-editing')).to.be.true;
    });

    after(function() {
      board.unplug(true);
      App.Boards.reset([], {silent: true});
    });
  });

  describe('onClickCancel().', function() {
    var board, initEditFormSpy, hideEditModeSpy;

    before(function() {
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

      initEditFormSpy = sinon.spy(Board.prototype, 'initEditForm');
      hideEditModeSpy = sinon.spy(Board.prototype, 'hideEditMode');
      board = new Board({model: App.Boards.at(0)});
      board.insert('#application');
    });

    it('should do nothing if the view cant be edited.', function() {
      board.canEdit = false;
      board.onClickEdit();
      expect(initEditFormSpy).to.have.not.called;
      expect(hideEditModeSpy).to.have.not.called;
    });

    it('should call hideEditMode().', function() {
      board.canEdit = true;
      board.onClickEdit();
      expect(initEditFormSpy).to.have.called;
    });

    after(function() {
      board.unplug(true);
      App.Boards.reset([], {silent: true});
      Board.prototype.initEditForm.restore();
      Board.prototype.hideEditMode.restore();
    });
  });

  describe('hideEditMode().', function() {
    var board;

    before(function() {
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

      board = new Board({model: App.Boards.at(0)});
      board.insert('#application');
    });

    it('should remove the is-editing class from the view element.', function() {
      board.initEditForm();
      board.showEditMode();
      board.hideEditMode();
      expect(board.$el.hasClass('is-editing')).to.be.false;
    });

    after(function() {
      board.unplug(true);
      App.Boards.reset([], {silent: true});
    });
  });

  describe('onEdited().', function() {
    var board, updateSpy, hideEditModeSpy;

    before(function() {
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

      updateSpy = sinon.spy(Board.prototype, 'update');
      hideEditModeSpy = sinon.spy(Board.prototype, 'hideEditMode');
      board = new Board({model: App.Boards.at(0)});
      board.insert('#application');
    });

    it('should do nothing if there are no changes in model.', function() {
      board.onEdited();
      expect(updateSpy).to.have.not.called;
      expect(hideEditModeSpy).to.have.not.called;
    });

    it('should update the board preview if there was changes in the model.', function() {
      board.onEdited(null, App.Boards.at(0), {name: 'Changed'});
      expect(updateSpy).to.have.called;
      expect(hideEditModeSpy).to.have.called;
    });

    after(function() {
      board.unplug(true);
      App.Boards.reset([], {silent: true});
      Board.prototype.update.restore();
      Board.prototype.hideEditMode.restore();
    });
  });

  describe('onClickDelete().', function() {
    var board, publishSpy;

    before(function() {
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

      publishSpy = sinon.spy(Board.prototype, 'publish');
      board = new Board({model: App.Boards.at(0)});
      board.insert('#application');
    });

    it('should destroy the model and publish a board:selected event.', function(done) {
      board.model.once('destroy', function() {
        done();
      });

      board.onClickDelete();
    });

    after(function() {
      board.unplug(true);
      App.Boards.reset([], {silent: true});
    });
  });
});
