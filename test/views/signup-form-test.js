describe('SignupForm', function() {
  var SignupForm = require('views/signup-form');
  var Connection = require('lib/connection');

  before(function() {
    jQuery.ajaxSetup({
      processData: false
    });

    this.token = 'eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJ0eXBlIjogIlNpZ251cFJlcXVlc3QiLCAiZW1haWwiOiAibmFtZUBleGFtcGxlLmNvbSJ9.PTbp7CGAJ3C4woorlCeWHRKqkcP7ZuiuWxn0FEiK9-0';

    this.Application = require('application');

    this.Application.connection = new Connection({
      type: 'HTTP',
      httpUrl: ''
    });

    $('#application').append('<form class="signup"></form>');
  });

  beforeEach(function() {
    this.renderStepSpy = sinon.spy(SignupForm.prototype, 'renderStep');
    this.onSignupStepChangeSpy = sinon.spy(SignupForm.prototype, 'onSignupStepChange');

    this.server = sinon.fakeServer.create();
    this.server.autoRespond = false;
    this.server.autoRespondAfter = 500;

    this.form = new SignupForm({
      model: require('models/user')
    });

    this.form.render();
  });

  afterEach(function() {
    SignupForm.prototype.renderStep.restore();
    SignupForm.prototype.onSignupStepChange.restore();

    this.server.restore();
  });

  it('should exist.', function() {
    expect(this.form).to.exist;
  });

  it('should have a name.', function() {
    expect(this.form.name).to.equal('SignupForm');
  });

  it('should have a model.', function() {
    expect(this.form.model).to.exist;
    expect(this.form.model.name).to.equal('User');
  });

  describe('SignupForm.initialize', function() {
    it('should invoke SignupForm.onSignupStepChange when the model triggers a change:signup_step event.', function() {
      this.form.model.set('signup_step', 2);
      expect(this.onSignupStepChangeSpy).to.have.been.calledOnce;
    });

    it('should invoke SignupForm.renderStep.', function() {
      expect(this.renderStepSpy).to.have.been.calledOnce;
    });
  });

  describe('SignupForm.onSignupStepChange', function() {
    it('should invoke SignupForm.renderStep when the model triggers a change:signup_step event.', function() {
      this.renderStepSpy.reset();
      this.form.onSignupStepChange(this.form.model, 1);
      expect(this.renderStepSpy).to.have.been.calledOnce;
    });
  });

  describe('SignupForm.renderStep', function() {
    it('should render the given step.', function() {
      this.form.renderStep(4);
      expect(this.form.find('[data-step=4]')).to.exist;
    });
  });

  describe('SignupForm.validateEmail', function() {
    it('should validate the email entered on the form and render the next step if it\'s validated.', function(done) {
      var url = '/api/auth/signup_request/',
          contentType = {"Content-Type":"application/json"};

      this.form.renderStep(1);
      this.form.setAttribute('email', 'name@example.com');

      this.server.respondWith('POST', url, function(request) {
        request.respond(200, contentType, JSON.stringify(request.requestBody));
      });

      this.form.validateEmail().done(function() {
        expect(this.form.model.get('email')).to.equal('name@example.com');
        expect(this.form.model.get('signup_step')).to.equal(2);
        expect(this.form.find('[data-step=2]')).to.exist;
        done();
      }.bind(this));

      this.server.respond();
    });
  });

  describe('SignupForm.redirectToFirstStep', function() {
    it('should redirect to the first step.', function() {
      this.form.model.set('signup_step', 3);
      this.form.redirectToFirstStep();
      expect(this.form.model.get('signup_step')).to.equal(1);
    });
  });

  describe('SignupForm.redirectToFourthStep', function() {
    it('should redirect to the fourth step.', function() {
      this.form.renderStep(1);
      this.form.redirectToFourthStep();
      expect(this.form.find('[data-step=4]')).to.exist;
      expect(this.form.model.get('signup_step')).to.equal(4);
    });
  });

  describe('SignupForm.validateFullName', function() {
    it('should validate the name entered on the form and render the next step if it\'s validated.', function() {
      this.form.model.set({
        'email': 'name@example.com',
        'signup_request_token': this.token,
        'signup_step': 4
      });

      this.form.setAttribute('full_name', 'Elving Rodriguez');
      this.form.validateFullName();
      expect(this.form.find('[data-step=5]')).to.exist;
      expect(this.form.model.get('full_name')).to.equal('Elving Rodriguez');
    });
  });

  describe('SignupForm.validateAccountName', function() {
    it('should validate the account name entered on the form and render the next step if it\'s validated.', function() {
      this.form.model.set({
        'email': 'name@example.com',
        'signup_request_token': this.token,
        'first_name': 'Elving',
        'last_name': 'Rodriguez',
        'full_name': 'Elving Rodriguez',
        'signup_step': 5
      });

      this.form.setAttribute('account_name', 'Blimp');
      this.form.validateAccountName();
      expect(this.form.find('[data-step=6]')).to.exist;
      expect(this.form.model.get('account_name')).to.equal('Blimp');
    });
  });

  describe('SignupForm.validateSignupDomains', function() {
    it('should validate the domains entered on the form and render the next step if it\'s validated.', function(done) {
      var url = '/api/auth/signup_domains/validate/',
          contentType = {"Content-Type":"application/json"};

      this.form.model.set({
        'email': 'name@example.com',
        'signup_request_token': this.token,
        'first_name': 'Elving',
        'last_name': 'Rodriguez',
        'full_name': 'Elving Rodriguez',
        'account_name': 'Blimp',
        'signup_step': 6
      });

      this.server.respondWith('POST', url, function(request) {
        request.respond(200, contentType, JSON.stringify(request.requestBody));
      });

      this.form.setAttribute('allow_signup', true);
      this.form.setAttribute('signup_domains', 'example.com, example.net');

      this.form.validateSignupDomains().done(function() {
        expect(this.form.find('[data-step=7]')).to.exist;
        expect(this.form.model.get('signup_domains')).to.eql(['example.com', 'example.net']);
        done();
      }.bind(this));

      this.server.respond();
    });
  });

  describe('SignupForm.skipSignupDomains', function() {
    it('should redirect to the seventh step.', function() {
      this.form.renderStep(6);
      this.form.skipSignupDomains();
      expect(this.form.find('[data-step=7]')).to.exist;
      expect(this.form.model.get('signup_step')).to.equal(7);
    });
  });

  describe('SignupForm.addOtherDomainInput', function() {
    it('should add a domain input field.', function() {
      var select;

      this.form.model.set({
        'email': 'name@example.com',
        'signup_request_token': this.token,
        'first_name': 'Elving',
        'last_name': 'Rodriguez',
        'full_name': 'Elving Rodriguez',
        'account_name': 'Blimp',
        'allow_signup': true,
        'signup_domains': ['example.com', 'example.net'],
        'signup_step': 7
      });

      select = this.form.find('select.signup__invitation-domains')[0];
      select.value = 'other';

      this.form.addOtherDomainInput({currentTarget: select});
      expect(this.form.find('input.signup__invitation-domain-input')).to.exist;
    });
  });

  describe('SignupForm.addInvitationRow', function() {
    it('should add an invitation row.', function() {
      this.form.renderStep(7);
      expect(this.form.find('input.signup__invitation-field').length).to.equal(3);
      this.form.addInvitationRow();
      expect(this.form.find('input.signup__invitation-field').length).to.equal(4);
    });
  });

  describe('SignupForm.removeInvitationRow', function() {
    it('should remove an invitation row.', function() {
      this.form.renderStep(7);

      expect(this.form.find('input.signup__invitation-field').length).to.equal(3);

      this.form.removeInvitationRow({
        currentTarget: this.form.find('button[data-action=removeInvitationRow]')[0]
      });

      expect(this.form.find('input.signup__invitation-field').length).to.equal(2);
    });
  });

  describe('SignupForm.validateInvitations', function() {
    it('should validate the email invites entered on the form and render the next step if it\'s validated (with select).', function() {
      this.form.model.set({
        'email': 'name@example.com',
        'signup_request_token': this.token,
        'first_name': 'Elving',
        'last_name': 'Rodriguez',
        'full_name': 'Elving Rodriguez',
        'account_name': 'Blimp',
        'allow_signup': true,
        'signup_domains': ['example.com', 'example.net'],
        'signup_step': 7
      });

      this.form.find('input.signup__invitation-field').eq(0).val('elving');
      this.form.find('input.signup__invitation-field').eq(1).val('elving');
      this.form.find('select.signup__invitation-domains').find('option').eq(1).prop('selected', true);
      this.form.validateInvitations();
      expect(this.form.model.get('invite_emails')).to.include('elving@example.com');
      expect(this.form.model.get('invite_emails')).to.include('elving@example.net');
    });

    it('should validate the email invites entered on the form and render the next step if it\'s validated (with inputs).', function() {
      var select;

      this.form.model.set({
        'email': 'name@example.com',
        'signup_request_token': this.token,
        'first_name': 'Elving',
        'last_name': 'Rodriguez',
        'full_name': 'Elving Rodriguez',
        'account_name': 'Blimp',
        'allow_signup': true,
        'signup_domains': ['example.com', 'example.net'],
        'signup_step': 7
      });

      select = this.form.find('select.signup__invitation-domains')[1];
      select.value = 'other';

      this.form.find('input.signup__invitation-field').eq(0).val('elving');
      this.form.find('input.signup__invitation-field').eq(1).val('elving');
      this.form.find('select.signup__invitation-domains').eq(0).find('option').eq(0).prop('selected', true);
      this.form.addOtherDomainInput({currentTarget: select});
      this.form.find('input.signup__invitation-domain-input').eq(0).val('somedomain.com');
      this.form.validateInvitations();
      expect(this.form.model.get('invite_emails')).to.include('elving@example.com');
      expect(this.form.model.get('invite_emails')).to.include('elving@somedomain.com');
    });
  });

  describe('SignupForm.validateUsername', function() {
    it('should validate the username entered on the form and render the next step if it\'s validated.', function(done) {
      var url = '/api/auth/username/validate/',
          contentType = {"Content-Type":"application/json"};

      this.form.model.set({
        'email': 'name@example.com',
        'signup_request_token': this.token,
        'first_name': 'Elving',
        'last_name': 'Rodriguez',
        'full_name': 'Elving Rodriguez',
        'account_name': 'Blimp',
        'allow_signup': true,
        'signup_domains': ['example.com', 'example.net'],
        'invite_emails': ['elving@example.com', 'elving@example.net'],
        'signup_step': 8
      });

      this.server.respondWith('POST', url, function(request) {
        request.respond(200, contentType, JSON.stringify(request.requestBody));
      });

      this.form.setAttribute('username', 'elving');

      this.form.validateUsername().done(function() {
        expect(this.form.find('[data-step=9]')).to.exist;
        expect(this.form.model.get('username')).to.equal('elving');
        done();
      }.bind(this));

      this.server.respond();
    });
  });

  describe('SignupForm.validatePassword', function() {
    it('should validate the password entered on the form and complete the signup process.', function(done) {
      var url = '/api/auth/signup/',
          contentType = {"Content-Type":"application/json"};

      this.form.model.set({
        'email': 'name@example.com',
        'signup_request_token': this.token,
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

      this.server.respondWith('POST', url, function(request) {
        request.respond(200, contentType, JSON.stringify(request.requestBody));
      });

      this.form.setAttribute('password', 'elving1234');

      this.form.validatePassword().done(function() {
        expect(this.form.model.has('password')).to.be.false;
        expect(this.form.model.has('signup_request_token')).to.be.false;
        done();
      }.bind(this));

      this.server.respond();
    });
  });

});
