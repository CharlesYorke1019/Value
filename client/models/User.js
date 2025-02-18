class User {

    email;
    password;
    socket;
    loggedIn;

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
        this.email = userInfo.email;
        this.password = userInfo.password;
        this.loggedIn = true;
    }


}

export default User;