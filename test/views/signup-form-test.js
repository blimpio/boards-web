describe('SignupForm', function() {
  var SignupForm = require('views/signup-form');

  before(function() {
    $('#application').html('<form class="signup"></form>');
  });

  after(function() {
    $('#application').empty();
  });

  describe('when instantiated.', function() {
    var signupForm;

    before(function() {
      signupForm = new SignupForm({
        model: _.createModel('user')
      });
    });

    it('should exist.', function() {
      expect(signupForm).to.exist;
    });

    it('should have a name property.', function() {
      expect(signupForm.name).to.exist;
      expect(signupForm.name).to.equal('SignupForm');
    });

    it('should have an events property.', function() {
      expect(signupForm.events).to.exist;
    });

    it('should have an bindings property.', function() {
      expect(signupForm.bindings).to.exist;
    });

    it('should have a model.', function() {
      expect(signupForm.model).to.exist;
      expect(signupForm.model.name).to.equal('User');
    });

    after(function() {
      signupForm.model.unplug();
      signupForm.unplug(true);
    });
  });

  describe('context()', function() {
    var signupForm = new SignupForm({
      model: _.createModel('user')
    });

    it('should return the template context.', function() {
      var context = signupForm.context();
      expect(context).to.exist;
      expect(_.keys(context)).to.eql(['email', 'signup_domains']);
    });

    after(function() {
      signupForm.model.unplug();
      signupForm.unplug(true);
    });
  });

  describe('onSubmit()', function() {
    var signupForm;

    before(function() {
      signupForm = new SignupForm({
        model: _.createModel('user')
      });

      signupForm.render();
    });

    it('should try to validate the current step and render the next one.', function() {
      signupForm.model.set({
        'email': 'name@example.com',
        'signup_request_token': JWT_SIGNUP_TOKEN,
        'signup_step': 4
      });

      signupForm.renderStep(4);
      signupForm.getAttributeElement('full_name').val('Elving Rodriguez');
      signupForm.onSubmit({preventDefault: function(){}});
      expect(signupForm.model.get('signup_step')).to.equal(5);
    });

    after(function() {
      signupForm.model.unplug();
      signupForm.unplug(true);
    });
  });

  describe('onSignupStepChange()', function() {
    var signupForm;

    before(function() {
      signupForm = new SignupForm({
        model: _.createModel('user')
      });

      signupForm.render();
    });

    it('should invoke renderStep when the model triggers a change:signup_step event.', function() {
      signupForm.onSignupStepChange(signupForm.model, 3);
      expect(signupForm.$('[data-step=3]')).to.exist;
    });

    after(function() {
      signupForm.model.unplug();
      signupForm.unplug(true);
    });
  });

  describe('renderStep()', function() {
    var signupForm;

    before(function() {
      signupForm = new SignupForm({
        model: _.createModel('user')
      });

      signupForm.render();
    });

    it('should render the given step.', function() {
      signupForm.renderStep(4);
      expect(signupForm.$('[data-step=4]')).to.exist;
    });

    after(function() {
      signupForm.model.unplug();
      signupForm.unplug(true);
    });
  });

  describe('validateEmail()', function() {
    var server, signupForm;

    before(function() {
      server = sinon.fakeServer.create();
      server.autoRespond = true;

      signupForm = new SignupForm({
        model: _.createModel('user')
      });

      signupForm.render();
    });

    it('should validate the email entered on the form and render the next step if it\'s validated.', function(done) {
      signupForm.renderStep(1);
      signupForm.getAttributeElement('email').val('name@example.com');

      server.respondWith('POST', '/api/auth/signup_request/', function(req) {
        req.respond(200, {'Content-Type': 'application/json'}, '{"email": "name@example.com"}');
        done();
      });

      signupForm.validateEmail();
    });

    after(function() {
      server.restore();
      signupForm.model.unplug();
      signupForm.unplug(true);
    });
  });

  describe('onSignupRequestError()', function() {
    var signupForm;

    before(function() {
      signupForm = new SignupForm({
        model: _.createModel('user')
      });

      signupForm.render();
    });

    it('should display an error message.', function() {
      signupForm.renderStep(1);
      signupForm.onSignupRequestError('error');
      expect(signupForm.getAttributeErrorElement('email').text()).to.equal('error');
    });

    after(function() {
      signupForm.model.unplug();
      signupForm.unplug(true);
    });
  });

  describe('redirectToFirstStep()', function() {
    var signupForm;

    before(function() {
      signupForm = new SignupForm({
        model: _.createModel('user')
      });

      signupForm.render();
    });

    it('should redirect to the first step.', function() {
      signupForm.model.set('signup_step', 3);
      signupForm.redirectToFirstStep();
      expect(signupForm.model.get('signup_step')).to.equal(1);
    });

    after(function() {
      signupForm.model.unplug();
      signupForm.unplug(true);
    });
  });

  describe('redirectToFourthStep()', function() {
    var signupForm;

    before(function() {
      signupForm = new SignupForm({
        model: _.createModel('user')
      });

      signupForm.render();
    });

    it('should redirect to the fourth step.', function() {
      signupForm.renderStep(1);
      signupForm.redirectToFourthStep();
      expect(signupForm.model.get('signup_step')).to.equal(4);
    });

    after(function() {
      signupForm.model.unplug();
      signupForm.unplug(true);
    });
  });

  describe('validateFullName()', function() {
    var signupForm;

    before(function() {
      signupForm = new SignupForm({
        model: _.createModel('user')
      });

      signupForm.render();
    });

    it('should validate the name entered on the form and render the next step if it\'s validated.', function() {
      signupForm.model.set({
        'email': 'name@example.com',
        'signup_request_token': JWT_SIGNUP_TOKEN,
        'signup_step': 4
      });

      signupForm.renderStep(4);
      signupForm.getAttributeElement('full_name').val('Elving Rodriguez');
      signupForm.validateFullName();
      expect(signupForm.model.get('full_name')).to.equal('Elving Rodriguez');
      expect(signupForm.model.get('signup_step')).to.equal(5);
    });

    after(function() {
      signupForm.model.unplug();
      signupForm.unplug(true);
    });
  });

  describe('validateAccountName()', function() {
    var signupForm;

    before(function() {
      signupForm = new SignupForm({
        model: _.createModel('user')
      });

      signupForm.render();
    });

    it('should validate the account name entered on the form and render the next step if it\'s validated.', function() {
      signupForm.model.set({
        'email': 'name@example.com',
        'signup_request_token': JWT_SIGNUP_TOKEN,
        'first_name': 'Elving',
        'last_name': 'Rodriguez',
        'full_name': 'Elving Rodriguez',
        'signup_step': 5
      });

      signupForm.renderStep(5);
      signupForm.getAttributeElement('account_name').val('Blimp');
      signupForm.validateAccountName();
      expect(signupForm.model.get('signup_step')).to.equal(6);
      expect(signupForm.model.get('account_name')).to.equal('Blimp');
    });

    after(function() {
      signupForm.model.unplug();
      signupForm.unplug(true);
    });
  });

  describe('validateSignupDomains()', function() {
    var server, signupForm;

    before(function() {
      server = sinon.fakeServer.create();
      server.autoRespond = true;

      signupForm = new SignupForm({
        model: _.createModel('user')
      });

      signupForm.render();
    });

    it('should validate the domains entered on the form and render the next step if it\'s validated.', function(done) {
      server.respondWith('POST', '/api/auth/signup_domains/validate/', function(req) {
        req.respond(200, {'Content-Type': 'application/json'}, '{"email": "name@example.com"}');
        done();
      });

      signupForm.model.set({
        'email': 'name@example.com',
        'signup_request_token': JWT_SIGNUP_TOKEN,
        'first_name': 'Elving',
        'last_name': 'Rodriguez',
        'full_name': 'Elving Rodriguez',
        'account_name': 'Blimp',
        'signup_step': 6
      });

      signupForm.renderStep(6);
      signupForm.getAttributeElement('allow_signup').prop('checked', true);
      signupForm.getAttributeElement('signup_domains').val('example.com, example.net');
      signupForm.validateSignupDomains();
    });

    after(function() {
      server.restore();
      signupForm.model.unplug();
      signupForm.unplug(true);
    });
  });

  describe('onSignupDomainsError()', function() {
    var signupForm;

    before(function() {
      signupForm = new SignupForm({
        model: _.createModel('user')
      });

      signupForm.render();
    });

    it('should dispplay an error message.', function() {
      signupForm.renderStep(6);
      signupForm.onSignupDomainsError('error');
      expect(signupForm.getAttributeErrorElement('signup_domains').text()).to.equal('error');
    });

    after(function() {
      signupForm.model.unplug();
      signupForm.unplug(true);
    });
  });

  describe('skipSignupDomains()', function() {
    var signupForm;

    before(function() {
      signupForm = new SignupForm({
        model: _.createModel('user')
      });

      signupForm.render();
    });

    it('should redirect to the seventh step.', function() {
      signupForm.renderStep(6);
      signupForm.skipSignupDomains();
      expect(signupForm.model.get('signup_step')).to.equal(7);
    });

    after(function() {
      signupForm.model.unplug();
      signupForm.unplug(true);
    });
  });

  describe('addOtherDomainInput()', function() {
    var signupForm;

    before(function() {
      signupForm = new SignupForm({
        model: _.createModel('user')
      });

      signupForm.render();
    });

    it('should add a domain input field.', function() {
      var select;

      signupForm.model.set({
        'email': 'name@example.com',
        'signup_request_token': JWT_SIGNUP_TOKEN,
        'first_name': 'Elving',
        'last_name': 'Rodriguez',
        'full_name': 'Elving Rodriguez',
        'account_name': 'Blimp',
        'allow_signup': true,
        'signup_domains': ['example.com', 'example.net'],
        'signup_step': 7
      });

      signupForm.renderStep(7);
      select = signupForm.$('select.signup__invitation-domains')[0];
      select.value = 'other';
      signupForm.addOtherDomainInput({currentTarget: select});
      expect(signupForm.$('input.signup__invitation-domain-input')).to.exist;
    });

    after(function() {
      signupForm.model.unplug();
      signupForm.unplug(true);
    });
  });

  describe('addInvitationRow()', function() {
    var signupForm;

    before(function() {
      signupForm = new SignupForm({
        model: _.createModel('user')
      });

      signupForm.render();
    });

    it('should add an invitation row.', function() {
      signupForm.renderStep(7);
      expect(signupForm.$('input.signup__invitation-field').length).to.equal(3);
      signupForm.addInvitationRow();
      expect(signupForm.$('input.signup__invitation-field').length).to.equal(4);
    });

    after(function() {
      signupForm.model.unplug();
      signupForm.unplug(true);
    });
  });

  describe('removeInvitationRow()', function() {
    var signupForm;

    before(function() {
      signupForm = new SignupForm({
        model: _.createModel('user')
      });

      signupForm.render();
    });

    it('should remove an invitation row.', function() {
      signupForm.renderStep(7);
      expect(signupForm.$('input.signup__invitation-field').length).to.equal(3);
      signupForm.removeInvitationRow({
        currentTarget: signupForm.$('button[data-action=removeInvitationRow]')[0]
      });
      expect(signupForm.$('input.signup__invitation-field').length).to.equal(2);
    });

    after(function() {
      signupForm.model.unplug();
      signupForm.unplug(true);
    });
  });

  describe('validateInvitations()', function() {
    var signupForm;

    before(function() {
      signupForm = new SignupForm({
        model: _.createModel('user')
      });

      signupForm.render();
    });

    it('should validate the email invites entered on the form and render the next step if it\'s validated (with select).', function() {
      signupForm.model.set({
        'email': 'name@example.com',
        'signup_request_token': JWT_SIGNUP_TOKEN,
        'first_name': 'Elving',
        'last_name': 'Rodriguez',
        'full_name': 'Elving Rodriguez',
        'account_name': 'Blimp',
        'allow_signup': true,
        'signup_domains': ['example.com', 'example.net'],
        'signup_step': 7
      });

      signupForm.renderStep(7);
      signupForm.$('input.signup__invitation-field').eq(0).val('elving');
      signupForm.$('input.signup__invitation-field').eq(1).val('elving');
      signupForm.$('select.signup__invitation-domains').find('option').eq(1).prop('selected', true);
      signupForm.validateInvitations();
      expect(signupForm.model.get('invite_emails')).to.include('elving@example.com');
      expect(signupForm.model.get('invite_emails')).to.include('elving@example.net');
    });

    it('should validate the email invites entered on the form and render the next step if it\'s validated (with inputs).', function() {
      var select;

      signupForm.model.set({
        'email': 'name@example.com',
        'signup_request_token': JWT_SIGNUP_TOKEN,
        'first_name': 'Elving',
        'last_name': 'Rodriguez',
        'full_name': 'Elving Rodriguez',
        'account_name': 'Blimp',
        'allow_signup': true,
        'signup_domains': ['example.com', 'example.net'],
        'signup_step': 7
      });

      signupForm.renderStep(7);
      select = signupForm.$('select.signup__invitation-domains')[1];
      select.value = 'other';
      signupForm.$('input.signup__invitation-field').eq(0).val('elving');
      signupForm.$('input.signup__invitation-field').eq(1).val('elving');
      signupForm.$('select.signup__invitation-domains').eq(0).find('option').eq(0).prop('selected', true);
      signupForm.addOtherDomainInput({currentTarget: select});
      signupForm.$('input.signup__invitation-domain-input').eq(0).val('somedomain.com');
      signupForm.validateInvitations();
      expect(signupForm.model.get('invite_emails')).to.include('elving@example.com');
      expect(signupForm.model.get('invite_emails')).to.include('elving@somedomain.com');
    });

    it('should set an \'invite_emails\' attribute even if no invites were added in the form.', function() {
      var select;

      signupForm.model.set({
        'email': 'name@example.com',
        'signup_request_token': JWT_SIGNUP_TOKEN,
        'first_name': 'Elving',
        'last_name': 'Rodriguez',
        'full_name': 'Elving Rodriguez',
        'account_name': 'Blimp',
        'allow_signup': true,
        'signup_domains': ['example.com', 'example.net'],
        'signup_step': 7
      });

      signupForm.renderStep(7);
      signupForm.validateInvitations();
      expect(signupForm.model.has('invite_emails')).to.be.true;
      expect(signupForm.model.get('invite_emails')).to.eql([]);
    });

    after(function() {
      signupForm.model.unplug();
      signupForm.unplug(true);
    });
  });

  describe('validateUsername()', function() {
    var server, signupForm;

    before(function() {
      server = sinon.fakeServer.create();
      server.autoRespond = true;

      signupForm = new SignupForm({
        model: _.createModel('user')
      });

      signupForm.render();
    });

    it('should validate the username entered on the form and render the next step if it\'s validated.', function(done) {
      server.respondWith('POST', '/api/auth/username/validate/', function(req) {
        req.respond(200, {'Content-Type': 'application/json'}, '{"email": "name@example.com"}');
        done();
      });

      signupForm.model.set({
        'email': 'name@example.com',
        'signup_request_token': JWT_SIGNUP_TOKEN,
        'first_name': 'Elving',
        'last_name': 'Rodriguez',
        'full_name': 'Elving Rodriguez',
        'account_name': 'Blimp',
        'allow_signup': true,
        'signup_domains': ['example.com', 'example.net'],
        'invite_emails': ['elving@example.com', 'elving@example.net'],
        'signup_step': 8
      });

      signupForm.renderStep(8);
      signupForm.getAttributeElement('username').val('elving');
      signupForm.validateUsername();
    });

    after(function() {
      server.restore();
      signupForm.model.unplug();
      signupForm.unplug(true);
    });
  });

  describe('onSignupUsernameError()', function() {
    var signupForm;

    before(function() {
      signupForm = new SignupForm({
        model: _.createModel('user')
      });

      signupForm.render();
    });

    it('should display an error message.', function() {
      signupForm.renderStep(8);
      signupForm.onSignupUsernameError('error');
      expect(signupForm.getAttributeErrorElement('username').text()).to.equal('error');
    });

    after(function() {
      signupForm.model.unplug();
      signupForm.unplug(true);
    });
  });

  describe('validatePassword()', function() {
    var server, signupForm;

    before(function() {
      server = sinon.fakeServer.create();
      server.autoRespond = true;

      signupForm = new SignupForm({
        model: _.createModel('user')
      });

      signupForm.render();
    });

    it('should validate the password entered on the form and complete the signup process.', function(done) {
      server.respondWith('POST', '/api/auth/signup/', function(req) {
        req.respond(200, {'Content-Type': 'application/json'}, '{"email": "name@example.com"}');
        done();
      });

      signupForm.model.set({
        'email': 'name@example.com',
        'signup_request_token': JWT_SIGNUP_TOKEN,
        'first_name': 'Elving',
        'last_name': 'Rodriguez',
        'full_name': 'Elving Rodriguez',
        'account_name': 'Blimp',
        'allow_signup': true,
        'signup_domains': ['example.com', 'example.net'],
        'invite_emails': ['elving@example.com', 'elving@example.net'],
        'username': 'elving',
        'signup_step': 9
      });

      signupForm.renderStep(9);
      signupForm.getAttributeElement('password').val('elving1234');
      signupForm.validatePassword();
    });

    after(function() {
      server.restore();
      signupForm.model.unplug();
      signupForm.unplug(true);
    });
  });

  describe('onValidatePasswordError()', function() {
    var signupForm;

    before(function() {
      signupForm = new SignupForm({
        model: _.createModel('user')
      });

      signupForm.render();
    });

    it('should display an error message.', function() {
      signupForm.renderStep(9);
      signupForm.onValidatePasswordError('error');
      expect(signupForm.getAttributeErrorElement('password').text()).to.equal('error');
    });

    after(function() {
      signupForm.model.unplug();
      signupForm.unplug(true);
    });
  });
});
