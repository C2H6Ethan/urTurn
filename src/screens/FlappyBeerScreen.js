import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { Text, Image, View, Alert, Modal, StyleSheet } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import entities from '../entities';
import Physics from '../physics';
import { db } from '../../firebase'
import { doc, getDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { theme } from '../core/theme'

export default function FlappyBeerScreen({ route, navigation }) {
  const { player } = route.params;
  const { code } = route.params;
  const [running, setRunning] = useState(false)
  const [gameEngine, setGameEngine] = useState(null)
  const [loserModalVisible, setLoserModalVisible] = useState(false)
  const [loserText, setLoserText] = useState("")
  const [winnerModalVisible, setWinnerModalVisible] = useState(false)
  useEffect(() => {
    setRunning(true)
    const unsub = onSnapshot(doc(db, "rooms", code), (doc) => {
      var loser = doc.data()['flappyBeer']['loser']
      if(loser){stopGame(loser)}
    });
  }, [])

  const stopGame = async(loser) => {
    //check if you lost game
    if(loser['userId'] == player['id']){
      console.log("u lost")
      //show loser modal
      setLoserModalVisible(true)
    }
    else{
      if(running){
        setRunning(false)
        gameEngine.stop()
      }
      
      //show who lost modal
      setLoserText("It's " + loser['userName'] + "'s Turn!")
      setWinnerModalVisible(true)
    }

    await new Promise(resolve => setTimeout(resolve, 2000)); 
    setWinnerModalVisible(false)
    setLoserModalVisible(false)
    navigation.navigate('Dashboard')
    
  }

  const lostGame = async() => {
    setRunning(false)
    gameEngine.stop()

    //check if someone else has already lost
    var room = await getDoc(doc(db, 'rooms', code))
    if(!room.data()['flappyBeer']['loser'])
    {
      var loser = {userId: player['id'], userName: player['name']}
      await updateDoc(doc(db, 'rooms', code), {
        flappyBeer: {isRunning: false, loser: loser}
      })
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.surface, }}>
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

      <GameEngine
        ref={(ref) => { setGameEngine(ref) }}
        systems={[Physics]}
        entities={entities()}
        running={running}
        onEvent={(e) => {
          switch (e.type) {
            case 'game_over':
              lostGame()
              break;
          }
        }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <StatusBar style="auto" hidden={true} />

      </GameEngine>

    </View>
  );
}

const styles = StyleSheet.create({
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