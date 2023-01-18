const { signup, login, addRole, getRole, updateRole, deleteUser, addImage, deleteImage, getUserInfo } = require('../controllers/user.controller');

module.exports = app => {
    app.post('/api/signup', signup);
    app.post('/api/login', login);
    app.post('/api/addrole', addRole);
    app.get('/api/getrole', getRole);
    app.put('/api/updaterole/:id', updateRole);
    app.delete('/api/deleteuser/:id', deleteUser);
    app.post('/api/addimage/:id', addImage);
    app.delete('/api/deleteimage/:id', deleteImage);
    app.get('/api/getuserinfo/:id', getUserInfo);
}