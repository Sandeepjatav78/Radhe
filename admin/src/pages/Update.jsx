import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { backendURL } from '../App'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'

const Update = ({ token }) => {

  const navigate = useNavigate();
  const { productId } = useParams(); // URL se ID nikalenge

  const [image1, setImage1] = useState(false) // Image preview ke liye (View Only)
  
  // States
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [bestsellar, setBestsellar] = useState(false);
  const [saltComposition, setSaltComposition] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [packSize, setPackSize] = useState("");
  const [stock, setStock] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [prescriptionRequired, setPrescriptionRequired] = useState(false);

  // Category Logic
  const categoryData = {
      "Tablet": ["Pain Relief", "Gastric", "Antibiotic", "Vitamins", "Cold & Cough", "Heart"],
      "Syrup": ["Cough Syrup", "Digestion", "Multivitamin", "Antacid"],
      "Injection": ["Pain Killer", "Antibiotic", "Diabetes", "Vaccine"],
      "Cream": ["Antifungal", "Antibiotic", "Pain Relief", "Moisturizer", "Skin Care"],
      "Drops": ["Eye Drops", "Ear Drops", "Pediatric Drops"],
      "Sexual Wellness": ["Condoms", "Lubricants", "Performance Supplements", "Test Kits", "Hygiene"],
      "Devices": ["BP Monitor", "Glucometer", "Thermometer", "Oximeter"]
  };

  const [category, setCategory] = useState("Tablet");
  const [subCategory, setSubCategory] = useState("");

  // --- 1. FETCH OLD DATA ---
  const fetchProductData = async () => {
      try {
          const response = await axios.post(backendURL + '/api/product/single', { productId });
          if(response.data.success) {
              const data = response.data.product;
              
              setName(data.name);
              setDescription(data.description);
              setPrice(data.price);
              setMrp(data.mrp);
              setCategory(data.category);
              setSubCategory(data.subCategory);
              setBestsellar(data.bestsellar);
              
              setSaltComposition(data.saltComposition);
              setManufacturer(data.manufacturer);
              setPackSize(data.packSize);
              setStock(data.stock);
              setPrescriptionRequired(data.prescriptionRequired);
              
              // Date handling
              if(data.expiryDate) {
                  const date = new Date(data.expiryDate);
                  setExpiryDate(date.toISOString().split('T')[0]);
              }

              // Image Preview (Sirf dikhane ke liye)
              if(data.image && data.image.length > 0) setImage1(data.image[0]);
          }
      } catch (error) {
          console.log(error);
          toast.error("Could not fetch product data");
      }
  }

  useEffect(() => {
      if(token && productId) {
          fetchProductData();
      }
  }, [token, productId]);

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    setSubCategory(categoryData[selectedCategory][0]);
};

  // --- 2. UPDATE FUNCTION ---
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      // JSON data bhej rahe hain kyunki image update nahi kar rahe (Images complex hoti hain edit me)
      const updatedData = {
          id: productId,
          name, description, price, mrp, category, subCategory, bestsellar,
          saltComposition, manufacturer, packSize, stock, 
          expiryDate: new Date(expiryDate).getTime(),
          prescriptionRequired
      }

      const response = await axios.post(backendURL + "/api/product/update", updatedData, { headers: { token } })

      if (response.data.success) {
        toast.success("Product Updated Successfully");
        navigate('/list'); // Wapas list pe bhej do
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3 p-4 bg-white shadow rounded-lg'>
      <h2 className='text-2xl font-bold mb-4'>Update Medicine Details</h2>
      
      {/* Current Image View */}
      <div className='mb-4'>
        <p className='mb-2 text-gray-500'>Current Image (Cannot be changed here)</p>
        {image1 && <img src={image1} className='w-24 h-24 object-contain border' alt="Product" />}
      </div>

      <div className='w-full'>
        <p className='mb-2'>Medicine Name</p>
        <input onChange={(e) => setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded' type="text" required />
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product Description</p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded' type="text" required />
      </div>

      {/* Categories */}
      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
         <div className='w-full'>
            <p className='mb-2'>Category</p>
            <select onChange={handleCategoryChange} value={category} className='w-full px-3 py-2 border border-gray-300 rounded'>
              {Object.keys(categoryData).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
        </div>
        <div className='w-full'>
            <p className='mb-2'>Type</p>
            <select onChange={(e) => setSubCategory(e.target.value)} value={subCategory} className='w-full px-3 py-2 border border-gray-300 rounded'>
               {categoryData[category] && categoryData[category].map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
        </div>
      </div>

      {/* Pharmacy Fields */}
      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div className='w-full'><p className='mb-2'>Salt</p><input onChange={(e) => setSaltComposition(e.target.value)} value={saltComposition} className='w-full px-3 py-2 border border-gray-300 rounded' type="text" /></div>
        <div className='w-full'><p className='mb-2'>Manufacturer</p><input onChange={(e) => setManufacturer(e.target.value)} value={manufacturer} className='w-full px-3 py-2 border border-gray-300 rounded' type="text" /></div>
      </div>

      {/* Prices */}
      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div className='w-full'><p className='mb-2'>MRP</p><input onChange={(e) => setMrp(e.target.value)} value={mrp} className='w-full px-3 py-2 border border-red-300 rounded' type="number" /></div>
        <div className='w-full'><p className='mb-2'>Selling Price</p><input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full px-3 py-2 border border-green-300 rounded' type="number" /></div>
      </div>

      {/* Inventory */}
      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
          <div className='w-full'><p className='mb-2'>Pack Size</p><input onChange={(e) => setPackSize(e.target.value)} value={packSize} className='w-full px-3 py-2 border border-gray-300 rounded' type="text" /></div>
           <div className='w-full'><p className='mb-2'>Stock</p><input onChange={(e) => setStock(e.target.value)} value={stock} className='w-full px-3 py-2 border border-gray-300 rounded' type="number" /></div>
          <div className='w-full'><p className='mb-2'>Expiry</p><input onChange={(e) => setExpiryDate(e.target.value)} value={expiryDate} className='w-full px-3 py-2 border border-gray-300 rounded' type="date" /></div>
      </div>

      {/* Checkboxes */}
      <div className='flex gap-4 mt-2'>
        <div className='flex gap-2 cursor-pointer'><input onChange={() => setBestsellar(!bestsellar)} checked={bestsellar} type="checkbox" /><label>Bestseller</label></div>
        <div className='flex gap-2 cursor-pointer'><input onChange={() => setPrescriptionRequired(!prescriptionRequired)} checked={prescriptionRequired} type="checkbox" /><label className='text-red-500'>Rx Required?</label></div>
      </div>

      <button type='submit' className='w-32 py-3 mt-4 bg-emerald-600 text-white font-bold rounded'>UPDATE</button>
    </form>
  )
}

export default Update