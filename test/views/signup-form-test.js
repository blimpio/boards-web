describe('SignupForm', function() {
  var formView, server, renderStepSpy,
      User = Boards.getUser(),
      SignupForm = require('views/signup-form'),
      Connection = require('lib/connection');

  before(function() {
    console.log(SignupForm.prototype);
    $('#application').append('<form class="signup"></form>');

    Boards.Connection = new Connection({
      type: 'HTTP',
      httpUrl: ''
    });

    User.set('signup_step', 1, {silent: true});
  });

  beforeEach(function() {
    renderStepSpy = sinon.spy(SignupForm.prototype, 'renderStep');

    server = sinon.fakeServer.create();
    server.autoRespond = false;
    server.autoRespondAfter = 500;

    formView = new SignupForm({
      model: User
    });

    formView.listenTo(formView.model, 'change:signup_step', formView.onSignupStepChange);
    formView.render();
  });

  afterEach(function() {
    formView.stopListening(formView.model);
    SignupForm.prototype.renderStep.restore();
    server.restore();
  });

  after(function() {
    formView.remove();
    $('#application').empty();
  });

  it('should exist.', function() {
    expect(formView).to.exist;
  });

  it('should have a model.', function() {
    expect(formView.model).to.exist;
    expect(formView.model.name).to.equal('User');
  });

  describe('initialize', function() {
    it('should invoke renderStep.', function() {
      expect(renderStepSpy).to.have.been.calledOnce;
    });
  });

  describe('onSignupStepChange', function() {
    it('should invoke renderStep when the model triggers a change:signup_step event.', function() {
      renderStepSpy.reset();
      formView.onSignupStepChange(formView.model, 1);
      expect(renderStepSpy).to.have.been.calledOnce;
    });
  });

  describe('renderStep', function() {
    it('should render the given step.', function() {
      formView.renderStep(4);
      expect(formView.$('[data-step=4]')).to.exist;
    });
  });

  describe('validateEmail', function() {
    it('should validate the email entered on the form and render the next step if it\'s validated.', function(done) {
      var url = '/api/auth/signup_request/',
          contentType = {"Content-Type":"application/json"};

      formView.renderStep(1);
      formView.getAttributeElement('email').val('name@example.com');

      server.respondWith('POST', url, function(request) {
        request.respond(200, contentType, JSON.stringify(request.requestBody));
      });

      formView.validateEmail().done(function() {
        expect(formView.model.get('email')).to.equal('name@example.com');
        expect(formView.model.get('signup_step')).to.equal(2);
        console.log(formView.$el.html());
        expect(formView.$('[data-step=2]')).to.exist;
        done();
      }.bind(this));

      server.respond();
    });
  });

  describe('redirectToFirstStep', function() {
    it('should redirect to the first step.', function() {
      formView.model.set('signup_step', 3);
      formView.redirectToFirstStep();
      expect(formView.model.get('signup_step')).to.equal(1);
    });
  });

  describe('redirectToFourthStep', function() {
    it('should redirect to the fourth step.', function() {
      formView.renderStep(1);
      formView.redirectToFourthStep();
      expect(formView.$('[data-step=4]')).to.exist;
      expect(formView.model.get('signup_step')).to.equal(4);
    });
  });

  describe('validateFullName', function() {
    it('should validate the name entered on the form and render the next step if it\'s validated.', function() {
      formView.model.set({
        'email': 'name@example.com',
        'signup_request_token': JWT_TEST_TOKEN,
        'signup_step': 4
      });

      formView.getAttributeElement('full_name').val('Elving Rodriguez');
      formView.validateFullName();
      expect(formView.$('[data-step=5]')).to.exist;
      expect(formView.model.get('full_name')).to.equal('Elving Rodriguez');
    });
  });

  describe('validateAccountName', function() {
    it('should validate the account name entered on the form and render the next step if it\'s validated.', function() {
      formView.model.set({
        'email': 'name@example.com',
        'signup_request_token': JWT_TEST_TOKEN,
        'first_name': 'Elving',
        'last_name': 'Rodriguez',
        'full_name': 'Elving Rodriguez',
        'signup_step': 5
      });

      formView.getAttributeElement('account_name').val('Blimp');
      formView.validateAccountName();
      expect(formView.$('[data-step=6]')).to.exist;
      expect(formView.model.get('account_name')).to.equal('Blimp');
    });
  });

  describe('validateSignupDomains', function() {
    it('should validate the domains entered on the form and render the next step if it\'s validated.', function(done) {
      var url = '/api/auth/signup_domains/validate/',
          contentType = {"Content-Type":"application/json"};

      formView.model.set({
        'email': 'name@example.com',
        'signup_request_token': JWT_TEST_TOKEN,
        'first_name': 'Elving',
        'last_name': 'Rodriguez',
        'full_name': 'Elving Rodriguez',
        'account_name': 'Blimp',
        'signup_step': 6
      });

      server.respondWith('POST', url, function(request) {
        request.respond(200, contentType, JSON.stringify(request.requestBody));
      });

      formView.getAttributeElement('allow_signup').prop('checked', true);
      formView.getAttributeElement('signup_domains').val('example.com, example.net');

      formView.validateSignupDomains().done(function() {
        expect(formView.$('[data-step=7]')).to.exist;
        expect(formView.model.get('signup_domains')).to.eql(['example.com', 'example.net']);
        done();
      }.bind(this));

      server.respond();
    });
  });

  describe('skipSignupDomains', function() {
    it('should redirect to the seventh step.', function() {
      formView.renderStep(6);
      formView.skipSignupDomains();
      expect(formView.model.get('signup_step')).to.equal(7);
    });
  });

  describe('addOtherDomainInput', function() {
    it('should add a domain input field.', function() {
      var select;

      formView.model.set({
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

      select = formView.$('select.signup__invitation-domains')[0];
      select.value = 'other';

      formView.addOtherDomainInput({currentTarget: select});
      expect(formView.$('input.signup__invitation-domain-input')).to.exist;
    });
  });

  describe('addInvitationRow', function() {
    it('should add an invitation row.', function() {
      formView.renderStep(7);
      expect(formView.$('input.signup__invitation-field').length).to.equal(3);
      formView.addInvitationRow();
      expect(formView.$('input.signup__invitation-field').length).to.equal(4);
    });
  });

  describe('removeInvitationRow', function() {
    it('should remove an invitation row.', function() {
      formView.renderStep(7);

      expect(formView.$('input.signup__invitation-field').length).to.equal(3);

      formView.removeInvitationRow({
        currentTarget: formView.$('button[data-action=removeInvitationRow]')[0]
      });

      expect(formView.$('input.signup__invitation-field').length).to.equal(2);
    });
  });

  describe('validateInvitations', function() {
    it('should validate the email invites entered on the form and render the next step if it\'s validated (with select).', function() {
      formView.model.set({
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

      formView.$('input.signup__invitation-field').eq(0).val('elving');
      formView.$('input.signup__invitation-field').eq(1).val('elving');
      formView.$('select.signup__invitation-domains').find('option').eq(1).prop('selected', true);
      formView.validateInvitations();
      expect(formView.model.get('invite_emails')).to.include('elving@example.com');
      expect(formView.model.get('invite_emails')).to.include('elving@example.net');
    });

    it('should validate the email invites entered on the form and render the next step if it\'s validated (with inputs).', function() {
      var select;

      formView.model.set({
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

      select = formView.$('select.signup__invitation-domains')[1];
      select.value = 'other';

      formView.$('input.signup__invitation-field').eq(0).val('elving');
      formView.$('input.signup__invitation-field').eq(1).val('elving');
      formView.$('select.signup__invitation-domains').eq(0).find('option').eq(0).prop('selected', true);
      formView.addOtherDomainInput({currentTarget: select});
      formView.$('input.signup__invitation-domain-input').eq(0).val('somedomain.com');
      formView.validateInvitations();
      expect(formView.model.get('invite_emails')).to.include('elving@example.com');
      expect(formView.model.get('invite_emails')).to.include('elving@somedomain.com');
    });

    it('should set an \'invite_emails\' attribute even if no invites were added in the form.', function() {
      var select;

      formView.model.set({
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

      formView.validateInvitations();
      expect(formView.model.has('invite_emails')).to.be.true;
      expect(formView.model.get('invite_emails')).to.eql([]);
    });
  });

  describe('validateUsername', function() {
    it('should validate the username entered on the form and render the next step if it\'s validated.', function(done) {
      var url = '/api/auth/username/validate/',
          contentType = {"Content-Type":"application/json"};

      formView.model.set({
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

      server.respondWith('POST', url, function(request) {
        request.respond(200, contentType, JSON.stringify(request.requestBody));
      });

      formView.getAttributeElement('username').val('elving');

      formView.validateUsername().done(function() {
        expect(formView.$('[data-step=9]')).to.exist;
        expect(formView.model.get('username')).to.equal('elving');
        done();
      }.bind(this));

      server.respond();
    });
  });

  describe('validatePassword', function() {
    it('should validate the password entered on the form and complete the signup process.', function(done) {
      var url = '/api/auth/signup/',
          contentType = {"Content-Type":"application/json"};

      formView.model.set({
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

      server.respondWith('POST', url, function(request) {
        request.respond(200, contentType, JSON.stringify(request.requestBody));
      });

      formView.getAttributeElement('password').val('elving1234');

      formView.validatePassword().done(function() {
        expect(formView.model.has('password')).to.be.false;
        expect(formView.model.has('signup_request_token')).to.be.false;
        done();
      }.bind(this));

      server.respond();
    });
  });
});
