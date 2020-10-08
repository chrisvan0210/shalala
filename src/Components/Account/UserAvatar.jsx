import React, { useState, useEffect, memo } from 'react'
import { db } from '../../firebase'
import { Avatar } from '@material-ui/core'

function UserAvatar({ username }) {
    const [userAvatar, setUserAvatar] = useState(null)

    useEffect(() => {
        let unsubscribe;
        if (username) {
            unsubscribe = db.collection('avatars').doc(username).onSnapshot(snapshot => {
                setUserAvatar(snapshot.data())
            });
            return () => {
                unsubscribe();
            }
        } else {
            setUserAvatar(null)
        }
    }, [username]);


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
        </>
    )
}

export default memo(UserAvatar)
