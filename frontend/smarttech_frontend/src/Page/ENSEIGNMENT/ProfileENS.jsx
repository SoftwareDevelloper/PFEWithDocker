import { Video } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import grid from '../../assest/grid.png';
import reel from '../../assest/reel.png';
import teacher_profile from '../../assest/user_teacher.png';
import i18n from '../../i18n';
import './css/ProfileEns.css';

const ProfileEns = () => {
  const currentLanguage = i18n.language; 
  useEffect(()=>{
    window.document.dir = i18n.dir();
  },[currentLanguage])
  const{t} = useTranslation()
  const [user, setUser] = useState(null);
  const [Post, setPost] = useState([]);
  const [Reel, setReel] = useState([]);
  const [imagePreview, setImagePreview] = useState(teacher_profile);
  const { teacherId } = useParams();
  const [activeTab, setActiveTab] = useState("post");

  useEffect(() => {
    fetch(`http://localhost:9000/api/user/${teacherId}`)
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.error('Error fetching teacher', error);
      });
  }, [teacherId]);
// Check if user is following


useEffect(() => {
  fetch(`http://localhost:9000/api/Post/${teacherId}`)
    .then((response) => response.json())
    .then((data) => {
      setPost(data);
    })
    .catch((error) => {
      console.error('Error fetching posts', error);
    });
}, [teacherId]);

useEffect(() => {
  fetch(`http://localhost:9000/api/Reel/${teacherId}`)
    .then((response) => response.json())
    .then((data) => {
      setReel(data);
    })
    .catch((error) => {
      console.error('Error fetching posts', error);
    });
}, [teacherId]);




 
    
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className='max-w-4xl mx-auto'>
 <div className="containers" style={{backgroundColor:"#fffff",borderRadius:"15px",boxShadow:"0 1px 3px rgba(0,0,0,0.12)",padding:"20px"}}>
      <ToastContainer/>
      <div className="info_primaire">
        <img src={user?.image || imagePreview} alt="Profile" className="img_ens" />
        <div className="flex flex-col items-start">
          <h1 className="fullname_ens">{user?.fullname}</h1>
        </div>
      </div>
      {/* Bio Section */}
      <div className="ens_bio">
        <h2 className="aboutEnsh2">Professional Summary</h2>
        <p className="bioP">{user?.about}</p>
        <p className="speciality"> {t('Speciality :')} {user?.specialitée} </p>
        
        <h2 className="contactInfoh2">Contact Details</h2>
        <p className="emailsp">📧 {user?.email}</p>
        <p className="telephonep">📞 {user?.phone}</p>
      </div>

      {/* Content Tabs */}
      <div className="drawers">
        <button 
          className={`tab-btn ${activeTab === "post" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("post")}
        >
          <img src={grid} alt="Posts" className="tab-icon" />
          POSTS
        </button>
        <button
          className={`tab-btn ${activeTab === "reel" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("reel")}
        >
          <img src={reel} alt="Reels" className="tab-icon" />
          REELS
        </button>
      </div>

      {/* Content Grid */}
      <div className="posts-grid">
        {activeTab === "post" && Post.length > 0 && (
          <div className="grid grid-cols-3 gap-1 bg-gray-100">
            {Post.map((post) => (
              <div key={post.id} className="group relative aspect-square cursor-pointer overflow-hidden">
                <img
                  src={post.image}
                  alt=""
                  className="h-full w-full object-cover transition-opacity hover:opacity-90"
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === "reel" && Reel.length > 0 && (
          <div className="grid grid-cols-3 gap-1 bg-gray-100">
            {Reel.map((reel) => (
              <div key={reel.id} className="group relative aspect-square cursor-pointer">
                <video
                    className="h-full w-full object-cover"
                    controls // Add native video controls
                    loop
                    preload="auto"
                    onClick={(e) => e.target.play()} // Play on click
                    onMouseOver={(e) => e.target.play()} // Auto-play on hover
                    onMouseOut={(e) => e.target.pause()} // Pause when not hovering
                >
                  <source src={reel?.url || "no video"} type="video/mp4" />
                </video>
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  <Video className="text-white w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

    </div>
   

  );
};

export default ProfileEns;
