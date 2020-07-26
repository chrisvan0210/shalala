import React, { useState, useEffect } from 'react';
import 'assets/css/app.css';
import { Post, SignUpSignInModal } from 'Components'
import ImagesUpload from './imagesUpload'
import { db, auth } from './firebase'
import InstagramEmbed from 'react-instagram-embed'
import { Button, CircularProgress, Modal } from '@material-ui/core'

import instaLOGO from 'assets/images/instaLOGO.png'
import searchIcon from 'assets/images/searchIcon.png'

const postStyle = {
  top: `40%`,
  left: `50%`,
  transform: `translate(-50%, -40%)`,
  position: 'absolute',
  height: 'auto',
}

function App() {
  const [userPosts, setUserPosts] = useState([]);
  const [username, setUsername] = useState('')
  const [username2, setUsername2] = useState('')
  const [user, setUser] = useState(null)
  const [postModal, setPostModal] = useState(false)
  const [getProp, setGetProp] = useState('')
  const [spin, setSpin] = useState(false)

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setUserPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    });

  }, []);
  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in...
        // console.log('authUser', authUser)
        // setUser(authUser)
        setUsername(authUser.displayName)
      }
      else {
        // user has logged out...
        setUser(null)
        setUsername('')
      }
    })
    
    console.log("status change on app")
  }, [user, username])

  const handlePost = () => {
    setPostModal(true)
  }

  const renderPost = (
    userPosts.map(({ id, post }) => {
      return (
        <Post key={id} user={username?username:username2} postId={id} username={post.username} imageUrl={post.imageUrl} caption={post.caption} />
      )
    })
  )

console.log('appuser',username2)

  return (
    <div className="App_contain">
      {spin ? (<div className="app_spin">
        <CircularProgress />
        <CircularProgress color="secondary" /></div>) :
        <div>
          {/* header */}
          <div className="page_header">
            <img className="insta-logo" src={instaLOGO} alt="" />
            <form className="header_search">
              <input type="text" placeholder="Search..." />
              <button className="search-btn" ><img src={searchIcon} alt="" /></button>
            </form>
            <div className="header-right">
              <Button className="header_post_btn" onClick={handlePost}>POST</Button>{/* Upload */}
              <SignUpSignInModal  userProps={user=>setUser(user)} userProps2={username=>setUsername2(username)}/>
            </div>
          </div>


          <div className="mainPage-wrapper"> {/* post here */}
            <div className="post_contain">
              {renderPost}
            </div>

            {/* Instagram profile clone */}
            <InstagramEmbed
              url='https://www.instagram.com/p/CC_G8XasBJd/?utm_source=ig_web_copy_link'
              maxWidth={320}
              hideCaption={false}
              containerTagName='div'
              protocol=''
              injectScript
              onLoading={() => { }}
              onSuccess={() => { }}
              onAfterRender={() => { }}
              onFailure={() => { }}
            />
          </div>

        </div>
      }

      {/* Modal */}
      <Modal
        open={postModal}
        onClose={() => setPostModal(false)}
      >
        <div style={postStyle} className="upload_contain">
          {username || username2 ?
            <ImagesUpload username={username?username:username2} onclose={(e)=>setPostModal(e)} childProps={(props) => setGetProp(props)} />
            : <h2 style={{color:'white',background:'#009126'}}>Sorry you need to login to upload</h2>
          }
        </div>
      </Modal>

      
    </div>
  );
}

export default App;
