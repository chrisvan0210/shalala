import React, { useState, useEffect } from 'react';
import 'assets/css/app.css';
import { Post, SignUpSignInModal } from 'Components'
import ImagesUpload from './imagesUpload'
import { db, auth } from './firebase'
import InstagramEmbed from 'react-instagram-embed'
import Modal from '@material-ui/core/Modal'
import { Button } from '@material-ui/core'

import instaLOGO from 'assets/images/instaLOGO.png'
import searchIcon from 'assets/images/searchIcon.png'

const postStyle = {
  top: `40%`,
  left: `50%`,
  transform: `translate(-40%, -50%)`,
  position: 'absolute',
  minWidth: 400,
  height: 'auto',
}

function App() {
  const [userPosts, setUserPosts] = useState([]);
  const [username, setUsername] = useState('')
  const [user, setUser] = useState(null)
  const [postModal, setPostModal] = useState(false)
  const [getProp, setGetProp] = useState('')

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
        setUser(authUser)
        setUsername(authUser.displayName)
      }
      else {
        // user has logged out...
        setUser(null)
      }
    })
  }, [user, username])

  const handlePost = () => {
    setPostModal(true)
  }


  //test get props from child imagesUpload cpn
  return (

    <div className="App_contain">

      {/* header */}
      <div className="page_header">
        <img className="insta-logo" src={instaLOGO} alt="" />
        <form className="header_search">
          <input type="text" placeholder="Search..." />
          <button className="search-btn" ><img src={searchIcon} alt="" /></button>
        </form>
        <div className="header-right">
          {/* Upload */}
          {user && <Button className="header_post_btn" onClick={handlePost}>POST</Button>}
          <Modal
            open={postModal}
            onClose={() => setPostModal(false)}
          >
            <div style={postStyle} className="upload_contain">
              {user ?
                <ImagesUpload username={username} childProps={(props) => setGetProp(props)} />
                : <div>Sorry you need to login to upload</div>
              }
            </div>
          </Modal>

          <SignUpSignInModal />
        </div>
      </div>
      {/* end header */}
      {/* post here */}

      <div className="mainPage-wrapper">
        <div className="post_contain">
          {userPosts.map(({ id, post }) => {
            return (
              <Post key={id} user={username} postId={id} username={post.username} imageUrl={post.imageUrl} caption={post.caption} />
            )
          })
          }

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
  );
}

export default App;
