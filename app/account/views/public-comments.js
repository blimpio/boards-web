module.exports = Zeppelin.View.extend({
  className: 'public-comments',

  template: require('account/templates/public-comments'),

  context: function() {
    return {
      disqusUrl: '//' + App.Accounts.current.get('disqus_shortname') + '.disqus.com/embed.js'
    };
  }
});
