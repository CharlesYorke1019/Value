const db = require('../models');
const User = db.user;
const Odds = db.odds;
const Alerts = db.alerts;
const bycrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const authConfig = require('../config/authConfig');
const axiosApi = require('../api/api');

exports.register = async (socket, body) => {
    if (!body.email || !body.password || !body.confirmPassword) {
        return;
    };

    if (body.password != body.confirmPassword) {
        return;
    };

    const hash = bycrypt.hashSync(body.password, 12);

    const user = {
        email: body.email.toLowerCase(),
        password: hash
    };

    User.create(user).then(data => {
        socket.emit('registerSuccessful');

        console.log(data);

    }).catch(err => {
        return;
    });
};

exports.logIn = (socket, body) => {
    const email = body.email.toLowerCase();
    const password = body.password;

    console.log(body);

    User.findOne({ where: { email : email } }).then(data => {
        if (data) {
            if (bycrypt.compareSync(password, data.password)) {
                
                const token = jsonwebtoken.sign({email: data.email}, authConfig.secret, {algorithm: 'HS256', expiresIn: 86400})
                socket.emit('logInSuccessful', {token: token, user: data});

            } else {
                return;
            };
        } else {
            return;
        };
    }).catch(err => {
        return;
    });
};

exports.createUser = (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.status(400).send({
            message: "Error occured while creating user"
        });
        return;
    };

    const hash = bycrypt.hashSync(req.body.password, 12);

    const user = {
        email: req.body.email.toLowerCase(),
        password: hash,
    };

    User.create(user).then(data => {
        res.status(201).send({
            message: "Success! User created.",
            data: data
        });
    }).catch(err => {
        res.status(500).send({
            message: "Error occured while creating user"
        });
    });
}

exports.getUsers = (req, res) => {
    User.findAll({ attributes: { exclude : ['password'] } }).then(data => {
        res.send({
            message: "Request successful!",
            data: data
        });
    }).catch(err => {
        res.status(500).send({
            message: "Error occured while finding users"
        });
    });
}

exports.feed = async (req, res) => {
    axiosApi().get('v4/sports/basketball_ncaab/odds?regions=us&oddsFormat=american&apiKey=9b3749c6f8111824a767b84b1ba41ef4').then(data => {
        let objsArr = data.data;

        for (let i = 0; i < objsArr.length; i++) {

            for (let j = 0; j < objsArr[i].bookmakers.length; j++) {

                if (objsArr[i].bookmakers[j].markets[0].outcomes != undefined) {

                    let slipInfo = objsArr[i].bookmakers[j].markets[0].outcomes;

                    let oddsObj = {
                        book: objsArr[i].bookmakers[j].title,
                        team1: slipInfo[0].name,
                        team2: slipInfo[1].name,
                        team1StartingOdds: slipInfo[0].price,
                        team2StartingOdds: slipInfo[1].price,
                        team1LiveOdds: slipInfo[0].price,
                        team2LiveOdds: slipInfo[1].price,
                        identifier: objsArr[i].bookmakers[j].title + '-' + slipInfo[0].name + ':' + slipInfo[0].price + '-' + slipInfo[1].name + ':' + slipInfo[1].price
                    }

                    const exists = Odds.count({ where : { book : oddsObj.book } && { team1 : oddsObj.team1 } && { team2 : oddsObj.team2 } })

                    // if (exists === 0) {

                    //     Odds.create(oddsObj).then(data2 => {

                    //         console.log('Success!')

                    //     }).catch(err => {

                    //         console.log('Error!')

                    //     })

                    // }

                    Odds.create(oddsObj).then(data2 => {

                        return data;

                    }).catch(err => {

                        console.log('Error!')

                    })

                }

            }

        }

        res.send({
            message: 'Success!'
        })
        return;

    })
}

// exports.test = async (io) => {

//     const clients = io.sockets.adapter.rooms.get('ncaa_basketball');

//     if (clients) {

//         const data1  = await axiosApi().get('v4/sports/basketball_ncaab/odds?regions=us&oddsFormat=american&apiKey=9b3749c6f8111824a767b84b1ba41ef4');

//         let objArr = data1.data;

//         let message = '';
//         let array = [];
//         let totalAlerts = 0;

//         for (let i = 0; i < objArr.length; i++) {

//             for (let j = 0; j < objArr[i].bookmakers.length; j++) {

