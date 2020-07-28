import React, { useState, useEffect } from 'react'
import 'assets/css/account.css'
import { Button, Avatar, Modal } from '@material-ui/core'
import firebase from 'firebase'
import { storage, db } from '../../firebase'



function AccountModal({ user, username }) {
    const [progress, setProgress] = useState('')
    const [modal, setModal] = useState(false)
    const [userAvatar, setUserAvatar] = useState(null)
    const [accountTab, setAccountTab] = useState(1)
    const [avatar, setAvatar] = useState('')
    //change email, password
    const [currentPassword, setCurrentPassword] = useState('')
    const [newEmail, setNewEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')


    const styling = ({
        margin: `35px auto 5px`,
        padding: `8px 5px`,
        borderRadius: `5px`,
        backgroundColor: `#002fff`,
        color: `white`,
        fontWeight: `800`,
        boxShadow: `0 2px 2px 0px black`
    })

    useEffect(() => {
        if (username) {
            db.collection('avatars').doc(username).onSnapshot(snapshot => {
                setUserAvatar(snapshot.data())
            });
        } else {
            setUserAvatar(null)
        }
    }, [username]);

    const handleOpenModal = () => {
        if (user === username) {
            setModal(true)
        }
        else {
            alert('Sorry you are not allow to see other people information!!!')
        }
    }
    const handleChange = (e) => {
        if (e.target.files[0]) {
            setAvatar(e.target.files[0])
        }
    }

    const handleUpload = () => {
        const uploadAvatar = storage.ref(`avatars/${avatar.name}`).put(avatar)

        uploadAvatar.on(
            "state_changed",
            (snapshot) => {
                //progress function...
                //https://firebase.google.com/docs/storage/web/upload-files
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progress)
            },
            (error) => {
                alert(error.message)
            },
            () => {
                //complete function...
                storage
                    .ref('avatars')
                    .child(avatar.name)
                    .getDownloadURL()
                    .then(url => {
                        //post image inside db... 
                        db
                            .collection('avatars')
                            .doc(username)
                            .set({
                                avatarUrl: url
                            });
                        setProgress(0);
                        setAvatar(null);
                        setModal(false)
                    })
            }
        )
    }

    //Change Email , Password ---------------
    const reauthenticate = (currentPassword) => {
        var user = firebase.auth().currentUser;
        var cred = firebase.auth.EmailAuthProvider.credential(
            user.email, currentPassword);
        return user.reauthenticateWithCredential(cred);
    }
    const handleChangeEmail = (e) => {
        e.preventDefault();
        reauthenticate(currentPassword).then(() => {
            var user = firebase.auth().currentUser;
            user.updateEmail(newEmail).then(() => {
                alert("Email updated!");
            }).catch((error) => { alert(error.message); });
        }).catch((error) => { alert(error.message); });
        setModal(false)
    }
    const handleChangePassword = (e) => {
        e.preventDefault();
        reauthenticate(currentPassword).then(() => {
            var user = firebase.auth().currentUser;

            user.updatePassword(newPassword).then(() => {
                alert("Password updated!");
            }).catch((error) => { alert(error.message); });
        }).catch((error) => { alert(error.message); });
        setModal(false)
    }
    //Change Email , Password ---------------

    //Setup select tab of account to edit-----------------------
    const updatesAvatar = (
        <div className="up_ava_container blur">
            <label className="label_input">
                <input type="file" onChange={handleChange} />
            </label>
            {progress ? <progress value={progress} max='100' /> : ''}

            <Button style={styling} type="submit" onClick={handleUpload}>Upload</Button>
        </div>
    )
    const updatesEmail = (
        <form className="up_ava_container one">
            <label > Your current password:</label>
            <input type="password" placeholder="password..." value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            <label > Enter your new email:</label>
            <input type="email" placeholder="email..." value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
            <Button style={styling} type="submit" onClick={handleChangeEmail}>Update</Button>
        </form>
    )
    const updatesPassword = (
        <form className="up_ava_container one">
            <label > Your current password:</label>
            <input type="password" placeholder="password..." value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            <label > Enter your new password:</label>
            <input type="password" placeholder="password..." value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <Button style={styling} type="submit" onClick={handleChangePassword}>Update</Button>
        </form>
    )
    let selectAccountTab;
    switch (accountTab) {
        case 1: selectAccountTab = updatesAvatar
            break;
        case 2: selectAccountTab = updatesEmail
            break;
        case 3: selectAccountTab = updatesPassword
            break;
        default: selectAccountTab = updatesAvatar;
    }
    // End setup select tab of account to edit
    return (
        <>
            {
                userAvatar && userAvatar.avatarUrl ?
                    <Avatar
                        className="post-avatar"
                        alt={username}
                        src={userAvatar.avatarUrl}
                    /> :
                    <Avatar
                        className="post-avatar"
                        alt={username}
                        src='/static/images/avatar/1.jpg'
                    />
            }
            <h3 className="post-username" onClick={handleOpenModal}>{username}</h3>

            <Modal
                open={modal}
                onClose={() => setModal(false)}
                className="account_modal"
            >
                <div className="account_container">
                    <div className="accountTab">
                        <ul>
                            <li className={accountTab === 1 ? 'active' : ''} onClick={() => setAccountTab(1)}>Change Avatar</li>
                            <li className={accountTab === 2 ? 'active' : ''} onClick={() => setAccountTab(2)}>Change Email</li>
                            <li className={accountTab === 3 ? 'active' : ''} onClick={() => setAccountTab(3)}>Change Password</li>
                        </ul>
                    </div>
                    <div className="edit_container">
                        {selectAccountTab}
                    </div>

                </div>
            </Modal>

        </>
    )
}

export default AccountModal
