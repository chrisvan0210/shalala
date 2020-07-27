import React, { useState, useEffect } from 'react'
import 'assets/css/account.css'
import { Button, Avatar, Modal } from '@material-ui/core'
import { storage, db } from '../../firebase'



function AccountModal({ user, username }) {
    const [avatar, setAvatar] = useState('')
    const [progress, setProgress] = useState('')
    const [modal, setModal] = useState(false)
    const [userAvatar, setUserAvatar] = useState(null)
    const [accountTab, setAccountTab] = useState(1)


    useEffect(() => {
        db.collection('avatars').doc(username).onSnapshot(snapshot => {
            setUserAvatar(snapshot.data())
        });
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

    //Setup select tab of account to edit
    const updatesAvatar = (
        <div className="up_ava_container">
            <label className="label_input">
                <input type="file" onChange={handleChange} />
            </label>
            <progress value={progress} max='100' />
            <Button type="submit" onClick={handleUpload}>Upload</Button>
        </div>
    )
    const updatesEmail = (
        <div className="up_ava_container">
            This function are updating...
        </div>
    )
    const updatesPassword = (
        <div className="up_ava_container">
            This function are updating...
        </div>
    )
    useEffect(() => {

    }, [accountTab])
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
