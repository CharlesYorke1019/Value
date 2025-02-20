import { Animated, View, TouchableOpacity, Text } from "react-native"
import { useState } from "react"
import Icon from 'react-native-vector-icons/FontAwesome'
import Icon2 from 'react-native-vector-icons/AntDesign'

interface menuProps {
    display: any
    leftValue: any
    toggleMenuFunc: any
}

const Menu: React.FC<menuProps> = ({display, leftValue, toggleMenuFunc}) => {

    // const leftValue = useState(new Animated.Value(0))[0];

    return (
        <Animated.View style={{marginLeft: leftValue, display: display ? 'flex' : 'none', borderWidth: 1, borderRadius: 5, borderColor: 'white', width: '60%', height: '100%', left: '-80%', top: '0%', position: 'absolute', zIndex: 1000, backgroundColor: 'black'}}>

            <TouchableOpacity style={{alignSelf: 'center', marginTop: '5%'}}
                onPress={() => toggleMenuFunc()}
            >
                <Icon2 name="menufold" color={'white'} size={20}  />
            </TouchableOpacity>        

            <TouchableOpacity style={{width: '95%', height: '7%', alignSelf: 'center', marginTop: '20%', borderTopWidth: 2, borderBottomWidth: 2, borderColor: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>

                <Icon name="user" color={'white'} size={14} style={{marginRight: '10%'}} />
                <Text style={{color: 'white', textAlign: 'center', fontSize: 14, fontFamily: 'sans-serif-thin'}}>Account</Text>

            </TouchableOpacity>


        </Animated.View>
    )

}

export default Menu;