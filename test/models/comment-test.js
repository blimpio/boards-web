describe('CommentModel', function() {
  var CommentModel = require('models/comment');

  describe('when instantiated.', function() {
    var commentModel;

    before(function() {
      commentModel = new CommentModel();
    });

    it('should exist.', function() {
      expect(commentModel).to.exist;
    });

    it('should have a name property.', function() {
      expect(commentModel.name).to.exist;
      expect(commentModel.name).to.equal('Comment');
    });

    it('should have a validations property.', function() {
      expect(commentModel.validations.content).to.exist;
    });

    it('should have a presenters property.', function() {
      expect(commentModel.presenters).to.exist;
    });

    it('should have a localAttributes property.', function() {
      expect(commentModel.localAttributes).to.exist;
    });

    after(function() {
      commentModel.clear();
    });
  });

  describe('url()', function() {
    var commentModel;

    before(function() {
      commentModel = new CommentModel();
    });

    it('should return the url (without id).', function() {
      commentModel.set('card', 4);
      expect(commentModel.url()).to.equal(App.API_URL + '/cards/4/comments/');
    });

    it('should return the url (with id).', function() {
      commentModel.set('id', 2);
      expect(commentModel.url()).to.equal(App.API_URL + '/comments/2/');
    });

    after(function() {
      commentModel.clear();
    });
  });
});
