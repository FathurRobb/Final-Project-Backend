module.exports = (sequelize, Sequelize) => {
    const Answers = sequelize.define(
        'answers',
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            questionId: {
                type: Sequelize.INTEGER,
            },
            userId: {
                type: Sequelize.INTEGER,
            },
            content: {
                type: Sequelize.TEXT,
            }
        },
    );
    return Answers;
}