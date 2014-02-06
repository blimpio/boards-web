module.exports = Zeppelin.FormView.extend({
  el: 'form.signup',

  name: 'SignupForm',

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

  saveOnSubmit: false,

  initialize: function() {
    this.model.validations = {};
    this.listenTo(this.model, 'change:signup_step', this.onSignupStepChange);
    this.renderStep();
  },

  onSignupStepChange: function(model, step) {
    this.renderStep(step);
  },

  renderStep: function(step) {
    step = step || this.model.get('signup_step');

    var nextStep;

    if (this.model.isWaitingForEmailValidation()) {
      nextStep = 'signup-step-2';
    } else {
      nextStep = 'signup-step-' + step;
    }

    this.renderToContainer(require('templates/' + nextStep));
    return this;
  },

  validateEmail: function(event) {
    if (!this.model.hasValidation('email')) {
      this.model.addValidation('email', [{
        required: true,
        message: 'An email is required to authenticate you.'
      }, {
        isEmail: true,
        message: 'Provide a valid email.'
      }]);
    }

    this.model.setValidate('email', this.getAttribute('email'));

    if (!this.model.validationError) {
      return this.model.requestSignup().done(function(data) {
        this.model.set(data);
        this.model.updateSignupStep(2);
      }.bind(this)).fail(function(error) {
        this.find('[data-model-attribute-error=email]').show().text(error.email);
      }.bind(this));
    }

    return this;
  },

  redirectToFirstStep: function(event) {
    this.model.setSilent('signup_step', 1);
    this.model.updateCache();
    this.publish('router:redirect', 'signup');
    return this;
  },

  redirectToFourthStep: function(event) {
    this.model.updateSignupStep(4);
    return this;
  },

  validateFullName: function(event) {
    var name = this.getAttribute('full_name');
    var nameSplit = name.split(' ');

    if (!this.model.hasValidation('full_name')) {
      this.model.addValidation('full_name', function(name) {
        if (!name) {
          return 'Your name is required to authenticate you.';
        } else if (!name.split(' ')[1]) {
          return 'Enter your full name.';
        }
      });
    }

    this.model.setValidate('full_name', name);

    if (!this.model.validationError) {
      this.model.set({
        last_name: nameSplit[1],
        first_name: nameSplit[0]
      }).addValidation('account_name', {
        require: true,
        message: 'An account name is required to authenticate you.'
      });

      this.model.updateSignupStep(5);
    }

    return this;
  },

  validateAccountName: function(event) {
    var accountName = this.getAttribute('account_name');

    if (!this.model.hasValidation('account_name')) {
      this.model.addValidation('account_name', function(name) {
        if (!name) {
          return 'An account name is required to authenticate you.';
        }
      });
    }

    this.model.setValidate('account_name', accountName);

    if (!this.model.validationError) {
      this.model.updateSignupStep(6);
    }

    return this;
  },

  addOtherDomainInput: function(event) {
    var $select = $(event.currentTarget);

    if ($select.val() === 'other') {
      $select
        .after(this.renderTemplate(require('templates/signup-invitation-domain-input')))
        .next()
          .focus()
          .end()
        .remove();

      return this;
    }
  },

  validateSignupDomains: function(event) {
    var domains = [],
        allowSignup = this.getAttribute('allow_signup'),
        signupDomains = this.getAttribute('signup_domains'),
        $errorElement = this.find('[data-model-attribute-error=signup_domains]'),
        hasInvalidDomains = false;

    _.forEach(signupDomains.split(','), function(domain) {
      domain = $.trim(domain);

      var error = '';

      if (!Zeppelin.Validations.isDomainName(domain)) {
        hasInvalidDomains = true;
        $errorElement.show().text(domain + ' is not a valid domain name.');
        return false;
      }

      domains.push(domain);
    }.bind(this));

    if (!hasInvalidDomains) {
      return this.model.validateSignupEmailDomain(domains).done(function(data) {
        this.model.set({
          'allow_signup': allowSignup,
          'signup_domains': data.signup_domains
        }).updateSignupStep(7);
      }.bind(this)).fail(function(error) {
        $errorElement.show().text(error.signup_domains);
      }.bind(this));
    }

    return this;
  },

  skipSignupDomains: function(event) {
    this.model.updateSignupStep(7);
    return this;
  },

  addInvitationRow: function(event) {
    var invitationRowTemplate = require('templates/signup-invitation-row'),
        invitationRowCompiled = this.renderTemplate(invitationRowTemplate);

    if (!this.$invitations) {
      this.cacheElement('invitations', 'div.signup__invitations');
    }

    this.$invitations.append(invitationRowCompiled);
    return this;
  },

  removeInvitationRow: function(event) {
    $(event.currentTarget).parent().remove();
  },

  validateInvitations: function(event) {
    var $error = this.find('[data-model-attribute-error=invite_emails]'),
        invitations = [],
        $invitations = this.find('div.signup__invitation-row'),
        invitationsError = false;

    $invitations.each(function(index, element) {
      var invitation = $(element).find('input.signup__invitation-field').val();

      if (invitation) {
        invitation += '@' + $(element).find('[data-domain-source=true]').val();
        invitations.push(invitation);
      }
    });

    if (invitations.length) {
      _.forEach(invitations, function(invitation, index) {
        if (!Zeppelin.Validations.isEmail(invitation)) {
          invitationsError = true;
          $error.show().text('One or more emails are invalid.');
        } else {
          invitationsError = false;
          $error.text('');
        }
      });
    } else {
      invitationsError = false;
      $error.text('');
    }

    if (!invitationsError) {
      if (invitations) {
        this.model.set('invite_emails', invitations);
      } else {
        this.model.set('invite_emails', []);
      }

      this.model.updateSignupStep(8);
    }

    return this;
  },

  validateUsername: function(event) {
    username = this.getAttribute('username');

    if (!this.model.hasValidation('username')) {
      this.model.addValidation('username', function(username) {
        if (!username) {
          return 'An username is required to authenticate you.';
        }
      });
    }

    this.model.setValidate('username', username);

    if (!this.model.validationError) {
      return this.model.validateUsername().done(function(data) {
        this.model.updateSignupStep(9);
      }.bind(this)).fail(function(error) {
        this.find('[data-model-attribute-error=email]').show().text(error.username);
      }.bind(this));
    }

    return this;
  },

  validatePassword: function(event) {
    password = this.getAttribute('password');

    if (!this.model.hasValidation('password')) {
      this.model.addValidation('password', [{
        required: true,
        message: 'A password is required to authenticate you.'
      }, {
        minLength: 8,
        message: 'Your password must have a minimun of 8 characters.'
      }]);
    }

    this.model.setValidate('password', password);

    if (!this.model.validationError) {
      return this.model.signup().done(function(data) {
        this.model
          .set(data)
          .unset('signup_request_token')
          .unset('password')
          .updateCache();
      }.bind(this)).fail(function(error) {
        this.find('[data-model-attribute-error=password]').show().text(error.password);
      }.bind(this));
    }

    return this;
  }
});
