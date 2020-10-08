import React, { useState, useEffect, lazy, Suspense, forwardRef, useCallback } from 'react'
import 'assets/css/post.css'
import { db } from '../../firebase'
import firebase from 'firebase/app';
import AccountModal from '../Account/AccountModal'
import { CircularProgress } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { UserAvatar } from 'Components'

const Contents = lazy(() => (import('./Contents')))


const Post = ({ user, username, imageUrl, caption, postId, type }, ref) => {
    const [comments, setComments] = useState([])
    const [upComment, setUpComment] = useState('')
    const [currentComment, setCurrentComment] = useState([])
    const [commmentId, setCommentId] = useState('')
    const [openOption, setOpenOption] = useState('')
    const [toggleComment, setToggleComment] = useState(false)




    // Auto height for textarea element
    const theRef = useCallback(
        (node) => {
            if (node) {
                node.style.height = "1px";
                node.style.height = (node.scrollHeight) + "px";
            }
        },
        [],
    )

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db.collection('posts')
                .doc(postId)
                .collection('comments')
                .orderBy('timestamp', 'asc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => (Object.assign(doc.data(), { id: doc.id }))))

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

    const onEditCommentBox = (id, text) => {
        setCommentId(id)
        if (text) {
            setCurrentComment(text)
        }
    }
    const handleGetCurrentCm = (e) => {
        setCurrentComment(e.target.value)
        e.target.style.height = "1px";
        e.target.style.height = (e.target.scrollHeight) + "px";
    }

    const onDeleteComment = (id) => {
        db.collection('posts')
            .doc(postId)
            .collection('comments')
            .doc(id)
            .delete()
    }
    const toggleViewComment = () => {
        setToggleComment(!toggleComment)
    }

    const openOptionEdit = (id) => {
        setOpenOption(id)
    }
    // Detected click outside close edit/delete btn
    document.addEventListener('click', useCallback((e) => {
        if (!e.target.dataset.dot) {
            setOpenOption('')
        }
    }, []))
    document.addEventListener('keydown', useCallback((e) => {
        if (e.key === 'Escape')
            setOpenOption('')
    }, []))

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
    const commentUpdate = (
        <form className="edit-form">
            <textarea
                ref={theRef}
                type="text"
                className="comment-input"
                placeholder="Add a comment..."
                value={currentComment}
                onChange={(e) => handleGetCurrentCm(e)}
            ></textarea>
            <div className="btn-subEdit">
                <button
                    className="comment-btn"
                    type="submit"
                    onClick={updateComment}
                >OK</button>
                <button
                    className="comment-btn"
                    type="submit"
                    onClick={onEditCommentBox}
                >Cancel</button>
            </div>
        </form>
    )

    const thecm = comments.slice(comments.length - 2, comments.length)
    const showOnly2 = thecm.map((cm, index) => {
        return (
            <div key={index} className="comment-list">
                <span className="cm-avatar">
                    <UserAvatar username={cm.username} />
                </span>
                <div className="comment-text">
                    <b >{cm.username}: </b>{cm.text}
                </div>
                {
                    user === cm.username ?
                        <div className="comment-update">
                            {
                                openOption !== cm.id ?
                                    <h4 data-dot={1} onClick={() => openOptionEdit(cm.id)}>...</h4>
                                    :
                                    <div className="update-option">
                                        <ul>
                                            <li onClick={() => onEditCommentBox(cm.id, cm.text)}>Edit</li>
                                            <hr />
                                            <li onClick={() => onDeleteComment(cm.id)}>Delete</li>
                                        </ul>
                                    </div>
                            }
                        </div> : <div className="dummy-box"></div>
                }
            </div>
        )
    })

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

                    {!toggleComment && comments.length >= 3 ?
                        <div>
                            {showOnly2}
                            <div onClick={toggleViewComment} className="btn-toggle-cm">
                                <span className="show-comment">Show more</span>
                                <span style={{ verticalAlign: "middle" }}><ExpandMoreIcon /></span>
                            </div>
                        </div>
                        :
                        <div>
                            {comments.map((comment) => (
                                <div key={comment.id}>
                                    {commmentId !== comment.id ?
                                        <div className="comment-list">
                                            <span className="cm-avatar">
                                                <UserAvatar username={comment.username} />
                                            </span>
                                            <div className="comment-text">
                                                <b >{comment.username}: </b>{comment.text}
                                            </div>
                                            {
                                                user === comment.username ?
                                                    <div className="comment-update">

                                                        {
                                                            openOption !== comment.id ?
                                                                <h4 data-dot={1} onClick={() => openOptionEdit(comment.id)}>...</h4>
                                                                :
                                                                <div className="update-option">
                                                                    <ul>
                                                                        <li onClick={() => onEditCommentBox(comment.id, comment.text)}>Edit</li>
                                                                        <hr />
                                                                        <li onClick={() => onDeleteComment(comment.id)}>Delete</li>
                                                                    </ul>
                                                                </div>
                                                        }

                                                    </div> : <div className="dummy-box"></div>
                                            }

                                        </div>
                                        : commentUpdate
                                    }
                                </div>
                            ))}
                            {
                                comments.length >= 3 ?
                                    <div onClick={toggleViewComment} className="btn-toggle-cm">
                                        <span className="show-comment">Close comments</span>
                                        <span style={{ verticalAlign: "middle" }}><ExpandLessIcon /></span>
                                    </div>
                                    : ''
                            }
                        </div>
                    }
                </div> :
                <div className="comment_box blur1">This post dont have comment yet...</div>
            }

            {user && commentInput}
        </div>
    )
}

export default forwardRef(Post);
