module.exports = (sequelize, Sequelize) => {
    const Alerts = sequelize.define('Alerts', {
        sent: {
            type: Sequelize.BOOLEAN
        },
        info: {
            type: Sequelize.JSON
        }
    });
    return Alerts;
};