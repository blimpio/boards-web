describe('BoardModel', function() {
  var BoardModel = require('models/board');

  describe('when instantiated.', function() {
    var boardModel;

    before(function() {
      boardModel = new BoardModel();
    });

    it('should exist.', function() {
      expect(boardModel).to.exist;
    });

    it('should have a name property.', function() {
      expect(boardModel.name).to.exist;
      expect(boardModel.name).to.equal('Board');
    });

    it('should have a validations property.', function() {
      expect(boardModel.validations.name).to.exist;
      expect(boardModel.validations.account).to.exist;
    });

    after(function() {
      boardModel.clear();
    });
  });

  describe('url()', function() {
    var boardModel;

    before(function() {
      boardModel = new BoardModel();
    });

    it('should return the url (without id).', function() {
      expect(boardModel.url()).to.equal(App.API_URL + '/boards/');
    });

    it('should return the url (with id).', function() {
      boardModel.id = 2;
      boardModel.set('id', 2);
      expect(boardModel.url()).to.equal(App.API_URL + '/boards/2/');
    });

    after(function() {
      boardModel.clear();
    });
  });
});
