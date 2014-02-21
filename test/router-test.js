describe('Router', function() {
  var Router = require('router'),
      ResetPassword = require('controllers/reset-password');

  before(function() {
    App.Accounts.reset([{
      id: 1,
      name: 'ACME Inc',
      slug: 'acme-inc',
      image_url: ''
    }]);
  });

  beforeEach(function() {
    this.server = sinon.fakeServer.create();
    this.server.autoRespond = false;
    this.server.autoRespondAfter = 500;

    this.navigateSpy = sinon.spy(Backbone.History.prototype, 'navigate');
    this.validateTokenSpy = sinon.spy(ResetPassword.prototype, 'validateToken');

    this.Router = new Router({
      routes: {
        'posts': 'onPosts',
        'posts/:id': 'onPosts'
      },

      onPosts: function(id) {

      }
    });

    Backbone.history.start({pushState: false});
  });

  afterEach(function() {
    this.server.restore;
    delete this.server;
    Backbone.History.prototype.navigate.restore();
    ResetPassword.prototype.validateToken.restore();
    delete this.Router;
    Backbone.history.stop();
  });

  after(function() {
    App.Accounts.reset();
  });

  describe('onError', function() {
    it('should navigate to the signin route if the authIsRequired() validation fails.', function() {
      this.Router.onError({}, 'Auth is required.');
      expect(this.navigateSpy).to.have.been.calledWith('signin', {trigger: true});
    });

    it('should navigate to the accounts route if the accountExists() validation fails.', function() {
      this.Router.onError({}, 'User is not in account.');
      expect(this.navigateSpy).to.have.been.calledWith('accounts', {trigger: true});
    });

    it('should navigate to the accounts route if the isNotAuthenticated() validation fails.', function() {
      this.Router.onError({}, 'User is already authenticated.');
      expect(this.navigateSpy).to.have.been.calledWith('accounts', {trigger: true});
    });

    it('should navigate to the accounts route if the hasOneAccount() validation fails.', function() {
      console.log(App.Accounts.toJSON());
      this.Router.onError({}, 'User has only one account.');
      expect(this.navigateSpy).to.have.been.calledWith('acme-inc', {trigger: true});
    });
  });

  describe('beforeRoute', function() {
    it('should remove the current controller.', function() {
      this.Router.controller = new Z.View();
      this.Router.beforeRoute();
      expect(this.Router.controller.isUnplugged).to.be.true;
    });
  });

  describe('authIsRequired', function() {
    it('should return an error if the user is not signed in.', function() {
      expect(this.Router.authIsRequired({fragment: 'accounts/'})).to.equal('Auth is required.');
    });
  });

  describe('isNotAuthenticated', function() {
    it('should return an error if the user is signed in.', function() {
      App.User.set('token', '12345');
      expect(this.Router.isNotAuthenticated({fragment: 'signin/'})).to.equal('User is already authenticated.');
    });
  });

  describe('accountExists', function() {
    it('should return an error if the user is not in the given account.', function() {
      App.User.set('token', '12345');
      expect(this.Router.accountExists({
        params: ['blimp'],
        fragment: 'blimp/'
      })).to.equal('User is not in account.');
    });
  });

  describe('hasOneAccount', function() {
    it('should return an error if the user has only one account.', function() {
      expect(this.Router.hasOneAccount({
        params: [],
        fragment: 'accounts/'
      })).to.equal('User has only one account.');
    });
  });

  describe('navigateWithTrigger', function() {
    it('should navigate and trigger the route.', function() {
      this.Router.navigateWithTrigger('signin');
      expect(this.navigateSpy).to.have.been.calledWith('signin', {trigger: true});
    });
  });

  describe('removeLastController', function() {
    it('should remove the last controller view.', function() {
      this.Router.controller = new Z.View();
      this.Router.removeLastController();
      expect(this.Router.controller.isUnplugged).to.be.true;
    });
  });

  describe('signup', function() {
    it('should init the signup controller view.', function() {
      this.Router.signup();
      expect(this.Router.controller).to.exist;
      expect(this.Router.controller.name).to.equal('SignupController');
    });
  });

  describe('signin', function() {
    it('should init the signin controller view.', function() {
      this.Router.signin();
      expect(this.Router.controller).to.exist;
      expect(this.Router.controller.name).to.equal('SigninController');
    });
  });

  describe('forgotPassword', function() {
    it('should init the forgotPassword controller view.', function() {
      this.Router.forgotPassword();
      expect(this.Router.controller).to.exist;
      expect(this.Router.controller.name).to.equal('ForgotPasswordController');
    });
  });

  describe('resetPassword', function() {
    it('should init the resetPassword controller view.', function() {
      this.Router.resetPassword();
      expect(this.Router.controller).to.exist;
      expect(this.Router.controller.name).to.equal('ResetPasswordController');
    });
  });

  describe('resetPasswordWithToken', function() {
    it('should init the resetPassword controller view and call the validateToken() method.', function() {
      this.Router.resetPasswordWithToken(JWT_TEST_TOKEN);
      expect(this.Router.controller).to.exist;
      expect(this.Router.controller.name).to.equal('ResetPasswordController');
      expect(this.validateTokenSpy).to.have.been.calledWith(JWT_TEST_TOKEN);
    });
  });

  describe('signout', function() {
    it('sign out the current user and navigate to the signin route.', function() {
      this.Router.signout();
      expect(App.User.isSignedIn()).to.be.false;
      expect(this.navigateSpy).to.have.been.calledWith('signin', {trigger: true});
    });
  });

  describe('accounts', function() {
    it('should init the accounts controller view.', function() {
      this.Router.accounts();
      expect(this.Router.controller).to.exist;
      expect(this.Router.controller.name).to.equal('AccountsController');
    });
  });

  describe('account', function() {
    it('should init the account controller view.', function(done) {
      this.server.respondWith('GET', '/api/boards/', function(req) {
        req.respond(200, {'Content-Type': 'application/json'}, '[]');
        done();
      });

      this.Router.account();
      expect(this.Router.controller).to.exist;
      expect(this.Router.controller.name).to.equal('AccountController');
      this.server.respond();
    });
  });
});
