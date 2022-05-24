import React, { useEffect, useState } from "react";
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Paragraph from '../components/Paragraph'
import Button from '../components/Button'
import { db } from '../../firebase'
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export default function Dashboard({ route, navigation }) {
  const { code } = route.params;
  const { player } = route.params;
  const [players, setPlayers] = useState();
  const [otherPlayers, setOtherPlayers] = useState();
  const [error, setError] = useState();

  useEffect(async() => {
    if (code) {
      await getDoc(doc(db, 'rooms', code))
        .then(room => {
          if (room.exists) {
            var players = room.data()['players']
            var index = players.findIndex(x => x.id === player['id']);
            var otherPlayers = players.splice(index, 1)
            console.warn(otherPlayers)
            setError(null);
            setPlayers(players);
            setOtherPlayers(otherPlayers)
          } else {
            setError('players-not-found');
            setPlayers();
            setOtherPlayers();
          }
        })
        .catch(() => setError('players-get-fail'));
    }
  });

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
      <Header>{code}</Header>
      <Logo />
      <Header>{player['name']}</Header>
      { otherPlayers?.map((player) => (
        <Paragraph>{player['name']}</Paragraph>
        ))
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