//                 if (objArr[i].bookmakers[j].markets[0].outcomes != undefined) {

//                     let slipInfo = objArr[i].bookmakers[j].markets[0].outcomes;

//                     let retrievedOdds = {
//                         book: objArr[i].bookmakers[j].title,
//                         team1: slipInfo[0].name,
//                         team2: slipInfo[1].name,
//                         team1Odds: slipInfo[0].price,
//                         team2Odds: slipInfo[1].price,
//                         identifier: objArr[i].bookmakers[j].title + '-' + slipInfo[0].name + ':' + slipInfo[0].price + '-' + slipInfo[1].name + ':' + slipInfo[1].price
//                     }

//                     let finalObj = {};

//                     await Odds.findOne({ where : { identifier : retrievedOdds.identifier } }).then(data2 => {

//                         if (data2) {

//                             let originalBetInfo = data2.dataValues;
                            
//                             let oddsChangeTeam1 = retrievedOdds.team1Odds - originalBetInfo.team1StartingOdds;
//                             let oddsChangeTeam2 = retrievedOdds.team2Odds - originalBetInfo.team2StartingOdds;

//                             if (originalBetInfo.id === 66) {
//                                 console.log(originalBetInfo);
//                                 console.log(oddsChangeTeam1);
//                                 console.log(oddsChangeTeam2);
//                             }

//                             if (oddsChangeTeam1 >= 100 || oddsChangeTeam1 <= -100 && oddsChangeTeam2 >= 100 || oddsChangeTeam2 <= -100) {

//                                 if (oddsChangeTeam1 >= 100 || oddsChangeTeam1 <= -100) {

//                                     finalObj.team1 = retrievedOdds.team1;
//                                     finalObj.team1OddsChange = oddsChangeTeam1;
//                                     finalObj.team1OriginalOdds = originalBetInfo.team1StartingOdds;
//                                     finalObj.team1UpdatedOdds = retrievedOdds.team1Odds;
                                    
//                                 }

//                                 if (oddsChangeTeam2 >= 100 || oddsChangeTeam2 <= -100) {

//                                     finalObj.team2 = retrievedOdds.team2;
//                                     finalObj.team2OddsChange = oddsChangeTeam2;
//                                     finalObj.team2OriginalOdds = originalBetInfo.team2StartingOdds;
//                                     finalObj.team2UpdatedOdds = retrievedOdds.team2Odds;

                                

//                                 }

//                                 finalObj.location = retrievedOdds.book;

//                                 array.push(finalObj);

//                                 totalAlerts++;

//                             }

//                             let updateObj = {
//                                 team1LiveOdds: retrievedOdds.team1Odds,
//                                 team2LiveOdds: retrievedOdds.team2Odds
//                             }

//                             Odds.update(updateObj, { where : { identifier : originalBetInfo.identifier } }).then(arr => {

//                                 if (arr[0]) {

//                                     return 'success';

//                                 }

//                             }).catch(err => {
//                                 return;
//                             })

//                         }

//                     })


//                 }

//             }

//         }

//         console.log(totalAlerts);

//         console.log(array);

//         io.to('ncaa_basketball').emit('receive_ping', JSON.parse(JSON.stringify(array)));

//     } else {

//         console.log('no point');

//     }
// }

