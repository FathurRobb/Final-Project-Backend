module.exports = (sequelize, Sequelize) => {
    const UserProfile = sequelize.define(
        'userProfile',
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            userId: {
                type: Sequelize.INTEGER,
            },
            image: {
                type: Sequelize.STRING,
            },
        },
    );
    return UserProfile;
};