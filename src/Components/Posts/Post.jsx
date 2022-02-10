import React, { lazy, Suspense, forwardRef } from 'react'
import 'assets/css/post.css'
import { CircularProgress } from '@material-ui/core'
import { Account } from 'Components'
import Comments from './Comments'
const Contents = lazy(() => (import('./Contents')))


const Post = ({ userLogin, postUser, imageUrl, caption, postId, type }, ref) => {


    return (
        <div className="post_wrapper" ref={ref}>

            {/* username */}
            <div className="post_username">
                <Account username={postUser} isAvatar={true}/>
                <Account username={postUser} />
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

            <Comments postId={postId} userLogin={userLogin} />

        </div>
    )
}

export default forwardRef(Post);
