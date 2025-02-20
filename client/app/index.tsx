import { View, SafeAreaView, Text, TouchableOpacity, TextInput, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import User from '@/models/User'
import socket from '@/components/socket'
import { Provider } from 'react-redux';
import { store, setUserInfoSuccessfulLogIn } from '@/models/store'

export default function StartPage() {

  const [user, setUser] = useState<any>(new User(null, null, socket));
  const [startScreenPosition, setStartScreenPosition] = useState(0);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  function changePosition(position: any) {
    setStartScreenPosition(position);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  }

  let suUsernameHolder;
  let suPasswordHolder;

  let rUsernameHolder;
  let rPasswordHolder;
  let rConfirmPasswordHolder;

  user.socket.on('registerSuccessful', () => {
    setStartScreenPosition(0);
  })

  user.socket.on('logInSuccessful', (userData: any) => {  

    store.dispatch(setUserInfoSuccessfulLogIn(userData));

    router.push({
      pathname: '/home'
    });
  })

  function userLogsIn() {
    socket.emit('logIn', {email: username, password: password})
  }

  function userRegisters() {
    socket.emit('register', {email: username, password: password, confirmPassword: confirmPassword})
  }

  return (
    <Provider store={store}>
    <SafeAreaView style={{width: '100%', height: '100%', backgroundColor: 'black', zIndex: -5}}
    >
      <KeyboardAvoidingView 
        style={{position: 'absolute', height: '100%', width: '100%', top: '0%', left: '0%', backgroundColor: 'black', zIndex: -5}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
      <View style={{flex: 1, backgroundColor: 'black'}}
      >
        <Text style={{color: 'white', fontSize: 56, alignSelf: 'center', fontFamily: 'Baskerville-Bold', marginTop: '20%'}}>
          Value
        </Text>

        <TouchableOpacity style={{borderWidth: 1, borderColor: 'white', position: 'absolute', top: '30%', left: '22.5%', width: '25%', opacity: startScreenPosition === 0 ? 1 : 0.5}}
          onPress={() => changePosition(0)}
        >
          <Text style={{color: 'white', fontFamily: 'Baskerville', fontSize: 18, textAlign: 'center', paddingTop: 7, paddingBottom: 7}}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{borderWidth: 1, borderColor: 'white', position: 'absolute', top: '30%', left: '52.5%', width: '25%', opacity: startScreenPosition === 1 ? 1 : 0.5}}
          onPress={() => changePosition(1)}
        >
          <Text style={{color: 'white', fontFamily: 'Baskerville', fontSize: 18, textAlign: 'center', paddingTop: 7, paddingBottom: 7}}>Register</Text>
        </TouchableOpacity>


        <View style={{position: 'absolute', width: '100%', height: '40%', top: '45%', alignSelf: 'center', display: startScreenPosition === 0 ? 'flex' : 'none'}}>

          <TextInput 
            value={suUsernameHolder}
            onChangeText={(input) => setUsername(input)}
            onPressOut={() => Keyboard.dismiss()}
            style={{width: 200, height: 40, borderWidth: 1, marginBottom: '5%', backgroundColor: 'white', alignSelf: 'center', textAlign: 'center', fontFamily: 'Baskerville'}}
            placeholder='Email'
            placeholderTextColor={'grey'}
          />

          <TextInput 
            value={suPasswordHolder}
            onChangeText={(input) => setPassword(input)}
            onPressOut={() => Keyboard.dismiss()}
            style={{width: 200, height: 40, borderWidth: 1, backgroundColor: 'white', alignSelf: 'center', textAlign: 'center', fontFamily: 'Baskerville'}}
            placeholder='Password'
            placeholderTextColor={'grey'}
            secureTextEntry={true}
          />

          <TouchableOpacity style={{borderWidth: 1, borderColor: 'white', position: 'absolute', alignSelf: 'center', top: 150}}
            onPress={() => userLogsIn()}
          >
            <Text style={{color: 'white', paddingTop: 7, paddingBottom: 7, paddingLeft: 17, paddingRight: 17, fontFamily: 'Baskerville'}}>Log In</Text>
          </TouchableOpacity>

        </View>

        <View style={{position: 'absolute', width: '100%', height: '40%', top: '45%', alignSelf: 'center', display: startScreenPosition === 1 ? 'flex' : 'none'}}>

          <TextInput 
            value={rUsernameHolder}
            onChangeText={(input) => setUsername(input)}
            style={{width: 200, height: 40, borderWidth: 1, marginBottom: '5%', backgroundColor: 'white', alignSelf: 'center', textAlign: 'center', fontFamily: 'Baskerville'}}
            placeholder='Email'
            placeholderTextColor={'grey'}
          />

          <TextInput 
            value={rPasswordHolder}
            onChangeText={(input) => setPassword(input)}
            style={{width: 200, height: 40, borderWidth: 1, marginBottom: '5%', backgroundColor: 'white', alignSelf: 'center', textAlign: 'center', fontFamily: 'Baskerville'}}
            placeholder='Password'
            placeholderTextColor={'grey'}
            secureTextEntry={true}
          />

          <TextInput 
            value={rConfirmPasswordHolder}
            onChangeText={(input) => setConfirmPassword(input)}
            style={{width: 200, height: 40, borderWidth: 1, backgroundColor: 'white', alignSelf: 'center', textAlign: 'center', fontFamily: 'Baskerville'}}
            placeholder='Confirm Password'
            placeholderTextColor={'grey'}
            secureTextEntry={true}
          />

          <TouchableOpacity style={{borderWidth: 1, borderColor: 'white', position: 'absolute', alignSelf: 'center', top: 190}}
            onPress={() => userRegisters()}
          >
            <Text style={{color: 'white', paddingTop: 7, paddingBottom: 7, paddingLeft: 17, paddingRight: 17, fontFamily: 'Baskerville'}}>Register</Text>
          </TouchableOpacity>

        </View>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </Provider>
  );
}