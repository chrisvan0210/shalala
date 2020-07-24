import React from 'react'
import firebase from 'firebase'
import { Button } from '@material-ui/core'
import {makeStyles} from'@material-ui/core/styles'
import { useState } from 'react'
import { storage, db } from './firebase'



const useStyles = makeStyles(()=>({
    uploadContain:{
        display:'flex',
        justifyContent:'center',
        flexDirection:'column',
        background:'#002450',
        border:'solid 1px blue',
        padding:'5px',
        width:'100%',
        color:'black',
        alignItems:'center',
        '& input': {
            backgroundColor: '#e2e2e2',
            padding: '5px 10px',
            margin:'10px auto',
            width:'80%'
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
        '& progress':{
            width:'50%',
            height:'30px',
            margin:'5px auto'
        }
    }
}))


function ImagesUpload({username,childProps}) {
    const classes = useStyles();
    const [image, setImage] = useState('')
    const [caption, setCaption] = useState('')
    const [progress, setProgress] = useState('')

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }

    const handleUpload = () => {
        const uploadImage = storage.ref(`images/${image.name}`).put(image)

        uploadImage.on(
            "state_changed",
            (snapshot) => {
                //progress function...
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgress(progress);
            },
            (error) => {
                alert(error.message)
            },
            () => {
                //complete function...
                storage
                    .ref('images')
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        //post image inside db... 
                        db.collection('posts').add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username
                        });

                        setProgress(0);
                        setImage(null);
                        setCaption('')
                    })
            }
        )
    }


    return (
        <div className={classes.uploadContain}>
            <h3 style={{color:'white'}}>Let's post your story here !!!</h3>
            {/* caption */}
            <input type="text" placeholder="Enter a caption..." onChange={(event)=>setCaption(event.target.value)} value={caption   } />
            {/* file upload */}
            <input type="file" onChange={handleChange} />
            {/* button */}
            <progress value={progress} max='100'/>
            <Button style={{color:'white'}} onClick={handleUpload}>Upload</Button>
            <Button style={{color:'white'}} onClick={()=>childProps('This is child Props')}>test pass child props</Button>
        </div>
    )
}

export default ImagesUpload
