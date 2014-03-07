describe('BoardEditForm', function() {
  var BoardModel = require('models/board'),
      BoardEditForm = require('views/board-edit-form');

  before(function() {
    $('#application').html(require('templates/board')({
      name: 'Designs_'
    }));
  });

  after(function() {
    $('#application').empty();
  });

  describe('when instantiated.', function() {
    var boardEditForm;

    before(function() {
      boardEditForm = new BoardEditForm({
        el: '.board-edit-form',
        form: '.board-edit-form'
      });

      boardEditForm.setForm();
    });

    it('should exist.', function() {
      expect(boardEditForm).to.exist;
    });

    it('should have a name property.', function() {
      expect(boardEditForm.name).to.exist;
      expect(boardEditForm.name).to.equal('BoardEditForm');
    });

    it('should have an elements property.', function() {
      expect(boardEditForm.elements).to.exist;
    });

    after(function() {
      boardEditForm.unplug(true);
    });
  });

  describe('reset().', function() {
    var board, boardEditForm;

    before(function() {
      board = new BoardModel({
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

      boardEditForm = new BoardEditForm({
        el: '.board-edit-form',
        form: '.board-edit-form',
        model: board
      });

      boardEditForm.setForm();
    });

    it('should reset the form.', function() {
      boardEditForm.$nameInput.val('');
      boardEditForm.reset();
      expect(boardEditForm.$nameInput.val()).to.equal('Designs_');
    });

    after(function() {
      boardEditForm.unplug(true);
    });
  });

  describe('onSubmit().', function() {
    var board, boardEditForm;

    before(function() {
      board = new BoardModel({
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

      boardEditForm = new BoardEditForm({
        el: '.board-edit-form',
        form: '.board-edit-form',
        model: board
      });

      boardEditForm.setForm();
    });

    it('should save the model.', function() {
      boardEditForm.once('request', function() {
        done();
      });

      boardEditForm.getAttributeElement('name').val('Design');
      boardEditForm.onSubmit({preventDefault: function() {}});
    });

    after(function() {
      boardEditForm.unplug(true);
    });
  });
});
