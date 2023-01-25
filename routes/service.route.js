const { create, update, destroy, getAll}  = require('../controllers/service.controller');

module.exports = app => {
    app.post('/api/service', create);
    app.put('/api/service/:id', update);
    app.delete('/api/service/:id', destroy);
    app.get('/api/service', getAll);
}