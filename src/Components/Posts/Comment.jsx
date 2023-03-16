import React, { useState, useCallback, memo } from 'react'
import { Account } from '../../Components'
import { db } from '../../firebase'



function Comment({ comment, postId, userLogin }) {
    const [currentComment, setCurrentComment] = useState([])
    const [commentId, setCommentId] = useState('')
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
        [])

    const updateComment = (e) => {
        e.preventDefault();
        db.collection('posts')
            .doc(postId)
            .collection('comments')
            .doc(commentId)
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
        if (!e.target.dataset.inside) {
            setOpenOption('')
        }
    }, []))
    document.addEventListener('keydown', useCallback((e) => {
        if (e.key === 'Escape')
            setOpenOption('')
    }, []))

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

    return (
        <>
            {comment && comment.length !== 0 ?
                <>
                    <>
                        {commentId !== comment.id ?
                            <div className="comment-list">
                                <Account username={comment.username} isAvatar= {true}/>
                                <div className="comment-text">
                                    <div>
                                        <span className="cm-avatar">
                                            <b><Account username={comment.username} isAvatar= {false}/></b>
                                        </span>
                                    </div>
                                    <p className='cmt-contents'>
                                        {comment.text}
                                    </p>
                                </div>
                                {
                                    userLogin === comment.username ?
                                        <div className="comment-update">
                                            {
                                                openOption !== comment.id ?
                                                    <h4 data-inside={1} onClick={() => openOptionEdit(comment.id)}>...</h4>
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
                    </>
                    {
                        comment.length >= 3 ?
                            <div onClick={toggleViewComment} className="btn-toggle-cm">
                                <span className="show-comment">Close comment</span>
                                <span style={{ verticalAlign: "middle" }}></span>
                            </div>
                            : ''
                    }
                </> :
                <div className="comment_box blur1">This post dont have comment yet...</div>
            }
        </>
    )
}

export default memo(Comment)
