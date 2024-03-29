import React from 'react';
import '../../../src/assets/css/post.css'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import { auth } from '../../firebase';

import { useState,memo } from 'react'


function getModalStyle() {
    //   const top = 50 + rand();
    //   const left = 50 + rand();

    return {
        top: `40%`,
        left: `50%`,
        transform: `translate(-50%, -40%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        height: 'auto',
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    btnSign: {
        padding: "5px 15px"
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
        '& p': {
            margin: '10px 0'
        },
        '& h2': {
            margin: '10px auto 20px'
        },
        '& button': {
            padding: '8px 5px',
            borderRadius: '5px',
            margin: '20px auto 5px',
            width: '100px',
            backgroundColor: '#002fff',
            color: 'white',
            '& hover': {
                opacity: '0.8'
            }
        },
    },
}));

function SignUpSignInModal({userLogin, userProps2 }) {
    const classes = useStyles();
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = useState(getModalStyle);
    const [signUpModal, setSignUpModal] = useState(false);
    const [signInModal, setSignInModal] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [userRegister, setUserRegister] = useState('')
    const [username, setUsername] = useState('')

    // const  userLogin  = useSignIn()

    const signUp = (e) => {
        e.preventDefault();
        auth.createUserWithEmailAndPassword(email, password)
            .then((authUser) => {
                return authUser.user.updateProfile({
                    displayName: userRegister,
                })
            })
            .catch((error) => alert('Email or password are not correct...'));
        userProps2(userRegister)
        setSignUpModal(false);
    }

    const signIn = (e) => {
        e.preventDefault();
        auth.signInWithEmailAndPassword(email, password)
            .then((authUser) => {
                setUsername(authUser);
            })
            .catch(error => alert('Email or password are not correct...'))
        userProps2(username)
        setSignInModal(false);
    }

    // let unsubscribe = db.usersCollection.doc(user.uid).onSnapshot(doc => {
    //     storage.commit('setUserProfile', doc.data())
    // })
    const logout = () => {
        auth.signOut()
        setUsername('')
    }

    return (
        <div>
            {
                userLogin ?
                    <Button type="button" onClick={logout} className={classes.btnSign}>Logout</Button> :
                    <div >
                        <Button type="button" onClick={() => setSignUpModal(true)} className={classes.btnSign}>Sign Up</Button>
                        <Button type="button" onClick={() => setSignInModal(true)} className={classes.btnSign}>Sign In</Button>
                    </div>
            }

            <Modal
                open={signUpModal}
                onClose={() => setSignUpModal(false)}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div style={modalStyle} className={classes.paper} id="form-wrapper">
                    <form action="" method="post" className={classes.signForm}>
                        <h2>SignUp</h2>

                        <label htmlFor="username" ><b>Username</b></label>
                        <Input type="text" className={classes.signInput} value={userRegister} onChange={(e) => setUserRegister(e.target.value)} />
                        <label htmlFor="email"><b>Email</b></label>
                        <Input type="email" className={classes.signInput} value={email} onChange={(e) => setEmail(e.target.value)} />
                        <label htmlFor="password"><b>Password</b></label>
                        <Input type="password" autoComplete="on" className={classes.signInput} value={password} onChange={(e) => setPassword(e.target.value)} />

                        <p>By creating an account you agree to our <a href='true'>Terms & Privacy</a>.</p>
                        <Button type="submit" onClick={signUp}>Register</Button>
                    </form>
                </div>
            </Modal>
            <Modal
                open={signInModal}
                onClose={() => setSignInModal(false)}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div style={modalStyle} className={classes.paper} id="form-wrapper1">
                    <form action="" method="post" className={classes.signForm}>
                        <h2>SignIn</h2>

                        <label htmlFor="email"><b>Email</b></label>
                        <Input type="email" className={classes.signInput} value={email} onChange={(e) => setEmail(e.target.value)} />
                        <label htmlFor="password"><b>Password</b></label>
                        <Input type="password" autoComplete="on" className={classes.signInput} value={password} onChange={(e) => setPassword(e.target.value)} />

                        <p>By creating an account you agree to our <a href='true'>Terms & Privacy</a>.</p>
                        <Button type="submit" onClick={signIn}>Login</Button>
                    </form>
                </div>
            </Modal>
        </div>
    );
}
export default memo(SignUpSignInModal);