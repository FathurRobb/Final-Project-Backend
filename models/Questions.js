module.exports = (sequelize, Sequelize) => {
    const Questions = sequelize.define(
        'questions',
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
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
            content: {
                type: Sequelize.TEXT,
            }
        },
    );
    return Questions;
}