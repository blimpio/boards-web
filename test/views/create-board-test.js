describe('CreateBoardForm', function() {
  var CreateBoardForm = require('views/create-board-form');

  before(function() {
    $('#application').html(require('templates/boards-sidebar')());
    App.Cache.set('current_account', 2, {silent: true});
  });

  after(function() {
    $('#application').empty();
    App.Cache.clear({silent: true});
  });

  describe('when instantiated.', function() {
    var createBoardForm;

    before(function() {
      createBoardForm = new CreateBoardForm();
    });

    it('should exist.', function() {
      expect(createBoardForm).to.exist;
    });

    it('should have a name property.', function() {
      expect(createBoardForm.name).to.exist;
      expect(createBoardForm.name).to.equal('CreateBoardForm');
    });

    it('should have a template property.', function() {
      expect(createBoardForm.template).to.exist;
    });

    it('should have a events property.', function() {
      expect(createBoardForm.events).to.exist;
    });

    it('should have a elements property.', function() {
      expect(createBoardForm.elements).to.exist;
    });

    it('should have a model property.', function() {
      expect(createBoardForm.model).to.exist;
    });

    after(function() {
      createBoardForm.unplug(true);
    });
  });

  describe('initialize()', function() {
    var createBoardForm;

    before(function() {
      createBoardForm = new CreateBoardForm();
    });

    it('should set the current account id to the view model.', function() {
      createBoardForm.initialize();
      expect(createBoardForm.model.get('account')).to.equal(2);
    });

    after(function() {
      createBoardForm.unplug(true);
    });
  });

  describe('onSubmit()', function() {
    var server, createBoardForm;

    before(function() {
      server = sinon.fakeServer.create();
      server.autoRespond = true;
      createBoardForm = new CreateBoardForm();
      createBoardForm.render();
    });

    it('should save the model.', function(done) {
      server.respondWith('POST', '/api/boards/', function(req) {
        req.respond(200, {'Content-Type': 'application/json'}, '{"name": "Design"}');
        done();
      });

      createBoardForm.getAttributeElement('name').val('Design');
      createBoardForm.onSubmit({preventDefault: function() {}});
    });

    after(function() {
      server.restore();
      createBoardForm.unplug(true);
    });
  });

  describe('hide()', function() {
    var createBoardForm;

    before(function() {
      createBoardForm = new CreateBoardForm();
      createBoardForm.render();
    });

    it('should reset and hide the form.', function() {
      createBoardForm.getAttributeElement('name').val('Design');
      createBoardForm.hide();
      expect(createBoardForm.$nameInput.val()).to.equal('');
      expect(createBoardForm.$el.is(':visible')).to.be.false;
    });

    after(function() {
      createBoardForm.unplug(true);
    });
  });

  describe('reset()', function() {
    var createBoardForm;

    before(function() {
      createBoardForm = new CreateBoardForm();
      createBoardForm.render();
    });

    it('should reset the form.', function() {
      createBoardForm.getAttributeElement('name').val('Design');
      createBoardForm.reset();
      expect(createBoardForm.$nameInput.val()).to.equal('');
    });

    after(function() {
      createBoardForm.unplug(true);
    });
  });
});
