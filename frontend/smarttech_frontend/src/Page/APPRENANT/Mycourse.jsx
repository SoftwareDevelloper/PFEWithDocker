import { motion } from "framer-motion";
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import '../../i18n';
import './CSS/Mycourse.css';

const Mycourse = () => {

    const [mycourse,setMycourse] = useState([]);
    const{t,i18n} = useTranslation()
    const currentLanguage = i18n.language; 
      useEffect(()=>{
        window.document.dir = i18n.dir();
      },[currentLanguage])
      useEffect(() => {
        const token = localStorage.getItem("auth-token");
          let userId=''
          if(token){
            const decodedToken = jwtDecode(token);
            userId = decodedToken.sub; 
          }
          
            fetch(`http://localhost:9000/api/Mycourse/${userId}?lang=${currentLanguage}`)
            .then((response) => response.json())
            .then((data) => {
              console.log('my course fetched:', data);
                if (Array.isArray(data)) {
                setMycourse(data);
              } else {
                setMycourse([data]); 
              }
            })
            .catch((error) => {
              console.error('Error fetching my course', error);
            });
      }, [currentLanguage]);
     
  return (
<div className='mycourse'>
                <motion.div
                  initial={{ opacity: 0, x: 150, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -150, scale: 0.5 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="mycourseH1Motion">
                    <div className="containerEvent">
                      <h1 className='mycourseH1'>{t('EnrolledCourses')}</h1>
                    </div>
                  </motion.div>
    <div className="courses-grid">
        {mycourse.map((course) => (
            <div key={course.id} className="MycoursesSubs">
                <Link to={`${course.id}`} className="course-link">
                    <img src={course.image} alt={course.title} />
                </Link>
                <div className="infoCourse">
                    <h1>{currentLanguage === 'fr'
                            ? course.titleFr
                            : currentLanguage === 'ar'
                            ? course.titleAr
                            : course.titleEn}</h1>
                    <hr />
                    <p>{currentLanguage === 'fr'
                            ? course.descriptionFr
                            : currentLanguage === 'ar'
                            ? course.descriptionAr
                            : course.descriptionEn}</p>
                    <Link to={`${course.id}`} className="course-link">
                        {t('ViewChapters')}
                    </Link>
                </div>
            </div>
        ))}
    </div>
</div>
  )
}

export default Mycourse
