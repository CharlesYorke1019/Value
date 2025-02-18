module.exports = (sequelize, Sequelize) => {
    const Odds = sequelize.define('Odds', {
        book: {
            type: Sequelize.STRING,
        },
        team1: {
            type: Sequelize.STRING,
        },
        team2: {
            type: Sequelize.STRING, 
        },
        team1Odds: {
            type: Sequelize.INTEGER
        },
        team2Odds: {
            type: Sequelize.INTEGER
        },
        identifier: {
            type: Sequelize.STRING
        }

    });
    return Odds;
};