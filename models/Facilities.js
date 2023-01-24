module.exports = (sequelize, Sequelize) => {
    const Facilities = sequelize.define(
        'facilities',
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: Sequelize.STRING,
            },
            tyoe: {
                type: Sequelize.INTEGER,
            },
            description: {
                type: Sequelize.TEXT,
            },
            telp: {
                type: Sequelize.STRING,
            },
            lat: {
                type: Sequelize.STRING,
            },
            long: {
                type: Sequelize.STRING,
            },
            city: {
                type: Sequelize.STRING,
            },
            country: {
                type: Sequelize.STRING,
            },
            maps: {
                type: Sequelize.STRING,
            },
        }
    );
    return Facilities;
}