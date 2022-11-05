let users = [];

const socketServer = (socket) => {
    socket?.on('join', (data) => {
        let newUser = { socketId: socket.id, ...data };

        socket.broadcast.emit('joinToClient', [...users, newUser]);
        socket.emit('joinToClient', [...users, newUser]);

        users.push(newUser);
    });
    socket?.on('disconnect', () => {
        users = users.filter((user) => user.socketId !== socket.id);
    });
    socket.on('cellClick', ({ cellIndex, to }) => {
        socket.to(to).emit('cellClickToClient', cellIndex);
    });
    socket.on('gameRequest', (data) => {
        socket.to(data.competitor.socketId).emit('gameRequestToClient', data.me);
    });
    socket.on('acceptGame', (data) => {
        socket.to(data.socketId).emit('acceptGameToClient');
    });
    socket.on('replayGame', ({ to, user }) => {
        socket.to(to.socketId).emit('gameReplayToClient', user);
    });
    socket.on('acceptReplayGame', (data) => {
        socket.to(data.socketId).emit('acceptGameReplayToClient');
    });

}

module.exports = socketServer;