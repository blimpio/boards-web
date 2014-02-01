// Connection
// ----------
//
// Provides an API to work with WebSockets(SockJS) using promises using HTTP as fallback.
var Connection = function(options) {
  options = options || {};

  this.open = false;
  this.type = options.type || 'HTTP';
  this.httpUrl = options.httpUrl || '';
  this.socketUrl = options.socketUrl || '';
};

_.extend(Connection.prototype, {
  create: function() {
    this.connectionPromise = $.Deferred();

    if (!SockJS && this.type === 'WebSocket') {
      this.type = 'HTTP';
    }

    if (this.type === 'WebSocket') {
      this.socket = new SockJS(this.socketUrl);

      this.socket.onopen = function() {
        this.open = true;
        return this.connectionPromise.resolve(arguments);
      }.bind(this);

      this.socket.onclose = function() {
        this.open = false;
        return this.connectionPromise.reject(arguments);
      }.bind(this);

      this.socket.onmessage = function(event) {
        var data = event.data && _.isString(event.data) ? JSON.parse(event.data) : null;

        if (data && this.requestPromise) {
          if (data.error) {
            this.requestPromise.reject(data.error, event);
          } else {
            this.requestPromise.resolve(data, event);
          }
        }
      }.bind(this);
    } else {
      return $.ajax({
        url: this.httpUrl,
        type: 'HEAD',
        success: function() {
          this.open = true;
          return this.connectionPromise.resolve(arguments);
        }.bind(this),
        error: function() {
          this.open = false;
          return this.connectionPromise.resolve(arguments);
        }.bind(this)
      });
    }

    return this.connectionPromise.promise();
  },

  request: function(method, url, data) {
    this.requestPromise = $.Deferred();

    if (this.type === 'WebSocket') {
      this.socket.send(JSON.stringify({
        url: url,
        data: data,
        method: method || 'GET'
      }));
    } else {
      $.ajax({
        url: this.httpUrl + url,
        type: method || 'GET',
        data: data,
        success: function(response) {
          var resp = response.responseText || response,
              data = resp && _.isString(resp) ? JSON.parse(resp) : resp;

          this.requestPromise.resolve(data, response);
        }.bind(this),
        error: function(response) {
          var resp = response.responseText || response,
              data = resp && _.isString(resp) ? JSON.parse(resp) : resp;

          this.requestPromise.reject(data.error || data, response);
        }.bind(this)
      });
    }

    return this.requestPromise.promise();
  },

  get: function(url, data) {
    return this.request('GET', url, data);
  },

  post: function(url, data) {
    return this.request('POST', url, data);
  },

  put: function(url, data) {
    return this.request('PUT', url, data);
  },

  patch: function(url, data) {
    return this.request('PATCH', url, data);
  },

  delete: function(url, data) {
    return this.request('DELETE', url, data);
  }
});

module.exports = Connection;
