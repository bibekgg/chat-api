const socket_io = require('socket.io');

var io = socket_io();
io.set('origins', '*:*');

var socketApi = {};
socketApi.io = io;

var userList = [];

/**
 * socket emit new server message to front end
 */
function emitMessage(message) {
	userList.forEach(user => {
		if (user._id == message.user.toString()) {
			io.to(user.socketId).emit('new-message', message);
		}
	})
}

io.on('connection', (socket) => {
	// Push new socket to list
	socket.on('login', (user) => {
		user.socketId = socket.id;
		userList.push(user);
	})

	// remove user from the list on disconnect
	socket.on('disconnect', function () {
		userList = userList.filter(user => {
			return user.socketId !== socket.id;
		})
	});

	// push new or update old on reconnect
	socket.on("user-reconnect", (user) => {
		let index = userList.findIndex(x => x.socketId == socket.id);
		user.socketId = socket.id;
		if (index == -1) {
			userList.push(user);
		} else {
			userList[index] = user;
		}
	})

	// remove user from the list on logout
	socket.on('logout', (logoutUser) => {
		userList = userList.filter(user => {
			return user.socketId !== socket.id;
		})
	})
});

module.exports = {
	socketApi,
	emitMessage
}