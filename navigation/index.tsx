import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import NotFoundScreen from '../screens/NotFoundScreen';
import ParentOrNanny from '../screens/ParentOrNanny';
import SignUp from '../screens/SignUp';
import Onboarding from '../screens/Onboarding';
import Splash from '../screens/Splash';

import { RootStackParamList } from '../types';
import BottomTabNavigator from './BottomTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  const [isLoggedIn, setIsLoggedIn] = React.useState('false');
  const [isLoading, setIsLoading] = React.useState(true);

  
  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userStatus;
      try {
        userStatus = await AsyncStorage.getItem('isLoggedIn');
        setIsLoading(false);
        setIsLoggedIn(userStatus);
      } catch (e) {
        setIsLoading(false);
        // Restoring token failed
      }
    }
    bootstrapAsync()
  })
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {
        isLoading ? <Stack.Screen name="Splash" component={Splash} options={{ title: 'BOJO' }} /> : 
        isLoggedIn === 'true' ? 
      <Stack.Screen name="Root" component={BottomTabNavigator} /> :
        <>
      <Stack.Screen name="ParentOrNanny" component={ParentOrNanny} options={{ title: 'parent or nanny!' }} />
      <Stack.Screen name="SignUp" component={SignUp} options={{ title: 'sign up' }} />
      <Stack.Screen name="Onboarding" component={Onboarding} options={{ title: 'Onboarding' }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Screen name="Root" component={BottomTabNavigator} />
        </> 
      }
    </Stack.Navigator>
  );
    }