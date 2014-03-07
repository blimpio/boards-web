describe('CreateCard', function() {
  var CreateCard = require('views/create-card');

  before(function() {
    $('#application').html(require('templates/cards')());
    App.Cache.set('current_board', 2, {silent: true});
  });

  after(function() {
    $('#application').empty();
    App.Cache.clear({silent: true});
  });

  describe('when instantiated.', function() {
    var createCard;

    before(function() {
      createCard = new CreateCard({el: 'form.create-card'});
    });

    it('should exist.', function() {
      expect(createCard).to.exist;
    });

    it('should have a name property.', function() {
      expect(createCard.name).to.exist;
      expect(createCard.name).to.equal('CreateCard');
    });

    it('should have a events property.', function() {
      expect(createCard.events).to.exist;
    });

    it('should have a elements property.', function() {
      expect(createCard.elements).to.exist;
    });

    it('should have a model property.', function() {
      expect(createCard.model).to.exist;
    });

    it('should have a subscriptions property.', function() {
      expect(createCard.subscriptions).to.exist;
    });

    after(function() {
      createCard.unplug(true);
    });
  });

  describe('prepareModel()', function() {
    var createCard;

    before(function() {
      createCard = new CreateCard({el: 'form.create-card'});
    });

    it('should set the current board id to the view model.', function() {
      createCard.prepareModel();
      expect(createCard.model.get('board')).to.equal(2);
    });

    it('should set the card type.', function() {
      createCard.prepareModel();
      expect(createCard.model.get('type')).to.equal('note');
    });

    after(function() {
      createCard.unplug(true);
    });
  });

  describe('renderCardForm()', function() {
    var createCard;

    before(function() {
      createCard = new CreateCard({el: 'form.create-card'});
    });

    it('should render the create-note template.', function() {
      createCard.renderCardForm();
      expect(createCard.isRendered).to.be.true;
    });

    after(function() {
      createCard.unplug(true);
    });
  });

  describe('onClickCancel()', function() {
    var createCard, publishSpy, resetSpy;

    before(function() {
      resetSpy = sinon.spy(CreateCard.prototype, 'reset');
      publishSpy = sinon.spy(CreateCard.prototype, 'publish');
      createCard = new CreateCard({el: 'form.create-card'});
    });

    it('should reset the form.', function() {
      createCard.onClickCancel();
      expect(resetSpy).to.have.been.called;
    });

    it('should publish a card:creating:cancel event.', function() {
      createCard.onClickCancel();
      expect(publishSpy).to.have.been.calledWith('card:creating:cancel');
    });

    after(function() {
      createCard.unplug(true);
      CreateCard.prototype.reset.restore();
      CreateCard.prototype.publish.restore();
    });
  });

  describe('reset()', function() {
    var createCard;

    before(function() {
      resetSpy = sinon.spy(CreateCard.prototype, 'reset');
      publishSpy = sinon.spy(CreateCard.prototype, 'publish');
      createCard = new CreateCard({el: 'form.create-card'});
      createCard.render();
    });

    it('should reset the form.', function() {
      createCard.onClickCancel();
      expect(resetSpy).to.have.been.called;
    });

    it('should publish a card:creating:cancel event.', function() {
      createCard.onClickCancel();
      expect(publishSpy).to.have.been.calledWith('card:creating:cancel');
    });

    after(function() {
      createCard.unplug(true);
      CreateCard.prototype.reset.restore();
      CreateCard.prototype.publish.restore();
    });
  });

  describe('reset()', function() {
    var createCard;

    before(function() {
      createCard = new CreateCard({el: 'form.create-card'});
      createCard.render();
    });

    it('should reset the form.', function() {
      createCard.getAttributeElement('name').val('Design');
      createCard.getAttributeElement('content').val('123');
      createCard.reset();
      expect(createCard.getAttributeElement('name').val()).to.equal('');
      expect(createCard.getAttributeElement('content').val()).to.equal('');
    });

    after(function() {
      createCard.unplug(true);
    });
  });

  describe('onSubmit()', function() {
    var createCard;

    before(function() {
      createCard = new CreateCard({el: 'form.create-card'});
      createCard.render();
    });

    it('should save the model.', function(done) {
      createCard.once('card:created', function() {
        done();
      });

      createCard.getAttributeElement('name').val('Design');
      createCard.getAttributeElement('content').val('123');
      createCard.onSubmit({preventDefault: function() {}});
    });

    after(function() {
      createCard.unplug(true);
    });
  });
});
