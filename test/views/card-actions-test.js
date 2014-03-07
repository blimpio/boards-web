describe('CardActions', function() {
  var CardActions = require('views/card-actions');

  before(function() {
    $('#application').html(require('templates/account-main')());
  });

  after(function() {
    $('#application').empty();
  });

  describe('when instantiated.', function() {
    var cardOptions;

    before(function() {
      cardOptions = new CardActions();
    });

    it('should exist.', function() {
      expect(cardOptions).to.exist;
    });

    it('should have a name property.', function() {
      expect(cardOptions.name).to.exist;
      expect(cardOptions.name).to.equal('CardActions');
    });

    it('should have a template property.', function() {
      expect(cardOptions.template).to.exist;
    });

    it('should have a events property.', function() {
      expect(cardOptions.events).to.exist;
    });

    it('should have a className property.', function() {
      expect(cardOptions.className).to.exist;
    });

    after(function() {
      cardOptions.unplug(true);
    });
  });

  describe('onClickEdit()', function() {
    var cardOptions, publishSpy;

    before(function() {
      publishSpy = sinon.spy(CardActions.prototype, 'publish');
      cardOptions = new CardActions();
      cardOptions.insert('.sub-header-actions');
    });

    it('should publish a card:editing event.', function() {
      cardOptions.onClickEdit();
      expect(publishSpy).to.have.been.calledWith('card:editing');
    });

    after(function() {
      cardOptions.unplug(true);
      CardActions.prototype.publish.restore();
    });
  });

  describe('onClickCancel()', function() {
    var cardOptions, publishSpy;

    before(function() {
      publishSpy = sinon.spy(CardActions.prototype, 'publish');
      cardOptions = new CardActions();
      cardOptions.insert('.sub-header-actions');
    });

    it('should publish a card:editing:cancel event.', function() {
      cardOptions.onClickCancel();
      expect(publishSpy).to.have.been.calledWith('card:editing:cancel');
    });

    after(function() {
      cardOptions.unplug(true);
      CardActions.prototype.publish.restore();
    });
  });

  describe('onClickDelete()', function() {
    var cardOptions, publishSpy;

    before(function() {
      publishSpy = sinon.spy(CardActions.prototype, 'publish');
      cardOptions = new CardActions();
      cardOptions.insert('.sub-header-actions');
    });

    it('should publish a card:delete event.', function() {
      cardOptions.onClickDelete();
      expect(publishSpy).to.have.been.calledWith('card:delete');
    });

    after(function() {
      cardOptions.unplug(true);
      CardActions.prototype.publish.restore();
    });
  });
});
