import {db} from "./firebase";




export function createManager(uid, data) {
  return db
    .collection("Customers")
    .doc(uid)
    .set({ uid, ...data }, { merge: true });
}
export async function createManagerData(uid, data) {
  return db
    .collection("Customers")
    .doc(uid)
    .set({ uid, ...data }, { merge: true }).then(()=>{
      db
    .collection("Cart")
    .doc(uid)
    .set({ items: 0 }, { merge: true }).then(()=>{
      
    });
    });
}

// export function createSite(data) {
//   const site = firestore.collection("sites").doc();
//   site.set(data);

//   return site;
// }
