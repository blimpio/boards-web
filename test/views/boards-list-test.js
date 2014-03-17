describe('BoardsList', function() {
  var BoardsList = require('views/boards-list');

  before(function() {
    $('#application').html(require('templates/accounts-main')());
  });

  after(function() {
    $('#application').empty();
  });

  describe('when instantiated.', function() {
    var boardsList;

    before(function() {
      boardsList = new BoardsList();
    });

    it('should exist.', function() {
      expect(boardsList).to.exist;
    });

    it('should have a name property.', function() {
      expect(boardsList.name).to.exist;
      expect(boardsList.name).to.equal('BoardsList');
    });

    it('should have a list property.', function() {
      expect(boardsList.list).to.exist;
    });

    it('should have a template property.', function() {
      expect(boardsList.template).to.exist;
    });

    it('should have an events property.', function() {
      expect(boardsList.events).to.exist;
    });

    it('should have an itemView property.', function() {
      expect(boardsList.itemView).to.exist;
    });

    it('should have an collection property.', function() {
      expect(boardsList.collection).to.exist;
    });

    after(function() {
      boardsList.unplug(true);
    });
  });

  describe('onCreateClick().', function() {
    var boardsList, showFormSpy;

    before(function() {
      showFormSpy = sinon.spy(BoardsList.prototype, 'showForm');
      boardsList = new BoardsList();
    });

    it('should call showForm().', function() {
      boardsList.onCreateClick();
      expect(showFormSpy).to.have.been.called;
    });

    after(function() {
      boardsList.unplug(true);
      BoardsList.prototype.showForm.restore();
    });
  });

  describe('showForm().', function() {
    var boardsList;

    before(function() {
      boardsList = new BoardsList();
      boardsList.insert('div.sidebar');
    });

    it('should show the create board form.', function() {
      boardsList.showForm();
      expect(boardsList.getView('createForm')).to.exist;
      expect(boardsList.getView('createForm')._isRendered).to.be.true;
    });

    after(function() {
      boardsList.unplug(true);
    });
  });

  describe('onNewBoard().', function() {
    var boardsList;

    before(function() {
      boardsList = new BoardsList();
      boardsList.insert('div.sidebar');
    });

    it('should add the given model to the boards collection.', function() {
      var count = boardsList.collection.length;
      boardsList.onNewBoard({id: 67});
      expect(boardsList.collection.length).to.equal(count + 1);
    });

    after(function() {
      boardsList.unplug(true);
    });
  });

  describe('onRemoveItem().', function() {
    var boardsList;

    before(function() {
      boardsList = new BoardsList();
      boardsList.insert('div.sidebar');
    });

    it('should remove the given itemView from the list.', function() {
      var model = _.createModel('board');

      boardsList.addItem(model);
      boardsList.onRemoveItem(boardsList.getItem(model));
      expect(boardsList.$list.find('li').length).to.equal(0);
    });

    after(function() {
      boardsList.unplug();
    });
  });

  describe('selectBoard().', function() {
    var model, boardsList;

    before(function() {
      boardsList = new BoardsList();
      boardsList.insert('div.sidebar');
    });

    it('should select a board given a model.', function() {
      model = _.createModel('board', {id: 12});

      App.Boards.set(model, {silent: true});
      boardsList.addItem(model);
      boardsList.selectBoard(model);
      expect(App.Boards.current).to.equal(12);
    });

    after(function() {
      boardsList.unplug(true);
      App.Boards.remove(model, {silent: true});
    });
  });
});
