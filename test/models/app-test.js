describe('AppModel', function() {
  var AppModel = require('models/app');

  before(function() {
    localStorage.setItem('App', '{"current_board":2,"current_account":1}');
  });

  after(function() {
    localStorage.clear();
  });

  describe('when instantiated.', function() {
    var appModel;

    before(function() {
      appModel = new AppModel();
    });

    it('should exist.', function() {
      expect(appModel).to.exist;
    });

    it('should have a name property.', function() {
      expect(appModel.name).to.exist;
      expect(appModel.name).to.equal('App');
    });

    after(function() {
      appModel.clear();
    });
  });

  describe('initialize()', function() {
    var appModel;

    before(function() {
      appModel = new AppModel();
    });

    it('should have fetch from cache.', function() {
      expect(appModel.get('current_board')).to.equal(2);
      expect(appModel.get('current_account')).to.equal(1);
    });

    after(function() {
      appModel.clear();
    });
  });
});
