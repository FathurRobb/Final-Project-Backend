const { create, update, destroy, getAll, getAllData }  = require('../controllers/category.controller');

module.exports = app => {
    app.post('/api/category', create);
    app.put('/api/category/:id', update);
    app.delete('/api/category/:id', destroy);
    app.get('/api/category', getAll);
    app.get('/api/getallcat', getAllData);
}