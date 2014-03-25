module.exports = (function() {
  var socket;

  try {
    socket = io.connect(App.SOCKETS_URL, {query: 'token=' + App.User.get('token')});

    socket.on('error', function(reason) {
      console.error('unable to connect websocket server:', reason);
    });

    socket.on('connect', function() {
      var userRooms = ['u' + App.User.id, 'a' + App.Accounts.current];

      userRooms.forEach(function(room) {
        socket.emit('subscribe', room);
      });
    });

    socket.on('roomAuth', function(data) {
      console.error('roomAuth:', data);
    });

    socket.on('joinedRoom', function(data) {
      console.log('joinedRoom:', data);
    });

    socket.on('message', function(response) {
      if (response.data_type === 'card' && response.method === 'update') {
        if (response.data.type === 'file') {
          App.Cards.get(response.data.id).set(response.data);
        }
      }
    });

  } catch(error) {
    console.log(error);
  }
})();
