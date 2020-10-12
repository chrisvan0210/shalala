import React, { useState } from 'react'
import { Account, SignUpSignInModal } from 'Components'
import { Button, Modal } from '@material-ui/core'
import ImagesUpload from '../../imagesUpload'
import nancyLogo from 'assets/images/nancy-logo.gif'
import { makeStyles } from '@material-ui/core/styles'


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
function Header({userLogin}) {
    const [userRegister, setUserRegister] = useState('')
    const [postModal, setPostModal] = useState(false)
    const classes = useStyles();



    const handlePost = () => {
        setPostModal(true)
    }

    return (
        <div className="page_header">
            <img className="insta-logo" src={nancyLogo} alt="" />
            <div style={{ display: 'flex', alignItems: "center" }} className="header_username">
                <Account username={userLogin} allowOpen={true}/>
            </div>

            <div className="header-right">
                <Button className="header_post_btn" onClick={handlePost}>UPLOAD</Button>{/* Upload */}
                <SignUpSignInModal userLogin={userLogin} userProps2={username => setUserRegister(username)} />

            </div>
            {/* Modal */}
            <Modal
                open={postModal}
                onClose={() => setPostModal(false)}
            >
                <div className={classes.uploadModal}>
                    {userLogin ?
                        <ImagesUpload username={userRegister} onclose={(e) => setPostModal(e)} />
                        : <h2 style={postFail}>Sorry you need to login to upload</h2>
                    }
                </div>
            </Modal>
        </div>
    )
}

export default Header
