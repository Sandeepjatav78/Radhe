import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { backendURL } from '../App'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'

const Update = ({ token }) => {

  const navigate = useNavigate();
  const { productId } = useParams();

  const [image1, setImage1] = useState(false) // View Only
  
  // Basic States
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [bestsellar, setBestsellar] = useState(false);
  const [saltComposition, setSaltComposition] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [prescriptionRequired, setPrescriptionRequired] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");

  // --- NEW: VARIANTS STATE ---
  const [variants, setVariants] = useState([]); 
  const [variantInput, setVariantInput] = useState({
      size: "", price: "", mrp: "", stock: "", batchNumber: ""
  });

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

  // --- HELPER: ADD VARIANT ---
  const addVariant = () => {
    if(!variantInput.size || !variantInput.price || !variantInput.mrp || !variantInput.stock) {
        toast.error("Please fill all variant details");
        return;
    }
    setVariants([...variants, variantInput]);
    setVariantInput({ size: "", price: "", mrp: "", stock: "", batchNumber: "" });
  };

  // --- HELPER: REMOVE VARIANT ---
  const removeVariant = (index) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };

  // --- 1. FETCH OLD DATA ---
  const fetchProductData = async () => {
      try {
          const response = await axios.post(backendURL + '/api/product/single', { productId });
          if(response.data.success) {
              const data = response.data.product;
              
              setName(data.name);
              setDescription(data.description);
              setCategory(data.category);
              setSubCategory(data.subCategory);
              setBestsellar(data.bestsellar);
              
              setSaltComposition(data.saltComposition);
              setManufacturer(data.manufacturer);
              setPrescriptionRequired(data.prescriptionRequired);
              
              // Handle Date
              if(data.expiryDate) {
                  // Check if it's a number (timestamp) or string
                  const date = new Date(Number(data.expiryDate) || data.expiryDate); 
                  if(!isNaN(date)) {
                    setExpiryDate(date.toISOString().split('T')[0]);
                  }
              }

              // --- LOAD VARIANTS ---
              if (data.variants && data.variants.length > 0) {
                  setVariants(data.variants);
              } else {
                  // FALLBACK: Agar purana product hai jisme variants nahi the
                  // To purane fields se ek variant bana do
                  if (data.price) {
                      setVariants([{
                          size: data.packSize || "Standard",
                          price: data.price,
                          mrp: data.mrp,
                          stock: data.stock,
                          batchNumber: data.batchNumber || ""
                      }]);
                  }
              }

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
    setSubCategory(categoryData[selectedCategory] ? categoryData[selectedCategory][0] : "");
  };

  // --- 2. UPDATE FUNCTION ---
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (variants.length === 0) {
        toast.error("Please add at least one product variant.");
        return;
    }

    try {
      const updatedData = {
          id: productId,
          name, description, category, subCategory, bestsellar,
          saltComposition, manufacturer, 
          expiryDate: new Date(expiryDate).getTime(),
          prescriptionRequired,
          variants // <--- Sending the Array
      }

      const response = await axios.post(backendURL + "/api/product/update", updatedData, { headers: { token } })

      if (response.data.success) {
        toast.success("Product Updated Successfully");
        navigate('/list');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3 p-4 bg-white shadow rounded-lg mb-20'>
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

      <div className='w-full max-w-[500px]'>
          <p className='mb-2'>Expiry Date</p>
          <input onChange={(e) => setExpiryDate(e.target.value)} value={expiryDate} className='w-full px-3 py-2 border border-gray-300 rounded' type="date" />
      </div>

      {/* --- UPDATED: VARIANTS SECTION --- */}
      <div className='w-full mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg'>
          <p className='font-bold text-gray-700 mb-3'>Manage Variants (Size, Price & Stock)</p>
          
          {/* Input Row */}
          <div className='grid grid-cols-2 md:grid-cols-5 gap-3 mb-3'>
              <div>
                  <p className='text-xs mb-1'>Size (e.g. 50ml)</p>
                  <input type="text" value={variantInput.size} onChange={(e) => setVariantInput({...variantInput, size: e.target.value})} className='w-full px-2 py-1 border rounded' placeholder="Size" />
              </div>
              <div>
                  <p className='text-xs mb-1'>MRP</p>
                  <input type="number" value={variantInput.mrp} onChange={(e) => setVariantInput({...variantInput, mrp: e.target.value})} className='w-full px-2 py-1 border rounded text-red-500' placeholder="0" />
              </div>
              <div>
                  <p className='text-xs mb-1'>Selling Price</p>
                  <input type="number" value={variantInput.price} onChange={(e) => setVariantInput({...variantInput, price: e.target.value})} className='w-full px-2 py-1 border rounded text-green-600' placeholder="0" />
              </div>
              <div>
                  <p className='text-xs mb-1'>Stock</p>
                  <input type="number" value={variantInput.stock} onChange={(e) => setVariantInput({...variantInput, stock: e.target.value})} className='w-full px-2 py-1 border rounded' placeholder="Qty" />
              </div>
              <div className='flex items-end'>
                  <button type="button" onClick={addVariant} className='w-full bg-emerald-600 text-white py-1.5 rounded hover:bg-emerald-700'>+ ADD</button>
              </div>
          </div>

          {/* List Row */}
          {variants.length > 0 && (
              <div className='bg-white border rounded mt-2'>
                  <div className='grid grid-cols-5 bg-gray-100 p-2 text-xs font-bold border-b'>
                      <span>Size</span>
                      <span>MRP</span>
                      <span>Price</span>
                      <span>Stock</span>
                      <span>Action</span>
                  </div>
                  {variants.map((item, index) => (
                      <div key={index} className='grid grid-cols-5 p-2 text-sm border-b last:border-0 items-center'>
                          <span>{item.size}</span>
                          <span className='text-red-500 line-through'>₹{item.mrp}</span>
                          <span className='text-green-600 font-bold'>₹{item.price}</span>
                          <span>{item.stock}</span>
                          <span onClick={() => removeVariant(index)} className='text-red-600 cursor-pointer hover:underline'>Remove</span>
                      </div>
                  ))}
              </div>
          )}
      </div>

      {/* Checkboxes */}
      <div className='flex gap-4 mt-4'>
        <div className='flex gap-2 cursor-pointer'><input onChange={() => setBestsellar(!bestsellar)} checked={bestsellar} type="checkbox" /><label>Bestseller</label></div>
        <div className='flex gap-2 cursor-pointer'><input onChange={() => setPrescriptionRequired(!prescriptionRequired)} checked={prescriptionRequired} type="checkbox" /><label className='text-red-500'>Rx Required?</label></div>
      </div>

      <button type='submit' className='w-40 py-3 mt-4 bg-black text-white font-bold rounded hover:bg-gray-800'>UPDATE PRODUCT</button>
    </form>
  )
}

export default Update