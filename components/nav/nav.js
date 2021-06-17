import Link from "next/link";
import firebase from "firebase/app";
import {FiShoppingCart} from 'react-icons/fi'
import {db } from '../../lib/firebase'
import React, {useState, useEffect} from 'react'

function Nav({ user,  setCartVisible, isCheckout }) {

  const [itemNo, setItemNo] = useState(0);


  useEffect(()=>{
    if(user!=null){
      db.collection("Cart").doc(user.uid).collection("Items").onSnapshot((snapshot)=>{
        if(snapshot.size>0){
          setItemNo(snapshot.size);
          console.log(snapshot.size)
        }
       

    })
    }



}, [])
 

  return (
    <nav className="lg:h-20 h-16  px-4 lg:px-20 flex items-center relative border border-b border-r-0 border-l-0 border-t-0">
      <div className="">
        <Link href="/" passHref={true}>
          <span className="font-bold text-2xl lg:text-3xl text-gray-800 cursor-pointer">
            Varalhub
          </span>
        </Link>
      </div>
      {!user ? (
        <div className=" absolute right-0 mr-4 lg:mr-20 flex flex-row space-x-4">
          <Link href="/login" passHref={true}>
            <button className="bg-blue-50  rounded-md text-sm lg:text-base text-blue-700 py-2 px-6 font-medium">
              Log in
            </button>
          </Link>
          <Link href="/signup" passHref={true}>
            <button className="bg-blue-600 hover:shadow text-sm lg:text-base hover:bg-blue-700 rounded-md text-gray-50 py-2 px-6 font-medium">
              Sign up{" "}
            </button>
          </Link>
        </div>
      ) : (
        <div className=" absolute right-0 mr-4 lg:mr-20 flex flex-row items-center space-x-5">
           {!isCheckout? <div onClick={setCartVisible} className=" h-8 w-8 lg:h-10 lg:w-10 rounded-md bg-gray-50 cursor-pointer flex justify-center items-center relative">
             <FiShoppingCart onClick={setCartVisible} className=" cursor-pointer h-5 w-5"/>
             {itemNo>0? 
             <div onClick={setCartVisible} className=" rounded-full bg-red-500 absolute w-4 h-4 flex items-center justify-center top-0 right-0  mt-1 mr-1 ">
             <span onClick={setCartVisible} className="  text-xs text-white font-semibold ">{itemNo.toString()}</span>
             </div>: null}
           </div>: null}
          <Link href="/" passHref={true}>
            <div className=" h-8 w-8 lg:h-10 lg:w-10 rounded-md bg-red-100 cursor-pointer flex items-center justify-center">
              <span className=" font-bold text-xl text-pink-700 uppercase ">
                {user.email.charAt(0)}
              </span>
            </div>
          </Link>

          <button
            onClick={async () => {
              await firebase.auth().signOut();
              location.reload();
            }}
            className="bg-blue-50  rounded-md text-blue-700 py-2 text-sm lg:text-base px-6 font-medium"
          >
            Log out
          </button>
        </div>
      )}
    </nav>
  );
}

export default Nav;
