import React from 'react'
import { View } from "react-native";
import { StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import { theme } from '../core/theme'

export default function Nametag(props) {
  return(
    <View style={styles.background}>
        <Text style={styles.text} {...props} />
    </View>
  ) 
}

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    left: 5,
    top: 5,
    backgroundColor: theme.colors.primary,
    minWidth: 100,
    minHeight: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  text: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 25,
  },
})
