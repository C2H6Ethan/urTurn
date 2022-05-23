import React from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Paragraph from '../components/Paragraph'
import Button from '../components/Button'
import { doc, getDoc } from 'firebase/firestore';

export default async function Dashboard({ route, navigation }) {
  const { code } = route.params;
  console.warn(code)
  // var data = (await getDoc(doc(db, 'rooms', code.value))).data()
  // var players = data['players']
  return (
    <Background>
      <Logo />
      <Header>ss</Header>
      <Paragraph>
        Your amazing app starts here. Open you favorite code editor and start
        editing this project.
      </Paragraph>
      <Button
        mode="outlined"
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'StartScreen' }],
          })
        }
      >
        Logout
      </Button>
    </Background>
  )
}
