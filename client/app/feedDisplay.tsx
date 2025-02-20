import Feed from "@/components/feed";
import { View, SafeAreaView, TouchableOpacity, Text, ScrollView } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import socket from "@/components/socket";
import Icon from 'react-native-vector-icons/Entypo'
import { Provider, useSelector } from "react-redux";
import { store, setAlerts, getAlerts } from "@/models/store";


export default function FeedDisplay() {

    // https://account.sportsbook.fanduel.com/sportsbook/
    

    const [data, setData] = useState<any>([]);
    const [header, setHeader] = useState<any>('');

    const state = store.getState();

    let elementArr = [];

    for (let i = data.length - 1; i >= 0; i--) {
        
        elementArr.push(
            <View key={i} style={{width: '98%',  alignSelf: 'center', borderStyle: 'solid', borderColor: 'white', borderTopWidth: 2, borderBottomWidth: 2, marginTop: 10, padding: 20, marginBottom: '5%'}}>
                <Text style={{color: 'white', textAlign: 'center', marginBottom: '2%', fontFamily: 'Baskerville'}}>{data[i].team1} has shifted {data[i].team1OddsChange} {"\n"} (started at {data[i].team1OriginalOdds} & now at {data[i].team1UpdatedOdds})</Text>
                <Text style={{color: 'white', textAlign: 'center', marginBottom: '2%', fontFamily: 'Baskerville'}}>{data[i].team2} has shifted {data[i].team2OddsChange} {"\n"} (started at {data[i].team2OriginalOdds} & now at {data[i].team2UpdatedOdds})</Text>
                <Text style={{color: 'white', textAlign: 'center', fontFamily: 'Baskerville'}}>Location: {data[i].location}</Text>
                <TouchableOpacity style={{alignSelf: 'center', backgroundColor: 'green', marginTop: '5%'}} 
                    onPress={() => {
                        router.navigate('https://account.sportsbook.fanduel.com/sportsbook/')
                    }}
                >
                    <Text style={{color: 'white', paddingLeft: 15, paddingRight: 15, paddingTop: 5, paddingBottom: 5, fontFamily: 'Baskerville'}}>GO</Text>
                </TouchableOpacity>
            </View> 
        )
    }

    setInterval(() => {
        socket.emit('sent_ping');
    }, 10000);

    socket.on('receive_ping', (sentData: any) => {

        let results = data;

        if (sentData.length <= 0) {
            setHeader('No new updates')
        } else {
            setHeader('Latest updates')
        }
        
        sentData.forEach((el: any, index: any) => {

            let newObj = {
                team1: el.team1,
                team2: el.team2,
                team1OddsChange: el.team1OddsChange,
                team2OddsChange: el.team2OddsChange,
                team1OriginalOdds: el.team1OriginalOdds,
                team2OriginalOdds: el.team2OriginalOdds,
                team1UpdatedOdds: el.team1UpdatedOdds,
                team2UpdatedOdds: el.team2UpdatedOdds,
                location: el.location
            }

            if (!results.includes(newObj)) {
                results.push(newObj);
            }

            // results.push(newObj);

            // if (!data.includes(newObj)) {
            //     setData([
            //         ...data,
            //         newObj
            //     ])
            // }

            // setData([
            //     ...data,
            //     newObj
            // ])



        });

        setData([
            ...results
        ])

    });

    function navigate(page: any) {
        socket.emit('leaveRoomEmit')
        router.push({
            pathname: page
        })
    }

    return (

        <Provider store={store}>

        <SafeAreaView style={{width: '100%', height: '100%'}}>

            <View style={{flex: 1, backgroundColor: 'black'}}>

                <View style={{width: '98%', alignSelf: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '5%'}}>

                    <TouchableOpacity style={{marginBottom: '6%'}}
                        onPress={() => navigate('/home')}
                    >
                        <Icon name="home" color={'white'} size={28} />
                    </TouchableOpacity>

                    <Text style={{color: 'white', fontSize: 28, fontFamily: 'Baskerville-Bold'}}>
                        NCAA BASKETBALL
                    </Text>

                </View>

                <ScrollView style={{position: 'absolute', height: '80%', width: '98%', alignSelf: 'center', top: '17.5%', borderColor: 'white', borderTopWidth: 1, borderBottomWidth: 1}} contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}} scrollsToTop={false} showsVerticalScrollIndicator={false}>
                    <Text style={{textAlign: 'center', color: 'white', fontSize: 24, marginTop: '5%', marginBottom: '5%'}}>{header}</Text>

                    {elementArr}

                </ScrollView>
                
                

            </View>


        </SafeAreaView>

        </Provider>

    )

}