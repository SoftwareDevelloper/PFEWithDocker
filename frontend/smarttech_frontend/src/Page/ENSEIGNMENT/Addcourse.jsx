import React, { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import './css/style.css'
const Addcourse = () => {
        const [formData,SetFormData] = useState({
          titleEn:"",
          titleFr:"",
          titleAr:"",
          descriptionEn:"",
          descriptionFr:"",
          descriptionAr:"",
          video:"",
          image:"",
          price:"",
          category:"",
          classe:"",
          level:"",
          publisheddate:"",
          pdfCours:"",
          pdfTD:"",
        }
      )
  
  const changeHandler = (e) =>{
    SetFormData({...formData, [e.target.name]:e.target.value});
  } 
  const AddCourse = async () =>{
    const {title,description,video,image,price,category,publisheddate,classe} = formData;
  if (!title || !description || !video || !image || !price || !category || !publisheddate || !classe) {
    toast.error("Please fill all required fields.");
    return;
  }
    console.log('Add course function executed : ' , formData)
    try{
    const response = await fetch('http://localhost:9000/api/AddFormations' ,{
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
        toast.success("added successfully")
      } else {
        toast.error(responseData.errors || 'Add course failed');
      }
    }catch(error) {
      console.error('Error during Add course ', error);
      toast.error('Something went wrong . please try again');
    }
  }
  return (
    <div class="p-4 sm:ml-64">
    <div class="p-4 bg-white">
      <div class="grid grid-cols-3 gap-3 mb-5 bg-white">
    <div className='add_course'>
    <form className='add_forms' onSubmit={(e) => {e.preventDefault();AddCourse() }}>
        <h1>ADD COURSE</h1>
        <hr />
       <div className="label_input_add_titre">
        <div className="label_input_add">
        <label htmlFor="title">titleEn</label>
        <input type="text" name="titleEn" id="title" value={formData.titleEn} onChange={changeHandler} />
        </div>
        <div className="label_input add">
        <label htmlFor="title">titleFr</label>
        <input type="text" name="titleFr" id="title" value={formData.titleFr} onChange={changeHandler} />
        </div>
        <div className="label_input_add">
        <label htmlFor="title">titleAr</label>
        <input type="text" name="titleAr" id="title" value={formData.titleAr} onChange={changeHandler} />
        </div>
       </div>
       <div className="label_input_add_description">
        <div className="label_input_add">
        <label htmlFor="description">descriptionEn</label>
        <input type="text" name="descriptionEn" id="description" value={formData.descriptionEn} onChange={changeHandler}/>
        </div>
        <div className="label_input_add">
        <label htmlFor="description">descriptionFr</label>
        <input type="text" name="descriptionFr" id="description" value={formData.descriptionFr} onChange={changeHandler}/>
        </div>
        <div className="label_input_add">
        <label htmlFor="description">descriptionAr</label>
        <input type="text" name="descriptionAr" id="description" value={formData.descriptionAr} onChange={changeHandler}/>
        </div>
        </div>
        <div className="label_input_add_price">
          <div className="label_input_add">
          <label htmlFor="price" >price</label>
          <input type="number" name="price" id="price" value={formData.price} onChange={changeHandler}/>
          </div>
          <div className="label_input_add">
          <label htmlFor="category" >category</label>
          <input type="text" name="category" id="category" value={formData.category} onChange={changeHandler}/>
          </div>
          <div className="label_input_add">
          <label htmlFor="class" >class</label>
          <input type="text" name="classe" id="class" value={formData.classe} onChange={changeHandler}/>
          </div>

        </div>
        <div className="label_input_add_others">
        <div className="label_input_add">
        <label htmlFor="video">video</label>
        <input type="url" name="video" id="video" value={formData.video} onChange={changeHandler}/>
        </div>
        <div className="label_input_add">
        <label htmlFor="image" >image</label>
        <input type="url" name="image" id="image" value={formData.image} onChange={changeHandler}/>
        </div>
        <div className="label_input_add">
          <label htmlFor="Level" >Level</label>
          <input type="text" name="level"  value={formData.level} onChange={changeHandler}/>
        </div>

        </div>
        <div className="label_input_add_others">
        <div className="label_input_add">
        <label htmlFor="pdfCours">COURS PDF</label>
        <input type="url" name="pdfCours" id="pdfCours" value={formData.pdfCours} onChange={changeHandler}/>
        </div>
        <div className="label_input_add">
        <label htmlFor="pdfTD">TD pdf</label>
        <input type="url" name="pdfTD" id="pdfTD" value={formData.pdfTD} onChange={changeHandler}/>
        </div>
        <div className="label_input_add">
        <label htmlFor="publisheddate" >Release Date</label>
        <input type="datetime-local" name="publisheddate" id="publisheddate" value={formData.publisheddate} onChange={changeHandler} />
        </div>
        </div>
       <div className="btn-send">
        <button className="btn_send" type='submit'>Confirm</button>
       </div>
      </form>
    </div>
    </div>
    </div>
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable theme="light" />

    </div>
  )
}

export default Addcourse
