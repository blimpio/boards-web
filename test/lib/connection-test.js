describe('Connection', function() {
  var server, connection,
      Connection = require('lib/connection');

  before(function() {
    server = sinon.fakeServer.create();
    server.autoRespond = false;
    server.autoRespondAfter = 500;

    connection = new Connection({
      type: 'HTTP',
      httpUrl: '/api/'
    });
  });

  after(function() {
    server.restore();
  });

  it('should exist.', function() {
    expect(connection).to.exist;
  });

  it('should be an HTTP connection.', function() {
    expect(connection.type).to.equal('HTTP');
  });

  it('should have a url.', function() {
    expect(connection.httpUrl).to.equal('/api/');
  });

  describe('Connection.create', function() {
    it('should create a connection to the server.', function(done) {
      var contentType = {"Content-Type":"application/json"};

      server.respondWith('HEAD', '/api/', [200, contentType, "OK"]);

      connection.create().done(function() {
        expect(connection.open).to.equal.true;
        done();
      }.bind(this));

      server.respond();
    });
  });

  describe('Connection.request', function() {
    it('should perform an HTTP request to the server.', function(done) {
      var response = '{"id": 1, "name": "Elving Rodriguez"}',
          contentType = {"Content-Type": "application/json"};

      server.respondWith('GET', '/api/user/', function(request) {
        request.respond(200, contentType, JSON.stringify(request.requestBody));
      });

      connection.request('GET', 'user/').done(function(data) {
        expect(data.id).to.equal(2);
        done();
      }.bind(this));

      server.respond('{"id": 2}');
    });
  });

  describe('Connection.get', function() {
    it('should perform an HTTP GET request to the server.', function(done) {
      var response = '{"animal": "dog", "rules": true}',
          contentType = {"Content-Type": "application/json"};

      server.respondWith('GET', '/api/user/', function(request) {
        request.respond(200, contentType, JSON.stringify(request.requestBody));
      });

      connection.get('user/').done(function(data) {
        expect(data.id).to.equal(2);
        done();
      }.bind(this));

      server.respond('{"id": 2}');
    });
  });

  describe('Connection.post', function() {
    it('should perform an HTTP POST request to the server.', function(done) {
      var contentType = {"Content-Type": "application/json"};

      server.respondWith('POST', '/api/user/', function(request) {
        request.respond(200, contentType, JSON.stringify(request.requestBody));
      });

      connection.post('user/', {company: 'Blimp'}).done(function(data) {
        expect(data.company).to.equal('Blimp');
        done();
      }.bind(this));

      server.respond();
    });
  });

  describe('Connection.put', function() {
    it('should perform an HTTP PUT request to the server.', function(done) {
      var contentType = {"Content-Type": "application/json"};

      server.respondWith('PUT', '/api/user/', function(request) {
        request.respond(200, contentType, JSON.stringify(request.requestBody));
      });

      connection.put('user/', {job: 'FrontEnd'}).done(function(data) {
        expect(data.job).to.equal('FrontEnd');
        done();
      }.bind(this));

      server.respond();
    });
  });

  describe('Connection.patch', function() {
    it('should perform an HTTP PATCH request to the server.', function(done) {
      var contentType = {"Content-Type": "application/json"};

      server.respondWith('PATCH', '/api/user/', function(request) {
        request.respond(200, contentType, JSON.stringify(request.requestBody));
      });

      connection.patch('user/', {awesome: true}).done(function(data) {
        expect(data.awesome).to.be.true;
        done();
      }.bind(this));

      server.respond();
    });
  });

  describe('Connection.delete', function() {
    it('should perform an HTTP DELETE request to the server.', function(done) {
      var contentType = {"Content-Type": "application/json"};

      server.respondWith('DELETE', '/api/user/', function(request) {
        request.respond(200, contentType, JSON.stringify(request.requestBody));
      });

      connection.delete('user/', {id: 1247}).done(function(data) {
        expect(data.id).to.equal(1247);
        done();
      }.bind(this));

      server.respond();
    });
  });

});
