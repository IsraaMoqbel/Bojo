import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as firebase from 'firebase';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { firebaseConfig } from './firebaseConfig';

firebase.initializeApp(firebaseConfig);

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  function saveUser() {
    firebase.database().ref('users/' + '7Us8CObAZmFUBA44Jcp2').set({
      username: 'israa'
    }).then(e=> console.log(e))
    .catch(err=> console.log(err))    
  }
  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
