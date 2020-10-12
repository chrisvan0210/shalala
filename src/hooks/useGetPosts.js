import { useEffect, useState, useRef, useCallback } from 'react'
import { db } from '../firebase'


function useGetPosts(isIntersecting) {
  const [userPosts, setUserPosts] = useState([]);
  const [lastVisible, setLastVisible] = useState()
  const [more, setMore] = useState(true)




  useEffect(() => {
    
    if (more && lastVisible && isIntersecting) {  // here is get post after scroll to bottom
     
      db.collection('posts').orderBy('timestamp', 'desc').startAfter(lastVisible).limit(5).onSnapshot(snapshot => {
        if ((snapshot.docs.length - 1) !== lastVisible) {  //if the last document of new request is the last document of previous => stop render for avoid same key index error
          const newPost = snapshot.docs.map(doc => ({
            id: doc.id,
            post: doc.data()
          }));
          setUserPosts(userPosts.concat(newPost))
          setLastVisible(snapshot.docs[snapshot.docs.length - 1]) // Check if the last document of pull request are VISIBLE OR UNDEFINED
        }
        else {
          setMore(false)
        }
      })
    }
    
    else if (more && !lastVisible && !isIntersecting){  // Here is get post after first load
     
     db.collection('posts').orderBy('timestamp', 'desc').limit(5).onSnapshot(snapshot => {
        setUserPosts(snapshot.docs.map(doc => ({
          id: doc.id,
          post: doc.data()
        })));
        setLastVisible(snapshot.docs[snapshot.docs.length - 1])
      })
    }
  }, [lastVisible,isIntersecting])


  return { userPosts }
}

export default useGetPosts


