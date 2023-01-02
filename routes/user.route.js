const { signup, login, addRole, getRole } = require('../controllers/user.controller');

module.exports = app => {
    app.post('/api/signup', signup);
    app.post('/api/login', login);
    app.post('/api/addrole', addRole);
    app.get('/api/getrole', getRole);
}