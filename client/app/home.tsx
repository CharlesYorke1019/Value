import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";

export default function HomePage() {

    return (

        <SafeAreaView style={{width: '100%', height: '100%'}}>

            <View style={{flex: 1}}>

                <TouchableOpacity style={{position: 'absolute', alignSelf: 'center', top: '20%'}}>
                    <Text style={{textAlign: 'center', fontSize: 24, color: 'white'}}>NCAA Basketball</Text>
                </TouchableOpacity>

            </View>

        </SafeAreaView>

    )

}