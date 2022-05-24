import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { nameValidator } from '../helpers/nameValidator'
import { codeValidator } from '../helpers/codeValidator'
import { db } from '../../firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function JoinScreen({ navigation }) {
  const [name, setName] = useState({ value: '', error: '' })
  const [code, setCode] = useState({ value: '', error: '' })

  const onJoinPressed = async () => {
    const nameError = nameValidator(name.value)
    const codeError = await codeValidator(code.value)
    if (nameError || codeError) {
      setName({ ...name, error: nameError })
      setCode({ ...code, error: codeError })
      return
    }

    var data = (await getDoc(doc(db, 'rooms', code.value))).data()
    var players = data['players']
    var totalJoins = data['totalJoins']
    var player = {id: totalJoins, name:name.value}
    players.push(player)

    await updateDoc(doc(db, 'rooms', code.value), {
      players: players,
      totalJoins: totalJoins + 1
    })

    navigation.reset({
      index: 0,
      routes: [{ name: 'Dashboard', params: {code: code.value, player: player} }],
    })
  }

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Join Room</Header>
      <TextInput
        label="Name"
        returnKeyType="next"
        value={name.value}
        onChangeText={(text) => setName({ value: text, error: '' })}
        error={!!name.error}
        errorText={name.error}
      />
      <TextInput
        label="Code"
        keyboardType='numeric'
        value={code.value}
        onChangeText={(text) => setCode({ value: text, error: '' })}
        error={!!code.error}
        errorText={code.error}
        autoCapitalize="none"
      />
      <Button mode="contained" onPress={onJoinPressed}>
        Join
      </Button>
      <View style={styles.row}>
        <Text>Haven't created a Room? </Text>
        <TouchableOpacity onPress={() => navigation.replace('CreateScreen')}>
          <Text style={styles.link}>Create one</Text>
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
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})
