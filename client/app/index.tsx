import { View, SafeAreaView, Text, TouchableOpacity, TextInput, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import User from '@/models/User'
import socket from '@/components/socket'


export default function StartPage() {

  const [user, setUser] = useState(new User(null, null, socket));
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
    
  })

  return (
    <SafeAreaView style={{width: '100%', height: '100%'}}
    >
      <KeyboardAvoidingView 
        style={{position: 'absolute', height: '100%', width: '100%', top: '0%', left: '0%'}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
      <View style={{flex: 1}}
      >
        <Text style={{color: 'white', fontSize: 28, alignSelf: 'center'}}>
          Value
        </Text>

        <TouchableOpacity style={{borderWidth: 1, borderColor: 'white', position: 'absolute', top: '30%', left: '22.5%', opacity: startScreenPosition === 0 ? 1 : 0.5}}
          onPress={() => changePosition(0)}
        >
          <Text style={{color: 'white', paddingTop: 7, paddingBottom: 7, paddingLeft: 17, paddingRight: 17}}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{borderWidth: 1, borderColor: 'white', position: 'absolute', top: '30%', left: '52.5%', opacity: startScreenPosition === 1 ? 1 : 0.5}}
          onPress={() => changePosition(1)}
        >
          <Text style={{color: 'white', paddingTop: 7, paddingBottom: 7, paddingLeft: 17, paddingRight: 17}}>Register</Text>
        </TouchableOpacity>


        <View style={{position: 'absolute', width: '100%', height: '40%', top: '45%', alignSelf: 'center', display: startScreenPosition === 0 ? 'flex' : 'none'}}>

          <TextInput 
            value={suUsernameHolder}
            onChangeText={(input) => setUsername(input)}
            onPressOut={() => Keyboard.dismiss()}
            style={{width: 200, height: 40, borderWidth: 1, marginBottom: '5%', backgroundColor: 'white', alignSelf: 'center', textAlign: 'center'}}
            placeholder='Email'
            placeholderTextColor={'grey'}
          />

          <TextInput 
            value={suPasswordHolder}
            onChangeText={(input) => setPassword(input)}
            onPressOut={() => Keyboard.dismiss()}
            style={{width: 200, height: 40, borderWidth: 1, backgroundColor: 'white', alignSelf: 'center', textAlign: 'center'}}
            placeholder='Password'
            placeholderTextColor={'grey'}
          />

          <TouchableOpacity style={{borderWidth: 1, borderColor: 'white', position: 'absolute', alignSelf: 'center', top: 150}}
            onPress={() => user.logIn({email: username, password: password})}
          >
            <Text style={{color: 'white', paddingTop: 7, paddingBottom: 7, paddingLeft: 17, paddingRight: 17}}>Log In</Text>
          </TouchableOpacity>

        </View>

        <View style={{position: 'absolute', width: '100%', height: '40%', top: '45%', alignSelf: 'center', display: startScreenPosition === 1 ? 'flex' : 'none'}}>

          <TextInput 
            value={rUsernameHolder}
            onChangeText={(input) => setUsername(input)}
            style={{width: 200, height: 40, borderWidth: 1, marginBottom: '5%', backgroundColor: 'white', alignSelf: 'center', textAlign: 'center'}}
            placeholder='Email'
            placeholderTextColor={'grey'}
          />

          <TextInput 
            value={rPasswordHolder}
            onChangeText={(input) => setPassword(input)}
            style={{width: 200, height: 40, borderWidth: 1, marginBottom: '5%', backgroundColor: 'white', alignSelf: 'center', textAlign: 'center'}}
            placeholder='Password'
            placeholderTextColor={'grey'}
          />

          <TextInput 
            value={rConfirmPasswordHolder}
            onChangeText={(input) => setConfirmPassword(input)}
            style={{width: 200, height: 40, borderWidth: 1, backgroundColor: 'white', alignSelf: 'center', textAlign: 'center'}}
            placeholder='Confirm Password'
            placeholderTextColor={'grey'}
          />

          <TouchableOpacity style={{borderWidth: 1, borderColor: 'white', position: 'absolute', alignSelf: 'center', top: 190}}
            onPress={() => user.register({email: username, password: password, confirmPassword: confirmPassword})}
          >
            <Text style={{color: 'white', paddingTop: 7, paddingBottom: 7, paddingLeft: 17, paddingRight: 17}}>Register</Text>
          </TouchableOpacity>

        </View>



      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}