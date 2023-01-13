const { create, update, destroy, getAll, getById }  = require('../controllers/question.controller');

module.exports = app => {
    app.post('/api/questions', create);
    app.put('/api/questions/:id', update);
    app.delete('/api/questions/:id', destroy);
    app.get('/api/questions', getAll);
    app.get('/api/questions/:id', getById);       
}