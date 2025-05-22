import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Bell, Book, BookKey, BookPlus, BotMessageSquare, CalendarClock, FilePlus2, LayoutDashboardIcon, LogOutIcon, MessageSquareText, Moon, Sun, User, UserRoundPlus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Link, NavLink } from 'react-router-dom';
import AdminProfile from '../assest/AdminProfile.png';
import downArrow from '../assest/down-arrow.png';
import arabe from '../assest/flag.png';
import fr from '../assest/france.png';
import globe from '../assest/globe (1).png';
import icon from "../assest/smarttechAcademy.png";
import usa from '../assest/united-states.png';
import '../i18n';
import './css/Navbar.css';
const Navbar = ({isLoggedIn,role}) => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true'
  );

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    document.documentElement.classList.toggle('dark', newMode);
  };
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState(null);
  const [imagePreview, setImagePreview] = useState(AdminProfile);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Mobile menu toggle
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  
  // Responsive sidebar toggle
  useEffect(() => {
      const token = localStorage.getItem("auth-token");
      if (token) {
          const decodedToken = jwtDecode(token);
          setUserId(decodedToken.sub);
      }
  }, []);
  useEffect(() => {
    if (!userId) return; 
    
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("http://localhost:9000/notifications/unread", {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("auth-token")}`
          }
        });
        
        // Deduplicate based on messageHash
        const uniqueNotifications = response.data.reduce((acc, current) => {
          const exists = acc.some(item => item.messageHash === current.messageHash);
          if (!exists) {
            return [...acc, current];
          }
          return acc;
        }, []);
        
        setNotifications(prev => {
          // Only update if notifications actually changed
          if (JSON.stringify(prev) !== JSON.stringify(uniqueNotifications)) {
            return uniqueNotifications;
          }
          return prev;
        });
      } catch (error) {
        console.error("Error fetching notifications", error);
      }
    };
  
    // Fetch immediately and then every 30 seconds (reduced from 10s)
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(interval);
  }, [userId]);
  const MarkAllRead = async () => {
    try {
      await axios.post(
        "http://localhost:9000/notifications/markAsRead",
        {},
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("auth-token")}`
          }
        }
      );
      setNotifications([]); // Clear all notifications immediately
    } catch (error) {
      console.error("Error marking notifications as read", error);
    }
  };
const [isOpen, setIsOpen] = useState(false);
const [isNotificationOpen, setIsNotificationOpen] = useState(false);
const[isProfileOpen,setisProfileOpen] = useState(false);
const{t,i18n} = useTranslation()
const changeLanguage=(lng)=>{i18n.changeLanguage(lng)}
const currentLanguage = i18n.language; 
useEffect(()=>{window.document.dir = i18n.dir();},[currentLanguage])
const navbarBgColor = role === "ADMIN" || role=== "ENSEIGNMENT" ? "bg-white  dark-bg" : "bg-white  dark-bg";

// get event 

  const [event,setevent]=useState([]);
  useEffect(()=>{
    fetch("http://localhost:9000/event/GetEvent")
    .then(response => response.json())
    .then(data => {
      console.log('Fetched course:', data);
      if (Array.isArray(data)) {
        setevent(data);
      } else {
        console.error("Fetched data is not an array:", data);
        setevent([]); 
      }
    })
    .catch(error => {
      console.error("Error fetching course:", error);
      setevent([]);
    });
  },[])
  const [isVisible, setIsVisible] = useState(true);

    const [allcourse, setAllcourse]=useState([]);

     useEffect(() => {
          fetch(`http://localhost:9000/api/GetFormations?lang=${currentLanguage}`)
            .then(response => response.json())
            .then(data => {
              console.log('Fetched course:', data);
              if (Array.isArray(data)) {
                setAllcourse(data);
              } else {
                console.error("Fetched data is not an array:", data);
                setAllcourse([]);
              }
            })
            .catch(error => {
              console.error("Error fetching course:", error);
              setAllcourse([]); 
            })
        }, [currentLanguage]);

      const [user, setUser] = useState(null);

        useEffect(() => {
          const token = localStorage.getItem("auth-token");
          if (token) {
            const decodedToken = jwtDecode(token);
            const adminId = decodedToken.sub;
          fetch(`http://localhost:9000/api/user/${adminId}`)
            .then((response) => response.json())
            .then((data) => {
              setUser(data);
            })
            .catch((error) => {
              console.error('Error fetching teacher', error);
            });
          }
        }, []);


