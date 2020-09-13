import React from 'react'

import Particles from 'react-particles-js';



function ParticlesData() {
    return (
        <Particles
        params={{
            "particles": {
                "number": {
                    "value": 8,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "line_linked": {
                    "enable": false
                },
                "move": {
                    "speed": 1,
                    "out_mode": "out"
                },
                "shape": {
                    "type": [
                        "image",
                        "circle"
                    ],
                    "image": [
                        {
                            "src": "/static/media/starbucks.a811c6e8.png",
                            "height": 20,
                            "width": 23
                        },
                        {
                            "src": "/static/media/starbucks.a811c6e8.png",
                            "height": 20,
                            "width": 23
                        },
                        {
                            "src": "/static/media/starbucks.a811c6e8.png",
                            "height": 20,
                            "width": 23
                        },
                    ]
                },
                "color": {
                    "value": "#CCC"
                },
                "size": {
                    "value": 30,
                    "random": false,
                    "anim": {
                        "enable": true,
                        "speed": 4,
                        "size_min": 10,
                        "sync": false
                    }
                }
            },
            "retina_detect": false
        }} />

    )
}

export default ParticlesData
