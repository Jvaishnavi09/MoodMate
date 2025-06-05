import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export const fetchMoods = async (uid) => {
  const ref = doc(db, "users", uid);
  const docSnap = await getDoc(ref);
  if (docSnap.exists()) {
    return docSnap.data().moods || {};
  }
  return {};
};
