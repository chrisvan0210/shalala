import { useState, useEffect} from 'react';
import {  auth } from '../firebase'



function useSignIn() {
    const [userLogin, setUserLogin] = useState('')
    useEffect(() => {
     const unsub =  auth.onAuthStateChanged((authUser) => {
          if (authUser) {
            // user has logged in...
            // console.log('authUser', authUser)
            // setUser(authUser)
            setUserLogin(authUser.displayName)
          }
          else {
            // user has logged out...
            setUserLogin('')
          }
        })
        return (()=>{
          unsub()
        })
      }, [])
    

    return {userLogin}
}

export default useSignIn
