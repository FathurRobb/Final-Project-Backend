module.exports = (sequelize, Sequelize) => {
    const Archhives = sequelize.define(
        'archives',
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            userId: {
                type: Sequelize.INTEGER,
            },
            postId: {
                type: Sequelize.INTEGER
            },
        },
    );
    return Archhives;
}