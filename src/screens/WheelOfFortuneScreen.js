import React,{ useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Modal
} from 'react-native';
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import BackButton from '../components/BackButton'
import WheelOfFortune from 'react-native-wheel-of-fortune'
import { theme } from '../core/theme';

export default function WheelOfFortuneScreen({ route, navigation }) {
  const { player } = route.params;
  const { playerNames } = route.params;
  const { players } = route.params;
  const [loserValue, setLoserValue] = useState();
  const [loserIndex, setLoserIndex] = useState();
  const [child, setChild] = useState();
  const [loserModalVisible, setLoserModalVisible] = useState(false)
  const [loserText, setLoserText] = useState("")
  const [winnerModalVisible, setWinnerModalVisible] = useState(false)
  const participants = playerNames;

  useEffect(() => {
    // child._onPress()
  }, []);

  const wheelOptions = {
    rewards: participants,
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
    setLoserValue(value) 
    setLoserIndex(index)

    var loser = players[index]

    //check if you lost game
    if(loser['id'] == player['id']){
      console.log("u lost")
      //show loser modal
      setLoserModalVisible(true)
    }
    else{
      //show who lost modal
      setLoserText("It's " + value + "'s Turn!")
      setWinnerModalVisible(true)
    }

    await new Promise(resolve => setTimeout(resolve, 2000)); 
    setWinnerModalVisible(false)
    setLoserModalVisible(false)
    navigation.navigate('Dashboard')
  }

  return (
    <Background >

      <Modal
        animationType="slide"
        transparent={true}
        visible={loserModalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setLoserModalVisible(!loserModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.loserModalText}>It's ur Turn!</Text>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={winnerModalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setWinnerModalVisible(!winnerModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.winnerModalText}>{loserText}</Text>
          </View>
        </View>
      </Modal>

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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    backgroundColor: theme.colors.secondary,
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  loserModalText: {
    textAlign: "center",
    fontSize: 30,
    color: theme.colors.error
  },
  winnerModalText: {
    textAlign: "center",
    fontSize: 30,
    color: "#4BB543"
  },
});