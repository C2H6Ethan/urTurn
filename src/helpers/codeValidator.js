import { db } from '../../firebase'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

export async function codeValidator(code) {
  if (code.length != 6) return "Code must be 6 digits long."


  var room = await getDoc(doc(db, 'rooms', code))

  if (!room.exists()) return "No Room with this code has been found"
  return ''
}
