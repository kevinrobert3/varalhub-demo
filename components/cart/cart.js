import React, {useState, useEffect} from 'react'
import {IoMdClose} from 'react-icons/io'
import {db } from '../../lib/firebase'
import { useAuth } from "../../lib/auth";
import Image from 'next/image'
import {IoMdAdd}  from 'react-icons/io'
import {AiOutlineMinus} from 'react-icons/ai'
import firebase from 'firebase/app'
import {BiTrash} from 'react-icons/bi'
import Link from 'next/link'

function Cart({setCartVisible, user}) {


    const auth = useAuth();

    const [loading, setLoading] = useState(false);
    const [empty, setEmpty] = useState(false);
    const [items, setItems]= useState([]);

    const [quantity, setQuantity] = useState(1);
  
  let incrementCounter = () => setQuantity(quantity + 1);
  let decrementCounter = () => setQuantity(quantity - 1);



    useEffect(()=>{
        db.collection("Cart").doc(auth.user.uid).collection("Items").onSnapshot((snapshot)=>{

            if(snapshot.size===0){
                setEmpty(true)
            }else{
                setEmpty(false)
            }

            const newItems=snapshot.docs.map((doc)=>({
                id: doc.id,
                ...doc.data()
            }))

            setItems(newItems);

        })

    

    }, [])
    return (
        <div className=" h-screen w-2/6 fixed right-0 top-0 flex flex-col bg-white border border-gray-100">
        <div className=" h-20 w-full flex-shrink-0  flex-row flex items-center px-4 border border-b border-t-0 border-r-0 border-l-0">
          <span className="font-semibold">Cart</span>
          <div
          onClick={()=>{
              setCartVisible(false)
          }}
          className=" absolute right-0 mr-4 h-5 w-5 cursor-pointer ">
              <IoMdClose/>
          </div>
        </div>
        <div className=" h-auto flex-1  flex-shrink-0 space-y-4 overflow-y-auto w-full px-4 py-4 flex flex-col">
          {
              items.map((item)=>{
                  return(
                    <div key={item.id} className=" h-20 border border-gray-100 shadow w-full rounded flex flex-row">
                    <div className=" rounded-md  h-full bg-red-50 w-2/12">
                    <Image
                          alt={item.Name}
                          className=" h-full w-full"
                          src={item.photoUrl}
                          width={80}
                          height={90}
                        ></Image>
                    </div>
                    <div className=" flex-1 w-1/5 flex-col px-2 py-2">

                        
                        
                    <p className="truncate w-full max-w-lg">{item.Name}</p>
                        <span>USD {(item.price* item.Quantity).toString()}</span> 
                       
                    </div>
                    <div className=" w-32 h-full bg-white flex items-center">
                    <div className=" flex flex-row w-24 justify-between px-2 bg-green-50 rounded-md h-10 items-center">
                        <div
                        onClick={async()=>{
                            if(quantity > 1 && quantity>=item.maxSelect){
                                const decrement = firebase.firestore.FieldValue.increment(-1);

                                const increment = firebase.firestore.FieldValue.increment(1);
                                decrementCounter();

                               await  db.collection("Cart").doc(auth.user.uid).collection("Items").doc(item.id).update({ Quantity: decrement });
                            await db.collection("Cart").doc(auth.user.uid).collection("Items").doc(item.id).update({ maxSelect: increment });
                               
                                //setTotalPrice(quantity* item.price);
                               
                            }
                        }}
                        className=" cursor-pointer ">
                            <AiOutlineMinus/>
                        </div>
                        <div className="">{item.Quantity}</div>
                        <div
                        onClick={async ()=>{
                            if(quantity<= item.maxSelect && quantity>0){
                                const decrement = firebase.firestore.FieldValue.increment(-1);

                                const increment = firebase.firestore.FieldValue.increment(1);
                                incrementCounter();
                               await  db.collection("Cart").doc(auth.user.uid).collection("Items").doc(item.id).update({ Quantity: increment });
                                await db.collection("Cart").doc(auth.user.uid).collection("Items").doc(item.id).update({ maxSelect: decrement });
                               
                                //setTotalPrice(quantity* item.price);

                               
                            }
                        }}
                        className=" cursor-pointer ">
                            <IoMdAdd/>
                        </div>
                    </div>
                    <div className=" w-10 h-full  bg-orange-50 flex items-center justify-center">
                        <BiTrash
                        onClick={()=>{
                            db.collection("Cart").doc(auth.user.uid).collection("Items").doc(item.id).delete().then(() => {
                                console.log("Document successfully deleted!");
                            }).catch((error) => {
                                console.error("Error removing document: ", error);
                            });
                        }}
                        className=" cursor-pointer"/>
                    </div>
                    </div>
                  </div>
                  )
              })
          }

{empty? <div className=" flex h-full items-center justify-center "><span className="">Cart Empty</span></div>: null}
          
        </div>

        
        <div className=" h-24 py-3    bottom-0 border border-t border-b-0 border-r-0 border-l-0 w-full flex-shrink-0 px-7 justify-center flex flex-col">

           <Link href="/checkout" passHref={true}>
           <button className="bg-blue-500 text-gray-50 font-semibold px-4 w-full rounded-md py-4">Proceed to Checkout</button>
           </Link>
        </div>
        
                </div>
    )
}

export default Cart
