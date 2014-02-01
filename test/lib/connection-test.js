describe('Connection', function() {
  before(function() {
    var Connection = require('lib/connection');

    this.connection = new Connection({
      type: 'HTTP',
      httpUrl: '/api/'
    });

    jQuery.ajaxSetup({
      processData: false
    });
  });

  beforeEach(function() {
    this.server = sinon.fakeServer.create();
    this.server.autoRespond = false;
    this.server.autoRespondAfter = 500;
  });

  afterEach(function() {
    this.server.restore();
  });

  it('should exist.', function() {
    expect(this.connection).to.exist;
  });

  it('should be an HTTP connection.', function() {
    expect(this.connection.type).to.equal('HTTP');
  });

  it('should have a url.', function() {
    expect(this.connection.httpUrl).to.equal('/api/');
  });

  describe('Connection.create', function() {
    it('should create a connection to the server.', function(done) {
      var contentType = {"Content-Type":"application/json"};

      this.server.respondWith('HEAD', '/api/', [200, contentType, "OK"]);

      this.connection.create().done(function() {
        expect(this.connection.open).to.equal.true;
        done();
      }.bind(this));

      this.server.respond();
    });
  });

  describe('Connection.request', function() {
    it('should perform an HTTP request to the server.', function(done) {
      var response = '{"id": 1, "name": "Elving Rodriguez"}',
          contentType = {"Content-Type": "application/json"};

      this.server.respondWith('GET', '/api/user/', [200, contentType, response]);

      this.connection.request('GET', 'user/').done(function(data) {
        expect(data.id).to.equal(1);
        expect(data.name).to.equal('Elving Rodriguez');
        done();
      }.bind(this));

      this.server.respond();
    });
  });

  describe('Connection.get', function() {
    it('should perform an HTTP GET request to the server.', function(done) {
      var response = '{"animal": "dog", "rules": true}',
          contentType = {"Content-Type": "application/json"};

      this.server.respondWith('GET', '/api/user/', [200, contentType, response]);

      this.connection.get('user/').done(function(data) {
        expect(data.rules).to.be.true;
        expect(data.animal).to.equal('dog');
        done();
      }.bind(this));

      this.server.respond();
    });
  });

  describe('Connection.post', function() {
    it('should perform an HTTP POST request to the server.', function(done) {
      var contentType = {"Content-Type": "application/json"};

      this.server.respondWith('POST', '/api/user/', function(request) {
        request.respond(200, contentType, JSON.stringify(request.requestBody));
      });

      this.connection.post('user/', {company: 'Blimp'}).done(function(data) {
        expect(data.company).to.equal('Blimp');
        done();
      }.bind(this));

      this.server.respond();
    });
  });

  describe('Connection.put', function() {
    it('should perform an HTTP PUT request to the server.', function(done) {
      var contentType = {"Content-Type": "application/json"};

      this.server.respondWith('PUT', '/api/user/', function(request) {
        request.respond(200, contentType, JSON.stringify(request.requestBody));
      });

      this.connection.put('user/', {job: 'FrontEnd'}).done(function(data) {
        expect(data.job).to.equal('FrontEnd');
        done();
      }.bind(this));

      this.server.respond();
    });
  });

  describe('Connection.patch', function() {
    it('should perform an HTTP PATCH request to the server.', function(done) {
      var contentType = {"Content-Type": "application/json"};

      this.server.respondWith('PATCH', '/api/user/', function(request) {
        request.respond(200, contentType, JSON.stringify(request.requestBody));
      });

      this.connection.patch('user/', {awesome: true}).done(function(data) {
        expect(data.awesome).to.be.true;
        done();
      }.bind(this));

      this.server.respond();
    });
  });

  describe('Connection.delete', function() {
    it('should perform an HTTP DELETE request to the server.', function(done) {
      var contentType = {"Content-Type": "application/json"};

      this.server.respondWith('DELETE', '/api/user/', function(request) {
        request.respond(200, contentType, JSON.stringify(request.requestBody));
      });

      this.connection.delete('user/', {id: 1247}).done(function(data) {
        expect(data.id).to.equal(1247);
        done();
      }.bind(this));

      this.server.respond();
    });
  });

});
