import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import student from '../../assest/audience.png';
import classroom from '../../assest/classroom.png';
import lesson from '../../assest/lesson.png';
import TeachersStudent from '../../component/TeachersStudents/TeachersStudent';
import '../../i18n';
const DashboardENS = () => {
  const [totalcourse,settotalcourse] = useState(0);
  const [totalStudent,settotalStudent] = useState(0);
  const[classe,setClasse]=useState(0);
    const [allcourse,setAllcourse] =useState([]);
      const{t,i18n} = useTranslation()
      const currentLanguage = i18n.language; 
  const TotalLessons = async () => {
      try {
          const token = localStorage.getItem("auth-token");
          let role=''
          let enseignantId=''
          if(token){
            const decodedToken = jwtDecode(token);
            enseignantId = decodedToken.sub; 
            const emailaddress = decodedToken.email;
            role = decodedToken.Role;
            const status = decodedToken.status;
            console.log("id of user:",enseignantId);
            console.log("email:", emailaddress);
            console.log("role:",role);
            console.log("status:",status)
          }
        const response = await fetch(`http://localhost:9000/api/CountCourseENS/${enseignantId}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
  
        const data = await response.json();
        settotalcourse(data); 
      } catch (error) {
        console.error('Error fetching total users:', error);
      }
    };
    useEffect(() => {
      TotalLessons();
    }, []);
    const TotalStudent = async () => {
      try {
          const token = localStorage.getItem("auth-token");
          let role=''
          let enseignantId=''
          if(token){
            const decodedToken = jwtDecode(token);
            enseignantId = decodedToken.sub; 
            const emailaddress = decodedToken.email;
            role = decodedToken.Role;
            const status = decodedToken.status;
            console.log("id of user:",enseignantId);
            console.log("email:", emailaddress);
            console.log("role:",role);
            console.log("status:",status)
          }
        const response = await fetch(`http://localhost:9000/api/CountStudent/${enseignantId}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
  
        const data = await response.json();
        settotalStudent(data); 
      } catch (error) {
        console.error('Error fetching total users:', error);
      }
    };
    useEffect(() => {
      TotalStudent();
    }, []);

    useEffect(() => {
       const token = localStorage.getItem("auth-token");
        let enseignantId =''
        if(token){
          const decodedToken = jwtDecode(token);
          enseignantId = decodedToken.sub; 
          const emailaddress = decodedToken.email;
          console.log("id of user:",enseignantId);
          console.log("email:", emailaddress);
        }
      fetch(`http://localhost:9000/api/GetFormationsbyENS/${enseignantId}?lang=${currentLanguage}`)
        .then(response => response.json())
        .then(data => {
          console.log('Fetched course:', data);
          // Make sure the fetched data is an array
          if (Array.isArray(data)) {
            setAllcourse(data);
          } else {
            console.error("Fetched data is not an array:", data);
            setAllcourse([]); // Set to empty array if it's not an array
          }
        })
        .catch(error => {
          console.error("Error fetching course:", error);
          setAllcourse([]); // Handle error by setting empty array
        });
    }, [currentLanguage]);
    const TotalClass = async () => {
      try {
          const token = localStorage.getItem("auth-token");
          let role=''
          let enseignantId=''
          if(token){
            const decodedToken = jwtDecode(token);
            enseignantId = decodedToken.sub; 
            const emailaddress = decodedToken.email;
            role = decodedToken.Role;
            const status = decodedToken.status;
            console.log("id of user:",enseignantId);
            console.log("email:", emailaddress);
            console.log("role:",role);
            console.log("status:",status)
          }
        const response = await fetch(`http://localhost:9000/api/CountCourseENS/${enseignantId}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
  
        const data = await response.json();
        setClasse(data); 
      } catch (error) {
        console.error('Error fetching total users:', error);
      }
    };
    useEffect(() => {
      TotalClass();
    }, []);

  return (
<div class="p-4 bg-white sm:ml-64" style={{fontFamily:"Montserrat, sans-serif"}}>
  <div class="p-4 mb-5">
    {/* Stats Cards Section */}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
      <div class="bg-indigo-400 text-white p-5 rounded-lg shadow-lg shadow-blue-500/50 w-full max-w-xs mx-auto flex flex-col items-center">
        <img src={classroom} alt="Classroom" class="w-20" />
        <h3 class="text-xl font-semibold mt-2">Class</h3>
        <p class="text-xl font-bold">{classe}</p>
      </div>
      <div class="bg-indigo-500 text-white p-5 rounded-lg shadow-lg shadow-grey-500/50 w-full max-w-xs mx-auto flex flex-col items-center">
        <img src={student} alt="Students" class="w-20" />
        <h3 class="text-xl font-semibold mt-2">Students</h3>
        <p class="text-xl font-bold">{totalStudent}</p>
      </div>
      <div class="bg-indigo-700 text-white p-5 rounded-lg shadow-lg shadow-grey-500/50 w-full max-w-xs mx-auto flex flex-col items-center">
        <img src={lesson} alt="Lessons" class="w-20" />
        <h3 class="text-xl font-semibold mt-2">Total Lessons</h3>
        <p class="text-xl font-bold">{totalcourse}</p>
      </div>
    </div>

    {/* Courses Grid Section */}
    <div class="mb-5">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {allcourse.map(course => (
          <div key={course.id} class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow " >
            <h3 class="text-md font-medium text-gray-900 mb-1">
              {currentLanguage === 'fr' ? course.titleFr :
               currentLanguage === 'ar' ? course.titleAr :
               course.titleEn}
            </h3>
            <p class="text-md text-green-400 mb-1">{course.category}</p>
            <p class="text-sm text-green-400">{course.price} TND</p>
          </div>
        ))}
      </div>
    </div>

    {/* Teachers/Students Section */}
    <div class="p-4">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <TeachersStudent/>
      </div>
    </div>
  </div>
</div>
  )
}

export default DashboardENS
