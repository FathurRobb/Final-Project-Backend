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
db.users = require('./Users')(sequelize, Sequelize);
db.roles = require('./Roles')(sequelize, Sequelize);
db.comments = require('./Comments')(sequelize, Sequelize);
db.questions = require('./Questions')(sequelize, Sequelize);
db.answers = require('./Answers')(sequelize, Sequelize);
db.services = require('./Services')(sequelize, Sequelize);
db.facilities = require('./Facilities')(sequelize, Sequelize);

db.posts.belongsTo(db.categories, {
    foreignKey: 'categoryId',
    onDelete: 'cascade',
    as: 'category'
});

db.posts.belongsTo(db.users, {
    foreignKey: 'userId',
    onDelete: 'cascade',
    as: 'user'
});

db.archives.belongsTo(db.posts, {
    foreignKey: 'postId',
    onDelete: 'cascade',
    as: 'post'
});

db.users.belongsTo(db.roles, {
    foreignKey: 'roleId',
    onDelete: 'cascade',
    as: 'role'
});

db.roles.hasMany(db.users, {
    foreignKey: 'roleId',
    as: 'users'
});

db.comments.belongsTo(db.users, {
    foreignKey: 'userId',
    onDelete: 'cascade',
    as: 'user'
});

db.posts.hasMany(db.comments, {
    foreignKey: 'postId',
    as: 'comments'
});

db.questions.belongsTo(db.categories, {
    foreignKey: 'categoryId',
    onDelete: 'cascade',
    as: 'category'
});

db.questions.belongsTo(db.users, {
    foreignKey: 'userId',
    onDelete: 'cascade',
    as: 'user'
});

db.questions.hasMany(db.answers, {
    foreignKey: 'questionId',
    as: 'answers'
});

db.answers.belongsTo(db.questions, {
    foreignKey: 'questionId',
    onDelete: 'cascade',
    as: 'question'
});

db.answers.belongsTo(db.users, {
    foreignKey: 'userId',
    onDelete: 'cascade',
    as: 'user'
});

db.services.belongsToMany(db.facilities, {
    through: 'services_facilities',
    foreignKey: 'serviceId',
    otherKey: 'facilityId',
});

db.facilities.belongsToMany(db.services, {
    through: 'services_facilities',
    foreignKey: 'facilityId',
    otherKey: 'serviceId',
});

// db.users.sync({ alter: true });

module.exports = db;