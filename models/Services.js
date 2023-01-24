module.exports = (sequelize, Sequelize) => {
    const Services = sequelize.define(
        'services',
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: Sequelize.STRING,
            },
        },{
            paranoid: true
        }
    );
    return Services;
}