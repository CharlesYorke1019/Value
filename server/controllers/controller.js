const db = require('../models');
const User = db.user;
const Odds = db.product;
const bycrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const authConfig = require('../config/authConfig');

exports.register = async (socket, body) => {
    if (!body.email || !body.password || !body.confirmPassword) {
        return;
    };

    if (body.password != body.confirmPassword) {
        return;
    };

    const hash = bycrypt.hashSync(body.password, 12);

    const user = {
        email: body.email.toLowerCase(),
        password: hash
    };

    User.create(user).then(data => {
        socket.emit('registerSuccessful');
    }).catch(err => {
        res.status(500).send({
            message: "Error occured while registering user"
        });
    });
};

exports.logIn = (socket, body) => {
    const email = body.email.toLowerCase();
    const password = body.password;

    User.findOne({ where: { email : email } }).then(data => {
        if (data) {
            if (bycrypt.compareSync(password, data.password)) {
                
                const token = jsonwebtoken.sign({email: data.email}, authConfig.secret, {algorithm: 'HS256', expiresIn: 86400})
                socket.emit('logInSuccessful', {token: token, user: data});

            } else {
                return;
            };
        } else {
            return;
        };
    }).catch(err => {
        return;
    });
};

exports.createUser = (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.status(400).send({
            message: "Error occured while creating user"
        });
        return;
    };

    const hash = bycrypt.hashSync(req.body.password, 12);

    const user = {
        email: req.body.email.toLowerCase(),
        password: hash,
    };

    User.create(user).then(data => {
        res.status(201).send({
            message: "Success! User created.",
            data: data
        });
    }).catch(err => {
        res.status(500).send({
            message: "Error occured while creating user"
        });
    });
}

exports.getUsers = (req, res) => {
    User.findAll({ attributes: { exclude : ['password'] } }).then(data => {
        res.send({
            message: "Request successful!",
            data: data
        });
    }).catch(err => {
        res.status(500).send({
            message: "Error occured while finding users"
        });
    });
}