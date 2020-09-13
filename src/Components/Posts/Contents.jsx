import React from 'react'

function Contents({imageUrl, type}) {
    return (
        <>
        {type === 'image' ?
        <img className="post-image" src={imageUrl} alt ="" />
         :
         <video className="post-image" src={imageUrl} alt ="" autoPlay loop controls />
         }
         
        </>
    )
}

export default Contents
