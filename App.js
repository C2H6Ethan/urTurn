import React, { Component } from 'react';
import { Provider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { theme } from './src/core/theme'
import {
  StartScreen,
  JoinScreen,
  CreateScreen,
  ResetPasswordScreen,
  Dashboard,
  WheelOfFortuneScreen,
  FlappyBeer
} from './src/screens'
import { db } from './firebase'
import { collection, getDocs } from 'firebase/firestore';

const Stack = createStackNavigator()

export default class App extends Component {

  constructor (props){
    super(props);

    this.state = {
        
    };
  }

 
  render(){
    return (
      <Provider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="StartScreen"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="StartScreen" component={StartScreen} />
            <Stack.Screen name="JoinScreen" component={JoinScreen} />
            <Stack.Screen name="CreateScreen" component={CreateScreen} />
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen
              name="ResetPasswordScreen"
              component={ResetPasswordScreen}
            />
            <Stack.Screen name="WheelOfFortune" component={WheelOfFortuneScreen} />
            <Stack.Screen name="FlappyBeer" component={FlappyBeer} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }
}
