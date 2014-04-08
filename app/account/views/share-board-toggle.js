module.exports = Zeppelin.FormView.extend({
  tagName: 'form',

  className: function() {
    var className = 'share-board-toggle-form';
    if (this.model.get('is_shared')) className += ' is-shared';
    return className;
  },

  template: require('account/templates/share-board-toggle'),

  events: {
    'change input[name=is_shared]': 'onChange',
    'click [data-action=shareTwitter]': 'shareViaTwitter',
    'click [data-action=shareFacebook]': 'shareViaFacebook'
  },

  elements: {
    twitterBtn: '[data-action=shareTwitter]',
    facebookBtn: '[data-action=shareFacebook]',
    shareUrlInput: 'input.share-board-toggle-url-input'
  },

  initialize: function() {
    _.bindAll(this, ['shareViaTwitter', 'shareViaFacebook']);
    this.twitterLoaded = false;
    this.facebookLoaded = false;
  },

  context: function() {
    return _.extend({}, this.model.attributes, {
      url: this.model.getShareUrl()
    });
  },

  focusOnShareUrl: function() {
    if (this.model.get('is_shared')) this.getElement('shareUrlInput').select();
  },

  toggleSharingActions: function(isShared) {
    isShared = isShared !== undefined ? isShared : this.model.get('is_shared');
    this.$el.toggleClass('is-shared', isShared);
    if (isShared) this.getElement('shareUrlInput').select();
    return this;
  },

  reset: function() {
    this.render();
    this.toggleSharingActions();
  },

  shareViaTwitter: function() {
    var top, left,
        width = 550,
        height = 420,
        winWidth = screen.width,
        winHeight = screen.height,
        windowOptions = 'scrollbars=no,resizable=no,toolbar=no,location=no';

    if (!this.twitterLoaded) {
      this.loadTwitter().done(this.shareViaTwitter);
    } else {
      top = 0;
      left = Math.round((winWidth / 2) - (width / 2));
      if (winHeight > height) top = Math.round((winHeight / 2) - (height / 2));
      windowOptions += ',width=' + width + ',height=' + height;
      windowOptions += ',left=' + left + ',top=' + top;
      window.open(this.getElement('twitterBtn').data('intent'), 'intent', windowOptions);
    }

    return this;
  },

  loadTwitter: function() {
    var $d = $.Deferred();

    this.getElement('twitterBtn').text('Loading...');
    yepnope.injectJs('//platform.twitter.com/widgets.js', _.bind(function() {
      this.twitterLoaded = true;
      this.getElement('twitterBtn').text('Twitter');
      $d.resolve(arguments);
    }, this), {
      charset: 'utf-8'
    }, 5000);

    _.delay(_.bind(function() {
      this.getElement('twitterBtn').text('Twitter');
      if (!this.twitterLoaded) $d.reject();
    }, this), 5000);

    return $d.promise();
  },

  shareViaFacebook: function() {
    var top, left,
        width = 550,
        height = 420,
        winWidth = screen.width,
        winHeight = screen.height,
        windowOptions = 'scrollbars=no,resizable=no,toolbar=no,location=no';

    if (!this.facebookLoaded) {
      this.loadFacebook().done(this.shareViaFacebook);
    } else {
      top = 0;
      left = Math.round((winWidth / 2) - (width / 2));
      if (winHeight > height) top = Math.round((winHeight / 2) - (height / 2));
      windowOptions += ',width=' + width + ',height=' + height;
      windowOptions += ',left=' + left + ',top=' + top;
      window.open(this.getElement('facebookBtn').data('share'), 'share', windowOptions);
    }

    return this;
  },

  loadFacebook: function() {
    var $d = $.Deferred();

    this.getElement('facebookBtn').text('Loading...');
    yepnope.injectJs('//connect.facebook.net/en_US/all.js#xfbml=1&appId=854149947934010', _.bind(function() {
      this.facebookLoaded = true;
      this.getElement('facebookBtn').text('Facebook');
      $d.resolve(arguments);
    }, this), {
      charset: 'utf-8'
    }, 5000);

    _.delay(_.bind(function() {
      this.getElement('facebookBtn').text('Facebook');
      if (!this.facebookLoaded) $d.reject();
    }, this), 5100);

    return $d.promise();
  },

  onChange: function(event) {
    this.toggleSharingActions($(event.currentTarget).val() === 'true');
    this.submit();
  }
});

