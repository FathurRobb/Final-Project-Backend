module.exports = (sequelize, Sequelize) => {
    const Posts = sequelize.define(
        'posts',
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            categoryId: {
                type: Sequelize.INTEGER,
            },
            userId: {
                type: Sequelize.INTEGER,
            },
            title: {
                type: Sequelize.STRING,
            },
            image: {
                type: Sequelize.STRING,
            },
            content: {
                type: Sequelize.TEXT,
            },
        },
    );
    return Posts;
}