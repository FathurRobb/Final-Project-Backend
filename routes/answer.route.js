const { create, update, destroy } = require('../controllers/answer.controller');

module.exports = app => {
    app.post('/api/answers/:questionId', create);
    app.put('/api/answers/:id', update);
    app.delete('/api/answers/:id', destroy);
}