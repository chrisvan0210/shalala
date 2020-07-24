import React, { useState, useEffect } from 'react'
import 'assets/css/post.css'
import Avatar from '@material-ui/core/Avatar'
import { db } from '../../firebase'
import firebase from 'firebase';


function Post({user, username, imageUrl, caption, postId }) {
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')

    useEffect(() => {
        let unsubscribe;
        if (postId) {
         unsubscribe = db.collection('posts')
                .doc(postId)
                .collection('comments')
                .orderBy('timestamp','desc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()));
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
            text:comment,
            username: user,
            timestamp:firebase.firestore.FieldValue.serverTimestamp()
        })
        setComment('');
    }
    return (
        <div className="post_wrapper">
            {/* username */}
            <div className="post_username">
                <Avatar
                    className="post-avatar"
                    alt={username}
                    src="/static/images/avatar/1.jpg"
                />
                <h3 className="post-username">{username}</h3>
            </div>

            {/* data upload */}
            <img className="post-image" src={imageUrl} alt="" />
            {/* caption */}
            <div className="post-captions"> <strong>{username}: </strong>{caption}</div>


            <div>
                {comments.map((comment,id) => (
                    <p key={id}>
                        <b>{comment.username} </b>{comment.text}
                    </p>
                )
                )}
            </div>

            <form action="">
                <input type="text"
                    className="cment_input"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <button
                    className="btn-cment"
                    disabled={!comment}
                    type="button"
                    onClick={postComment}
                >
                    Post
                </button>
            </form>

        </div>
    )
}

export default Post
