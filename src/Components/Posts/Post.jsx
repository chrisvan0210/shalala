import React, { useState, useEffect, lazy, Suspense, forwardRef } from 'react'
import 'assets/css/post.css'
import { db } from '../../firebase'
import firebase from 'firebase/app';
import AccountModal from '../Account/AccountModal'
import { CircularProgress } from '@material-ui/core'


const Contents = lazy(() => (import('./Contents')))


const Post = ({ user, username, imageUrl, caption, postId, type }, ref) => {
    const [comments, setComments] = useState([])
    const [upComment, setUpComment] = useState('')
    const [editComment, setEditComment] = useState(false)
    const [currentComment, setCurrentComment] = useState([])
    const [commmentId, setCommentId] = useState('')



    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db.collection('posts')
                .doc(postId)
                .collection('comments')
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) =>(Object.assign(doc.data(), { id: doc.id }))))
                    
                });
        }
        return () => {
            unsubscribe();
        }

    }, [postId])

    const postComment = (event) => {
        event.preventDefault();
        db.collection('posts')
            .doc(postId)
            .collection('comments')
            .add({
                text: upComment,
                username: user,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })
        setUpComment('');
        let target = document.getElementById(postId)
        if (target !== null) {
            target.scrollTop = 0
        }
        // target.scrollTop = target.scrollHeight + 40;
        // target.scrollTop = (target.scrollHeight-target.clientHeight) + 5
    }
    const updateComment = (e) => {
        e.preventDefault();
        db.collection('posts')
            .doc(postId)
            .collection('comments')
            .doc(commmentId)
            .update({
                text: currentComment
            })
        setCommentId('');
        let target = document.getElementById(postId)
        if (target !== null) {
            target.scrollTop = 0
        }
    }

    const commentInput = (
        <form className="comment-form" >
            <input type="text"
                className="comment-input"
                placeholder="Add a comment..."
                value={upComment}
                onChange={(e) => setUpComment(e.target.value)}
            />
            <button
                className="comment-btn"
                disabled={!upComment}
                type="submit"
                onClick={postComment}
            >
                Post
        </button>
        </form>
    )

    const onEditCommentBox = (id, text) => {
        setCommentId(id)
        if(text){
            setCurrentComment(text)
        }
        
    }
    const onDeleteComment =(id)=>{
        db.collection('posts')
            .doc(postId)
            .collection('comments')
            .doc(id)
            .delete()
    }
    const commentUpdate= () => (
        <form className="edit-form" >
            <textarea
                type="text"
                className="comment-input"
                placeholder="Add a comment..."
                value={currentComment}
                onChange={(e) => setCurrentComment(e.target.value)}
            ></textarea>
            <button
                className="comment-btn"
                type="submit"
                onClick={updateComment}
            >OK</button>
            <button
                className="comment-btn"
                type="submit"
                onClick={onEditCommentBox}
            >Cacel</button>
        </form>
    )
   
   

    return (
        <div className="post_wrapper" ref={ref}>
            {/* username */}
            <div className="post_username">
                <AccountModal user={user} username={username} />
            </div>

            {/* data upload from database */}
            {/* <img className="post-image" src={imageUrl} alt="" /> */}


            <Suspense fallback={
                <div className="app_spin">
                    <CircularProgress />
                    <CircularProgress color="secondary" /></div>
                // <div className="PreImages">
                //     <h2>Loading...</h2>
                // </div>

            }>
                <div className="contents-box">
                    <Contents imageUrl={imageUrl} type={type} />
                </div>
            </Suspense>

            {/* caption */}
            <div className="post-captions">{caption}</div>

            {/* comments box */}

            {comments && comments.length !== 0 ?
                <div className="comment_box" id={postId}>
                    {comments.map((comment) => (
                        <div key={comment.id} className="comment-list">
                            {commmentId !== comment.id?
                                <p className="comment-text">
                                    <b >{comment.username}: </b>{comment.text}
                                </p>
                                : commentUpdate(comment.id)
                            }

                            <div className="comment-update">
                                <h4>...</h4>
                                
                                    <div className="update-option">
                                        <ul>
                                            <li onClick={() => onEditCommentBox(comment.id, comment.text)}>Edit</li>
                                            <hr/>
                                            <li onClick={() => onDeleteComment(comment.id)}>Delete</li>
                                        </ul>
                                    </div>
                            </div>
                        </div>
                    )
                    )}
                </div> :
                <div className="comment_box blur1">This post dont have comment yet...</div>
            }

            {user && commentInput}
        </div>
    )
}

export default forwardRef(Post);
