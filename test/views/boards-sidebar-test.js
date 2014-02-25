describe('BoardsSidebar', function() {
  var BoardsSidebar = require('views/boards-sidebar');

  before(function() {
    $('#application').html(require('templates/account')());
  });

  after(function() {
    $('#application').empty();
  });

  describe('when instantiated.', function() {
    var sideBar;

    before(function() {
      sideBar = new BoardsSidebar();
    });

    it('should exist.', function() {
      expect(sideBar).to.exist;
    });

    it('should have a name property.', function() {
      expect(sideBar.name).to.exist;
      expect(sideBar.name).to.equal('BoardsSidebar');
    });

    it('should have a template property.', function() {
      expect(sideBar.template).to.exist;
    });

    it('should have a list property.', function() {
      expect(sideBar.list).to.exist;
      expect(sideBar.list).to.equal('ol.boards-sidebar__boards');
    });

    it('should have a elements property.', function() {
      expect(sideBar.elements).to.exist;
    });

    it('should have a subscriptions property.', function() {
      expect(sideBar.subscriptions).to.exist;
    });

    it('should have a itemView property.', function() {
      expect(sideBar.itemView).to.exist;
    });

    it('should have a collection property.', function() {
      expect(sideBar.collection).to.exist;
    });

    after(function() {
      sideBar.unplug(true);
    });
  });

  describe('onCreateBoardClick()', function() {
    var sideBar, showFormSpy;

    before(function() {
      showFormSpy = sinon.spy(BoardsSidebar.prototype, 'showForm');
      sideBar = new BoardsSidebar();
    });

    it('should call the showForm method.', function() {
      sideBar.onCreateBoardClick();
      expect(showFormSpy).to.have.been.called;
    });

    after(function() {
      sideBar.unplug(true);
    });
  });

  describe('showForm()', function() {
    var sideBar;

    before(function() {
      sideBar = new BoardsSidebar();
      sideBar.render();
    });

    it('should init and render the form child view.', function() {
      sideBar.showForm();
      expect(sideBar.children.form).to.exist;
    });

    it('should show the form child view element.', function() {
      sideBar.showForm();
      sideBar.children.form.$el.hide();
      expect(sideBar.children.form.$el.is(':visible')).to.be.false;
      sideBar.showForm();
      expect(sideBar.children.form.$el.is(':visible')).to.be.true;
    });

    after(function() {
      sideBar.unplug(true);
    });
  });

  describe('onNewBoard()', function() {
    var sideBar;

    before(function() {
      sideBar = new BoardsSidebar();
      sideBar.render();
    });

    it('should add the given board to the collection.', function() {
      sideBar.onNewBoard(_.createModel('board'));
      expect(sideBar.collection.length).to.equal(1);
    });

    after(function() {
      sideBar.unplug(true);
    });
  });

  describe('onAdd()', function() {
    var sideBar;

    before(function() {
      sideBar = new BoardsSidebar();
      sideBar.render();
    });

    it('should append a new child view element to the list given a board model.', function() {
      var count = sideBar.$list.find('li').length;
      sideBar.onAdd(_.createModel('board'));
      expect(sideBar.$list.find('li').length).to.equal(count + 1);
    });

    after(function() {
      sideBar.unplug(true);
    });
  });

  describe('onBoardSelected()', function() {
    var sideBar,
        selectSpy,
        BoardsSidebarItem = require('views/boards-sidebar-item');

    before(function() {
      selectSpy = sinon.spy(BoardsSidebarItem.prototype, 'select');
      sideBar = new BoardsSidebar();
      sideBar.render();
    });

    it('should call the select method on corresponding item view given a board model.', function() {
      sideBar.onBoardSelected(App.Boards.at(0));
      expect(selectSpy).to.have.been.called;
      expect(sideBar.$list.find('li').eq(0).hasClass('is-selected')).to.be.true;
    });

    after(function() {
      sideBar.unplug(true);
      BoardsSidebarItem.prototype.select.restore();
    });
  });
});
