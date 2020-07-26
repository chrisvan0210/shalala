import React, { useState, useEffect } from 'react'
import 'assets/css/post.css'
import Avatar from '@material-ui/core/Avatar'
import { db, auth } from '../../firebase'
import firebase from 'firebase';


function Post({ user, username, imageUrl, caption, postId }) {
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')


    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db.collection('posts')
                .doc(postId)
                .collection('comments')
                .orderBy('timestamp', 'desc')
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
                text: comment,
                username: user,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })
        setComment('');
        let target = document.getElementById(postId)
        if(target !==null){
            target.scrollTop = 0
        }
       
        // target.scrollTop = target.scrollHeight + 40;
        // target.scrollTop = (target.scrollHeight-target.clientHeight) + 5

    }
    const commentInput = (
        <form className="comment-form" >
            <input type="text"
                className="comment-input"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />
            <button
                className="comment-btn"
                disabled={!comment}
                type="submit"
                onClick={postComment}
            >
                Post
        </button>
        </form>
    )




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
            <div className="post-captions">{caption}</div>

            {/* comments box */}

            {comments.length !== 0  ?
                <div className="comment_box" id={postId}>
                    {comments.map((comment, id) => (
                        <p key={id}>
                            <b>{comment.username}: </b>{comment.text}
                        </p>
                    )
                    )}
                </div>  :
                <div className="comment_box blur1">This post dont have comment yet...</div>
        }

            {user && commentInput}
        </div>
    )
}

export default Post
