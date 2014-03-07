describe('CardEditForm', function() {
  var CardModel = require('models/card'),
      CardEditForm = require('views/card-edit-form');

  before(function() {
    $('#application').html(require('templates/card')({
      name: 'Another note',
      content: 'With some other content...'
    }));
  });

  after(function() {
    $('#application').empty();
  });

  describe('when instantiated.', function() {
    var cardEditForm;

    before(function() {
      cardEditForm = new CardEditForm({el: '.card-edit-form'});
    });

    it('should exist.', function() {
      expect(cardEditForm).to.exist;
    });

    it('should have a name property.', function() {
      expect(cardEditForm.name).to.exist;
      expect(cardEditForm.name).to.equal('CardEditForm');
    });

    it('should have an events property.', function() {
      expect(cardEditForm.events).to.exist;
    });

    it('should have an elements property.', function() {
      expect(cardEditForm.elements).to.exist;
    });

    after(function() {
      cardEditForm.unplug(true);
    });
  });

  describe('reset().', function() {
    var card, cardEditForm;

    before(function() {
      card = new CardModel({
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
      });

      cardEditForm = new CardEditForm({
        el: '.card-edit-form',
        model: card
      });
      cardEditForm.render();
    });

    it('should reset the form.', function() {
      cardEditForm.$nameInput.val('');
      cardEditForm.reset();
      expect(cardEditForm.$nameInput.val()).to.equal('Another note');
    });

    after(function() {
      cardEditForm.unplug(true);
    });
  });

  describe('onClickCancel()', function() {
    var cardEditForm, publishSpy;

    before(function() {
      publishSpy = sinon.spy(CardEditForm.prototype, 'publish');
      cardEditForm = new CardEditForm({el: '.card-edit-form'});
      cardEditForm.render();
    });

    it('should publish a card:editing:cancel event.', function() {
      cardEditForm.onClickCancel();
      expect(publishSpy).to.have.been.calledWith('card:editing:cancel');
    });

    after(function() {
      cardEditForm.unplug(true);
      CardEditForm.prototype.publish.restore();
    });
  });

  describe('onSubmit().', function() {
    var card, cardEditForm;

    before(function() {
      card = new CardModel({
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
      });

      cardEditForm = new CardEditForm({
        el: '.card-edit-form',
        model: card
      });

      cardEditForm.render();
    });

    it('should save the model.', function(done) {
      cardEditForm.model.once('edited', function() {
        done();
      });

      cardEditForm.getAttributeElement('name').val('Another edited note.');
      cardEditForm.getAttributeElement('content').val('12345');
      cardEditForm.onSubmit({preventDefault: function() {}});
    });

    after(function() {
      cardEditForm.unplug(true);
    });
  });
});
