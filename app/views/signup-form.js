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

  bindings: {
    'model change:signup_step': 'onSignupStepChange'
  },

  initialize: function() {
    this.renderStep();
  },

  onSignupStepChange: function(model, step) {
    this.renderStep(step);
  },

  renderStep: function(step) {
    step = step || this.model.get('signup_step') || 1;

    var nextStep;

    if (this.model.isWaitingForEmailValidation()) {
      nextStep = 'signup-step-2';
    } else {
      nextStep = 'signup-step-' + step;
    }

    this.render(require('templates/signup-steps/' + nextStep));
    return this;
  },

  validateEmail: function(event) {
    this.model.addValidation('email', [{
      isEmpty: false,
      message: 'An email is required to authenticate you.'
    }, {
      isEmail: true,
      message: 'Provide a valid email.'
    }]);

    this.setAttribute('email');

    if (!this.model.validationError) {
      return this.model.requestSignup().done(function(data) {
        this.model.set(data);
        this.model.updateSignupStep(2);
      }.bind(this)).fail(function(error) {
        this.getAttributeErrorElement('email').text(error.email);
      }.bind(this));
    }

    return this;
  },

  redirectToFirstStep: function(event) {
    this.model.set('signup_step', 1, {silent: true});
    this.model.saveCache();
    this.publish('router:navigate', 'signup');
    return this;
  },

  redirectToFourthStep: function(event) {
    this.model.updateSignupStep(4);
    return this;
  },

  validateFullName: function(event) {
    this.model.addValidation('full_name', function(name) {
      if (!name) {
        return 'Your name is required to authenticate you.';
      } else if (!name.split(' ')[1]) {
        return 'Enter your full name.';
      }
    });

    this.setAttribute('full_name');

    if (!this.model.validationError) {
      this.model.addValidation('account_name', {
        isEmpty: false,
        message: 'An account name is required to authenticate you.'
      }).updateSignupStep(5);
    }

    return this;
  },

  validateAccountName: function(event) {
    this.model.addValidation('account_name', {
      isEmpty: false,
      message: 'An account name is required to authenticate you.'
    });

    this.setAttribute('account_name');

    if (!this.model.validationError) {
      this.model.updateSignupStep(6);
    }

    return this;
  },

  addOtherDomainInput: function(event) {
    var $select = $(event.currentTarget),
        template = require('templates/signup-steps/signup-invitation-domain-input');

    if ($select.val() === 'other') {
      $select
        .after(template())
        .next()
          .focus()
          .end()
        .remove();

      return this;
    }
  },

  validateSignupDomains: function(event) {
    var domains = [],
        signupDomains = this.getAttributeValue('signup_domains'),
        hasInvalidDomains = false;

    this.setAttribute('allow_signup');

    _.forEach(this.getAttributeValue('signup_domains').split(','), function(domain) {
      domain = $.trim(domain);

      var error = '';

      if (!Z.Validations.isDomainName(domain)) {
        hasInvalidDomains = true;
        this.getAttributeErrorElement('signup_domains').text(domain + ' is not a valid domain name.');
        return false;
      }

      domains.push(domain);
    }.bind(this));

    if (!hasInvalidDomains) {
      return this.model.validateSignupEmailDomain(domains).done(function(data) {
        this.model.set('signup_domains', data.signup_domains).updateSignupStep(7);
      }.bind(this)).fail(function(error) {
        this.getAttributeErrorElement('signup_domains').text(error.signup_domains);
      }.bind(this));
    }

    return this;
  },

  skipSignupDomains: function(event) {
    this.model.updateSignupStep(7);
    return this;
  },

  addInvitationRow: function(event) {
    this.registerElement('invitations', 'div.signup__invitations');
    this.$invitations.append(require('templates/signup-steps/signup-invitation-row')());
    return this;
  },

  removeInvitationRow: function(event) {
    $(event.currentTarget).parent().remove();
  },

  validateInvitations: function(event) {
    var $error = this.getAttributeErrorElement('invite_emails'),
        invitations = [],
        $invitations = this.$('div.signup__invitation-row'),
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
        if (!Z.Validations.isEmail(invitation)) {
          invitationsError = true;
          $error.text('One or more emails are invalid.');
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
        this.model.set('invite_emails', invitations).updateSignupStep(8);
      } else {
        this.model.set('invite_emails', []).updateSignupStep(8);
      }
    }

    return this;
  },

  validateUsername: function(event) {
    this.model.addValidation('username', {
      isEmpty: false,
      message: 'An username is required to authenticate you.'
    });

    this.setAttribute('username');

    if (!this.model.validationError) {
      return this.model.validateUsername().done(function(data) {
        this.model.updateSignupStep(9);
      }.bind(this)).fail(function(error) {
        this.getAttributeErrorElement('username').text(error.username);
      }.bind(this));
    }

    return this;
  },

  validatePassword: function(event) {
    this.model.addValidation('password', [{
      isEmpty: false,
      message: 'A password is required to authenticate you.'
    }, {
      isOfMinimumLength: 8,
      message: 'Your password must have a minimun of 8 characters.'
    }]);

    this.setAttribute('password');

    if (!this.model.validationError) {
      return this.model.signup().done(function(data) {
        this.model
          .set(data)
          .unset('signup_step', {silent: true})
          .unset('signup_request_token', {silent: true})
          .unset('password', {silent: true})
          .saveCache();

        this.publish('user:signed:in');
      }.bind(this)).fail(function(error) {
        this.getAttributeErrorElement('password').text(error.email || error.username);
      }.bind(this));
    }

    return this;
  }
});
