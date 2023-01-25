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
                unique: true
            },
        },{
            paranoid: true
        }
    );
    return Services;
}