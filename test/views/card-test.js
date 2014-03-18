describe('Card', function() {
  var CardModel = require('models/card'),
      Card = require('views/card');

  describe('when instantiated.', function() {
    var card;

    before(function() {
      card = new Card();
      card.insert('#application');
    });

    it('should exist.', function() {
      expect(card).to.exist;
    });

    it('should have a name property.', function() {
      expect(card.name).to.exist;
      expect(card.name).to.equal('Card');
    });

    it('should have a tagName property.', function() {
      expect(card.tagName).to.exist;
    });

    it('should have a className property.', function() {
      expect(card.className).to.exist;
    });

    it('should have a attributes property.', function() {
      expect(card.attributes).to.exist;
    });

    it('should have a events property.', function() {
      expect(card.events).to.exist;
    });

    it('should have a elements property.', function() {
      expect(card.elements).to.exist;
    });

    it('should have a bindings property.', function() {
      expect(card.bindings).to.exist;
    });

    it('should have a subscriptions property.', function() {
      expect(card.subscriptions).to.exist;
    });

    it('should have a model property.', function() {
      expect(card.model).to.exist;
    });

    it('should have a isDetail property.', function() {
      expect(card.isDetail).to.exist;
    });

    it('should have a isDetail property.', function() {
      expect(card.canEdit).to.exist;
    });

    after(function() {
      card.unplug(true);
    });
  });

  describe('context().', function() {
    var card;

    before(function() {
      App.Cards.reset([{
        'created_by':2,
        'id':2,
        'date_created':'2014-02-28T18:25:56.961Z',
        'date_modified':'2014-02-28T18:25:56.966Z',
        'name':'Another note',
        'type':'note',
        'slug':'another-note',
        'board':7,
        'featured':false,
        'origin_url':'',
        'content':'With some other content...',
        'is_shared':false,
        'thumbnail_sm_path':'',
        'thumbnail_md_path':'',
        'thumbnail_lg_path':'',
        'file_size':null,
        'file_extension':'',
        'cards':[]
      }], {silent: true});

      card = new Card({model: App.Cards.at(0)});
      card.insert('#application');
    });

    it('should return the template context.', function() {
      var context = card.context();

      expect(_.keys(context)).to.not.be.empty;
      expect(context.isDetail).to.exist;
    });

    after(function() {
      card.unplug(true);
      App.Cards.reset([], {silent: true});
    });
  });

  describe('setTemplate().', function() {
    var card;

    before(function() {
      App.Cards.reset([{
        'created_by':2,
        'id':2,
        'date_created':'2014-02-28T18:25:56.961Z',
        'date_modified':'2014-02-28T18:25:56.966Z',
        'name':'Another note',
        'type':'note',
        'slug':'another-note',
        'board':7,
        'featured':false,
        'origin_url':'',
        'content':'With some other content...',
        'is_shared':false,
        'thumbnail_sm_path':'',
        'thumbnail_md_path':'',
        'thumbnail_lg_path':'',
        'file_size':null,
        'file_extension':'',
        'cards':[]
      }], {silent: true});

      card = new Card({model: App.Cards.at(0)});
      card.insert('#application');
    });

    it('should set the file template if the card is a file.', function() {
      card.model.set('type', 'file');
      card.setTemplate();
      expect(card.template).to.eql(require('templates/card-file'));
    });

    it('should set the note template if the card is a file.', function() {
      card.model.set('type', 'note');
      card.setTemplate();
      expect(card.template).to.eql(require('templates/card-note'));
    });

    after(function() {
      card.unplug(true);
      App.Cards.reset([], {silent: true});
    });
  });

  describe('update().', function() {
    var card;

    before(function() {
      App.Cards.reset([{
        'created_by':2,
        'id':2,
        'date_created':'2014-02-28T18:25:56.961Z',
        'date_modified':'2014-02-28T18:25:56.966Z',
        'name':'Another note',
        'type':'note',
        'slug':'another-note',
        'board':7,
        'featured':false,
        'origin_url':'',
        'content':'With some other content...',
        'is_shared':false,
        'thumbnail_sm_path':'',
        'thumbnail_md_path':'',
        'thumbnail_lg_path':'',
        'file_size':null,
        'file_extension':'',
        'cards':[]
      }], {silent: true});

      card = new Card({model: App.Cards.at(0)});
      card.insert('#application');
    });

    it('should update the model preview.', function() {
      card.$preview.find('.card-name').text('123');
      card.update();
      expect(card.$preview.find('.card-name').text()).to.equal('Another note');
    });

    after(function() {
      card.unplug(true);
      App.Cards.reset([], {silent: true});
    });
  });

  describe('initActions().', function() {
    var card;

    before(function() {
      card = new Card();
      card.insert('#application');
    });

    it('should init and insert the card actions child view.', function() {
      card.initActions();
      expect(card.getView('actions')).to.exist;
    });

    after(function() {
      card.unplug(true);
    });
  });

  describe('onClick().', function() {
    var card, publishSpy;

    before(function() {
      App.Cards.reset([{
        'created_by':2,
        'id':2,
        'date_created':'2014-02-28T18:25:56.961Z',
        'date_modified':'2014-02-28T18:25:56.966Z',
        'name':'Another note',
        'type':'note',
        'slug':'another-note',
        'board':7,
        'featured':false,
        'origin_url':'',
        'content':'With some other content...',
        'is_shared':false,
        'thumbnail_sm_path':'',
        'thumbnail_md_path':'',
        'thumbnail_lg_path':'',
        'file_size':null,
        'file_extension':'',
        'cards':[]
      }], {silent: true});

      publishSpy = sinon.spy(Card.prototype, 'publish');
      card = new Card({model: App.Cards.at(0)});
      card.insert('#application');
    });

    it('should not publish a card:selected event if the view is a detail view.', function() {
      card.isDetail = true;
      card.onClick();
      expect(publishSpy).to.have.not.called;
    });

    it('should publish a card:selected event.', function() {
      card.isDetail = false;
      card.onClick();
      expect(publishSpy).to.have.been.calledWith('card:selected', App.Cards.at(0));
    });

    after(function() {
      card.unplug(true);
      App.Cards.reset([], {silent: true});
      Card.prototype.publish.restore();
    });
  });

  describe('initEditForm().', function() {
    var card;

    before(function() {
      card = new Card();
      card.insert('#application');
    });

    it('should init and insert the card edit form child view.', function() {
      card.initEditForm();
      expect(card.getView('editForm')).to.exist;
    });

    after(function() {
      card.unplug(true);
    });
  });

  describe('onClickEdit().', function() {
    var card, initEditFormSpy, showEditModeSpy;

    before(function() {
      App.Cards.reset([{
        'created_by':2,
        'id':2,
        'date_created':'2014-02-28T18:25:56.961Z',
        'date_modified':'2014-02-28T18:25:56.966Z',
        'name':'Another note',
        'type':'note',
        'slug':'another-note',
        'board':7,
        'featured':false,
        'origin_url':'',
        'content':'With some other content...',
        'is_shared':false,
        'thumbnail_sm_path':'',
        'thumbnail_md_path':'',
        'thumbnail_lg_path':'',
        'file_size':null,
        'file_extension':'',
        'cards':[]
      }], {silent: true});

      initEditFormSpy = sinon.spy(Card.prototype, 'initEditForm');
      showEditModeSpy = sinon.spy(Card.prototype, 'showEditMode');
      card = new Card({model: App.Cards.at(0)});
      card.insert('#application');
    });

    it('should do nothing if the view cant be edited.', function() {
      card.canEdit = false;
      card.onClickEdit();
      expect(initEditFormSpy).to.have.not.called;
      expect(showEditModeSpy).to.have.not.called;
    });

    it('should call showEditMode().', function() {
      card.canEdit = true;
      card.onClickEdit();
      expect(initEditFormSpy).to.have.called;
      expect(showEditModeSpy).to.have.called;
    });

    after(function() {
      card.unplug(true);
      App.Cards.reset([], {silent: true});
      Card.prototype.initEditForm.restore();
      Card.prototype.showEditMode.restore();
    });
  });

  describe('showEditMode().', function() {
    var card;

    before(function() {
      App.Cards.reset([{
        'created_by':2,
        'id':2,
        'date_created':'2014-02-28T18:25:56.961Z',
        'date_modified':'2014-02-28T18:25:56.966Z',
        'name':'Another note',
        'type':'note',
        'slug':'another-note',
        'board':7,
        'featured':false,
        'origin_url':'',
        'content':'With some other content...',
        'is_shared':false,
        'thumbnail_sm_path':'',
        'thumbnail_md_path':'',
        'thumbnail_lg_path':'',
        'file_size':null,
        'file_extension':'',
        'cards':[]
      }], {silent: true});

      card = new Card({model: App.Cards.at(0)});
      card.insert('#application');
    });

    it('should add the is-editing class to the view element.', function() {
      card.initEditForm();
      card.showEditMode();
      expect(card.$el.hasClass('is-editing')).to.be.true;
    });

    after(function() {
      card.unplug(true);
      App.Cards.reset([], {silent: true});
    });
  });

  describe('onClickCancel().', function() {
    var card, initEditFormSpy, hideEditModeSpy;

    before(function() {
      App.Cards.reset([{
        'created_by':2,
        'id':2,
        'date_created':'2014-02-28T18:25:56.961Z',
        'date_modified':'2014-02-28T18:25:56.966Z',
        'name':'Another note',
        'type':'note',
        'slug':'another-note',
        'board':7,
        'featured':false,
        'origin_url':'',
        'content':'With some other content...',
        'is_shared':false,
        'thumbnail_sm_path':'',
        'thumbnail_md_path':'',
        'thumbnail_lg_path':'',
        'file_size':null,
        'file_extension':'',
        'cards':[]
      }], {silent: true});

      initEditFormSpy = sinon.spy(Card.prototype, 'initEditForm');
      hideEditModeSpy = sinon.spy(Card.prototype, 'hideEditMode');
      card = new Card({model: App.Cards.at(0)});
      card.insert('#application');
    });

    it('should do nothing if the view cant be edited.', function() {
      card.canEdit = false;
      card.onClickCancel();
      expect(initEditFormSpy).to.have.not.called;
      expect(hideEditModeSpy).to.have.not.called;
    });

    it('should call hideEditMode().', function() {
      card.canEdit = true;
      card.onClickCancel();
      expect(initEditFormSpy).to.have.called;
      expect(hideEditModeSpy).to.have.called;
    });

    after(function() {
      card.unplug(true);
      App.Cards.reset([], {silent: true});
      Card.prototype.initEditForm.restore();
      Card.prototype.hideEditMode.restore();
    });
  });

  describe('hideEditMode().', function() {
    var card;

    before(function() {
      App.Cards.reset([{
        'created_by':2,
        'id':2,
        'date_created':'2014-02-28T18:25:56.961Z',
        'date_modified':'2014-02-28T18:25:56.966Z',
        'name':'Another note',
        'type':'note',
        'slug':'another-note',
        'board':7,
        'featured':false,
        'origin_url':'',
        'content':'With some other content...',
        'is_shared':false,
        'thumbnail_sm_path':'',
        'thumbnail_md_path':'',
        'thumbnail_lg_path':'',
        'file_size':null,
        'file_extension':'',
        'cards':[]
      }], {silent: true});

      card = new Card({model: App.Cards.at(0)});
      card.insert('#application');
    });

    it('should remove the is-editing class from the view element.', function() {
      card.initEditForm();
      card.showEditMode();
      card.hideEditMode();
      expect(card.$el.hasClass('is-editing')).to.be.false;
    });

    after(function() {
      card.unplug(true);
      App.Cards.reset([], {silent: true});
    });
  });

  describe('onEdited().', function() {
    var card, updateSpy, hideEditModeSpy;

    before(function() {
      App.Cards.reset([{
        'created_by':2,
        'id':2,
        'date_created':'2014-02-28T18:25:56.961Z',
        'date_modified':'2014-02-28T18:25:56.966Z',
        'name':'Another note',
        'type':'note',
        'slug':'another-note',
        'board':7,
        'featured':false,
        'origin_url':'',
        'content':'With some other content...',
        'is_shared':false,
        'thumbnail_sm_path':'',
        'thumbnail_md_path':'',
        'thumbnail_lg_path':'',
        'file_size':null,
        'file_extension':'',
        'cards':[]
      }], {silent: true});

      updateSpy = sinon.spy(Card.prototype, 'update');
      hideEditModeSpy = sinon.spy(Card.prototype, 'hideEditMode');
      card = new Card({model: App.Cards.at(0)});
      card.insert('#application');
    });

    it('should do nothing if there are no changes in model.', function() {
      card.onEdited();
      expect(updateSpy).to.have.not.called;
      expect(hideEditModeSpy).to.have.not.called;
    });

    it('should update the card preview if there was changes in the model.', function() {
      card.onEdited(App.Cards.at(0), {name: 'Changed'});
      expect(updateSpy).to.have.called;
      expect(hideEditModeSpy).to.have.called;
    });

    after(function() {
      card.unplug(true);
      App.Cards.reset([], {silent: true});
      Card.prototype.update.restore();
      Card.prototype.hideEditMode.restore();
    });
  });

describe('onUploadProgress().', function() {
    var card;

    before(function() {
      App.Cards.reset([{
        'created_by':2,
        'id':2,
        'date_created':'2014-02-28T18:25:56.961Z',
        'date_modified':'2014-02-28T18:25:56.966Z',
        'name':'Another note',
        'type':'file',
        'slug':'another-note',
        'board':7,
        'featured':false,
        'origin_url':'',
        'content':'With some other content...',
        'is_shared':false,
        'thumbnail_sm_path':'',
        'thumbnail_md_path':'',
        'thumbnail_lg_path':'',
        'file_size':null,
        'file_extension':'',
        'cards':[]
      }], {silent: true});

      card = new Card({model: App.Cards.at(0)});
      card.insert('#application');
    });

    it('should update the upload rate text..', function() {
      card.onUploadProgress(card.$('.card-upload-progress'), {}, 21);
      expect(card.$('.card-upload-progress').text()).to.equal('21%');
    });

    after(function() {
      card.unplug(true);
      App.Cards.reset([], {silent: true});
    });
  });

  describe('onClickDelete().', function() {
    var card, publishSpy;

    before(function() {
      App.Cards.reset([{
        'created_by':2,
        'id':2,
        'date_created':'2014-02-28T18:25:56.961Z',
        'date_modified':'2014-02-28T18:25:56.966Z',
        'name':'Another note',
        'type':'note',
        'slug':'another-note',
        'board':7,
        'featured':false,
        'origin_url':'',
        'content':'With some other content...',
        'is_shared':false,
        'thumbnail_sm_path':'',
        'thumbnail_md_path':'',
        'thumbnail_lg_path':'',
        'file_size':null,
        'file_extension':'',
        'cards':[]
      }], {silent: true});

      publishSpy = sinon.spy(Card.prototype, 'publish');
      card = new Card({model: App.Cards.at(0)});
      card.insert('#application');
    });

    it('should destroy the model and publish a card:selected event.', function(done) {
      card.model.once('destroy', function() {
        done();
      });

      card.onClickDelete();
    });

    after(function() {
      card.unplug(true);
      App.Cards.reset([], {silent: true});
    });
  });
});
