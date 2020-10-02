import React from 'react'
import firebase from 'firebase/app'
import { makeStyles } from '@material-ui/core/styles'
import { useState } from 'react'
import { storage, db } from './firebase'
import md5 from 'md5'




const useStyles = makeStyles(() => ({
    uploadContain: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        background: '#000000',
        border: 'solid 1px blue',
        padding: '20px 5px',
        width: '100%',
        color: 'black',
        alignItems: 'center',
        '& input': {
            backgroundColor: '#e2e2e2',
            padding: '5px 10px',
            margin: '10px auto',
            width: '80%'
        },
        '& progress': {
            width: '50%',
            height: '30px',
            margin: '5px auto'
        },
        '& button': {
            display: 'block',
            position: 'relative',
            overflow: 'hidden',
            color: 'white',
            width: '150px',
            height: '50px',
            outline: 'none',
            backgroundColor: 'black'
        },
        '& button:hover': {
            backgroundPosition: 'right center',
            backgroundSize: '100% 0',
        },
    }
}))

function ImagesUpload({ username, childProps, onclose }) {
    const classes = useStyles();
    const [image, setImage] = useState('')
    const [filename, setFilename] = useState('')
    const [caption, setCaption] = useState('')
    const [progress, setProgress] = useState('')
    const [typeFile,setTypeFile] = useState('')
    
    //  useEffect(()=>{
    //         console.log("checking",typeFile)
    //         if(typeFile.startsWith('video')===true){
    //             console.log("video")
    //         }
    //         else {
    //             console.log("image")
    //         }
        
    // },[typeFile])

    const handleChange = (e) => {
       let img = e.target.files[0]
        if (img) {
            setFilename(md5(img.name))
            setImage(img);
            if(img.type.startsWith('image')){
                setTypeFile('image')
            }
            else{
                setTypeFile('video')
            }
        }
    }

    const handleUpload = () => {
        const uploadImage = storage.ref(`images/${filename}`).put(image)

        uploadImage.on(
            "state_changed",
            (snapshot) => {
                //progress function...
                //https://firebase.google.com/docs/storage/web/upload-files
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgress(progress);
            },
            (error) => {
                console.log(error.message)
            },
            () => {
                //complete function...
                storage
                    .ref('images')
                    .child(filename)
                    .getDownloadURL()
                    .then(url => {
                        //post image inside db... 
                        db.collection('posts').add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(), 
                            caption: caption,
                            imageUrl: url,
                            username: username,
                            type:typeFile
                        });

                        setProgress(0);
                        setImage(null);
                        setCaption('');
                        onclose(false)
                    })
                window.scrollTop = 0;
            }
        )
    }


    return (
        <div className={classes.uploadContain}>
            <h3 style={{ color: 'white' }}>Update your status here !!!</h3>

            {/* caption */}
            <textarea className="Upload_text" type="text" placeholder="Write something..." onChange={(event) => setCaption(event.target.value)} value={caption}></textarea>
            {/* <input type="text" placeholder="Write something..." onChange={(event)=>setCaption(event.target.value)} value={caption} /> */}

            {/* file upload */}
            <label className="custom-file-upload">
                Photo/Videos
            <input type="file" onChange={handleChange} />
            </label>


            {/* button */}
            {
                progress ? <progress value={progress} max='100' /> : ''
            }
            <button className="btn_upload" onClick={handleUpload}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <h2>Post</h2>
            </button>

            {/* <Button style={{color:'white'}} onClick={()=>childProps('This is child Props')}>test pass child props</Button> */}
        </div>
    )
}

export default ImagesUpload
