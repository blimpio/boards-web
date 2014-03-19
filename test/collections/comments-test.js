describe('CommentsCollection', function() {
  var CommentsCollection = require('collections/comments');

  describe('when instantiated.', function() {
    var commentsCollection;

    before(function() {
      commentsCollection = new CommentsCollection();
    });

    it('should exist.', function() {
      expect(commentsCollection).to.exist;
    });

    it('should have a name.', function() {
      expect(commentsCollection.name).to.equal('Comments');
    });

    after(function() {
      commentsCollection.unplug();
    });
  });

  describe('fetchComments().', function() {
    var server, commentsCollection;

    before(function() {
      server = sinon.fakeServer.create();
      server.autoRespond = true;
      commentsCollection = new CommentsCollection();
    });

    it('should fetch comments given a card id.', function(done) {
      server.respondWith('GET', '/api/cards/2/comments/', function(req) {
        req.respond(200, {'Content-Type': 'application/json'}, '[]');
        done();
      });

      commentsCollection.fetchComments(2);
    });

    after(function() {
      server.restore();
      commentsCollection.unplug();
    });
  });
});
