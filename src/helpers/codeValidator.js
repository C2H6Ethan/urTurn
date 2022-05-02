import { db } from '../../firebase'
import { collection, getDocs } from 'firebase/firestore/lite';

export async function codeValidator(code) {
  if (code.length != 6) return "Code must be 6 digits long."

  const roomsCol = collection(db, 'rooms');
  const roomsSnapshot = await getDocs(roomsCol);
  const roomsList = roomsSnapshot.docs.map(doc => doc.data());
  const codes = [];
  roomsList.forEach(room => {
    codes.push(room['code'])
  });

  if (!codes.includes(code)) return "No Room with this code has been found"
  return ''
}
