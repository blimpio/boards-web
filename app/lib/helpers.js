module.exports = (function() {
  // Decodes a JSON Web Token.
  _.mixin({'decodeJWT': function(token) {
    // Get the part of the token where data is stored.
    token = token.split('.')[1];

    // Make URL friendly.
    token = token.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');

    // Reverse to original encoding.
    if (token.length % 4 !== 0) {
      token += ('===').slice(0, 4 - (token.length % 4));
    }

    token = token.replace(/-/g, '+').replace(/_/g, '/');

    // Return the token data decoded.
    return JSON.parse(atob(token));
  }});
})();
