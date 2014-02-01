describe('Application', function() {
  before(function() {
    this.Application = require('application');
  });

  it('should exist.', function() {
    expect(this.Application).to.exist;
  });

  it('should have routes.', function() {
    expect(this.Application.routes).to.exist;
  });

  it('should have an open connection to the server.', function() {
    expect(this.Application.connection).to.exist;
  });
});
