describe('CardsList', function() {
  var CardsList = require('views/cards-list');

  before(function() {
    $('#application').html(require('templates/account-main')());
  });

  after(function() {
    $('#application').empty();
  });

  describe('when instantiated.', function() {
    var cardsList;

    before(function() {
      cardsList = new CardsList();
    });

    it('should exist.', function() {
      expect(cardsList).to.exist;
    });

    it('should have a name property.', function() {
      expect(cardsList.name).to.exist;
      expect(cardsList.name).to.equal('CardsList');
    });

    it('should have a list property.', function() {
      expect(cardsList.list).to.exist;
    });

    it('should have a template property.', function() {
      expect(cardsList.template).to.exist;
    });

    it('should have an events property.', function() {
      expect(cardsList.events).to.exist;
    });

    it('should have an itemView property.', function() {
      expect(cardsList.itemView).to.exist;
    });

    it('should have an collection property.', function() {
      expect(cardsList.collection).to.exist;
    });

    it('should have an subscriptions property.', function() {
      expect(cardsList.subscriptions).to.exist;
    });

    after(function() {
      cardsList.unplug(true);
    });
  });

  describe('onRender()', function() {
    var cardsList;

    before(function() {
      cardsList = new CardsList();
    });

    it('should init the createForm child view.', function() {
      cardsList.onRender();
      expect(cardsList.children.createForm).to.exist;
    });

    after(function() {
      cardsList.unplug(true);
    });
  });

  describe('showCreateMode()', function() {
    var cardsList;

    before(function() {
      cardsList = new CardsList();
    });

    it('should add the is-creating class to the view element.', function() {
      cardsList.showCreateMode();
      expect(cardsList.$el.hasClass('is-creating')).to.be.true;
    });

    after(function() {
      cardsList.unplug(true);
    });
  });

  describe('hideCreateMode()', function() {
    before(function() {
      cardsList = new CardsList();
    });

    it('should remove the is-creating class from the view element.', function() {
      cardsList.showCreateMode();
      cardsList.hideCreateMode();
      expect(cardsList.$el.hasClass('is-creating')).to.be.false;
    });

    after(function() {
      cardsList.unplug(true);
    });
  });

  describe('addCard()', function() {
    var cardsList;

    before(function() {
      cardsList = new CardsList();
    });

    it('should add the given model to the cards collection.', function() {
      var count = cardsList.collection.length;
      cardsList.showCreateMode();
      cardsList.addCard(_.createModel('card'));
      expect(cardsList.$el.hasClass('is-creating')).to.be.false;
      expect(cardsList.collection.length).to.equal(count + 1);
    });

    after(function() {
      cardsList.unplug(true);
    });
  });

  describe('onAdd().', function() {
    var cardsList;

    before(function() {
      cardsList = new CardsList();
      cardsList.insert('div.sidebar');
    });

    it('should append a new itemView to the list element given a model.', function() {
      var count = cardsList.collection.length;
      cardsList.onAdd(_.createModel('card'));
      expect(cardsList.$list.find('li').length).to.equal(count + 1);
    });

    after(function() {
      cardsList.unplug(true);
    });
  });
});
