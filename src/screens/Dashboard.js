import React, { useEffect, useState } from "react";
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Nametag from "../components/Nametag";
import Paragraph from '../components/Paragraph'
import Button from '../components/Button'
import { db } from '../../firebase'
import { doc, getDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

export default function Dashboard({ route, navigation }) {
  const { code } = route.params;
  const { player } = route.params;
  const [players, setPlayers] = useState();
  const [otherPlayers, setOtherPlayers] = useState();
  const [playerNames, setPlayerNames] = useState();
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
      var newPlayers = doc.data()['players']
      var otherPlayers = doc.data()['players']
      var namesOnly = []
      newPlayers.forEach(player => {
        namesOnly.push(player['name'])
      });
      var index = newPlayers.findIndex(x => x.id === player['id']);
      otherPlayers.splice(index, 1)
      setPlayers(newPlayers);
      setOtherPlayers(otherPlayers);
      setPlayerNames(namesOnly);
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

  // var data = (await getDoc(doc(db, 'rooms', code.value))).data()
  // var players = data['players']
  return (
    <Background>
      <Nametag>{player['name']}</Nametag>
      <Header>{code}</Header>
      <Logo />
      { otherPlayers?.map((player) => (
        <Paragraph>{player['name']}</Paragraph>
        ))
      }
      <Button
        mode="contained"
        onPress={() => navigation.navigate('WheelOfFortune', {player, players, playerNames})}
      >
        Spin the Wheel
      </Button>
      <Button
        mode="contained"
        onPress={() => startFlappyBeer()}
      >
        Flappy Beer
      </Button>
      <Button
        mode="outlined"
        onPress={() => leaveRoom()}
      >
        Leave Room
      </Button>
    </Background>
  )
}
