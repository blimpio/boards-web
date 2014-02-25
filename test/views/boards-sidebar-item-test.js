describe('BoardsSidebarItem', function() {
  var BoardsSidebarItem = require('views/boards-sidebar-item');

  before(function() {
    $('#application').html(require('templates/boards-sidebar')());
  });

  after(function() {
    $('#application').empty();
  });

  describe('when instantiated.', function() {
    var sideBarItem;

    before(function() {
      sideBarItem = new BoardsSidebarItem();
    });

    it('should exist.', function() {
      expect(sideBarItem).to.exist;
    });

    it('should have a name property.', function() {
      expect(sideBarItem.name).to.exist;
      expect(sideBarItem.name).to.equal('BoardsSidebarItem');
    });

    it('should have a template property.', function() {
      expect(sideBarItem.template).to.exist;
    });

    it('should have a events property.', function() {
      expect(sideBarItem.events).to.exist;
    });

    it('should have a bindings property.', function() {
      expect(sideBarItem.bindings).to.exist;
    });

    it('should have a tagName property.', function() {
      expect(sideBarItem.tagName).to.exist;
      expect(sideBarItem.tagName).to.equal('li');
    });

    it('should have a className property.', function() {
      expect(sideBarItem.className).to.exist;
      expect(sideBarItem.className).to.equal('boards-sidebar__boards-item');
    });

    it('should have a model property.', function() {
      expect(sideBarItem.model).to.exist;
    });

    after(function() {
      sideBarItem.unplug(true);
    });
  });

  describe('context()', function() {
    var sideBarItem;

    before(function() {
      sideBarItem = new BoardsSidebarItem();
    });

    it('should return the template context.', function() {
      var context = sideBarItem.context();
      expect(context).to.exist;
      expect(_.keys(context)).to.eql(['name', 'thumbnail_sm_path']);
    });

    after(function() {
      sideBarItem.unplug(true);
    });
  });

  describe('select()', function() {
    var sideBarItem;

    before(function() {
      sideBarItem = new BoardsSidebarItem();
      sideBarItem.render();
    });

    it('should add an is-selected class to the view element.', function() {
      sideBarItem.select();
      expect(sideBarItem.$el.hasClass('is-selected')).to.be.true;
    });

    after(function() {
      sideBarItem.unplug(true);
    });
  });

  describe('onClick()', function() {
    var sideBarItem, publishSpy;

    before(function() {
      publishSpy = sinon.spy(BoardsSidebarItem.prototype, 'publish');
      sideBarItem = new BoardsSidebarItem();
    });

    it('should add an is-selected class to the view element.', function() {
      sideBarItem.onClick();
      expect(publishSpy).to.be.calledWith('board:selected', sideBarItem.model);
    });

    after(function() {
      sideBarItem.unplug(true);
      BoardsSidebarItem.prototype.publish.restore();
    });
  });

  describe('onEdited()', function() {
    var sideBarItem, renderSpy;

    before(function() {
      renderSpy = sinon.spy(BoardsSidebarItem.prototype, 'render');
      sideBarItem = new BoardsSidebarItem();
      sideBarItem.setModel(_.createModel('board')).render();
    });

    it('should render the view given a hash of changes from the model.', function() {
      sideBarItem.onEdited({name: 'Design1'});
      expect(renderSpy).to.be.called;
    });

    after(function() {
      sideBarItem.unplug(true);
      BoardsSidebarItem.prototype.render.restore();
    });
  });
});
