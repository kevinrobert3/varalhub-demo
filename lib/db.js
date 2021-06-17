import {db} from "./firebase";




export function createManager(uid, data) {
  return db
    .collection("Customers")
    .doc(uid)
    .set({ uid, ...data }, { merge: true });
}

