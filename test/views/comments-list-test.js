describe('CommentsList', function() {
  var CommentsList = require('views/comments-list');

  before(function() {
    $('#application').html(require('templates/card-note-preview')());
  });

  after(function() {
    $('#application').empty();
  });

  describe('when instantiated.', function() {
    var commentsList;

    before(function() {
      commentsList = new CommentsList();
    });

    it('should exist.', function() {
      expect(commentsList).to.exist;
    });

    it('should have a name property.', function() {
      expect(commentsList.name).to.exist;
      expect(commentsList.name).to.equal('CommentsList');
    });

    it('should have a list property.', function() {
      expect(commentsList.list).to.exist;
    });

    it('should have a template property.', function() {
      expect(commentsList.template).to.exist;
    });

    it('should have an itemView property.', function() {
      expect(commentsList.itemView).to.exist;
    });

    it('should have an collection property.', function() {
      expect(commentsList.collection).to.exist;
    });

    it('should have child views.', function() {
      expect(commentsList.getView('createForm')).to.exist;
    });

    after(function() {
      commentsList.unplug(true);
    });
  });

  describe('onNewComment().', function() {
    var commentsList;

    before(function() {
      commentsList = new CommentsList();
    });

    it('should add the given model to the comments collection.', function() {
      var count = commentsList.collection.length;
      commentsList.onNewComment({id: 67});
      expect(commentsList.collection.length).to.equal(count + 1);
    });

    after(function() {
      commentsList.unplug(true);
    });
  });

  describe('onRemoveItem().', function() {
    var commentsList;

    before(function() {
      commentsList = new CommentsList();
    });

    it('should remove the given itemView from the list.', function() {
      var model = _.createModel('comment');

      commentsList.addItem(model);
      commentsList.onRemoveItem(commentsList.getItem(model));
      expect(commentsList.$list.find('li').length).to.equal(0);
    });

    after(function() {
      commentsList.unplug();
    });
  });
});
