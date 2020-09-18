import React from 'react'
import { useEffect, useState } from 'react'



function Footer() {

    const [X, setX] = useState(10)
    const [Y, setY] = useState(10)
    const [Z, setZ] = useState(10)



    useEffect(() => {
        function runEvent(e) {
            let x = e.offsetX;
            let y = e.offsetY;
            let z = 150;
            setX(x); setY(y); setZ(z);
        }
        let el1 = document.getElementsByClassName('App_footer')
        el1[0].addEventListener('mousemove',runEvent)
        // window.addEventListener('mousemove', runEvent)

        return () => {
            el1[0].removeEventListener('mousemove', runEvent)
        }
    }, [X, Y,Z])

    const footerStyle = {
        backgroundColor: `hsl(${Z},${X}%,${Y}%,1)`
    }
    return (
        <div className="App_footer" style={footerStyle}>
            <div className="App_footer_contain"><h3>Join Us...</h3></div>
        </div>
    )
}

export default Footer
