describe('Comment', function() {
  var CommentModel = require('models/comment'),
      Comment = require('views/comment');

  describe('when instantiated.', function() {
    var comment;

    before(function() {
      App.Comments.reset([{
        content: "091283mswd",
        created_by: 2,
        date_created: "2014-03-19T15:33:15.805Z",
        date_modified: "2014-03-19T15:33:15.807Z",
        id: 7
      }], {silent: true});

      comment = new Comment({model: App.Comments.at(0)});
      comment.insert('#application');
    });

    it('should exist.', function() {
      expect(comment).to.exist;
    });

    it('should have a name property.', function() {
      expect(comment.name).to.exist;
      expect(comment.name).to.equal('Comment');
    });

    it('should have a tagName property.', function() {
      expect(comment.tagName).to.exist;
    });

    it('should have a className property.', function() {
      expect(comment.className).to.exist;
    });

    it('should have a events property.', function() {
      expect(comment.events).to.exist;
    });

    it('should have a elements property.', function() {
      expect(comment.elements).to.exist;
    });

    it('should have a bindings property.', function() {
      expect(comment.bindings).to.exist;
    });

    it('should have a subscriptions property.', function() {
      expect(comment.subscriptions).to.exist;
    });

    it('should have a model property.', function() {
      expect(comment.model).to.exist;
    });

    after(function() {
      comment.unplug(true);
    });
  });

  describe('update().', function() {
    var comment;

    before(function() {
      App.Comments.reset([{
        content: "091283mswd",
        created_by: 2,
        date_created: "2014-03-19T15:33:15.805Z",
        date_modified: "2014-03-19T15:33:15.807Z",
        id: 7
      }], {silent: true});

      comment = new Comment({model: App.Comments.at(0)});
      comment.insert('#application');
    });

    it('should update the model preview.', function() {
      comment.$preview.find('.comment-content').text('123');
      comment.update();
      expect(comment.$preview.find('.comment-content').text()).to.equal('091283mswd');
    });

    after(function() {
      comment.unplug(true);
      App.Comments.reset([], {silent: true});
    });
  });

  describe('initEditForm().', function() {
    var comment;

    before(function() {
      App.Comments.reset([{
        content: "091283mswd",
        created_by: 2,
        date_created: "2014-03-19T15:33:15.805Z",
        date_modified: "2014-03-19T15:33:15.807Z",
        id: 7
      }], {silent: true});

      comment = new Comment({model: App.Comments.at(0)});
      comment.insert('#application');
    });

    it('should init and insert the comment edit form child view.', function() {
      comment.initEditForm();
      expect(comment.getView('editForm')).to.exist;
    });

    after(function() {
      comment.unplug(true);
    });
  });

  describe('onClickEdit().', function() {
    var comment, initEditFormSpy, showEditModeSpy;

    before(function() {
      App.Comments.reset([{
        content: "091283mswd",
        created_by: 2,
        date_created: "2014-03-19T15:33:15.805Z",
        date_modified: "2014-03-19T15:33:15.807Z",
        id: 7
      }], {silent: true});

      initEditFormSpy = sinon.spy(Comment.prototype, 'initEditForm');
      showEditModeSpy = sinon.spy(Comment.prototype, 'showEditMode');
      comment = new Comment({model: App.Comments.at(0)});
      comment.insert('#application');
    });

    it('should call showEditMode().', function() {
      comment.onClickEdit();
      expect(initEditFormSpy).to.have.been.called;
      expect(showEditModeSpy).to.have.been.called;
    });

    after(function() {
      comment.unplug(true);
      App.Comments.reset([], {silent: true});
      Comment.prototype.initEditForm.restore();
      Comment.prototype.showEditMode.restore();
    });
  });

  describe('showEditMode().', function() {
    var comment;

    before(function() {
      App.Comments.reset([{
        content: "091283mswd",
        created_by: 2,
        date_created: "2014-03-19T15:33:15.805Z",
        date_modified: "2014-03-19T15:33:15.807Z",
        id: 7
      }], {silent: true});

      comment = new Comment({model: App.Comments.at(0)});
      comment.insert('#application');
    });

    it('should add the is-editing class to the view element.', function() {
      comment.initEditForm();
      comment.showEditMode();
      expect(comment.$el.hasClass('is-editing')).to.be.true;
    });

    after(function() {
      comment.unplug(true);
      App.Comments.reset([], {silent: true});
    });
  });

  describe('onClickCancel().', function() {
    var comment, initEditFormSpy, hideEditModeSpy;

    before(function() {
      App.Comments.reset([{
        content: "091283mswd",
        created_by: 2,
        date_created: "2014-03-19T15:33:15.805Z",
        date_modified: "2014-03-19T15:33:15.807Z",
        id: 7
      }], {silent: true});

      initEditFormSpy = sinon.spy(Comment.prototype, 'initEditForm');
      hideEditModeSpy = sinon.spy(Comment.prototype, 'hideEditMode');
      comment = new Comment({model: App.Comments.at(0)});
      comment.insert('#application');
    });

    it('should do nothing if the view cant be edited.', function() {
      comment.canEdit = false;
      comment.onClickCancel();
      expect(initEditFormSpy).to.have.not.called;
      expect(hideEditModeSpy).to.have.not.called;
    });

    it('should call hideEditMode().', function() {
      comment.canEdit = true;
      comment.onClickCancel();
      expect(initEditFormSpy).to.have.called;
      expect(hideEditModeSpy).to.have.called;
    });

    after(function() {
      comment.unplug(true);
      App.Comments.reset([], {silent: true});
      Comment.prototype.initEditForm.restore();
      Comment.prototype.hideEditMode.restore();
    });
  });

  describe('hideEditMode().', function() {
    var comment;

    before(function() {
      App.Comments.reset([{
        content: "091283mswd",
        created_by: 2,
        date_created: "2014-03-19T15:33:15.805Z",
        date_modified: "2014-03-19T15:33:15.807Z",
        id: 7
      }], {silent: true});

      comment = new Comment({model: App.Comments.at(0)});
      comment.insert('#application');
    });

    it('should remove the is-editing class from the view element.', function() {
      comment.initEditForm();
      comment.showEditMode();
      comment.hideEditMode();
      expect(comment.$el.hasClass('is-editing')).to.be.false;
    });

    after(function() {
      comment.unplug(true);
      App.Comments.reset([], {silent: true});
    });
  });

  describe('onEdited().', function() {
    var comment, updateSpy, hideEditModeSpy;

    before(function() {
      App.Comments.reset([{
        content: "091283mswd",
        created_by: 2,
        date_created: "2014-03-19T15:33:15.805Z",
        date_modified: "2014-03-19T15:33:15.807Z",
        id: 7
      }], {silent: true});

      updateSpy = sinon.spy(Comment.prototype, 'update');
      hideEditModeSpy = sinon.spy(Comment.prototype, 'hideEditMode');
      comment = new Comment({model: App.Comments.at(0)});
      comment.insert('#application');
    });

    it('should do nothing if there are no changes in model.', function() {
      comment.onEdited();
      expect(updateSpy).to.have.not.called;
      expect(hideEditModeSpy).to.have.not.called;
    });

    it('should update the comment preview if there was changes in the model.', function() {
      comment.onEdited(null, App.Comments.at(0), {content: 'Changed'});
      expect(updateSpy).to.have.called;
      expect(hideEditModeSpy).to.have.called;
    });

    after(function() {
      comment.unplug(true);
      App.Comments.reset([], {silent: true});
      Comment.prototype.update.restore();
      Comment.prototype.hideEditMode.restore();
    });
  });
});
