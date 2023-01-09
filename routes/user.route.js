const { signup, login, addRole, getRole, updateRole, deleteUser } = require('../controllers/user.controller');

module.exports = app => {
    app.post('/api/signup', signup);
    app.post('/api/login', login);
    app.post('/api/addrole', addRole);
    app.get('/api/getrole', getRole);
    app.put('/api/updaterole/:id', updateRole);
    app.delete('/api/deleteuser/:id', deleteUser);
}