class User {

    email;
    password;
    socket;
    loggedIn;
    token;

    constructor(email, password, socket) {
        this.email = email;
        this.password = password;
        this.socket = socket;
        this.loggedIn = false;
    }

    register(userInfo) {
        this.socket.emit('register', userInfo);
    }

    logIn(userInfo) {
        this.socket.emit('logIn', userInfo);
    }

    setUserOnLogIn(userInfo) {
        this.email = userInfo.user.email;
        this.password = userInfo.user.password;
        this.loggedIn = true;
        this.token = userInfo.token;
    }

    sendPing() {
        this.socket.emit('sent_ping')
    }


}

export default User;