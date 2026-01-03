import React, { useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendURL } from '../App'
import { toast } from 'react-toastify'

const Add = ({ token }) => {

  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [bestsellar, setBestsellar] = useState(false);
  
  // Pharmacy Details
  const [saltComposition, setSaltComposition] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [prescriptionRequired, setPrescriptionRequired] = useState(false);

  // --- NEW: VARIANTS STATE ---
  const [variants, setVariants] = useState([]); // List of added variants
  
  // Temporary state for the input fields
  const [variantInput, setVariantInput] = useState({
      size: "",      // e.g. "50ml", "10 Tabs"
      price: "",
      mrp: "",
      stock: "",
      batchNumber: ""
  });

  // Function to add variant to the list
  const addVariant = () => {
      if(!variantInput.size || !variantInput.price || !variantInput.mrp || !variantInput.stock) {
          toast.error("Please fill all variant details");
          return;
      }
      setVariants([...variants, variantInput]);
      // Reset inputs
      setVariantInput({ size: "", price: "", mrp: "", stock: "", batchNumber: "" });
  };

  // Function to remove variant
  const removeVariant = (index) => {
      const newVariants = variants.filter((_, i) => i !== index);
      setVariants(newVariants);
  };

  // ✅ UPDATED CATEGORY DATA
  const categoryData = {
      "Tablet": ["Pain Relief", "Gastric", "Antibiotic", "Vitamins", "Cold & Cough", "Heart", "Other"],
      "Syrup": ["Cough Syrup", "Digestion", "Multivitamin", "Antacid", "Other"],
      "Injection": ["Pain Killer", "Antibiotic", "Diabetes", "Vaccine", "Other"],
      "Cream": ["Antifungal", "Antibiotic", "Pain Relief", "Moisturizer", "Skin Care", "Other"],
      "Drops": ["Eye Drops", "Ear Drops", "Pediatric Drops", "Other"],
      "Sexual Wellness": ["Condoms", "Lubricants", "Performance Supplements", "Test Kits", "Hygiene", "Other"],
      "Devices": ["BP Monitor", "Glucometer", "Thermometer", "Oximeter", "Other"],
      "Health & Nutrition": ["Daily Supplements", "Protein Supplements", "Weight Management", "Energy Drinks", "Multivitamins", "Other"], // ✅ New Category
      "Other": [] // Remains empty for fully custom input
  };

  const [category, setCategory] = useState("Tablet");
  const [subCategory, setSubCategory] = useState(categoryData["Tablet"][0]);
  const [customSubCategory, setCustomSubCategory] = useState(""); 

  const handleCategoryChange = (e) => {
      const selectedCategory = e.target.value;
      setCategory(selectedCategory);
      
      // If "Other" (Main Category) is selected, clear subcategory
      if (selectedCategory === "Other") {
          setSubCategory("Other");
          setCustomSubCategory("");
      } else {
          // Default to the first item in the list
          setSubCategory(categoryData[selectedCategory][0]);
      }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    if (variants.length === 0) {
        toast.error("Please add at least one product variant (Size/Price)");
        return;
    }

    try {
      const formData = new FormData()

      formData.append("name", name)
      formData.append("description", description)
      formData.append("category", category)
      
      // If user selected "Other" as main category, send the custom typed input
      // If user selected a normal category but chose "Other" as sub-category, it sends the string "Other"
      const finalSubCategory = category === "Other" ? customSubCategory : subCategory;
      formData.append("subCategory", finalSubCategory)
      
      formData.append("bestsellar", bestsellar)
      formData.append("saltComposition", saltComposition)
      formData.append("manufacturer", manufacturer)
      formData.append("prescriptionRequired", prescriptionRequired)

      formData.append("variants", JSON.stringify(variants));

      image1 && formData.append("image1", image1)
      image2 && formData.append("image2", image2)
      image3 && formData.append("image3", image3)
      image4 && formData.append("image4", image4)

      const response = await axios.post(backendURL + "/api/product/add", formData, { headers: { token } })

      if (response.data.success) {
        toast.success(response.data.message)
        setName("")
        setDescription("")
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setSaltComposition("")
        setManufacturer("")
        setVariants([]) 
        setCategory("Tablet")
        setSubCategory(categoryData["Tablet"][0])
        setCustomSubCategory("")
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3 pb-10'>
      
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

      <div className='w-full'>
        <p className='mb-2'>Medicine Name</p>
        <input onChange={(e) => setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded' type="text" placeholder='e.g. Dolo 650 or Detol Soap' required />
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product Description</p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded' type="text" placeholder='Uses, Side effects, etc.' required />
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div className='w-full'>
          <p className='mb-2'>Salt Composition</p>
          <input onChange={(e) => setSaltComposition(e.target.value)} value={saltComposition} className='w-full px-3 py-2 border border-gray-300 rounded' type="text" placeholder='e.g. Paracetamol' />
        </div>
        <div className='w-full'>
          <p className='mb-2'>Manufacturer</p>
          <input onChange={(e) => setManufacturer(e.target.value)} value={manufacturer} className='w-full px-3 py-2 border border-gray-300 rounded' type="text" placeholder='e.g. Cipla' required />
        </div>
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
         <div className='w-full'>
            <p className='mb-2'>Category</p>
            <select onChange={handleCategoryChange} value={category} className='w-full px-3 py-2 border border-gray-300 rounded bg-white'>
              {Object.keys(categoryData).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
        </div>
        <div className='w-full'>
            <p className='mb-2'>Sub Category</p>
            {category === "Other" ? (
                <input type="text" value={customSubCategory} onChange={(e) => setCustomSubCategory(e.target.value)} placeholder="Type custom category..." className='w-full px-3 py-2 border border-emerald-500 rounded bg-emerald-50 outline-none' required />
            ) : (
                <select onChange={(e) => setSubCategory(e.target.value)} value={subCategory} className='w-full px-3 py-2 border border-gray-300 rounded bg-white'>
                   {categoryData[category].map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                   ))}
                </select>
            )}
        </div>
      </div>

      {/* --- VARIANT SECTION STARTS --- */}
      <div className='w-full mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg'>
          <p className='font-bold text-gray-700 mb-3'>Product Variants (Size & Prices)</p>
          
          <div className='grid grid-cols-2 md:grid-cols-5 gap-3 mb-3'>
              <div>
                  <p className='text-xs mb-1'>Size/Pack (e.g. 50ml, 10 Tabs)</p>
                  <input type="text" value={variantInput.size} onChange={(e) => setVariantInput({...variantInput, size: e.target.value})} className='w-full px-2 py-1 border rounded' placeholder="Size" />
              </div>
              <div>
                  <p className='text-xs mb-1'>MRP (₹)</p>
                  <input type="number" value={variantInput.mrp} onChange={(e) => setVariantInput({...variantInput, mrp: e.target.value})} className='w-full px-2 py-1 border rounded text-red-500' placeholder="100" />
              </div>
              <div>
                  <p className='text-xs mb-1'>Selling Price (₹)</p>
                  <input type="number" value={variantInput.price} onChange={(e) => setVariantInput({...variantInput, price: e.target.value})} className='w-full px-2 py-1 border rounded text-green-600' placeholder="80" />
              </div>
              <div>
                  <p className='text-xs mb-1'>Stock</p>
                  <input type="number" value={variantInput.stock} onChange={(e) => setVariantInput({...variantInput, stock: e.target.value})} className='w-full px-2 py-1 border rounded' placeholder="Qty" />
              </div>
              <div className='flex items-end'>
                  <button type="button" onClick={addVariant} className='w-full bg-emerald-600 text-white py-1.5 rounded hover:bg-emerald-700'>+ ADD</button>
              </div>
          </div>

          {/* Added Variants List */}
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
      {/* --- VARIANT SECTION ENDS --- */}

      <div className='flex gap-4 mt-2'>
        <div className='flex gap-2 items-center cursor-pointer'>
          <input onChange={() => setBestsellar(prev => !prev)} checked={bestsellar} type="checkbox" id="bestseller" className='w-4 h-4 cursor-pointer' />
          <label className='cursor-pointer select-none' htmlFor="bestseller">Add to Bestseller</label>
        </div>
        <div className='flex gap-2 items-center cursor-pointer'>
          <input onChange={() => setPrescriptionRequired(prev => !prev)} checked={prescriptionRequired} type="checkbox" id="presc" className='w-4 h-4 cursor-pointer' />
          <label className='cursor-pointer text-red-600 font-medium select-none' htmlFor="presc">Prescription Required?</label>
        </div>
      </div>

      <button type='submit' className='w-32 py-3 mt-4 bg-black text-white font-medium rounded hover:bg-gray-800 transition-colors'>ADD MEDICINE</button>

    </form>
  )
}

export default Add