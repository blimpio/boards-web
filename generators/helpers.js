module.exports = function(Handlebars) {
  Handlebars.registerHelper('camelizeDashed', function(string) {
    var matches,
        result = '',
        camelized = '';

    if (string) {
      matches = string.split('-');
      matches.slice(1).forEach(function(match) {
        camelized += match.charAt(0).toUpperCase() + match.slice(1);
      });
      result = matches[0] + camelized;
    }

    return result;
  });
};
