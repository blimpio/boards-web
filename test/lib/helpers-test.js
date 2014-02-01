describe('Helpers', function() {
  before(function() {
    require('lib/helpers');
  });

  describe('_.decodeJWT', function() {
    it('should decode a JSON Web Token.', function() {
      var token = 'eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJ0eXBlIjogIlNpZ251cFJlcXVlc3QiLCAiZW1haWwiOiAibmFtZUBleGFtcGxlLmNvbSJ9.PTbp7CGAJ3C4woorlCeWHRKqkcP7ZuiuWxn0FEiK9-0',
          decoded = _.decodeJWT(token);

      expect(decoded.type).to.equal('SignupRequest');
      expect(decoded.email).to.equal('name@example.com');
    });
  });
});
