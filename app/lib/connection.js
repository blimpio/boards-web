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

  request: function(method, url, data, token, type) {
    this.requestPromise = $.Deferred();

    data = data || {};

    if (!token && !type && !_.isPlainObject(data)) {
      if (/(WebSockets|HTTP)/i.test(data)) {
        type = data;
        data = {};
        token = '';
      } else {
        token = data;
        data = {};
        type = this.type;
      }
    } else if (!type) {
      if (/[WebSockets|HTTP]/i.test(token)) {
        type = token;
        token = null;
      }
    }

    if (type === 'WebSocket') {
      this.socket.send(JSON.stringify({
        url: url,
        data: data,
        token: token,
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

          return this.requestPromise.resolve(data, response);
        }.bind(this),
        error: function(response) {
          var resp = response.responseText || response,
              data = resp && _.isString(resp) ? JSON.parse(resp) : resp;

          return this.requestPromise.reject(data.error || data, response);
        }.bind(this)
      });
    }

    return this.requestPromise.promise();
  },

  get: function(url, data, token, type) {
    return this.request('GET', url, data, token, type);
  },

  post: function(url, data, token, type) {
    return this.request('POST', url, data, token, type);
  },

  put: function(url, data, token, type) {
    return this.request('PUT', url, data, token, type);
  },

  patch: function(url, data, token, type) {
    return this.request('PATCH', url, data, token, type);
  },

  delete: function(url, data, token, type) {
    return this.request('DELETE', url, data, token, type);
  }
});

module.exports = Connection;