exports.test = async (io) => {

    const clients = io.sockets.adapter.rooms.get('ncaa_basketball');

    if (clients) {

        const data1  = await axiosApi().get('v4/sports/basketball_ncaab/odds?regions=us&oddsFormat=american&apiKey=9b3749c6f8111824a767b84b1ba41ef4');

        let objArr = data1.data;

        let message = '';
        let array = [];
        let totalAlerts = 0;

        for (let i = 0; i < objArr.length; i++) {

            for (let j = 0; j < objArr[i].bookmakers.length; j++) {

                if (objArr[i].bookmakers[j].markets[0].outcomes != undefined) {

                    let slipInfo = objArr[i].bookmakers[j].markets[0].outcomes;

                    let retrievedOdds = {
                        book: objArr[i].bookmakers[j].title,
                        team1: slipInfo[0].name,
                        team2: slipInfo[1].name,
                        team1Odds: slipInfo[0].price,
                        team2Odds: slipInfo[1].price,
                        identifier: objArr[i].bookmakers[j].title + '-' + slipInfo[0].name + ':' + slipInfo[0].price + '-' + slipInfo[1].name + ':' + slipInfo[1].price
                    }

                    let finalObj = {};

                    await Odds.findOne({ where : { identifier : retrievedOdds.identifier } }).then(data2 => {

                        if (data2) {

                            let originalBetInfo = data2.dataValues;
                            
                            let oddsChangeTeam1 = retrievedOdds.team1Odds - originalBetInfo.team1StartingOdds;
                            let oddsChangeTeam2 = retrievedOdds.team2Odds - originalBetInfo.team2StartingOdds;

                            if (originalBetInfo.id === 66) {
                                console.log(originalBetInfo);
                                console.log(oddsChangeTeam1);
                                console.log(oddsChangeTeam2);
                            }

                            if (oddsChangeTeam1 >= 100 || oddsChangeTeam1 <= -100 && oddsChangeTeam2 >= 100 || oddsChangeTeam2 <= -100) {

                                if (oddsChangeTeam1 >= 100 || oddsChangeTeam1 <= -100) {

                                    finalObj.team1 = retrievedOdds.team1;
                                    finalObj.team1OddsChange = oddsChangeTeam1;
                                    finalObj.team1OriginalOdds = originalBetInfo.team1StartingOdds;
                                    finalObj.team1UpdatedOdds = retrievedOdds.team1Odds;
                                    
                                }

                                if (oddsChangeTeam2 >= 100 || oddsChangeTeam2 <= -100) {

                                    finalObj.team2 = retrievedOdds.team2;
                                    finalObj.team2OddsChange = oddsChangeTeam2;
                                    finalObj.team2OriginalOdds = originalBetInfo.team2StartingOdds;
                                    finalObj.team2UpdatedOdds = retrievedOdds.team2Odds;

                                

                                }

                                finalObj.location = retrievedOdds.book;

                                array.push(finalObj);

                                totalAlerts++;

                                let alertObj = {

                                    info: finalObj,
                                    sent: false

                                }

                                Alerts.create(alertObj).then(data3 => {
                                    if (data3) {
                                        return 'success'
                                    }
                                }).catch(err => {
                                    return 'err';
                                })


                            }

                            let updateObj = {
                                team1LiveOdds: retrievedOdds.team1Odds,
                                team2LiveOdds: retrievedOdds.team2Odds
                            }

                            Odds.update(updateObj, { where : { identifier : originalBetInfo.identifier } }).then(arr => {

                                if (arr[0]) {

                                    return 'success';

                                }

                            }).catch(err => {
                                return;
                            })

                        }

                    })


                }

            }

        }

        console.log(totalAlerts);

        console.log(array);

        io.to('ncaa_basketball').emit('receive_ping', JSON.parse(JSON.stringify(array)));

    } else {

        console.log('no point');

    }
}

exports.updateForTesting = (req, res) => {

    const id = req.params.id;

    let obj = {

        team1StartingOdds: req.body.team1StartingOdds,
        team2StartingOdds: req.body.team2StartingOdds

    }

    Odds.update(obj, { where : { id : id } }).then(arr => {

        if (arr[0]) {

            Odds.findOne({ where : { id : id } }).then(data => {

                if (data) {

                    res.send({

                      message: 'Success!',
                      data: data
                        
                    })

                }

            }).catch(err => {

                res.send({

                    message: 'Error'

                })

            })

        }

    })

}

exports.getOdds = (req, res) => {

    Odds.findAll().then(data => {
        if (data) {
            res.send({
                message: 'Success!',
                data: data
            })
        }
    }).catch(err => {
        res.send({
            message: 'Error!'
        })
    })

}

exports.handleUserJoiningRoom = (socket) => {
    
    socket.join('ncaa_basketball');

}

exports.handleUserLeavingRoom = (socket) => {
    
    socket.leave('ncaa_basketball');

}

exports.createAlert = async (body) => {

    if (!body.info) {
        return;
    }

    let newObj = {
        info: body.info,
        sent: false
    }

    Alerts.create(newObj).then(data => {
        if (data) {
            return 'success';
        }
    }).catch(err => {
        return 'err';
    });


}

exports.getAlerts = async (req, res) => {

    Alerts.findAll().then(data => {

        res.send({
            message: 'Success',
            data: data
        })

    }).catch(err => {
        return 'err';
    })

}