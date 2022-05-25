import React,{ useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import BackButton from '../components/BackButton'
import WheelOfFortune from 'react-native-wheel-of-fortune'

export default function WheelOfFortuneScreen({ route, navigation }) {
  const { playerNames } = route.params;
  const [winnerValue, setWinnerValue] = useState();
  const [winnerIndex, setWinnerIndex] = useState();
  const [child, setChild] = useState();
  const participants = playerNames;

  useEffect(() => {
    // child._onPress()
  }, []);

  const wheelOptions = {
    rewards: participants,
    winner: 1,
    knobSize: 25,
    borderWidth: 5,
    borderColor: '#560cce',
    innerRadius: 30,
    duration: 6000,
    backgroundColor: '#560cce',
    textAngle: 'horizontal',
    knobSource: require('../assets/knob.png'),
    onRef: ref => (setChild(ref)),
  };

  const wheelSpinFinish = async(value, index) => {
    setWinnerValue(value) 
    setWinnerIndex(index)
    await new Promise(resolve => setTimeout(resolve, 2000)); 
    navigation.navigate('Dashboard')
  }

  return (
    <Background >
        <BackButton goBack={navigation.goBack} />
        <WheelOfFortune
          options={wheelOptions}
          getWinner={(value, index) => {wheelSpinFinish(value, index)}
          }
        />
        <Button mode="contained" onPress={ () => { child._onPress() } }> Spin! </Button>
        
    </Background>
    // <Background>
    //   <Logo />
    //   <Header>Wheel Of Fortune</Header>
    //   <WheelOfFortune 
    //      wheelOptions={wheelOptions} getWinner={(value, index) => {setWinnerValue(value); setWinnerIndex(index)}}
    //   />
    // </Background>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: 'rgba(0,0,0,.5)',
    marginTop: 50,
    padding: 5,
  },
  startButtonText: {
    fontSize: 50,
    color: '#fff',
    fontWeight: 'bold',
  },
  winnerView: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tryAgainButton: {
    padding: 10,
  },
  winnerText: {
    fontSize: 30,
  },
  tryAgainButton: {
    padding: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  tryAgainText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});