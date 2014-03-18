describe('BoardActions', function() {
  var BoardActions = require('views/board-actions');

  before(function() {
    $('#application').html(require('templates/accounts-main')());
  });

  after(function() {
    $('#application').empty();
  });

  describe('when instantiated.', function() {
    var boardActions;

    before(function() {
      boardActions = new BoardActions({el: '.accounts__list'});
    });

    it('should exist.', function() {
      expect(boardActions).to.exist;
    });

    it('should have a name property.', function() {
      expect(boardActions.name).to.exist;
      expect(boardActions.name).to.equal('BoardActions');
    });

    it('should have a className property.', function() {
      expect(boardActions.className).to.exist;
      expect(boardActions.className).to.equal('board-actions');
    });

    it('should have a template property.', function() {
      expect(boardActions.template).to.exist;
    });

    it('should have an events property.', function() {
      expect(boardActions.events).to.exist;
    });

    it('should have an elements property.', function() {
      expect(boardActions.elements).to.exist;
    });

    after(function() {
      boardActions.unplug(true);
    });
  });

  describe('onClickAddNote().', function() {
    var publishSpy, boardActions;

    before(function() {
      publishSpy = sinon.spy(BoardActions.prototype, 'publish');
      boardActions = new BoardActions({el: '.accounts__list'});
    });

    it('should toggle the card type dropdown.', function() {
      boardActions.onClickAddNote();
      expect(publishSpy).to.have.been.calledWith('card:creating', 'note');
    });

    after(function() {
      boardActions.unplug(true);
      BoardActions.prototype.publish.restore();
    });
  });

  describe('onClickAddFile().', function() {
    var publishSpy, boardActions;

    before(function() {
      publishSpy = sinon.spy(BoardActions.prototype, 'publish');
      boardActions = new BoardActions({el: '.accounts__list'});
    });

    it('should toggle the card type dropdown.', function() {
      boardActions.onClickAddFile();
      expect(publishSpy).to.have.been.calledWith('card:creating', 'file');
    });

    after(function() {
      boardActions.unplug(true);
      BoardActions.prototype.publish.restore();
    });
  });
});
