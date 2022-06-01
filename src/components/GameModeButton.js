import React from 'react'
import { Image, StyleSheet, TouchableOpacity } from 'react-native'

export default function GameModeButton({gameImage, ...props}) {
  return (
    <TouchableOpacity activeOpacity={1} style={styles.container} {...props}>
      <Image
        style={styles.image}
        source={gameImage}
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 125,
    height: 125,
    margin: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
})