return (
<nav className={navbarBgColor} style={{fontFamily:"Montserrat,sans-serif"}}>
  <div class="max-w-screen-xl mx-auto px-4 py-3 dark-bg dark-text">
  {
  !isLoggedIn ? (
    <>   
    <div className="flex flex-wrap items-center justify-between ">
      <Link to="/" className="flex items-center space-x-5 rtl:space-x-reverse dark-hover dark-text" >
        <img src={icon} alt="SmartTech Academy Logo" className='w-12 md:w-16 dark-invert'/>
      </Link>
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg  dark-hover dark-text"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 6h16M4 12h16m-7 6h7" 
          />
        </svg>
      </button>
      {/* Navigation Items */}
      <div className={`flex items-center justify-center w-full md:w-auto md:flex ${isMobileMenuOpen ? 'block' : 'hidden'}`} >
        <div className="flex flex-col md:flex-row items-center  ">
          {/* Auth Buttons */}
          <div className="flex flex-col md:flex-row  w-full md:w-auto">
            <Link to="/Login" className="w-full md:w-auto">
              <button className="btn_Login w-full md:w-auto  ">
                {t('SignIn')}
              </button>
            </Link>
            <Link to="/SignUp" className="w-full md:w-auto">
              <button className="btn_Register w-full md:w-auto  ">
                {t('Register')}
              </button>
            </Link>
          </div>
          {/* Language Selector */}
          <div className="relative group w-full md:w-auto dark-bg dark-text">
            <button 
              className="flex items-center justify-center gap-2 w-full md:w-auto px-4 py-2 text-gray-900 rounded-lg hover:bg-gray-100  dark-text"
              onClick={() => setIsOpen(!isOpen)}
            >
              <img src={globe} alt="Globe" className="w-5 h-5 dark-invert" />
              <img src={downArrow} alt="Dropdown" className="w-4 h-4 dark-invert" />
            </button>

            {/* Language Dropdown */}
            {isOpen && (
              <div className="absolute md:right-0 w-full md:w-48 mt-2 bg-white border rounded-lg shadow-lg dark-bg dark-text">
                <ul className="py-2">
                  <li>
                    <button
                      onClick={() => changeLanguage('en')}
                      className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-100 dark-text "
                    >
                      <img src={usa} alt="English" className="w-6 h-6" />
                      {t('english')}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => changeLanguage('fr')}
                      className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-100 dark-text "
                    >
                      <img src={fr} alt="French" className="w-6 h-6" />
                      {t('french')}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => changeLanguage('ar')}
                      className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-100 dark-text "
                    >
                      <img src={arabe} alt="Arabic" className="w-6 h-6" />
                      {t('arabic')}
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
          <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-200 dark-bg hover:bg-gray-300"
            >
            {darkMode ? (
              <span className="text-xl"><Sun/></span>
            ) : (
              <span className="text-xl"> <Moon/> </span>
            )}
          </button>
        </div>
      </div>
    </div>
  
      
    </>
  ):(
  <>
  </>
  )}
  </div>
  {
  isLoggedIn ? (
    role==="ADMIN"? (
    <>
    <nav class="p-4  sm:ml-64 dark-bg text-gray-800 dark-text"  onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{fontFamily:"Montserrat,sans-serif"}}>
      <div className="md:hidden flex justify-between items-center p-4">
      <button
          data-drawer-target="default-sidebar"
          data-drawer-toggle="default-sidebar"
          className="md:hidden p-2 text-gray-500 rounded-lg hover:bg-gray-100"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>


        <div className="flex items-center gap-4">
        <div className="relative">
          <button onClick={() => setIsNotificationOpen(!isNotificationOpen)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full relative">
            <Bell className="w-6 h-6" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 bg-yellow-500 text-white rounded-full w-4 h-4 text-xs">
                  {notifications.length}
                </span>
              )}
          </button>
          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white border rounded-lg shadow-lg z-50">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Notifications</h3>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="p-4 text-sm text-gray-500">No notifications</p>
                  ) : (
                    notifications.map((notif) => (
                      <Link key={notif.messageHash} to="/Approvecomments" className="block p-4 hover:bg-gray-50 border-b">
                        <div className="text-sm text-gray-800">{notif.message}</div>
                        <div className="text-xs text-gray-500 mt-1">{new Date(notif.timestamp).toLocaleString()}</div>
                      </Link>
                    ))
                  )}
              </div>
              <button onClick={MarkAllRead} className="w-full p-3 text-sm text-gray-600 hover:bg-gray-100 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg"className="w-4 h-4"fill="none"viewBox="0 0 24 24"stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                </svg>
                Mark all as read
              </button>
            </div>
          )}
        </div>
        <div className="relative">
        <button value={"Languages"} onClick={() => setIsOpen(!isOpen)}  data-dropdown-toggle="language-dropdown-menu" className="flex items-center gap-1 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
            <img src={globe} alt="Globe" className="w-5 h-5" />
            <img src={downArrow} alt="Dropdown" className="w-3 h-3" />
          </button> 
           {/* Language Dropdown */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
              <ul className="py-2">
                <li>
              <buton value='en' onClick={() => changeLanguage('en')}  class="inline-flex items-center px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 dark:text-gray-800 dark:hover:bg-blue-800 dark:hover:text-white" style={{gap:"10px"}}  >
                  <img  src={usa} alt='' width={"25px"} height={"25px"} />
                  {t('english')}
                </buton>
                <button value='fr'onClick={() => changeLanguage('fr')} class="inline-flex items-center px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 dark:text-gray-800 dark:hover:bg-blue-800 dark:hover:text-white" style={{gap:"10px"}} >
                  <img src={fr} alt='' width={"25px"} height={"25px"} />
                  {t('french')}
                </button>
                <button value='ar' onClick={() => changeLanguage('ar')} class="inline-flex items-center px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 dark:text-gray-800 dark:hover:bg-green-700 dark:hover:text-white" style={{gap:"10px"}} >
                  <img src={arabe} alt='' width={"25px"} height={"25px"} />
                  {t('arabic')}
                </button>
                </li>
              </ul>
            </div>
          )}    
        </div>
            <button 
            onClick={() => setisProfileOpen(!isProfileOpen)}
            className="flex text-sm bg-white rounded-full md:me-0 focus:ring-4 focus:ring-yellow-400"
            type="button">
            <span className="sr-only">Open user menu</span>
            <img className="w-10 h-10 rounded-full" src={user?.image || imagePreview} alt=""/>
            </button>
            {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
              <div className="px-4 py-3 border-b">
                <div className="text-sm font-medium truncate">{user?.fullname}</div>
                <div className="text-xs text-gray-500 truncate">{user?.email}</div>
              </div>
              <ul className="py-1">
                 <li>
                <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">
                  Dashboard
                </Link>
              </li>
              <Link to={`/Admin/${userId}`} className="block px-4 py-2 hover:bg-gray-100">
                  Profile
                </Link>
              <li>
                <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100">
                  Settings
                </Link>
              </li>
            </ul>
            <div className="py-2">
              <button 
                onClick={() => {
                  localStorage.removeItem('auth-token');
                  window.location.replace('/Login');
                 setIsOpen(!isOpen)
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign out
              </button>
               </div>
            </div>
          )}
        </div>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-200 dark-bg hover:bg-gray-300"
            >
            {darkMode ? (
              <span className="text-xl"><Sun/></span>
            ) : (
              <span className="text-xl"> <Moon/> </span>
            )}
          </button>
          </div>
      
    </nav>
     {/* Responsive Sidebar */}
    <aside
        onClick={() => toggleMobileMenu()}
        id="default-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 bg-white shadow-lg dark-bg  dark-text"
      >   
       <div className="h-full px-4 py-6 overflow-y-auto  border dark-border">
        <div className="flex justify-center mb-8">
          <img src={icon} alt="Logo" className="w-24 dark-invert" />
        </div>
           <nav className="space-y-1 dark-text">
        {[
          { to: '/Dashboard', text: t('Dashboard'), icon: LayoutDashboardIcon },
          { to: '/usermanagement', text:  t('userManagement'), icon: User },
          { to: '/coursManagement', text: t('courseManagement'), icon: Book  },
          { to: '/Events', text: t('Events'), icon: CalendarClock },
          { to: '/AddCourses', text: t('Adding'), icon: BookPlus },
          { to: '/CreateChapters', text: t('Create Chapter'), icon:FilePlus2 },
          { to: '/UnlockChapters', text: t('Unlock Chapters'), icon:BookKey },
          { to: '/IAManagement', text: t('AIManagement'), icon: BotMessageSquare },
          { to: '/AddUser', text: t('Teacher'), icon: UserRoundPlus },
          { to: '/Approvecomments', text: t('Community'), icon:MessageSquareText },
          
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex items-center p-3 text-gray-600 rounded-lg hover:bg-gray-100 dark-text "
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.text}
          </Link>
        ))}
        <button class="block py-2 px-8 text-white  md:bg-transparent text-lg" onClick={()=>{localStorage.removeItem('auth-token');window.location.replace('/Login')}} style={{ display: "flex", alignItems: "center",cursor:"pointer",gap:"5px", width:"200px",height:"50px",background:"#0382c7",boxShadow:"5px 5px 5px #0382c7",borderRadius:"3px",justifyContent:"center" }}>
          <LogOutIcon className="w-5 h-5" />
          {t('Logout')}
        </button>        
      </nav>

      </div>   

      </aside>
    </>
      ): role==="APPRENANT" ?(
                  <>
                 <nav className="bg-white relative dark-bg" style={{ fontFamily: "Montserrat,sans-serif" }}>
                    <div className="max-w-screen-xl mx-auto px-4 py-3 dark-bg dark-text">
                      <div className="flex flex-wrap items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex items-center z-10 ">
                          <img src={icon} alt="" className="w-16 md:w-20 dark-invert" />
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                          className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg z-10 dark-text"
                          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                          <svg 
                            className="w-6 h-6" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M4 6h16M4 12h16m-7 6h7" 
                            />
                          </svg>
                        </button>

                        {/* Navigation Items */}
                            <div
                              className={`w-full md:w-auto  dark-text ${isMobileMenuOpen ? 'block' : 'hidden'} md:flex  dark-text`}
                              style={{
                                fontFamily: "Montserrat, sans-serif",
                                justifyContent: "center",
                                alignItems: "center"
                              }}
                            >
                          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full md:flex-grow  dark-text">
                            {/* Main Links */}
                            <div className="md:flex absolute left-1/2 -translate-x-1/2  dark-text">
                            <div className="flex items-center space-x-8  dark-text">
                                <NavLink
                                  to="/" 
                                  className={({ isActive }) => 
                                    `text-lg transition-colors duration-300 ${
                                      isActive ? 'text-blue-800' : 'text-gray-600 hover:text-blue-800  dark-text'
                                    }`
                                  }
                                  end
                                >
                                  {t('home')}
                                </NavLink>
                                <NavLink
                                  to="/Cours"
                                  className={({ isActive }) => 
                                    `text-lg transition-colors duration-300 ${
                                      isActive ? 'text-blue-800' : 'text-gray-600 hover:text-blue-800   dark-text'
                                    }`
                                  }
                                >
                                  {t('courses')}
                                </NavLink>
                                <NavLink
                                  to="/Profile"
                                  className={({ isActive }) => 
                                    `text-lg transition-colors duration-300 ${
                                      isActive ? 'text-blue-800' : 'text-gray-600 hover:text-blue-800  dark-text'
                                    }`
                                  }
                                >
                                  {t('profile')}
                                </NavLink>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 w-full md:w-auto dark-bg dark-text">
                              <div className="relative ">
                                <button 
                                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-full relative dark-text "
                                >
                                  <Bell className="w-6 h-6" />
                                  {notifications.length > 0 && (
                                    <span className="absolute top-0 right-0 bg-yellow-500 text-white rounded-full w-4 h-4 text-xs dark-text">
                                      {notifications.length}
                                    </span>
                                  )}
                                </button>

                                {/* Notifications Dropdown */}
                                {isNotificationOpen && (
                                  <div className="absolute right-0 mt-2 w-72 bg-white border rounded-lg shadow-lg z-50 dark-bg dark-text">
                                    <div className="p-4 border-b text-gray-500 dark-text">
                                      <h3 className="font-semibold text-gray-500 dark-text ">Notifications</h3>
                                    </div>
                                    <div className="max-h-60 overflow-y-auto">
                                      {notifications.length === 0 ? (
                                        <p className="p-4 text-sm text-gray-900 dark-text">No notifications</p>
                                      ) : (
                                        notifications.map((notif, index) => (
                                          <Link
                                            key={index}
                                            to="/Cours"
                                            className="block p-4 hover:bg-gray-50 border-b"
                                          >
                                            <div className="text-sm text-gray-800 dark-text">{notif.message}</div>
                                            <div className="text-xs text-gray-500 mt-1 dark-text">{notif.timestamp}</div>
                                          </Link>
                                        ))
                                      )}
                                    </div>
                                    <button
                                      onClick={MarkAllRead}
                                      className="w-full p-3 text-sm text-gray-600 hover:bg-gray-100 flex items-center gap-2 dark-text"
                                    >
                                      <svg 
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-4 h-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path 
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                      Mark all as read
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* Language Selector */}
                              <div className="relative dark-bg dark-text" >
                                <button
                                  onClick={() => setIsOpen(!isOpen)}
                                  className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg  "
                                >
                                  <img src={globe} alt="Globe" className="w-5 h-5 dark-invert" />
                                  <img src={downArrow} alt="Dropdown" className="w-3 h-3 dark-invert" />
                                </button>

                                {/* Language Dropdown */}
                                {isOpen && (
                                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50 dark-bg dark-text">
                                    <ul className="py-2">
                                      <li>
                                        <button
                                          onClick={() => changeLanguage('en')}
                                          className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-100  dark-text"
                                        >
                                          <img src={usa} alt="English" className="w-6 h-6" />
                                          {t('english')}
                                        </button>
                                      </li>
                                      <li>
                                        <button
                                          onClick={() => changeLanguage('fr')}
                                          className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-100  dark-text"
                                        >
                                          <img src={fr} alt="French" className="w-6 h-6" />
                                          {t('french')}
                                        </button>
                                      </li>
                                      <li>
                                        <button
                                          onClick={() => changeLanguage('ar')}
                                          className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-100  dark-text"
                                        >
                                          <img src={arabe} alt="Arabic" className="w-6 h-6" />
                                          {t('arabic')}
                                        </button>
                                      </li>
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <button
                              onClick={toggleDarkMode}
                              className="p-2 rounded-full bg-gray-200 dark-bg hover:bg-gray-300"
                            >
                            {darkMode ? (
                              <span className="text-xl"><Sun/></span>
                            ) : (
                              <span className="text-xl"> <Moon/> </span>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </nav>
                    
                  </>
              )  : role === "ENSEIGNMENT" && (
                  <>
                    <nav className="bg-white dark-bg font-[Montserrat]">
                      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                        <div to="/" className="flex items-center">
                        </div>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-gray-500 rounded-lg hover:bg-gray-100"
                            aria-label="Toggle menu"
                          >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        <div className="flex items-center space-x-4 md:space-x-6">
                          <div className="relative">
                            <button 
                              onClick={() => setIsNotificationOpen(!isNotificationOpen)} 
                              className="relative p-2 rounded-lg hover:bg-gray-100"
                            >
                              <Bell className="text-gray-700 w-6 h-6" />
                              {notifications.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                  {notifications.length}
                                </span>
                              )}
                            </button>
                            {isNotificationOpen && (
                              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
                                <div className="p-3 border-b border-yellow-500 flex justify-center bg-yellow-50">
                                  <Bell className="text-yellow-500 w-6 h-6" />
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                  {notifications.length === 0 ? (
                                    <p className="text-sm text-yellow-500 p-4 text-center">No notifications</p>
                                  ) : (
                                    <div className="divide-y divide-gray-200">
                                      {notifications.map(notif => (
                                        <div key={notif.id} className="hover:bg-gray-50">
                                          <Link 
                                            to="/Cours" 
                                            className="block p-4"
                                            onClick={() => setIsOpen(false)}
                                          >
                                            <p className="text-sm text-blue-800 font-medium">{notif.message}</p>
                                            <p className="text-xs text-blue-600 mt-1">{notif.timestamp}</p>
                                          </Link>
                                        </div>
                                      ))}
                                      <div className="p-3 border-t border-gray-200">
                                        <button 
                                          onClick={() => {
                                            MarkAllRead();
                                            setIsOpen(false);
                                          }} 
                                          className="text-xs text-gray-500 flex items-center hover:text-gray-700"
                                        >
                                          <svg 
                                            className="w-3 h-3 mr-1" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                          >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                          </svg>
                                          Mark all as read
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                              onClick={toggleDarkMode}
                              className="p-2 rounded-full bg-gray-200 dark-bg hover:bg-gray-300"
                            >
                            {darkMode ? (
                              <span className="text-xl"><Sun/></span>
                            ) : (
                              <span className="text-xl"> <Moon/> </span>
                            )}
                          </button>
                      </div>
  
                        <aside  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`fixed top-0 left-0 z-40 w-64 h-screen bg-white shadow-sm transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0`} >                        
                        <div className="p-4 flex flex-col h-full dark-bg">
                          <div className="flex justify-center py-4">
                            <img src={icon} alt="Logo" className="w-24" />
                          </div>
                          <nav className="mt-6 flex-1">
                            <NavLink 
                              to="/DashboardENS" 
                              className={({isActive}) => `flex items-center space-x-3 p-3 rounded-lg mb-2 transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 22 21">
                                <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z"/>
                                <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z"/>
                              </svg>
                              <span>Dashboard</span>
                            </NavLink>
                            <NavLink 
                              to="/comments" 
                              className={({isActive}) => `flex items-center space-x-3 p-3 rounded-lg mb-2 transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 18 20">
                                <path d="M16 0H4a2 2 0 0 0-2 2v1H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM13.929 17H7.071a.5.5 0 0 1-.5-.5 3.935 3.935 0 1 1 7.858 0 .5.5 0 0 1-.5.5Z"/>
                              </svg>
                              <span>Community</span>
                            </NavLink>
                            <NavLink 
                              to={`/ProfileENSPrivate/${userId}`}
                              className={({isActive}) => `flex items-center space-x-3 p-3 rounded-lg mb-2 transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a7.5 7.5 0 0 1-7.5-7.5c0-.75.125-1.5.375-2.2C3.5 10 5 10 5 10h10s1.5 0 2.125.8c.25.7.375 1.45.375 2.2A7.5 7.5 0 0 1 10 18Z"/>
                              </svg>
                              <span>Profile</span>
                            </NavLink>
                            <NavLink 
                              to="/Update" 
                              className={({isActive}) => `flex items-center space-x-3 p-3 rounded-lg mb-2 transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7.75 4H19M7.75 4a2.25 2.25 0 0 1-4.5 0m4.5 0a2.25 2.25 0 0 0-4.5 0M1 4h2.25m13.5 6H19m-2.25 0a2.25 2.25 0 0 1-4.5 0m4.5 0a2.25 2.25 0 0 0-4.5 0M1 10h11.25m-4.5 6H19M7.75 16a2.25 2.25 0 0 1-4.5 0m4.5 0a2.25 2.25 0 0 0-4.5 0M1 16h2.25"/>
                              </svg>
                              <span>Settings</span>
                            </NavLink>
                            <button 
                              onClick={() => {
                                localStorage.removeItem('auth-token');
                                window.location.replace('/Login');
                              }}
                              className="flex items-center space-x-3 p-3 rounded-lg mb-2 text-gray-700 hover:bg-gray-50 w-full text-left">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 16 16">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h11m0 0-4-4m4 4-4 4m-5 3H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h3"/>
                              </svg>
                              <span>Logout</span>
                            </button>
                          </nav>
                        </div>
                      </aside>
                    </nav>
                  </>
              )
            ):(
              <>
              </>
            )
}
</nav>

  )
}

export default Navbar
