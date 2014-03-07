describe('CardModel', function() {
  var CardModel = require('models/card');

  describe('when instantiated.', function() {
    var cardModel;

    before(function() {
      cardModel = new CardModel();
    });

    it('should exist.', function() {
      expect(cardModel).to.exist;
    });

    it('should have a name property.', function() {
      expect(cardModel.name).to.exist;
      expect(cardModel.name).to.equal('Card');
    });

    it('should have a validations property.', function() {
      expect(cardModel.validations.name).to.exist;
      expect(cardModel.validations.board).to.exist;
      expect(cardModel.validations.content).to.exist;
    });

    after(function() {
      cardModel.unplug();
    });
  });

  describe('url()', function() {
    var cardModel;

    before(function() {
      cardModel = new CardModel();
    });

    it('should return the url (without id).', function() {
      expect(cardModel.url()).to.equal('/api/cards/');
    });

    it('should return the url (with id).', function() {
      cardModel.id = 2;
      cardModel.set('id', 2);
      expect(cardModel.url()).to.equal('/api/cards/2/');
    });

    after(function() {
      cardModel.unplug();
    });
  });
});
