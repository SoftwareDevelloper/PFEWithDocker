import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast, ToastContainer } from 'react-toastify';
import i18n from '../../i18n';


const Events = () => {
  const{t} = useTranslation()
    const currentLanguage = i18n.language; 
    useEffect(()=>{
      window.document.dir = i18n.dir();
    },[currentLanguage])
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
  // events creation
  const [formData , setformData] = useState({
    eventTitle:"",
    eventDescription:"",
    eventDate:"",

      });
       const changeHandler = (e) =>{
            setformData({...formData, [e.target.name]:e.target.value});
        }
const AddEvent = async () =>{
        if (!formData.eventTitle|| !formData.eventDescription || !formData.eventDate ) {
          toast.error("Please fill all required fields");
          return;
        }
        try{
          const response = await fetch('http://localhost:9000/event/createEvent' ,{
            method:"POST",
            headers :{
              Accept:'application/json',
              'Content-Type':"application/json"
            },
            body:JSON.stringify(formData),
          });
          const responseData = await response.json();
          if (response.ok) 
            {
              toast.success('Event is created successfully');
              setevent((prevEvent) => [...prevEvent, responseData]);
              setformData({
                eventTitle: "",
                eventDescription: "",
                eventDate: "",
              });
          } else{
            toast.error(responseData.errors || 'Creation failed');
          }
      
          }catch(error) {
            console.error('Error during Creation ', error);
            toast.error('Please try again');
          }
        }

        //remove event 
            const RemoveEvent = async(id) =>{
              setevent((prev)=> prev.filter((event)=>event.id !== id));
              if(localStorage.getItem("auth-token"))
                {
                  fetch(`http://localhost:9000/event/delete/${id}`,{
                    method:"DELETE",
                    headers :{
                        Accept : 'application/json',
                        'auth-token':`${localStorage.getItem('auth-token')}`,
                        'Content-type':'application/json',
                    },
                    body:JSON.stringify({event:id})
                })
                .then((response) =>response.json(),toast.success('event deleted successfully'))
                .then((data) => console.log(data))
                .catch((error) => console.error('Error rejected events',error))
            }else{
              toast.info("just admin has access to remove formations")
            }
          }
  return (
    <div className="p-4 sm:ml-64" style={{ fontFamily: "Montserrat, sans-serif" }}>
      <div className="p-4">
        {/* Approved Users Section */}
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-4 mb-4">
        <table className="w-full border-collapse border border-gray-50">
            <thead>
              <tr className="bg-yellow-400 text-white text-sm" >
                <th className="border-2 border-yellow-400 px-3 py-3 text-sm">Event's title</th>
                <th className="border-2 border-yellow-400 px-3 py-3 text-sm">Event's Description</th>
                <th className="border-2 border-yellow-400 px-3 py-3 text-sm">Event's Date</th>
                <th className="border-2 border-yellow-400 px-2 py-3 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                event.map(events=>(
                  <tr key={events.id}>
                  <td className="border-2 border-yellow-400 px-3 py-5 text-sm"> {events.eventTitle} </td>
                  <td className="border-2 border-yellow-400 px-3 py-5 text-sm"> {events.eventDescription} </td>
                  <td className="border-2 border-yellow-400 px-10 py-5 text-sm"> {events.eventDate} </td>

                  <td className="border-2 border-yellow-400 px-10 py-5" >
                    <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",gap:"5px"}}>
                      <button    className="bg-yellow-400 px-3 py-1.5 text-white text-sm  rounded mr-2">
                        update
                      </button>
                      <button onClick={() =>RemoveEvent(events.id)} className="bg-red-500  px-4 py-1.5 text-white text-sm rounded mr-2">
                        delete
                      </button>
                    </div>
                  </td>
                </tr>
                ))
              }
            </tbody>
          </table> 
          <form class="max-w-md mx-auto "  onSubmit={(e) => {e.preventDefault(); AddEvent() }}>
            <h1 className='text-xl text-blue-800 font-medium dark:text-blue-900 dark:font-semibold w-full tracking-wide '>Create a new Event</h1>
            <div class="relative z-0 w-full mb-5 group">
                <input type="text" name="eventTitle" value={formData.eventTitle} onChange={changeHandler} id="floating_title" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-gray-400 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                <label for="floating_title" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Events title</label>
            </div>
            <div class="relative z-0 w-full mb-5 group">
                <input type="text" name="eventDescription" value={formData.eventDescription} onChange={changeHandler} id="floating_title" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-gray-400 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                <label for="floating_title" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Events Description</label>
            </div>
            <div class="relative z-0 w-full mb-5 group">
                <input type="datetime-local" name="eventDate" value={formData.eventDate} onChange={changeHandler} id="floating_title" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-gray-400 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                <label for="floating_title" class="peer-focus:font-medium absolute text-sm text-gray-900 dark:text-gray-900 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Events Date</label>
            </div>
              <button type="submit" class="text-white bg-blue-800 hover:bg-yellow-500 focus:ring-4 focus:outline-none font-medium rounded-full text-sm px-8 py-2.5 text-center me-2 mb-2">Confirm</button>
            </form>




          </div>
      </div>
      <ToastContainer/>
    </div>
  )
}

export default Events
