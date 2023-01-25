const { create, destroy, getAll }  = require('../controllers/facility.controller');

module.exports = app => {
    app.post('/api/facility', create);
    app.delete('/api/facility/:id', destroy);
    app.get('/api/facility', getAll);
}