describe('SignupForm', function() {
  var SignupForm = require('views/signup-form');

  before(function() {
    _.getModel('User').set('signup_step', 1, {silent: true});
  });

  beforeEach(function() {
    $('#application').html('<form class="signup"></form>');

    this.server = sinon.fakeServer.create();
    this.server.autoRespond = false;
    this.server.autoRespondAfter = 500;

    this.renderStepSpy = sinon.spy(SignupForm.prototype, 'renderStep');

    this.SignupForm = new SignupForm({
      model: _.getModel('User')
    });

    this.SignupForm.render();
  });

  afterEach(function() {
    this.server.restore();
    delete this.server;
    SignupForm.prototype.renderStep.restore();
    this.SignupForm.remove();
    delete this.SignupForm;
    _.getModel('User').clear();
  });

  it('should exist.', function() {
    expect(this.SignupForm).to.exist;
  });

  it('should have a name property.', function() {
    expect(this.SignupForm.name).to.exist;
    expect(this.SignupForm.name).to.equal('SignupForm');
  });

  it('should have an events property.', function() {
    expect(this.SignupForm.events).to.exist;
  });

  it('should have an bindings property.', function() {
    expect(this.SignupForm.bindings).to.exist;
  });

  it('should have a model.', function() {
    expect(this.SignupForm.model).to.exist;
    expect(this.SignupForm.model.name).to.equal('User');
  });

  describe('context', function() {
    it('should return the template context.', function() {
      var context = this.SignupForm.context();
      expect(context).to.exist;
      expect(_.keys(context)).to.eql(['email', 'signup_domains']);
    });
  });

  describe('onSubmit', function() {
    it('should try to validate the current step and render the next one.', function() {
      this.SignupForm.model.set({
        'email': 'name@example.com',
        'signup_request_token': JWT_TEST_TOKEN,
        'signup_step': 4
      });

      this.SignupForm.renderStep(4);
      this.SignupForm.getAttributeElement('full_name').val('Elving Rodriguez');
      this.SignupForm.onSubmit({preventDefault: function(){}});
      expect(this.SignupForm.model.get('signup_step')).to.equal(5);
    });
  });

  describe('onSignupStepChange', function() {
    it('should invoke renderStep when the model triggers a change:signup_step event.', function() {
      this.renderStepSpy.reset();
      this.SignupForm.onSignupStepChange(this.SignupForm.model, 1);
      expect(this.renderStepSpy).to.have.been.calledOnce;
    });
  });

  describe('renderStep', function() {
    it('should render the given step.', function() {
      this.SignupForm.renderStep(4);
      expect(this.SignupForm.$('[data-step=4]')).to.exist;
    });
  });

  describe('validateEmail', function() {
    it('should validate the email entered on the form and render the next step if it\'s validated.', function(done) {
      this.SignupForm.renderStep(1);
      this.SignupForm.getAttributeElement('email').val('name@example.com');

      this.server.respondWith('POST', '/api/auth/signup_request/', function(req) {
        req.respond(200, {'Content-Type': 'application/json'}, '{"email": "name@example.com"}');
        done();
      });

      this.SignupForm.validateEmail();
      this.server.respond();
    });
  });

  describe('onSignupRequestError', function() {
    it('should display an error message.', function() {
      this.SignupForm.renderStep(1);
      this.SignupForm.onSignupRequestError('error');
      expect(this.SignupForm.getAttributeErrorElement('email').text()).to.equal('error');
    });
  });

  describe('redirectToFirstStep', function() {
    it('should redirect to the first step.', function() {
      this.SignupForm.model.set('signup_step', 3);
      this.SignupForm.redirectToFirstStep();
      expect(this.SignupForm.model.get('signup_step')).to.equal(1);
    });
  });

  describe('redirectToFourthStep', function() {
    it('should redirect to the fourth step.', function() {
      this.SignupForm.renderStep(1);
      this.SignupForm.redirectToFourthStep();
      expect(this.SignupForm.model.get('signup_step')).to.equal(4);
    });
  });

  describe('validateFullName', function() {
    it('should validate the name entered on the form and render the next step if it\'s validated.', function() {
      this.SignupForm.model.set({
        'email': 'name@example.com',
        'signup_request_token': JWT_TEST_TOKEN,
        'signup_step': 4
      });

      this.SignupForm.renderStep(4);
      this.SignupForm.getAttributeElement('full_name').val('Elving Rodriguez');
      this.SignupForm.validateFullName();
      expect(this.SignupForm.model.get('full_name')).to.equal('Elving Rodriguez');
      expect(this.SignupForm.model.get('signup_step')).to.equal(5);
    });
  });

  describe('validateAccountName', function() {
    it('should validate the account name entered on the form and render the next step if it\'s validated.', function() {
      this.SignupForm.model.set({
        'email': 'name@example.com',
        'signup_request_token': JWT_TEST_TOKEN,
        'first_name': 'Elving',
        'last_name': 'Rodriguez',
        'full_name': 'Elving Rodriguez',
        'signup_step': 5
      });

      this.SignupForm.renderStep(5);
      this.SignupForm.getAttributeElement('account_name').val('Blimp');
      this.SignupForm.validateAccountName();
      expect(this.SignupForm.model.get('signup_step')).to.equal(6);
      expect(this.SignupForm.model.get('account_name')).to.equal('Blimp');
    });
  });

  describe('validateSignupDomains', function() {
    it('should validate the domains entered on the form and render the next step if it\'s validated.', function(done) {
      this.server.respondWith('POST', '/api/auth/signup_domains/validate/', function(req) {
        req.respond(200, {'Content-Type': 'application/json'}, '{"email": "name@example.com"}');
        done();
      });

      this.SignupForm.model.set({
        'email': 'name@example.com',
        'signup_request_token': JWT_TEST_TOKEN,
        'first_name': 'Elving',
        'last_name': 'Rodriguez',
        'full_name': 'Elving Rodriguez',
        'account_name': 'Blimp',
        'signup_step': 6
      });

      this.SignupForm.renderStep(6);
      this.SignupForm.getAttributeElement('allow_signup').prop('checked', true);
      this.SignupForm.getAttributeElement('signup_domains').val('example.com, example.net');
      this.SignupForm.validateSignupDomains();
      this.server.respond();
    });
  });

  describe('onSignupDomainsError', function() {
    it('should dispplay an error message.', function() {
      this.SignupForm.renderStep(6);
      this.SignupForm.onSignupDomainsError('error');
      expect(this.SignupForm.getAttributeErrorElement('signup_domains').text()).to.equal('error');
    });
  });

  describe('skipSignupDomains', function() {
    it('should redirect to the seventh step.', function() {
      this.SignupForm.renderStep(6);
      this.SignupForm.skipSignupDomains();
      expect(this.SignupForm.model.get('signup_step')).to.equal(7);
    });
  });

  describe('addOtherDomainInput', function() {
    it('should add a domain input field.', function() {
      var select;

      this.SignupForm.model.set({
        'email': 'name@example.com',
        'signup_request_token': JWT_TEST_TOKEN,
        'first_name': 'Elving',
        'last_name': 'Rodriguez',
        'full_name': 'Elving Rodriguez',
        'account_name': 'Blimp',
        'allow_signup': true,
        'signup_domains': ['example.com', 'example.net'],
        'signup_step': 7
      });

      this.SignupForm.renderStep(7);
      select = this.SignupForm.$('select.signup__invitation-domains')[0];
      select.value = 'other';
      this.SignupForm.addOtherDomainInput({currentTarget: select});
      expect(this.SignupForm.$('input.signup__invitation-domain-input')).to.exist;
    });
  });

  describe('addInvitationRow', function() {
    it('should add an invitation row.', function() {
      this.SignupForm.renderStep(7);
      expect(this.SignupForm.$('input.signup__invitation-field').length).to.equal(3);
      this.SignupForm.addInvitationRow();
      expect(this.SignupForm.$('input.signup__invitation-field').length).to.equal(4);
    });
  });

  describe('removeInvitationRow', function() {
    it('should remove an invitation row.', function() {
      this.SignupForm.renderStep(7);
      expect(this.SignupForm.$('input.signup__invitation-field').length).to.equal(3);
      this.SignupForm.removeInvitationRow({
        currentTarget: this.SignupForm.$('button[data-action=removeInvitationRow]')[0]
      });
      expect(this.SignupForm.$('input.signup__invitation-field').length).to.equal(2);
    });
  });

  describe('validateInvitations', function() {
    it('should validate the email invites entered on the form and render the next step if it\'s validated (with select).', function() {
      this.SignupForm.model.set({
        'email': 'name@example.com',
        'signup_request_token': JWT_TEST_TOKEN,
        'first_name': 'Elving',
        'last_name': 'Rodriguez',
        'full_name': 'Elving Rodriguez',
        'account_name': 'Blimp',
        'allow_signup': true,
        'signup_domains': ['example.com', 'example.net'],
        'signup_step': 7
      });

      this.SignupForm.renderStep(7);
      this.SignupForm.$('input.signup__invitation-field').eq(0).val('elving');
      this.SignupForm.$('input.signup__invitation-field').eq(1).val('elving');
      this.SignupForm.$('select.signup__invitation-domains').find('option').eq(1).prop('selected', true);
      this.SignupForm.validateInvitations();
      expect(this.SignupForm.model.get('invite_emails')).to.include('elving@example.com');
      expect(this.SignupForm.model.get('invite_emails')).to.include('elving@example.net');
    });

    it('should validate the email invites entered on the form and render the next step if it\'s validated (with inputs).', function() {
      var select;

      this.SignupForm.model.set({
        'email': 'name@example.com',
        'signup_request_token': JWT_TEST_TOKEN,
        'first_name': 'Elving',
        'last_name': 'Rodriguez',
        'full_name': 'Elving Rodriguez',
        'account_name': 'Blimp',
        'allow_signup': true,
        'signup_domains': ['example.com', 'example.net'],
        'signup_step': 7
      });

      this.SignupForm.renderStep(7);
      select = this.SignupForm.$('select.signup__invitation-domains')[1];
      select.value = 'other';
      this.SignupForm.$('input.signup__invitation-field').eq(0).val('elving');
      this.SignupForm.$('input.signup__invitation-field').eq(1).val('elving');
      this.SignupForm.$('select.signup__invitation-domains').eq(0).find('option').eq(0).prop('selected', true);
      this.SignupForm.addOtherDomainInput({currentTarget: select});
      this.SignupForm.$('input.signup__invitation-domain-input').eq(0).val('somedomain.com');
      this.SignupForm.validateInvitations();
      expect(this.SignupForm.model.get('invite_emails')).to.include('elving@example.com');
      expect(this.SignupForm.model.get('invite_emails')).to.include('elving@somedomain.com');
    });

    it('should set an \'invite_emails\' attribute even if no invites were added in the form.', function() {
      var select;

      this.SignupForm.model.set({
        'email': 'name@example.com',
        'signup_request_token': JWT_TEST_TOKEN,
        'first_name': 'Elving',
        'last_name': 'Rodriguez',
        'full_name': 'Elving Rodriguez',
        'account_name': 'Blimp',
        'allow_signup': true,
        'signup_domains': ['example.com', 'example.net'],
        'signup_step': 7
      });

      this.SignupForm.renderStep(7);
      this.SignupForm.validateInvitations();
      expect(this.SignupForm.model.has('invite_emails')).to.be.true;
      expect(this.SignupForm.model.get('invite_emails')).to.eql([]);
    });
  });

  describe('validateUsername', function() {
    it('should validate the username entered on the form and render the next step if it\'s validated.', function(done) {
      this.server.respondWith('POST', '/api/auth/username/validate/', function(req) {
        req.respond(200, {'Content-Type': 'application/json'}, '{"email": "name@example.com"}');
        done();
      });

      this.SignupForm.model.set({
        'email': 'name@example.com',
        'signup_request_token': JWT_TEST_TOKEN,
        'first_name': 'Elving',
        'last_name': 'Rodriguez',
        'full_name': 'Elving Rodriguez',
        'account_name': 'Blimp',
        'allow_signup': true,
        'signup_domains': ['example.com', 'example.net'],
        'invite_emails': ['elving@example.com', 'elving@example.net'],
        'signup_step': 8
      });

      this.SignupForm.renderStep(8);
      this.SignupForm.getAttributeElement('username').val('elving');
      this.SignupForm.validateUsername();
      this.server.respond();
    });
  });

  describe('onSignupUsernameError', function() {
    it('should display an error message.', function() {
      this.SignupForm.renderStep(8);
      this.SignupForm.onSignupUsernameError('error');
      expect(this.SignupForm.getAttributeErrorElement('username').text()).to.equal('error');
    });
  });

  describe('validatePassword', function() {
    it('should validate the password entered on the form and complete the signup process.', function(done) {
      this.server.respondWith('POST', '/api/auth/signup/', function(req) {
        req.respond(200, {'Content-Type': 'application/json'}, '{"email": "name@example.com"}');
        done();
      });

      this.SignupForm.model.set({
        'email': 'name@example.com',
        'signup_request_token': JWT_TEST_TOKEN,
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

      this.SignupForm.renderStep(9);
      this.SignupForm.getAttributeElement('password').val('elving1234');
      this.SignupForm.validatePassword();
      this.server.respond();
    });
  });

  describe('onValidatePasswordError', function() {
    it('should display an error message.', function() {
      this.SignupForm.renderStep(9);
      this.SignupForm.onValidatePasswordError('error');
      expect(this.SignupForm.getAttributeErrorElement('password').text()).to.equal('error');
    });
  });
});
