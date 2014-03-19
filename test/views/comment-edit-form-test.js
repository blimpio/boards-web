describe('CommentEditForm', function() {
  var Comment = require('models/comment'),
      CommentEditForm = require('views/comment-edit-form');

  before(function() {
    $('#application').html(require('templates/comment')({
      content: 'A comment',
      date_created: _.now()
    }));
  });

  after(function() {
    $('#application').empty();
  });

  describe('when instantiated.', function() {
    var commentEditForm;

    before(function() {
      commentEditForm = new CommentEditForm({el: '.comment-edit-form'});
    });

    it('should exist.', function() {
      expect(commentEditForm).to.exist;
    });

    it('should have a name property.', function() {
      expect(commentEditForm.name).to.exist;
      expect(commentEditForm.name).to.equal('CommentEditForm');
    });

    it('should have an events property.', function() {
      expect(commentEditForm.events).to.exist;
    });

    it('should have an elements property.', function() {
      expect(commentEditForm.elements).to.exist;
    });

    after(function() {
      commentEditForm.unplug(true);
    });
  });

  describe('reset().', function() {
    var card, commentEditForm;

    before(function() {
      card = new Comment({
        content: "A comment",
        created_by: 2,
        date_created: "2014-03-19T15:33:15.805Z",
        date_modified: "2014-03-19T15:33:15.807Z",
        id: 7
      });

      commentEditForm = new CommentEditForm({
        el: '.comment-edit-form',
        model: card
      });
      commentEditForm.render();
    });

    it('should reset the form.', function() {
      commentEditForm.$contentInput.val('');
      commentEditForm.reset();
      expect(commentEditForm.$contentInput.val()).to.equal('A comment');
    });

    after(function() {
      commentEditForm.unplug(true);
    });
  });

  describe('onClickCancel()', function() {
    var commentEditForm, publishSpy;

    before(function() {
      publishSpy = sinon.spy(CommentEditForm.prototype, 'publish');
      commentEditForm = new CommentEditForm({el: '.comment-edit-form'});
      commentEditForm.render();
    });

    it('should publish a comment:editing:cancel event.', function() {
      commentEditForm.onClickCancel();
      expect(publishSpy).to.have.been.calledWith('comment:editing:cancel');
    });

    after(function() {
      commentEditForm.unplug(true);
      CommentEditForm.prototype.publish.restore();
    });
  });

  describe('onClickDelete()', function() {
    var commentEditForm;

    before(function() {
      commentEditForm = new CommentEditForm({el: '.comment-edit-form'});
      commentEditForm.render();
    });

    it('should destroy the comment model.', function(done) {
      commentEditForm.model.once('destroy', function() {
        done();
      });

      commentEditForm.onClickDelete();
    });

    after(function() {
      commentEditForm.unplug(true);
    });
  });

  describe('onSubmit().', function() {
    var card, commentEditForm;

    before(function() {
      card = new Comment({
        content: "A comment",
        created_by: 2,
        date_created: "2014-03-19T15:33:15.805Z",
        date_modified: "2014-03-19T15:33:15.807Z",
        id: 7
      });

      commentEditForm = new CommentEditForm({
        el: '.comment-edit-form',
        model: card
      });

      commentEditForm.render();
    });

    it('should save the model.', function(done) {
      commentEditForm.model.once('edited', function() {
        done();
      });

      commentEditForm.getAttributeElement('content').val('12345');
      commentEditForm.onSubmit({preventDefault: function() {}});
    });

    after(function() {
      commentEditForm.unplug(true);
    });
  });
});
