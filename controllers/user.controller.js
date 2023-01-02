const { Op } = require('sequelize');
const db = require('../models');
const Bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = db.users;

const JWT_SECRET_KEY = 'finalprojectteam4';

exports.signup = async (req, res) => {

    const userData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        role_id: req.body.role_id,
        email: req.body.email,
        password: req.body.password,
    };

    User.findOne({ where: { email: userData.email } })
        .then((user) => {
            if (!user) {
                const hash = Bcrypt.hashSync(userData.password, 10);
                userData.password = hash;
                if(userData.role_id == 1){
                    userData.role_name = 'Super Admin';
                }else if(userData.role_id == 2){
                    userData.role_name = 'Editor';
                }else if(userData.role_id == 3){
                    userData.role_name = 'Doctor';
                }else if(userData.role_id == 4){
                    userData.role_name = 'Guest';
                }else{
                    userData.role_name = 'Unknown';
                }
                User.create(userData)
                    .then((user) => {
                        res.json({ status: user.email + ' registered!' });
                    })
                    .catch((err) => {
                        res.send('error: ' + err);
                    });
            }
            else {
                res.json({ error: 'User already exists' });
            }
        })
        .catch((err) => {
            res.send('error: ' + err);
        }
    );

};

exports.login = async (req, res) => {
    User.findOne({ where: { email: req.body.email },
    })
        .then((user) => {
            if (user) {
                if (Bcrypt.compareSync(req.body.password, user.password)) {
                   const token = jwt.sign(user.dataValues, JWT_SECRET_KEY, {
                        expiresIn: '2 days',
                    });
                    res.json({
                        id: user.dataValues.id,
                        first_name: user.dataValues.first_name,
                        last_name: user.dataValues.last_name,
                        role_name: user.dataValues.role_name,
                        email: user.dataValues.email,
                        token: token,
                    });
                }else {
                    res.status(400).json({ error: 'Invalid password' });
                }
            }
        })
        .catch((err) => {
            res.status(400).json({ error: err });
        });
};
