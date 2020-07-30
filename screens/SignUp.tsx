import { StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Button } from 'react-native';
import * as firebase from 'firebase'
import { RootStackParamList } from '../types';

export default function NotFoundScreen({
  navigation,
  route,
}: StackScreenProps<RootStackParamList, 'SignUp'>) {
  const role = route.params.params.role;
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');  

  const handleLogIn = () => {
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(result => {
      navigation.navigate('Root', {
        screen: 'Home',
        params: {
          role
        },
      });

    })
    .catch(function(error) {
      setError(error.message);
    })
  }
  const handleSignUp = ()=> {
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(result=> navigation.navigate('Onboarding', {params: {role}}))
    .catch(err=> {
      if(err.code === 'auth/email-already-in-use') {
        handleLogIn()
      } else {
      setError(err.message);
      }
    } 
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up / Log in</Text>
      <Text style={styles.error}>{error}</Text>
      <TextInput style={styles.input} placeholder="email" value={email} onChangeText={(text)=> setEmail(text)} />
      <TextInput style={styles.input} secureTextEntry placeholder="password" value={password} onChangeText={(text)=> setPassword(text)} />
      <Button title='Sign up' onPress={()=> handleSignUp()}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  inputView: {
  },
  input: {
    borderStyle: 'solid',
    width: '90%',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: 'grey',
    margin: 10,
  },
  error: {
    color: 'red',
  }
});
