module.exports = Zeppelin.ModelView.extend({
  className: 'public-comments',

  template: require('account/templates/public-comments'),

  model: function() {
    return App.Accounts.current;
  },

  bindings: {
    model: {
      'change:disqus_shortname': function() {
        this.render();
      }
    }
  },

  context: function() {
    var shortname = this.model.get('disqus_shortname');

    return {
      canEdit: this.options.canEdit,
      disqusUrl: '//' + shortname + '.disqus.com/embed.js',
      hasDisqusShortname: shortname
    };
  }
});
