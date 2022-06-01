import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { nameValidator } from '../helpers/nameValidator'
import { db } from '../../firebase'
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';


export default function CreateScreen({ navigation }) {
  const [name, setName] = useState({ value: '', error: '' })

  const onCreatePressed = async() => {
    const nameError = nameValidator(name.value)
    if (nameError) {
      setName({ ...name, error: nameError })
      return
    }
    
    var code = await createCode()
    var player = {id: 0, name:name.value, isAdmin: true}

    await setDoc(doc(db, "rooms", code), {
      players: [player],
      flappyBeer: {isRunning: false},
      totalJoins: 1,
      admin: player
    });

    navigation.reset({
      index: 0,
      routes: [{ name: 'Dashboard', params: {code: code, player: player} }],
    })
  }

  const createCode = async() => {
    var code = (Math.floor(100000 + Math.random() * 900000)).toString();
    if( await checkIfCodeExists(code)) {createCode();}
    else{return code}
  }

  const checkIfCodeExists = async(code) => {
    const roomsCol = collection(db, 'rooms');
    const roomsSnapshot = await getDocs(roomsCol);
    const roomsList = roomsSnapshot.docs.map(doc => doc.data());
    const codes = [];
    roomsList.forEach(room => {
      codes.push(room['code'])
    });

    if (codes.includes(code)) return true
  }

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Create Room</Header>
      <TextInput
        label="Name"
        returnKeyType="next"
        value={name.value}
        onChangeText={(text) => setName({ value: text, error: '' })}
        error={!!name.error}
        errorText={name.error}
      />
      <Button
        mode="contained"
        onPress={onCreatePressed}
        style={{ marginTop: 24 }}
      >
        Create Room
      </Button>
      <View style={styles.row}>
        <Text>Already have a room? </Text>
        <TouchableOpacity onPress={() => navigation.replace('JoinScreen')}>
          <Text style={styles.link}>Join</Text>
        </TouchableOpacity>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})
