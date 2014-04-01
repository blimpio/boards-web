module.exports = Zeppelin.FormView.extend({
  tagName: 'form',

  className: 'signup-validate-domain',

  template: require('signup/templates/validate-domain'),

  events: {
    'click button[data-action=skip]': 'skip'
  },

  bindings: {
    model: {
      'user:signup-domains:error': 'onSignupDomainsError',
      'user:signup-domains:success': 'onSignupDomainsSuccess'
    }
  },

  saveOnSubmit: false,

  model: function() {
    return App.User;
  },

  context: function() {
    return _.extend({}, this.model.attributes, {
      domain: this.model.getDomain()
    });
  },

  skip: function(event) {
    this.model.updateSignupStep('validate-invites');
    this.broadcast('signup:stepPassed');
  },

  onValidationSuccess: function() {
    var domains = this.getAttributeValue('signup_domains').split(','),
        validDomains = [],
        hasInvalidDomains = false;

    this.setAttribute('allow_signup');

    _.forEach(domains, function(domain) {
      var error = 'Provide a valid domain name.';
      domain = $.trim(domain);

      if (!Z.Validations.isDomainName(domain)) {
        hasInvalidDomains = true;
        if (domain) error = domain + ' is not a valid domain name.'
        this.getAttributeErrorElement('signup_domains').show().text(error);
        return false;
      }

      validDomains.push(domain);
    }, this);

    if (!hasInvalidDomains) this.model.validateSignupEmailDomain(validDomains);
  },

  onSignupDomainsError: function(error) {
    this.getAttributeErrorElement('signup_domains').show().text(error);
  },

  onSignupDomainsSuccess: function() {
    this.getAttributeErrorElement('signup_domains').hide();
    this.model.updateSignupStep('validate-invites');
    this.broadcast('signup:stepPassed');
  }
});

