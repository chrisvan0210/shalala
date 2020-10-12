import { useEffect, useState } from 'react'
import { db } from '../firebase'


function useGetCmts(postId, numberMore) {
    const [comments, setComments] = useState([]);
    const [lastVisible, setLastVisible] = useState()
    const [openShowMore, setOpenShowMore] = useState(false)

    useEffect(() => {
        if (postId && !lastVisible) {
            db.collection('posts')
                .doc(postId)
                .collection('comments')
                .orderBy('timestamp', 'desc')
                .limit(6)
                .onSnapshot((snapshot) => {
                    //Get 5 out of 6 comments (if there is 5 comments then open btn ShowMore)
                    if (snapshot.docs.length === 6) {
                        let takeFourCmt = (snapshot.docs.map((doc) => (Object.assign(doc.data(), { id: doc.id }))))
                        takeFourCmt.pop()
                        setComments(takeFourCmt)
                        setLastVisible(snapshot.docs[snapshot.docs.length - 2])
                        setOpenShowMore(true)
                    }
                    // if comments quantity <= 5 just request normal
                    else {
                        setComments(snapshot.docs.map((doc) => (Object.assign(doc.data(), { id: doc.id }))))
                        setLastVisible(snapshot.docs[snapshot.docs.length - 1])
                    }
                });
        }
        else if (postId && lastVisible && numberMore) {
            db.collection('posts')
                .doc(postId)
                .collection('comments')
                .orderBy('timestamp', 'desc')
                .startAfter(lastVisible)
                .limit(7)
                .onSnapshot((snapshot) => {
                    const newCmt = snapshot.docs.map((doc) => (Object.assign(doc.data(), { id: doc.id })))
                    setComments(comments.concat(newCmt))
                    setLastVisible(snapshot.docs[snapshot.docs.length - 1]) // Check if the last document of pull request are VISIBLE OR UNDEFINED
                  
                    if (snapshot.docs.length < 7) setLastVisible()
                });
        }

    }, [postId, numberMore])

    return { comments, lastVisible, openShowMore }
}

export default useGetCmts


