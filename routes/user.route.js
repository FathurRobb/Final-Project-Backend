const { signup, login } = require('../controllers/user.controller');

module.exports = app => {
    app.post('/api/signup', signup);
    app.post('/api/login', login);
}