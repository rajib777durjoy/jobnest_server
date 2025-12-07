
export const users = {}
export const SocketConnect = (io) => {
    io.on('connection', (socket) => {
        console.log('new user connect', socket.id)
        
        socket.on('user_info', ({ user }) => {
            if (user) {
                users[user] = socket.id;
                socket.email = user;
                console.log('userObj',users)
            }

            
        })

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
            if (socket.email) {
                delete users[socket.email];
            }
        });
    })


}