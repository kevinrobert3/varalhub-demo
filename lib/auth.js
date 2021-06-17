import React, { useState, useEffect, useContext, createContext } from "react";
import Router from "next/router";
import cookie from "js-cookie";

import {auth} from "./firebase";
import { createManager, createManagerData } from './db';

const authContext = createContext();

export function AuthProvider({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleUser = async (rawUser) => {
    if (rawUser) {
      const user = await formatUser(rawUser);
      const { token, ...userWithoutToken } = user;
      //user.emailIsVerified
      createManager(user.uid, userWithoutToken);
      setUser(user);
      cookie.set("fast-auth", true, {
        expires: 1,
      });

      setLoading(false);
      return user;
    } else {
      setUser(false);
      cookie.remove("fast-auth");
      setLoading(false);
      return false;
    }
  };

  const signinWithEmail = (email, password) => {
    setLoading(true);
    return auth
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        //handleUser(response.user);
        Router.push("/");
      });
  };

  const signUpWithEmail = (email, password) => {
    setLoading(true);
    return auth
      .createUserWithEmailAndPassword(email, password)
      .then(async (response) => {
        const user = await formatUser(response.user);
      const { token, ...userWithoutToken } = user;
        //handleUser(response.user);
        await createManagerData(user.uid, userWithoutToken)
        Router.push("/");
      });
  };

  const signout = () => {
    Router.push("/");

    return auth
      .signOut()
      .then(() => handleUser(false));
  };

  useEffect(() => {
    const unsubscribe = auth.onIdTokenChanged(handleUser);

    return () => unsubscribe();
  }, []);

  return {
    user,
    loading,
    signinWithEmail,
    signUpWithEmail,
    signout,
  };
}

const getStripeRole = async () => {
  await auth.currentUser.getIdToken(true);
  const decodedToken = await auth.currentUser.getIdTokenResult();

  return decodedToken.claims.stripeRole || "free";
};

const formatUser = async (user) => {
  const token = await user.getIdToken();
  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    photoUrl: user.photoURL,
    phoneNumber: user.phoneNumber,
    userCreatedTime: user.metadata.creationTime,
    lastSignInTime: user.metadata.lastSignInTime,
    emailIsVerified: user.emailVerified,
    //stripeRole: await getStripeRole(),
    token,
  };
};
