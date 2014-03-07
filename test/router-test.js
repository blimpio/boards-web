describe('Router', function() {
  var Router = require('router');

  beforeEach(function() {
    App.Accounts.reset([{
      id: 1,
      name: 'ACME Inc',
      slug: 'acme-inc',
      image_url: ''
    }]);
  });

  afterEach(function() {
    App.Accounts.reset();
  });

  describe('onError()', function() {
    var router, navigateSpy;

    beforeEach(function() {
      router = new Router({
        routes: {
          'posts': 'onPosts',
          'posts/:id': 'onPosts'
        },

        onPosts: function(id) {}
      });

      navigateSpy = sinon.spy(Backbone.History.prototype, 'navigate');
    });

    it('should navigate to the signin route if the authIsRequired() validation fails.', function() {
      router.onError({}, 'Auth is required.');
      expect(navigateSpy).to.have.been.calledWith('signin', {trigger: true});
    });

    it('should navigate to the accounts route if the accountExists() validation fails.', function() {
      router.onError({}, 'User is not in account.');
      expect(navigateSpy).to.have.been.calledWith('accounts', {trigger: true});
    });

    it('should navigate to the accounts route if the isNotAuthenticated() validation fails.', function() {
      router.onError({}, 'User is already authenticated.');
      expect(navigateSpy).to.have.been.calledWith('accounts', {trigger: true});
    });

    it('should navigate to the accounts route if the hasOneAccount() validation fails.', function() {
      router.onError({}, 'User has only one account.');
      expect(navigateSpy).to.have.been.calledWith('acme-inc', {trigger: true});
    });

    afterEach(function() {
      Backbone.History.prototype.navigate.restore();
    });
  });

  describe('beforeRoute()', function() {
    var router;

    beforeEach(function() {
      router = new Router({
        routes: {
          'posts': 'onPosts',
          'posts/:id': 'onPosts'
        },

        onPosts: function(id) {}
      });
    });

    it('should remove the current controller.', function() {
      router.controller = new Z.View();
      router.beforeRoute();
      expect(router.controller.isUnplugged).to.be.true;
    });
  });

  describe('authIsRequired()', function() {
    var router;

    beforeEach(function() {
      router = new Router({
        routes: {
          'posts': 'onPosts',
          'posts/:id': 'onPosts'
        },

        onPosts: function(id) {}
      });
    });

    it('should return an error if the user is not signed in.', function() {
      expect(router.authIsRequired({fragment: 'accounts/'})).to.equal('Auth is required.');
    });
  });

  describe('isNotAuthenticated()', function() {
    var router;

    beforeEach(function() {
      router = new Router({
        routes: {
          'posts': 'onPosts',
          'posts/:id': 'onPosts'
        },

        onPosts: function(id) {}
      });
    });

    it('should return an error if the user is signed in.', function() {
      App.User.set('token', '12345');
      expect(router.isNotAuthenticated({fragment: 'signin/'})).to.equal('User is already authenticated.');
    });
  });

  describe('accountExists()', function() {
    var router;

    beforeEach(function() {
      router = new Router({
        routes: {
          'posts': 'onPosts',
          'posts/:id': 'onPosts'
        },

        onPosts: function(id) {}
      });

      App.User.set('token', '12345');
    });

    it('should return an error if the user is not in the given account.', function() {
      expect(router.accountExists({
        params: ['blimp'],
        fragment: 'blimp/'
      })).to.equal('User is not in account.');
    });

    afterEach(function() {
      App.User.clear();
    });
  });

  describe('hasOneAccount()', function() {
    var router;

    beforeEach(function() {
      router = new Router({
        routes: {
          'posts': 'onPosts',
          'posts/:id': 'onPosts'
        },

        onPosts: function(id) {}
      });
    });

    it('should return an error if the user has only one account.', function() {
      expect(router.hasOneAccount({
        params: [],
        fragment: 'accounts/'
      })).to.equal('User has only one account.');
    });
  });

  describe('navigateWithTrigger()', function() {
    var router, navigateSpy;

    beforeEach(function() {
      router = new Router({
        routes: {
          'posts': 'onPosts',
          'posts/:id': 'onPosts'
        },

        onPosts: function(id) {}
      });

      navigateSpy = sinon.spy(Backbone.History.prototype, 'navigate');
    });

    it('should navigate and trigger the route.', function() {
      router.navigateWithTrigger('signin');
      expect(navigateSpy).to.have.been.calledWith('signin', {trigger: true});
    });

    afterEach(function() {
      Backbone.History.prototype.navigate.restore();
    });
  });

  describe('removeLastController()', function() {
    var router;

    beforeEach(function() {
      router = new Router({
        routes: {
          'posts': 'onPosts',
          'posts/:id': 'onPosts'
        },

        onPosts: function(id) {}
      });
    });

    it('should remove the last controller view.', function() {
      router.controller = new Z.View();
      router.removeLastController();
      expect(router.controller.isUnplugged).to.be.true;
    });
  });

  describe('signup()', function() {
    var router;

    beforeEach(function() {
      router = new Router({
        routes: {
          'posts': 'onPosts',
          'posts/:id': 'onPosts'
        },

        onPosts: function(id) {}
      });
    });

    it('should init the signup controller view.', function() {
      router.signup();
      expect(router.controller).to.exist;
      expect(router.controller.name).to.equal('SignupController');
    });
  });

  describe('signin()', function() {
    var router;

    beforeEach(function() {
      router = new Router({
        routes: {
          'posts': 'onPosts',
          'posts/:id': 'onPosts'
        },

        onPosts: function(id) {}
      });
    });

    it('should init the signin controller view.', function() {
      router.signin();
      expect(router.controller).to.exist;
      expect(router.controller.name).to.equal('SigninController');
    });
  });

  describe('forgotPassword()', function() {
    var router;

    beforeEach(function() {
      router = new Router({
        routes: {
          'posts': 'onPosts',
          'posts/:id': 'onPosts'
        },

        onPosts: function(id) {}
      });
    });

    it('should init the forgotPassword controller view.', function() {
      router.forgotPassword();
      expect(router.controller).to.exist;
      expect(router.controller.name).to.equal('ForgotPasswordController');
    });
  });

  describe('resetPassword()', function() {
    var router;

    beforeEach(function() {
      router = new Router({
        routes: {
          'posts': 'onPosts',
          'posts/:id': 'onPosts'
        },

        onPosts: function(id) {}
      });
    });

    it('should init the resetPassword controller view.', function() {
      router.resetPassword();
      expect(router.controller).to.exist;
      expect(router.controller.name).to.equal('ResetPasswordController');
    });
  });

  describe('resetPasswordWithToken()', function() {
    var router,
        ResetPassword = require('controllers/reset-password'),
        validateTokenSpy;

    beforeEach(function() {
      router = new Router({
        routes: {
          'posts': 'onPosts',
          'posts/:id': 'onPosts'
        },

        onPosts: function(id) {}
      });

      validateTokenSpy = sinon.spy(ResetPassword.prototype, 'validateToken');
    });

    it('should init the resetPassword controller view and call the validateToken() method.', function() {
      router.resetPasswordWithToken(JWT_PASSWORD_TOKEN);
      expect(router.controller).to.exist;
      expect(router.controller.name).to.equal('ResetPasswordController');
      expect(validateTokenSpy).to.have.been.calledWith(JWT_PASSWORD_TOKEN);
    });

    afterEach(function() {
      ResetPassword.prototype.validateToken.restore();
    });
  });

  describe('signout()', function() {
    var router, navigateSpy;

    beforeEach(function() {
      router = new Router({
        routes: {
          'posts': 'onPosts',
          'posts/:id': 'onPosts'
        },

        onPosts: function(id) {}
      });

      navigateSpy = sinon.spy(Backbone.History.prototype, 'navigate');
    });

    it('sign out the current user and navigate to the signin route.', function() {
      router.signout();
      expect(App.User.isSignedIn()).to.be.false;
      expect(navigateSpy).to.have.been.calledWith('signin', {trigger: true});
    });

    afterEach(function() {
      Backbone.History.prototype.navigate.restore();
    });
  });

  describe('accounts()', function() {
    var router;

    beforeEach(function() {
      router = new Router({
        routes: {
          'posts': 'onPosts',
          'posts/:id': 'onPosts'
        },

        onPosts: function(id) {}
      });
    });

    it('should init the accounts controller view.', function() {
      router.accounts();
      expect(router.controller).to.exist;
      expect(router.controller.name).to.equal('AccountsController');
    });
  });

  describe('account()', function() {
    var router;

    beforeEach(function() {
      router = new Router({
        routes: {
          'posts': 'onPosts',
          'posts/:id': 'onPosts'
        },

        onPosts: function(id) {}
      });
    });

    it('should init the account controller view.', function() {
      router.account();
      expect(router.controller).to.exist;
      expect(router.controller.name).to.equal('AccountController');
    });
  });

  describe('onBoardSelected()', function() {
    var router;

    beforeEach(function() {
      router = new Router();
      App.Accounts.reset([{
        id: 4,
        name: 'Blimp LLC',
        slug: 'blimp',
        image_url: ''
      }], {silent: true});

      App.Accounts.current = 4;
    });

    it('should navigate to the board url given a board model.', function() {
      App.User.set('token', '123');

      router.onBoardSelected(_.createModel('board', {
        id: 12,
        name: 'Design',
        slug: 'design',
        account: 4
      }));

      expect(router.getFragment()).to.equal('blimp/design');
    });

    afterEach(function() {
      App.User.clear();
      App.Accounts.reset([], {silent: true});
      App.Accounts.current = undefined;
    });
  });

  describe('onCardSelected()', function() {
    var router;

    beforeEach(function() {
      router = new Router();

      App.Accounts.reset([{
        id: 4,
        name: 'Blimp LLC',
        slug: 'blimp',
        image_url: ''
      }], {silent: true});

      App.Accounts.current = 4;

      App.Boards.reset([{
        account: 1,
        created_by: 2,
        date_created: '2014-02-24T21:19:43.334Z',
        date_modified: '2014-02-24T21:21:12.674Z',
        id: 1,
        is_shared: false,
        name: 'Inspiration',
        slug: 'designs',
        thumbnail_lg_path: '',
        thumbnail_md_path: '',
        thumbnail_sm_path: ''
      }], {silent: true});

      App.Boards.current = 1;
    });

    it('should navigate to the card url given a card model.', function() {
      App.User.set('token', '123');

      router.onCardSelected(_.createModel('card', {
        id: 12,
        name: 'Dog',
        slug: 'dog-3',
        board: 1
      }));

      expect(router.getFragment()).to.equal('blimp/designs/dog-3');
    });

    afterEach(function() {
      App.User.clear();
      App.Boards.reset([], {silent: true});
      App.Boards.current = undefined;
      App.Accounts.reset([], {silent: true});
      App.Accounts.current = undefined;
    });
  });

  describe('card()', function() {
    var router;

    beforeEach(function() {
      router = new Router({
        routes: {
          'posts': 'onPosts',
          'posts/:id': 'onPosts'
        },

        onPosts: function(id) {}
      });

      App.Accounts.reset([{
        id: 4,
        name: 'Blimp LLC',
        slug: 'blimp',
        image_url: ''
      }], {silent: true});

      App.Accounts.current = 4;

      App.Boards.reset([{
        account: 1,
        created_by: 2,
        date_created: '2014-02-24T21:19:43.334Z',
        date_modified: '2014-02-24T21:21:12.674Z',
        id: 1,
        is_shared: false,
        name: 'Inspiration',
        slug: 'designs',
        thumbnail_lg_path: '',
        thumbnail_md_path: '',
        thumbnail_sm_path: ''
      }], {silent: true});

      App.Boards.current = 1;

      App.Cards.reset([{
        'created_by':2,
        'id':2,
        'date_created':'2014-02-28T18:25:56.961Z',
        'date_modified':'2014-02-28T18:25:56.966Z',
        'name':'Another note',
        'type':'note',
        'slug':'another-note',
        'board':1,
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
    });

    it('should init the account controller view.', function() {
      router.card('blimp', 'designs', 'another-note');
      expect(router.controller).to.exist;
      expect(router.controller.name).to.equal('CardController');
    });

    afterEach(function() {
      App.Boards.reset([], {silent: true});
      App.Boards.current = undefined;
      App.Accounts.reset([], {silent: true});
      App.Accounts.current = undefined;
    });
  });
});
