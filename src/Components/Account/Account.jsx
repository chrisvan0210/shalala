import React, { useState, useEffect, memo, useContext } from "react";
import "../../../src/assets/css/account.css";
import { Button, Modal } from "@material-ui/core";
import firebase from "firebase/compat/app";
import { storage, db } from "../../firebase";
import { Avatar } from "@material-ui/core";
import useSignIn from "../../hooks/useSignIn";

import { AvatarContext } from "../../AvatarContext";

function Account({ username, isAvatar }) {
  const [progress, setProgress] = useState("");
  const [modal, setModal] = useState(false);
  const [accountTab, setAccountTab] = useState(1);
  const [avatar, setAvatar] = useState("");
  //change email, password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [userAvatar, setUserAvatar] = useState(null);

  const { userLogin } = useSignIn();

  const [particlesImg, setParticlesImg] = useContext(AvatarContext);

  const styling = {
    margin: `35px auto 5px`,
    padding: `8px 5px`,
    borderRadius: `5px`,
    backgroundColor: `#002fff`,
    color: `white`,
    fontWeight: `800`,
    boxShadow: `0 2px 2px 0px black`,
  };

  useEffect(() => {
    let unsubscribe;
    if (username) {
      unsubscribe = db
        .collection("avatars")
        .doc(username)
        .onSnapshot((snapshot) => {
          setUserAvatar(snapshot.data());
        });
      return () => {
        unsubscribe();
      };
    } else {
      setUserAvatar(null);
    }
  }, [username, setParticlesImg]);
  useEffect(() => {
    let unsubscribe;
    if (userLogin) {
      unsubscribe = db
        .collection("avatars")
        .doc(userLogin)
        .onSnapshot((snapshot) => {
          setParticlesImg(snapshot.data().avatarUrl);
        });
      return () => {
        unsubscribe();
      };
    } else {
      setParticlesImg(
        "https://firebasestorage.googleapis.com/v0/b/shalala-1.appspot.com/o/avatars%2Fstarbucks.png?alt=media&token=f2964a71-829d-4d5f-ab48-1a5e1c47a6df"
      );
    }
  }, [userLogin, setParticlesImg]);

  const handleOpenModal = () => {
    if (username === userLogin) {
      setModal(true);
    } else {
      alert("Sorry you are not allow to see other people information!!!");
    }
  };
  const handleChange = (e) => {
    if (e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadAvatar = storage.ref(`avatars/${avatar.name}`).put(avatar);

    uploadAvatar.on(
      "state_changed",
      (snapshot) => {
        //progress function...
        //https://firebase.google.com/docs/storage/web/upload-files
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        alert(error.message);
      },
      () => {
        //complete function...
        storage
          .ref("avatars")
          .child(avatar.name)
          .getDownloadURL()
          .then((url) => {
            //post image inside db...
            db.collection("avatars").doc(username).set({
              avatarUrl: url,
            });
            setProgress(0);
            setAvatar(null);
            setModal(false);
          });
      }
    );
  };

  //Change Email , Password ---------------
  const reauthenticate = (currentPassword) => {
    var user = firebase.auth().currentUser;
    var cred = firebase.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    return user.reauthenticateWithCredential(cred);
  };
  const handleChangeEmail = (e) => {
    e.preventDefault();
    reauthenticate(currentPassword)
      .then(() => {
        var user = firebase.auth().currentUser;
        user
          .updateEmail(newEmail)
          .then(() => {
            alert("Email updated!");
          })
          .catch((error) => {
            alert(error.message);
          });
      })
      .catch((error) => {
        alert(error.message);
      });
    setModal(false);
  };
  const handleChangePassword = (e) => {
    e.preventDefault();
    reauthenticate(currentPassword)
      .then(() => {
        var user = firebase.auth().currentUser;
        user
          .updatePassword(newPassword)
          .then(() => {
            alert("Password updated!");
          })
          .catch((error) => {
            alert(error.message);
          });
      })
      .catch((error) => {
        alert(error.message);
      });
    setModal(false);
  };
  //Change Email , Password ---------------

  //Setup select tab of account to edit-----------------------
  const updatesAvatar = (
    <div className="up_ava_container blur">
      <label className="label_input">
        <input type="file" onChange={handleChange} />
      </label>
      {progress ? <progress value={progress} max="100" /> : ""}

      <button className="btn_avatar" type="submit" onClick={handleUpload}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <h2>Update</h2>
      </button>
    </div>
  );
  const updatesEmail = (
    <form className="up_ava_container one">
      <label> Your current password:</label>
      <input
        type="password"
        placeholder="password..."
        autoComplete="on"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />
      <label> Enter your new email:</label>
      <input
        type="email"
        placeholder="email..."
        value={newEmail}
        onChange={(e) => setNewEmail(e.target.value)}
      />
      <Button style={styling} type="submit" onClick={handleChangeEmail}>
        Update
      </Button>
    </form>
  );
  const updatesPassword = (
    <form className="up_ava_container one">
      <label> Your current password:</label>
      <input
        type="password"
        placeholder="password..."
        autoComplete="on"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />
      <label> Enter your new password:</label>
      <input
        type="password"
        placeholder="password..."
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <Button style={styling} type="submit" onClick={handleChangePassword}>
        Update
      </Button>
    </form>
  );
  let selectAccountTab;
  switch (accountTab) {
    case 1:
      selectAccountTab = updatesAvatar;
      break;
    case 2:
      selectAccountTab = updatesEmail;
      break;
    case 3:
      selectAccountTab = updatesPassword;
      break;
    default:
      selectAccountTab = updatesAvatar;
  }
  // End setup select tab of account to edit

  return (
    <>
      {/* <UserAvatar  username={username} /> */}
      {isAvatar === true ? (
        <>
          {userAvatar && userAvatar.avatarUrl ? (
            <Avatar
              className="post-avatar"
              alt={username}
              src={userAvatar.avatarUrl}
              onClick={handleOpenModal}
            />
          ) : (
            <Avatar
              className="post-avatar"
              alt={username}
              src="/static/images/avatar/1.jpg"
            />
          )}
        </>
      ) : (
        <h3 className="post-username" onClick={handleOpenModal}>
          {username}
        </h3>
      )}

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        className="account_modal"
      >
        <div className="account_container">
          <div className="accountTab">
            <ul>
              <li
                className={accountTab === 1 ? "active" : ""}
                onClick={() => setAccountTab(1)}
              >
                Change Avatar
              </li>
              <li
                className={accountTab === 2 ? "active" : ""}
                onClick={() => setAccountTab(2)}
              >
                Change Email
              </li>
              <li
                className={accountTab === 3 ? "active" : ""}
                onClick={() => setAccountTab(3)}
              >
                Change Password
              </li>
            </ul>
          </div>
          <div className="edit_container">{selectAccountTab}</div>
        </div>
      </Modal>
    </>
  );
}

export default memo(Account);
