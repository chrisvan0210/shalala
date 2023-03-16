import React, { useState } from "react";
import "./assets/css/app.css";
import ParticlesData from "./ParticlesData";

import { Posts, Footer, Header } from "./Components";
import InstagramEmbed from "react-instagram-embed";
import starBucks from "./assets/images/starbucks.png";

import useSignIn from "./hooks/useSignIn";

import { AvatarContext } from "./AvatarContext";

function App() {
  const { userLogin } = useSignIn();
  const [particlesImg, setParticlesImg] = useState(null);

  return (
    <AvatarContext.Provider value={[particlesImg, setParticlesImg]}>
      <div className="App_contain">
        <img src={starBucks} alt="" style={{ display: "none" }} />

        <div>
          {/* header change 1*/}

          <Header userLogin={userLogin} />

          <div className="mainPage-wrapper">
            <div className="App_post_contain">
              {/* post here change 2*/}
              <Posts userLogin={userLogin} />
              {/* {renderPost} */}
            </div>

            {/* Instagram profile clone change 3*/}
            {/* <InstagramEmbed
            url='https://www.instagram.com/p/CO9GxwaJBZp/'
            maxWidth={320}
            style={{ zIndex: '10', height: 'fit-content' }}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => { }}
            onSuccess={() => { }}
            onAfterRender={() => { }}
            onFailure={() => { }}
          /> */}
          </div>
          <Footer />
        </div>

        {/* prarticles theme */}
        <div className="particles-box">
          {particlesImg && <ParticlesData particlesImg={particlesImg} />}
        </div>
      </div>
    </AvatarContext.Provider>
  );
}

export default App;
