import { useState, useEffect, useContext, createContext } from "react";
import nookies from "nookies";
import firebase from "firebase/app";

import "firebase/auth";
import cookie from 'js-cookie';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  // handle auth logic here...

  // listen for token changes
  // call setUser and write new token as a cookie
  useEffect(() => {
    return firebase.auth().onIdTokenChanged(async (user) => {
      nookies.destroy(null, "session");
      
      if (!user) {
        setUser(null);
        
        nookies.destroy(null, "session");
        nookies.set(undefined, "session", "", {
          maxAge: 365 * 24 * 60 * 60 * 1000,
          path: "/",
        });
        cookie.remove('fast-auth');

        return;
      } else {
        const token = await user.getIdToken();
        setUser(user);
        nookies.destroy(null, "session");
        nookies.set(undefined, "session", token, {
          maxAge: 365 * 24 * 60 * 60 * 1000,
          path: "/",
        });
        cookie.set('fast-auth', true, {
          expires: 1
        });
       
        return;
      }
    });
  }, []);

  //

  // force refresh the token every 10 minutes
  useEffect(() => {
    const handle = setInterval(async () => {
      const user = firebase.auth().currentUser;
      if (user)
        await user.getIdToken(true).then((token) => {
          setUser(user);
          nookies.destroy(null, "session");
          nookies.set(undefined, "session", token, {
            maxAge: 365 * 24 * 60 * 60 * 1000,
            path: "/",
          });
          cookie.set('fast-auth', true, {
            expires: 1
          });
        });
    }, 10 * 60 * 1000);

    // clean up setInterval
    return () => clearInterval(handle);
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
