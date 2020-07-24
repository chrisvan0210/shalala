import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button,Input } from '@material-ui/core';
import { auth } from '../../firebase';

import {useState,useEffect} from 'react'
// function rand() {
//   return Math.round(Math.random() * 20) - 10;
// }

function getModalStyle() {
    //   const top = 50 + rand();
    //   const left = 50 + rand();

    return {
        top: `40%`,
        left: `50%`,
        transform: `translate(-40%, -50%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        minWidth: 400,
        height: 'auto',
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    btnSign:{
        padding:"5px 15px"
    },
    signForm: {
        display: 'flex',
        flexDirection: 'column',
        '& input': {
            backgroundColor: '#e2e2e2',
            padding: '5px 10px'
        },
        '& label': {
            marginBottom: '5px'
        },
        '& p':{
            margin:'10px 0'
        },
        '& h2':{
            margin:'10px auto 20px'
        },
        '& button':{
            padding:'8px 5px',
            borderRadius:'5px',
            margin:'20px auto 5px',
            width:'100px',
            backgroundColor:'#002fff',
            color:'white',
           '& hover':{
               opacity:'0.8'
           } 
        },
    },
}));

function SignUpSignInModal({userProps}) {
    const classes = useStyles();
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = useState(getModalStyle);
    const [open, setOpen] = useState(false);
    const [signInModal, setSignInModal] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [user,setUser] = useState(null)

    

    useEffect(()=>{
       auth.onAuthStateChanged((authUser)=>{
            if(authUser){
                // user has logged in...
                // console.log(authUser)
                setUser(authUser)
            }
            else {
                // user has logged out...
                setUser(null)
            }
        })
    },[user,username])
    
    // const handleOpen = () => {
    //     setOpen(true);
    // };

    // const handleClose = () => {
    //     setOpen(false);
    // };
   
    const signUp =(e)=>{
        e.preventDefault();
        auth.createUserWithEmailAndPassword(email,password)
        .then((authUser)=>{
            return authUser.user.updateProfile({
                displayName:username,
            })
        })
        .catch((error)=>alert(error));

        setOpen(false);
    }
    
    const signIn = (e) =>{
        e.preventDefault();
        auth.signInWithEmailAndPassword(email,password)
        .then((authUser)=>{
            setUser(authUser);
        })
        .catch(error=>alert(error))
        
        setSignInModal(false);
    }


    return (
       
        <div>
            {
                user?
                <Button type="button" onClick={()=>auth.signOut()} className={classes.btnSign}>Logout</Button> :
                <div >
                     <Button type="button" onClick={()=>setOpen(true)} className={classes.btnSign}>Sign Up</Button>
                     <Button type="button" onClick={()=>setSignInModal(true)} className={classes.btnSign}>Sign In</Button>
                </div>
               
            }
            
            <Modal
                open={open}
                onClose={()=>setOpen(false)}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div style={modalStyle} className={classes.paper}>
                    <form action="" method="post" className={classes.signForm}>
                        <h2>SignUp</h2>

                        <label htmlFor="username" ><b>Username</b></label>
                        <Input type="text" className={classes.signInput} value={username} onChange={(e)=>setUsername(e.target.value)}/>
                        <label htmlFor="email"><b>Email</b></label>
                        <Input type="email" className={classes.signInput} value={email} onChange={(e)=>setEmail(e.target.value)}/>
                        <label htmlFor="password"><b>Password</b></label>
                        <Input type="password" className={classes.signInput} value={password} onChange={(e)=>setPassword(e.target.value)}/>

                        <p>By creating an account you agree to our <a href>Terms & Privacy</a>.</p>
                        <Button type="submit" onClick={signUp}>Register</Button>
                    </form>
                </div>
            </Modal>
            <Modal
                open={signInModal}
                onClose={()=>setSignInModal(false)}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div style={modalStyle} className={classes.paper}>
                    <form action="" method="post" className={classes.signForm}>
                        <h2>SignIn</h2>

                        <label htmlFor="email"><b>Email</b></label>
                        <Input type="email" className={classes.signInput} value={email} onChange={(e)=>setEmail(e.target.value)}/>
                        <label htmlFor="password"><b>Password</b></label>
                        <Input type="password" className={classes.signInput} value={password} onChange={(e)=>setPassword(e.target.value)}/>

                        <p>By creating an account you agree to our <a href>Terms & Privacy</a>.</p>
                        <Button type="submit" onClick={signIn}>Login</Button>
                    </form>
                </div>
            </Modal>
        </div>
    );
}
export default SignUpSignInModal;