module.exports = Zeppelin.FormView.extend({
  el: 'form.signup',

  name: 'SignupForm',

  form: 'form.signup',

  events: {
    'click button[data-action=validateEmail]': 'validateEmail',
    'click button[data-action=redirectToFirstStep]': 'redirectToFirstStep',
    'click button[data-action=redirectToFourthStep]': 'redirectToFourthStep',
    'click button[data-action=validateFullName]': 'validateFullName',
    'click button[data-action=validateAccountName]': 'validateAccountName',
    'change select.signup__invitation-domains': 'addOtherDomainInput',
    'click button[data-action="removeInvitationRow"]': 'removeInvitationRow',
    'click button[data-action=validateSignupDomains]': 'validateSignupDomains',
    'click button[data-action=skipSignupDomains]': 'skipSignupDomains',
    'click button[data-action=addInvitationRow]': 'addInvitationRow',
    'click button[data-action=validateInvitations]': 'validateInvitations',
    'click button[data-action=validateUsername]': 'validateUsername',
    'click button[data-action=validatePassword]': 'validatePassword'
  },

  bindings: {
    'change:signup_step': {
      callback: 'onSignupStepChange'
    },

    'user:signup-request:error': {
      callback: 'onSignupRequestError'
    },

    'user:signup-domains:error': {
      callback: 'onSignupDomainsError'
    },

    'user:signup-username:error': {
      callback: 'onSignupUsernameError'
    },

    'user:signup:error': {
      callback: 'onValidatePasswordError'
    }
  },

  model: App.User,

  context: function() {
    return this.model.getPresenters(['email', 'signup_domains']);
  },

  initialize: function() {
    this.renderStep();
    return this;
  },

  onSubmit: function(event) {
    event.preventDefault();
    this[this.$('[data-next-step]').data('action')]();
    return this;
  },

  onSignupStepChange: function(element, model, step) {
    this.renderStep(step);
    return this;
  },

  renderStep: function(step) {
    var nextStep;

    step = step || this.model.get('signup_step') || 1;
    nextStep = 'signup-step-' + step;
    if (this.model.isWaitingForEmailValidation()) nextStep = 'signup-step-2';
    this.render(require('templates/signup-steps/' + nextStep));
    if (step === 7) this.$('input.signup__invitation-field').first().focus();

    return this;
  },

  validateEmail: function(event) {
    this.setAttribute('email');
    if (!this.model.validationError) this.model.requestSignup();
    return this;
  },

  onSignupRequestError: function(element, error) {
    this.getAttributeErrorElement('email').text(error);
    return this;
  },

  redirectToFirstStep: function(event) {
    this.model.updateSignupStep(1);
    this.publish('router:navigate', '/signup/');
    return this;
  },

  redirectToFourthStep: function(event) {
    this.model.updateSignupStep(4);
    return this;
  },

  validateFullName: function(event) {
    this.setAttribute('full_name');
    if (!this.model.validationError) this.model.updateSignupStep(5);
    return this;
  },

  validateAccountName: function(event) {
    this.setAttribute('account_name');
    if (!this.model.validationError) this.model.updateSignupStep(6);
    return this;
  },

  validateSignupDomains: function(event) {
    var domains = [],
        hasInvalidDomains = false;

    this.setAttribute('allow_signup');

    _.forEach(this.getAttributeValue('signup_domains').split(','), function(domain) {
      var error = 'Provide a valid domain name.';

      domain = $.trim(domain);

      if (!Z.Validations.isDomainName(domain)) {
        hasInvalidDomains = true;
        if (domain) error = domain + ' is not a valid domain name.'
        this.getAttributeErrorElement('signup_domains').text(error);
        return false;
      }

      domains.push(domain);
    }.bind(this));

    if (!hasInvalidDomains) this.model.validateSignupEmailDomain(domains)
    return this;
  },

  onSignupDomainsError: function(element, error) {
    this.getAttributeErrorElement('signup_domains').text(error);
    return this;
  },

  skipSignupDomains: function(event) {
    this.model.updateSignupStep(8);
    return this;
  },

  addInvitationRow: function(event) {
    this.registerElement('invitations', 'div.signup__invitations');
    this.$invitations.append(require('templates/signup-steps/signup-invitation-row')());
    this.$('input.signup__invitation-field').last().focus();
    return this;
  },

  removeInvitationRow: function(event) {
    $(event.currentTarget).parent().remove();
    return this;
  },

  addOtherDomainInput: function(event) {
    var $select = $(event.currentTarget);

    if ($select.val() === 'other') $select.after(this.renderTemplate(
      require('templates/signup-steps/signup-invitation-domain-input')
    )).next().focus().end().remove();

    return this;
  },

  validateInvitations: function(event) {
    var $error = this.getAttributeErrorElement('invite_emails'),
        invitations = [],
        $invitations = this.$('div.signup__invitation-row'),
        invitationsError = false;

    $error.text('');

    _.forEach($invitations, function(element) {
      var invitation = $(element).find('input.signup__invitation-field').val();

      if (invitation) {
        invitation += '@' + $(element).find('[data-domain-source=true]').val();
        invitations.push(invitation);
      }
    });

    if (invitations.length) {
      _.forEach(invitations, function(invitation) {
        if (!Z.Validations.isEmail(invitation)) {
          invitationsError = true;
          $error.text('One or more emails are invalid.');
          return false;
        }
      });
    }

    if (!invitationsError) {
      if (invitations) {
        this.model.set('invite_emails', invitations).updateSignupStep(8);
      } else {
        this.model.set('invite_emails', []).updateSignupStep(8);
      }
    }

    return this;
  },

  validateUsername: function(event) {
    this.setAttribute('username');
    if (!this.model.validationError) this.model.validateUsername();
    return this;
  },

  onSignupUsernameError: function(element, error) {
    this.getAttributeErrorElement('username').text(error);
    return this;
  },

  validatePassword: function(event) {
    this.setAttribute('password');
    if (!this.model.validationError) this.model.signup();
    return this;
  },

  onValidatePasswordError: function(element, error) {
    this.getAttributeErrorElement('password').text(error);
    return this;
  }
});
