import { motion } from "framer-motion";
import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import banner from '../assest/banner_hero_home.svg';
import About from '../component/About';
import Contact from '../component/Contact';
import SubjectSection from "../component/SubjectSection";
import Teachers from "../component/Teachers/Teachers";
import '../i18n';
import './home.css';

const Home = () => {
  const [event, setEvent] = useState(null);
  const [showModal, setShowModal] = useState(true); 
  const{t,i18n} = useTranslation()
  const currentLanguage = i18n.language; 
  useEffect(()=>{
    window.document.dir = i18n.dir();
  },[currentLanguage])


      useEffect(() => {
        fetch(`http://localhost:9000/event/GetEvent?lang=${currentLanguage}`)
          .then(response => response.json())
          .then(data => {
            console.log('Fetched course:', data);
            if (Array.isArray(data)) {
              setEvent(data);
            } else {
              console.error("Fetched data is not an array:", data);
              setEvent([]);
            }
          })
          .catch(error => {
            console.error("Error fetching course:", error);
            setEvent([]); 
          })
      }, [currentLanguage]);
  return (
   
    <div className="home dark-bg dark-text">
          {showModal && event?.length > 0 && (
            <div className="event dark-bg dark-text">
              {event.map((ev, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 150, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -150, scale: 0.5 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="eventMotion"
                >
                  <div className="containerEvent  dark-text">
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <h2 className="eventTitle">
                        {currentLanguage === "fr"
                          ? ev.eventTitleFr
                          : currentLanguage === "ar"
                          ? ev.eventTitleAr
                          : ev.eventTitle}
                      </h2>
                    </div>
                    <br />
                    <br />
                    <p className="eventDesc">
                      {currentLanguage === "fr"
                        ? ev.eventDescriptionFr
                        : currentLanguage === "ar"
                        ? ev.eventDescriptionAr
                        : ev.eventDescription}
                    </p>
                    <p className="eventOn"> {t('On')} </p>

                    <p className="eventDate">
                      {new Date(ev.eventDate).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

        <section className='banner dark-bg' >
        <div class="heroRight" style={{display:"flex",flexDirection:"column"
        }} >
        <motion.h1
    initial={{ opacity: 0, x: -100 }} 
    whileInView={{ opacity: 1, x: 0 }} 
    transition={{ duration: 1.5, ease: "easeIn" }} 
    viewport={{ once: true, amount: 0.5 }} 
  >
            {t('textBanner1')} <br /><span>{t('textBanner2')}</span>
           
            </motion.h1>
            <motion.div
    initial={{ opacity: 0.2, x: -100 }} 
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 1.5, ease: "easeIn" }} 
    viewport={{ once: true, amount: 0.5 }} 
    >
            </motion.div>
            <motion.p
    initial={{ opacity: 0.2, x: 100 }} 
    whileInView={{ opacity: 1, x: 0 }} 
    transition={{ duration: 1.5, ease: "easeOut" }}
    viewport={{ once: true, amount: 0.5 }} 
    >
           {t('slogan')}
            </motion.p>

        </div>
        <motion.div
    initial={{ opacity: 0.2, x: 100 }}
    whileInView={{ opacity: 1, x: 0 }} 
    transition={{ duration: 1.5, ease: "easeOut" }} 
    viewport={{ once: true, amount: 0.5 }} 
     className="heroleft">
           
            <img src={banner} alt=""  />
         </motion.div>
       </section>

<br />
<div id='about'>
  <About/>
</div>
<div id="Subjects">
  <SubjectSection/>
</div>

<div id="Teachers">
  <Teachers/>
</div>
<div id='contact'>
<Contact/>
</div>




</div>
  )
}

export default Home
