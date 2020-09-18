import React, { useState, useEffect, useRef, useCallback } from 'react';
import 'assets/css/app.css';
import ParticlesData from './ParticlesData'

import { Post, SignUpSignInModal, AccountModal, Footer } from 'Components'
import ImagesUpload from './imagesUpload'
import { db, auth } from './firebase'
import InstagramEmbed from 'react-instagram-embed'
import { Button, Modal } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import nancyLogo from 'assets/images/nancy-logo.gif'
import starBucks from 'assets/images/starbucks.png'


const useStyles = makeStyles((theme) => ({
  "@keyframes OpenDown": {
    "0%": {
      top: "0%",
      left: "50%",
      transform: "translate(-50%, 0%)"
    },
    "100%": {
      top: "30%",
      left: "50%",
      transform: "translate(-50%, -30%)"
    }
  },
  uploadModal: {
    position: "absolute",
    top: "30%",
    left: "50%",
    transform: "translate(-50%, -30%)",
    display: "flex",
    justifyContent: "center",
    width: "90%",
    maxWidth: "400px",
    outline: "none",
    border: "solid 2px #000571",
    boxShadow: "0px 4px 5px #00188f",
    animation: `$OpenDown 300ms ${theme.transitions.easing.easeInOut}`,
  },

}))


const postFail = {
  color: 'white',
  background: 'rgb(162 0 0)',
  width: '100%',
  borderRadius: `5px`,
  boxShadow: `0 0 5px 5px #940303`,
  border: `solid 2px red`,
}


function App() {
  const [userPosts, setUserPosts] = useState([]);
  const [username, setUsername] = useState('')
  const [userRegister, setUserRegister] = useState('')
  const [user, setUser] = useState(null)
  const [postModal, setPostModal] = useState(false)
  const [getProp, setGetProp] = useState('')
  const [more, setMore] = useState(true)
  const [lastVisible, setLastVisible] = useState()

 
  const classes = useStyles();



  // useEffect( () => {
  //   async function getdata(){
  //     let snap =  await db.collection('posts').orderBy('timestamp', 'desc').get();
  //     console.log("snap",snap.docs.map(data=>data.data()))
  //   }
  //     getdata()
  // }, [])
  useEffect(() => {
    let unsubscribe = db.collection('posts').orderBy('timestamp', 'desc').limit(5).onSnapshot(snapshot => {
      setUserPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
      setLastVisible(snapshot.docs[snapshot.docs.length - 1])
    })
    return () => {
      unsubscribe()
    }
  }, [])


  const observer = useRef()
  const lastRef = useCallback(node => {
    if (observer.current) observer.current.disconnect() // stop previous ref
    observer.current = new IntersectionObserver(entries => { // take the last current ref
      if (entries[0].isIntersecting && more && lastVisible) {  // if the last document not Visible mean no more data on firebase then stop making new pull request
        db.collection('posts').orderBy('timestamp', 'desc').startAfter(lastVisible).limit(5).onSnapshot(snapshot => {
          if ((snapshot.docs.length - 1 ) !== lastVisible) {  //if the last document of new request is the last document of previous => stop render for avoid same key index error
            const newPost = snapshot.docs.map(doc => ({
              id: doc.id,
              post: doc.data()
            }));
            setUserPosts(userPosts.concat(newPost))
            setLastVisible(snapshot.docs[snapshot.docs.length - 1]) // Check if the last document of pull request are VISIBLE OR UNDEFINED
          }
          else{
            setMore(false)
          }
        })
      }
    })
    if (node) observer.current.observe(node)
  }, [lastVisible, userPosts,more])



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

  }, [user, username])

  const handlePost = () => {
    setPostModal(true)
  }

  const renderPost = (
    userPosts.map(({ id, post }) => {
      return (
        <Post ref={lastRef} key={id} user={username ? username : userRegister} postId={id} username={post.username} imageUrl={post.imageUrl} caption={post.caption} type={post.type} />
      )
    })
  )


  return (
    <div className="App_contain">
      <img src={starBucks} alt="" style={{ display: "none" }} />
      
        <div>
          {/* header */}
          <div className="page_header">
            <img className="insta-logo" src={nancyLogo} alt="" />
            <div style={{ display: 'flex', alignItems: "center" }} className="header_username">
              <AccountModal user={userRegister ? userRegister : username} username={userRegister ? userRegister : username} />
            </div>
            {/* <form className="header_search">
              <input type="text" placeholder="Search..." />
              <button className="search-btn" ><img src={searchIcon} alt="" /></button>
            </form> */}
            <div className="header-right">
              <Button className="header_post_btn" onClick={handlePost}>UPLOAD</Button>{/* Upload */}
              <SignUpSignInModal userProps={user => setUser(user)} userProps2={username => setUserRegister(username)} />
            </div>
          </div>


          <div className="mainPage-wrapper"> {/* post here */}
            <div className="App_post_contain">
              {renderPost}
            </div>

            {/* Instagram profile clone */}
            <InstagramEmbed
              url='https://www.instagram.com/p/CC_G8XasBJd/?utm_source=ig_web_copy_link'
              maxWidth={320}
              style={{ zIndex: '10', height: 'fit-content' }}
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
          <Footer />
        </div>
      
      {/* Modal */}
      <Modal
        open={postModal}
        onClose={() => setPostModal(false)}
      >
        <div className={classes.uploadModal}>
          {username || userRegister ?
            <ImagesUpload username={username ? username : userRegister} onclose={(e) => setPostModal(e)} childProps={(props) => setGetProp(props)} />
            : <h2 style={postFail}>Sorry you need to login to upload</h2>
          }
        </div>
      </Modal>
      <div className="particles-box">
        <ParticlesData />
      </div>

    </div>
  );
}

export default App;
