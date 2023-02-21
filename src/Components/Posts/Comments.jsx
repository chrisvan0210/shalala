import React, { useState, memo } from 'react'
import '../../../src/assets/css/comment.css'
import { db } from '../../firebase'
import firebase from 'firebase/compat/app';
import Comment from './Comment'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

import useGetCmts from '../../hooks/useGetCmts'
import useSignIn from '../../hooks/useSignIn'

function Comments({ postId }) {
    const [upComment, setUpComment] = useState('')
    const [numberMore, setNumberMore] = useState(false)


    const { comments, lastVisible ,openShowMore } = useGetCmts(postId, numberMore)
    const { userLogin } = useSignIn()

    const postComment = (event) => {
        event.preventDefault();
        db.collection('posts')
            .doc(postId)
            .collection('comments')
            .add({
                text: upComment,
                username: userLogin,
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

    const commentInput = (
        <form className="comment-form" >
            <input
                type="text"
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
                OK
        </button>
        </form>
    )




    const renderComments = comments.map((comment, id) => {
        return (
            <Comment key={id} comment={comment} postId={postId} userLogin={userLogin} />
        )
    })

    return (
        <div className="comment_box">
            {renderComments}
            {openShowMore ?
                <div className="comment-showMore">
                    {lastVisible ?
                        <p onClick={() => setNumberMore(numberMore + 1)}><ExpandMoreIcon/>Show More<ExpandMoreIcon/></p> 
                        : <p onClick={() => setNumberMore(numberMore + 1)}><ExpandLessIcon/>Close<ExpandLessIcon/></p>
                    }
                    </div>
                    : ''
            }
            {userLogin && commentInput}
        </div>
    )
}

export default memo(Comments)
