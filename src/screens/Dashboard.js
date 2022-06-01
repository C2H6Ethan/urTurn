import React, { useEffect, useState } from "react";
import { View, StyleSheet, Modal, Text } from 'react-native'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Nametag from "../components/Nametag";
import Paragraph from '../components/Paragraph'
import Button from '../components/Button'
import GameModeButton from "../components/GameModeButton";
import { db } from '../../firebase'
import { doc, getDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { theme } from '../core/theme'

export default function Dashboard({ route, navigation }) {
  const { code } = route.params;
  const { player } = route.params;
  const [admin, setAdmin] = useState();
  const [players, setPlayers] = useState();
  const [otherPlayers, setOtherPlayers] = useState();
  const [playerNames, setPlayerNames] = useState();
  const [notifyModal, setNotifyModal] = useState(false);
  const [notifyModalText, setNotifyModalText] = useState("");
  const [error, setError] = useState();

  useEffect(async() => {
    // fetchPlayers();
    const unsub = onSnapshot(doc(db, "rooms", code), (doc) => {
      if(doc.data() != null){
        if(doc.data()['flappyBeer']['isRunning'] == true){console.log("flappy beer has started"); navigation.navigate('FlappyBeer', {player, code})}
        fetchPlayers(doc);
      }
      
    });
  }, []);

  const fetchPlayers = async(doc) => {
    if(code){
      var data = doc.data()
      var newPlayers = data['players']
      var otherPlayers = data['players']
      var namesOnly = []
      newPlayers.forEach(player => {
        namesOnly.push(player['name'])
      });
      var index = newPlayers.findIndex(x => x.id === player['id']);
      otherPlayers.splice(index, 1)
      setPlayers(data['players']);
      setOtherPlayers(otherPlayers);
      setPlayerNames(namesOnly);
      setAdmin(data['admin']);
    }
  }


  const leaveRoom = async() =>{
    navigation.reset({
      index: 0,
      routes: [{ name: 'StartScreen' }],
    })
    var newPlayers = players
    var index = newPlayers.findIndex(x => x.id === player['id']);
    newPlayers.splice(index, 1)

    //delete room or player
    if(newPlayers.length == 0){
      await deleteDoc(doc(db, "rooms", code));
    }
    else{
      await updateDoc(doc(db, 'rooms', code), {
        players: newPlayers
      })
    }
  }

  const startFlappyBeer = async() =>{
    await updateDoc(doc(db, 'rooms', code), {
      flappyBeer: {isRunning: true}
    })
  }
  
  const showNotifyModal = async(notifyModalText) => {
    setNotifyModalText(notifyModalText);
    setNotifyModal(true);

    //hide after 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000)); 
    setNotifyModal(false);
  }


  // var data = (await getDoc(doc(db, 'rooms', code.value))).data()
  // var players = data['players']
  return (
    <Background>
      <Modal
        animationType="slide"
        transparent={true}
        visible={notifyModal}
        onRequestClose={() => {
          setNotifyModal(!notifyModal);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{notifyModalText}</Text>
          </View>
        </View>
      </Modal>

      <Nametag>{player['name']}</Nametag>
      <Header>{code}</Header>
      <Logo />
      <View style={styles.namesContainer}>
        { otherPlayers?.map((player) => (
          <Paragraph style={styles.playerName}>{player['name']}</Paragraph>
          ))
        }
      </View>
      
      { player['isAdmin']? 
        <View style={styles.gameModes}>
          <GameModeButton gameImage={require('../assets/spin_the_wheel.png')} onPress={() => navigation.navigate('WheelOfFortune', {player, players, playerNames})}/>
          <GameModeButton gameImage={require('../assets/flappy_beer.png')} onPress={() => startFlappyBeer()}/>
        </View>
       : <View style={styles.gameModes}>
          <GameModeButton gameImage={require('../assets/spin_the_wheel_gray.png')} onPress={() => showNotifyModal("ask " + admin['name'] + " to chose a game!")}/>
          <GameModeButton gameImage={require('../assets/flappy_beer_gray.png')} onPress={() => showNotifyModal("ask " + admin['name'] + " to chose a game!")}/>
        </View>
      }
      
      <Button
        mode="outlined"
        onPress={() => leaveRoom()}
      >
        Leave Room
      </Button>
    </Background>
  )
}

const styles = StyleSheet.create({
  gameModes: {
    flexDirection: "row",
    flexWrap: 'wrap',
  },
  namesContainer: {
    maxWidth: 150,
    flexDirection: "row",
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
  },
  playerName: {
    marginHorizontal: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    backgroundColor: theme.colors.primary,
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
  modalText: {
    textAlign: "center",
    fontSize: 30,
  },
})
