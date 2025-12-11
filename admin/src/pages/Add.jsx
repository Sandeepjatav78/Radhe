import React, { useState } from 'react'
import { assets } from '../assets/assets' // Check your path
import axios from 'axios'
import { backendURL } from '../App' // Check your path
import { toast } from 'react-toastify'

const Add = ({ token }) => {

  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Tablet");
  const [subCategory, setSubCategory] = useState("Pain Relief");
  const [bestsellar, setBestsellar] = useState(false);
  
  // --- NEW PHARMACY STATES ---
  const [saltComposition, setSaltComposition] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [packSize, setPackSize] = useState("");
  const [stock, setStock] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [prescriptionRequired, setPrescriptionRequired] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData()

      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("category", category)
      formData.append("subCategory", subCategory)
      formData.append("bestsellar", bestsellar)
      
      // New Fields Append
      formData.append("saltComposition", saltComposition)
      formData.append("manufacturer", manufacturer)
      formData.append("packSize", packSize)
      formData.append("stock", stock)
      formData.append("expiryDate", new Date(expiryDate).getTime()) // Convert date to timestamp
      formData.append("prescriptionRequired", prescriptionRequired)

      image1 && formData.append("image1", image1)
      image2 && formData.append("image2", image2)
      image3 && formData.append("image3", image3)
      image4 && formData.append("image4", image4)

      const response = await axios.post(backendURL + "/api/product/add", formData, { headers: { token } })

      if (response.data.success) {
        toast.success(response.data.message)
        // Reset Form
        setName("")
        setDescription("")
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setPrice("")
        setSaltComposition("")
        setManufacturer("")
        setPackSize("")
        setStock("")
        setExpiryDate("")
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
      
      {/* Image Upload Section */}
      <div>
        <p className='mb-2'>Upload Image</p>
        <div className='flex gap-2'>
          <label htmlFor="image1">
            <img className='w-20' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
            <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1" hidden />
          </label>
          <label htmlFor="image2">
            <img className='w-20' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="" />
            <input onChange={(e) => setImage2(e.target.files[0])} type="file" id="image2" hidden />
          </label>
          <label htmlFor="image3">
            <img className='w-20' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="" />
            <input onChange={(e) => setImage3(e.target.files[0])} type="file" id="image3" hidden />
          </label>
          <label htmlFor="image4">
            <img className='w-20' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="" />
            <input onChange={(e) => setImage4(e.target.files[0])} type="file" id="image4" hidden />
          </label>
        </div>
      </div>

      {/* Basic Details */}
      <div className='w-full'>
        <p className='mb-2'>Medicine Name</p>
        <input onChange={(e) => setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Type here (e.g. Dolo 650)' required />
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product Description</p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Uses, Side effects, etc.' required />
      </div>

      {/* --- PHARMACY SPECIFIC FIELDS --- */}
      
      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div>
          <p className='mb-2'>Salt Composition</p>
          <input onChange={(e) => setSaltComposition(e.target.value)} value={saltComposition} className='w-full px-3 py-2' type="text" placeholder='e.g. Paracetamol' required />
        </div>

        <div>
          <p className='mb-2'>Manufacturer</p>
          <input onChange={(e) => setManufacturer(e.target.value)} value={manufacturer} className='w-full px-3 py-2' type="text" placeholder='e.g. Cipla' required />
        </div>
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
         <div>
            <p className='mb-2'>Category</p>
            <select onChange={(e) => setCategory(e.target.value)} className='w-full px-3 py-2'>
              <option value="Tablet">Tablet</option>
              <option value="Syrup">Syrup</option>
              <option value="Injection">Injection</option>
              <option value="Cream">Cream</option>
              <option value="Drops">Drops</option>
            </select>
        </div>

        <div>
            <p className='mb-2'>Type</p>
            <select onChange={(e) => setSubCategory(e.target.value)} className='w-full px-3 py-2'>
              <option value="Pain Relief">Pain Relief</option>
              <option value="Gastric">Gastric</option>
              <option value="Cold & Cough">Cold & Cough</option>
              <option value="Vitamins">Vitamins</option>
              <option value="Antibiotic">Antibiotic</option>
            </select>
        </div>

        <div>
          <p className='mb-2'>Price</p>
          <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-[120px]' type="number" placeholder='25' />
        </div>
      </div>

      {/* Extra Details Row */}
      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
          <div>
            <p className='mb-2'>Pack Size</p>
            <input onChange={(e) => setPackSize(e.target.value)} value={packSize} className='w-full px-3 py-2' type="text" placeholder='10 Tablets/Strip' required />
          </div>

           <div>
            <p className='mb-2'>Stock Quantity</p>
            <input onChange={(e) => setStock(e.target.value)} value={stock} className='w-full px-3 py-2' type="number" placeholder='100' required />
          </div>

          <div>
            <p className='mb-2'>Expiry Date</p>
            <input onChange={(e) => setExpiryDate(e.target.value)} value={expiryDate} className='w-full px-3 py-2' type="date" required />
          </div>
      </div>

      {/* Checkboxes */}
      <div className='flex gap-2 mt-2'>
        <div className='flex gap-2 cursor-pointer'>
          <input onChange={() => setBestsellar(prev => !prev)} checked={bestsellar} type="checkbox" id="bestseller" />
          <label className='cursor-pointer' htmlFor="bestseller">Add to Bestseller</label>
        </div>
        
        <div className='flex gap-2 cursor-pointer ml-4'>
          <input onChange={() => setPrescriptionRequired(prev => !prev)} checked={prescriptionRequired} type="checkbox" id="presc" />
          <label className='cursor-pointer text-red-500 font-medium' htmlFor="presc">Prescription Required?</label>
        </div>
      </div>

      <button type='submit' className='w-28 py-3 mt-4 bg-black text-white' onClick={console.log("yy")}>ADD</button>

    </form>
  )
}

export default Add