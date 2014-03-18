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

  describe('smallThumbnail()', function() {
    var cardModel;

    beforeEach(function() {
      cardModel = new CardModel();
    });

    afterEach(function() {
      cardModel.unplug();
    });

    it('should return the small thumbnail url.', function() {
      cardModel.set('thumbnail_sm_path', 'image.png');
      expect(cardModel.smallThumbnail()).to.equal('image.png');
    });

    it('should return the small thumbnail url. (using fallbacks)', function() {
      cardModel.set('content', 'image.gif');
      expect(cardModel.smallThumbnail()).to.equal('image.gif');
    });

    it('should return the small thumbnail url. (using fallbacks)', function() {
      expect(cardModel.smallThumbnail()).to.equal('images/generic-file.png');
    });
  });

  describe('largeThumbnail()', function() {
    var cardModel;

    beforeEach(function() {
      cardModel = new CardModel();
    });

    afterEach(function() {
      cardModel.unplug();
    });

    it('should return the small thumbnail url.', function() {
      cardModel.set('thumbnail_lg_path', 'image.png');
      expect(cardModel.largeThumbnail()).to.equal('image.png');
    });

    it('should return the small thumbnail url. (using fallbacks)', function() {
      cardModel.set('content', 'image.gif');
      expect(cardModel.largeThumbnail()).to.equal('image.gif');
    });

    it('should return the small thumbnail url. (using fallbacks)', function() {
      expect(cardModel.largeThumbnail()).to.equal('images/generic-file.png');
    });
  });

  describe('isNote()', function() {
    var cardModel;

    beforeEach(function() {
      cardModel = new CardModel();
    });

    afterEach(function() {
      cardModel.unplug();
    });

    it('should return false if the card is not a note.', function() {
      cardModel.set('type', 'file');
      expect(cardModel.isNote()).to.be.false;
    });

    it('should return true if the card is not a note.', function() {
      cardModel.set('type', 'note');
      expect(cardModel.isNote()).to.be.true;
    });
  });

  describe('isFile()', function() {
    var cardModel;

    beforeEach(function() {
      cardModel = new CardModel();
    });

    afterEach(function() {
      cardModel.unplug();
    });

    it('should return false if the card is not a note.', function() {
      cardModel.set('type', 'note');
      expect(cardModel.isFile()).to.be.false;
    });

    it('should return true if the card is not a note.', function() {
      cardModel.set('type', 'file');
      expect(cardModel.isFile()).to.be.true;
    });
  });
});
