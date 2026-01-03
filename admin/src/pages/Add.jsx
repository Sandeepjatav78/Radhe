import React, { useState, useEffect } from 'react'
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
  const [saltComposition, setSaltComposition] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [prescriptionRequired, setPrescriptionRequired] = useState(false);

  // --- 1. DEFAULT HARDCODED DATA (Jo pehle tha) ---
  const defaultCategoryData = {
      "Tablet": ["Pain Relief", "Gastric", "Antibiotic", "Vitamins", "Cold & Cough", "Heart", "Other"],
      "Syrup": ["Cough Syrup", "Digestion", "Multivitamin", "Antacid", "Other"],
      "Injection": ["Pain Killer", "Antibiotic", "Diabetes", "Vaccine", "Other"],
      "Cream": ["Antifungal", "Antibiotic", "Pain Relief", "Moisturizer", "Skin Care", "Other"],
      "Drops": ["Eye Drops", "Ear Drops", "Pediatric Drops", "Other"],
      "Sexual Wellness": ["Condoms", "Lubricants", "Performance Supplements", "Test Kits", "Hygiene", "Other"],
      "Devices": ["BP Monitor", "Glucometer", "Thermometer", "Oximeter", "Other"],
      "Health & Nutrition": ["Daily Supplements", "Protein Supplements", "Weight Management", "Energy Drinks", "Multivitamins", "Other"]
  };

  // --- 2. DYNAMIC STATES ---
  const [dbCategories, setDbCategories] = useState([]); // Fetched from DB
  const [mergedCategories, setMergedCategories] = useState([]); // Hardcoded + DB Merged

  // Selection States
  const [category, setCategory] = useState("Tablet");
  const [subCategory, setSubCategory] = useState(defaultCategoryData["Tablet"][0]);
  
  // Inputs for Creating New
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [newSubCategoryInput, setNewSubCategoryInput] = useState("");

  // Mode Toggles
  const [isNewCategoryMode, setIsNewCategoryMode] = useState(false);
  const [isNewSubCategoryMode, setIsNewSubCategoryMode] = useState(false);

  // Variants
  const [variants, setVariants] = useState([]); 
  const [variantInput, setVariantInput] = useState({ size: "", price: "", mrp: "", stock: "", batchNumber: "" });

  // --- 3. FETCH & MERGE LOGIC ---
  const fetchCategories = async () => {
      try {
          const response = await axios.get(backendURL + "/api/product/categories");
          if (response.data.success) {
              const fetchedCats = response.data.categories;
              setDbCategories(fetchedCats);

              // MERGE: Hardcoded keys + DB Category Names
              const hardcodedKeys = Object.keys(defaultCategoryData);
              const dbKeys = fetchedCats.map(c => c.name);
              
              // Unique Set banaya taaki duplicate na ho (agar 'Tablet' DB me bhi hai to ek hi baar dikhe)
              const uniqueKeys = Array.from(new Set([...hardcodedKeys, ...dbKeys]));
              setMergedCategories(uniqueKeys);
          }
      } catch (error) {
          toast.error("Failed to load categories");
      }
  };

  useEffect(() => {
      fetchCategories();
  }, []);

  // --- 4. HELPER: GET SUB-CATEGORIES ---
  // Ye function check karega ki category Hardcoded me hai ya DB me
  const getSubCategoriesFor = (catName) => {
      // 1. Check Hardcoded
      if (defaultCategoryData[catName]) {
          return defaultCategoryData[catName];
      }
      // 2. Check DB
      const dbCat = dbCategories.find(c => c.name === catName);
      if (dbCat) {
          return dbCat.subCategories;
      }
      return [];
  };

  // --- 5. HANDLERS ---
  const handleCategoryChange = (e) => {
      const val = e.target.value;
      if (val === "new_cat_option") {
          setIsNewCategoryMode(true);
          setIsNewSubCategoryMode(true);
          setCategory(""); 
          setSubCategory("");
      } else {
          setIsNewCategoryMode(false);
          setCategory(val);
          
          // Get Subcats (Hybrid Logic)
          const subs = getSubCategoriesFor(val);
          
          if (subs.length > 0) {
              setIsNewSubCategoryMode(false);
              setSubCategory(subs[0]);
          } else {
              // Agar subcategory list khali hai (New DB Entry without subs), to input dikhao
              setIsNewSubCategoryMode(true);
              setSubCategory("");
          }
      }
  };

  const handleSubCategoryChange = (e) => {
      const val = e.target.value;
      if (val === "new_sub_option" || val === "Other") {
          setIsNewSubCategoryMode(true);
          setSubCategory(""); // Clear value so user types it
      } else {
          setIsNewSubCategoryMode(false);
          setSubCategory(val);
      }
  };

  const addVariant = () => {
      if(!variantInput.size || !variantInput.price || !variantInput.mrp || !variantInput.stock) {
          toast.error("Fill all variant details"); return;
      }
      setVariants([...variants, variantInput]);
      setVariantInput({ size: "", price: "", mrp: "", stock: "", batchNumber: "" });
  };

  const removeVariant = (i) => setVariants(variants.filter((_, idx) => idx !== i));

  // --- 6. SUBMIT ---
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    // Final Values Logic
    const finalCategory = isNewCategoryMode ? newCategoryInput : category;
    const finalSubCategory = isNewSubCategoryMode ? newSubCategoryInput : subCategory;

    if (!finalCategory || !finalSubCategory) {
        toast.error("Category & Sub-Category are required!");
        return;
    }
    if (variants.length === 0) {
        toast.error("Add at least one variant");
        return;
    }

    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("description", description)
      formData.append("category", finalCategory)
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
        toast.success(response.data.message);
        // Reset
        setName(""); setDescription(""); setSaltComposition(""); setManufacturer("");
        setImage1(false); setImage2(false); setImage3(false); setImage4(false);
        setVariants([]);
        setNewCategoryInput(""); setNewSubCategoryInput("");
        
        // Reset Modes
        setIsNewCategoryMode(false); setIsNewSubCategoryMode(false);
        setCategory("Tablet"); 
        setSubCategory(defaultCategoryData["Tablet"][0]);

        // Refresh List (Jo nayi category add hui wo agli baar list me dikhegi)
        await fetchCategories(); 

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
      
      {/* Image Upload */}
      <div>
        <p className='mb-2'>Upload Image</p>
        <div className='flex gap-2'>
          <label htmlFor="image1"><img className='w-20' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" /><input onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1" hidden /></label>
          <label htmlFor="image2"><img className='w-20' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="" /><input onChange={(e) => setImage2(e.target.files[0])} type="file" id="image2" hidden /></label>
          <label htmlFor="image3"><img className='w-20' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="" /><input onChange={(e) => setImage3(e.target.files[0])} type="file" id="image3" hidden /></label>
          <label htmlFor="image4"><img className='w-20' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="" /><input onChange={(e) => setImage4(e.target.files[0])} type="file" id="image4" hidden /></label>
        </div>
      </div>

      <div className='w-full'><p className='mb-2'>Medicine Name</p><input onChange={(e) => setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded' type="text" placeholder='Name' required /></div>
      <div className='w-full'><p className='mb-2'>Description</p><textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded' type="text" placeholder='Details' required /></div>

      <div className='flex gap-2 w-full'><div className='w-full'><p>Salt</p><input onChange={(e)=>setSaltComposition(e.target.value)} value={saltComposition} className='w-full border p-2 rounded' /></div><div className='w-full'><p>Manufacturer</p><input onChange={(e)=>setManufacturer(e.target.value)} value={manufacturer} className='w-full border p-2 rounded' required /></div></div>

      {/* --- HYBRID CATEGORY SECTION --- */}
      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
         
         <div className='w-full'>
            <p className='mb-2'>Category</p>
            {isNewCategoryMode ? (
                <div className='flex gap-2'>
                    <input type="text" value={newCategoryInput} onChange={(e)=>setNewCategoryInput(e.target.value)} placeholder="Type New Category" className='w-full border border-emerald-500 bg-emerald-50 p-2 rounded' autoFocus />
                    <button type="button" onClick={() => setIsNewCategoryMode(false)} className='text-red-500 text-xs underline'>Cancel</button>
                </div>
            ) : (
                <select onChange={handleCategoryChange} value={category} className='w-full border p-2 rounded bg-white'>
                    {/* Merged List of Default + DB Categories */}
                    {mergedCategories.map((cat, i) => (
                        <option key={i} value={cat}>{cat}</option>
                    ))}
                    <option value="new_cat_option" className='text-emerald-600 font-bold'>+ Create New</option>
                </select>
            )}
        </div>

        <div className='w-full'>
            <p className='mb-2'>Sub Category</p>
            {isNewSubCategoryMode ? (
                <div className='flex gap-2'>
                    <input type="text" value={newSubCategoryInput} onChange={(e)=>setNewSubCategoryInput(e.target.value)} placeholder="Type New Sub Category" className='w-full border border-emerald-500 bg-emerald-50 p-2 rounded' />
                    {!isNewCategoryMode && <button type="button" onClick={() => setIsNewSubCategoryMode(false)} className='text-red-500 text-xs underline'>Cancel</button>}
                </div>
            ) : (
                <select onChange={handleSubCategoryChange} value={subCategory} className='w-full border p-2 rounded bg-white'>
                   {getSubCategoriesFor(category).map((sub, i) => (
                      <option key={i} value={sub}>{sub}</option>
                   ))}
                   <option value="new_sub_option" className='text-emerald-600 font-bold'>+ Create New / Other</option>
                </select>
            )}
        </div>
      </div>

      {/* --- VARIANTS --- */}
      <div className='w-full mt-4 p-4 bg-gray-50 border rounded'>
          <p className='font-bold mb-3'>Variants</p>
          <div className='grid grid-cols-5 gap-2 mb-2'>
              <input placeholder="Size" value={variantInput.size} onChange={(e)=>setVariantInput({...variantInput, size:e.target.value})} className='border p-1' />
              <input type="number" placeholder="MRP" value={variantInput.mrp} onChange={(e)=>setVariantInput({...variantInput, mrp:e.target.value})} className='border p-1' />
              <input type="number" placeholder="Price" value={variantInput.price} onChange={(e)=>setVariantInput({...variantInput, price:e.target.value})} className='border p-1' />
              <input type="number" placeholder="Stock" value={variantInput.stock} onChange={(e)=>setVariantInput({...variantInput, stock:e.target.value})} className='border p-1' />
              <button type="button" onClick={addVariant} className='bg-black text-white rounded'>Add</button>
          </div>
          {variants.map((v, i) => (
              <div key={i} className='grid grid-cols-5 gap-2 text-sm border-b p-1'>
                  <span>{v.size}</span><span>{v.mrp}</span><span>{v.price}</span><span>{v.stock}</span><span onClick={()=>removeVariant(i)} className='text-red-500 cursor-pointer'>Remove</span>
              </div>
          ))}
      </div>

      <div className='flex gap-4 mt-2'>
        <div className='flex gap-2'><input onChange={() => setBestsellar(!bestsellar)} checked={bestsellar} type="checkbox" /><label>Bestseller</label></div>
        <div className='flex gap-2'><input onChange={() => setPrescriptionRequired(!prescriptionRequired)} checked={prescriptionRequired} type="checkbox" /><label>Rx Required</label></div>
      </div>

      <button type='submit' className='w-32 py-3 mt-4 bg-black text-white font-medium rounded'>ADD PRODUCT</button>
    </form>
  )
}

export default Add