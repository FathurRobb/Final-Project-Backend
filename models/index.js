const config = require('../db/config');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    {
        dialect: config.dialect,
        storage: config.storage
    },
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.categories = require('./Categories')(sequelize, Sequelize);
db.posts = require('./Posts')(sequelize, Sequelize);
db.archives = require('./Archives')(sequelize, Sequelize);

db.posts.belongsTo(db.categories, {
    foreignKey: 'categoryId',
    onDelete: 'cascade',
    as: 'category'
});

db.archives.belongsTo(db.posts, {
    foreignKey: 'postId',
    onDelete: 'cascade',
    as: 'post'
});

module.exports = db;