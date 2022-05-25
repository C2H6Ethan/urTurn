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
    fetchPlayers();
    const unsub = onSnapshot(doc(db, "rooms", code), (doc) => {
      fetchPlayers();
    });
    return () => {
      console.log("bruh")
      leaveRoom();
    };
  }, []);


  const fetchPlayers = async() => {
    if (code){
      await getDoc(doc(db, 'rooms', code))
        .then(room => {
          if (room.exists) {
            var newPlayers = room.data()['players']
            var otherPlayers = room.data()['players']
            var namesOnly = []
            newPlayers.forEach(player => {
              namesOnly.push(player['name'])
            });
            var index = newPlayers.findIndex(x => x.id === player['id']);
            otherPlayers.splice(index, 1)
            setError(null);
            setPlayers(newPlayers);
            setOtherPlayers(otherPlayers);
            setPlayerNames(namesOnly);
            
          } else {
            setError('players-not-found');
            setPlayers();
            setOtherPlayers();
          }
        })
        .catch(() => setError('players-get-fail'));
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
        onPress={() => navigation.navigate('WheelOfFortune', {playerNames})}
      >
        Spin the Wheel
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
