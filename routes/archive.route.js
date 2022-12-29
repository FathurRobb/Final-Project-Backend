const { actionArchived, getArchived } = require('../controllers/archive.controller');

module.exports = app => {
    app.put('/api/archive', actionArchived);
    app.get('/api/archive', getArchived);
}