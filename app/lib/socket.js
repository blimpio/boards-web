var Socket = function(options) {
  this.url = options.url || '/';
  this.query = options.query || {};
  this.rooms = options.rooms || [];
  this.connection = null;
  this._subscriptions = {};

  _.bindAll(this, ['onMessage']);
};

_.extend(Socket.prototype, {
  connect: function() {
    var self = this;

    this.connection = io.connect(this.url, {
      query: this.query
    });

    this.connection.on('error', function(response) {
      self.broadcast('socket:connection:error', response);
    });

    this.connection.on('connect', function(response) {
      self.joinRooms();
      self.broadcast('socket:connection:success', response);
    });

    this.connection.on('roomAuth', function(response) {
      self.broadcast('socket:authenticated', response);
    });

    this.connection.on('joinedRoom', function(response) {
      self.broadcast('socket:room:joined', response);
    });

    this.connection.on('message', this.onMessage);
  },

  joinRooms: function(rooms) {
    rooms = rooms || this.rooms;

    _.forEach(rooms, function(room) {
      this.connection.emit('subscribe', room);
    }, this);
  },

  onMessage: function(message) {
    var collection;

    if (message.data.board &&
    message.data.board !== App.Boards.current.id) return;

    if (message.data.account &&
    message.data.account !== App.Accounts.current.id) return;

    if ((message.data.type === 'file' && message.method === 'update') ||
    message.data.modified_by.id !== App.User.id) {
      if (message.data_type === 'board') {
        collection = App.Boards;
      } else if (message.data_type === 'card') {
        collection = App.Cards;
      } else if (message.data_type === 'comment') {
        collection = App.Comments;
      } else {
        return;
      }

      if (message.method === 'create') {
        collection.add(message.data);
      } else if (message.method === 'update') {
        collection.get(message.data.id).set(message.data);
      } else if (message.method === 'delete') {
        collection.remove(collection.get(message.data.id));
      }
    }
  }
}, Z.Subscriptions);

module.exports = Socket;
