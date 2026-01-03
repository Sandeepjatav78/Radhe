import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets' // ✅ Need assets for upload icon
import axios from 'axios'
import { backendURL } from '../App'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'

const Update = ({ token }) => {

  const navigate = useNavigate();
  const { productId } = useParams();

  // --- IMAGES STATE (File Objects for Upload) ---
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  // --- PREVIEW URLS (To show existing images) ---
  const [prevImg1, setPrevImg1] = useState("");
  const [prevImg2, setPrevImg2] = useState("");
  const [prevImg3, setPrevImg3] = useState("");
  const [prevImg4, setPrevImg4] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [bestsellar, setBestsellar] = useState(false);
  const [saltComposition, setSaltComposition] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [prescriptionRequired, setPrescriptionRequired] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");

  // --- 1. HARDCODED DEFAULT CATEGORIES ---
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

  // --- HYBRID CATEGORY STATES ---
  const [dbCategories, setDbCategories] = useState([]);
  const [mergedCategories, setMergedCategories] = useState([]);
  
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [newSubCategoryInput, setNewSubCategoryInput] = useState("");
  
  const [isNewCategoryMode, setIsNewCategoryMode] = useState(false);
  const [isNewSubCategoryMode, setIsNewSubCategoryMode] = useState(false);

  // --- VARIANTS ---
  const [variants, setVariants] = useState([]); 
  const [variantInput, setVariantInput] = useState({ size: "", price: "", mrp: "", stock: "", batchNumber: "" });

  // --- HELPER: Get Subcategories (Hybrid) ---
  const getSubCategoriesFor = (catName) => {
      if (defaultCategoryData[catName]) return defaultCategoryData[catName];
      const dbCat = dbCategories.find(c => c.name === catName);
      return dbCat ? dbCat.subCategories : [];
  };

  // --- FETCH DATA ---
  useEffect(() => {
      if(token && productId) {
          fetchData();
      }
  }, [token, productId]);

  const fetchData = async () => {
      try {
          // 1. Fetch Categories first
          const catRes = await axios.get(backendURL + "/api/product/categories");
          let fetchedCats = [];
          if(catRes.data.success) {
              fetchedCats = catRes.data.categories;
              setDbCategories(fetchedCats);
              // Merge Logic
              const hardcodedKeys = Object.keys(defaultCategoryData);
              const dbKeys = fetchedCats.map(c => c.name);
              setMergedCategories(Array.from(new Set([...hardcodedKeys, ...dbKeys])));
          }

          // 2. Fetch Product Data
          const prodRes = await axios.post(backendURL + '/api/product/single', { productId });
          if(prodRes.data.success) {
              const data = prodRes.data.product;
              
              setName(data.name);
              setDescription(data.description);
              setBestsellar(data.bestsellar);
              setSaltComposition(data.saltComposition);
              setManufacturer(data.manufacturer);
              setPrescriptionRequired(data.prescriptionRequired);
              
              // Set Images for Preview
              if(data.image && data.image.length > 0) setPrevImg1(data.image[0]);
              if(data.image && data.image.length > 1) setPrevImg2(data.image[1]);
              if(data.image && data.image.length > 2) setPrevImg3(data.image[2]);
              if(data.image && data.image.length > 3) setPrevImg4(data.image[3]);

              // Handle Date
              if(data.expiryDate) {
                  const date = new Date(Number(data.expiryDate)); 
                  if(!isNaN(date)) setExpiryDate(date.toISOString().split('T')[0]);
              }

              // Handle Variants
              if (data.variants && data.variants.length > 0) {
                  setVariants(data.variants);
              } else if (data.price) {
                  setVariants([{ size: data.packSize || "Standard", price: data.price, mrp: data.mrp, stock: data.stock, batchNumber: "" }]);
              }

              // --- POPULATE CATEGORY LOGIC ---
              setCategory(data.category);
              setSubCategory(data.subCategory);

              // Check if the current category is "New" (not in merged list)
              // But since we just merged them, it should be there unless it's totally custom
              // Logic check:
              const isKnownCat = Object.keys(defaultCategoryData).includes(data.category) || fetchedCats.some(c => c.name === data.category);
              
              if (!isKnownCat && data.category) {
                  // It's a custom category not in our lists yet? Treat as New Input Mode
                  setIsNewCategoryMode(true);
                  setNewCategoryInput(data.category);
                  setIsNewSubCategoryMode(true);
                  setNewSubCategoryInput(data.subCategory);
              } else {
                  // Known Category. Check Subcategory.
                  const knownSubs = getSubCategoriesFor(data.category) || [];
                  // We need to re-run getSubCategoriesFor logic here because dbCategories state update might be slightly delayed in React batching
                  // Use 'fetchedCats' for immediate check
                  let subs = [];
                  if(defaultCategoryData[data.category]) subs = defaultCategoryData[data.category];
                  else {
                      const c = fetchedCats.find(x => x.name === data.category);
                      if(c) subs = c.subCategories;
                  }

                  if (!subs.includes(data.subCategory)) {
                      setIsNewSubCategoryMode(true);
                      setNewSubCategoryInput(data.subCategory);
                  }
              }
          }
      } catch (error) {
          console.log(error);
          toast.error("Error loading data");
      }
  }

  // --- HANDLERS ---
  const handleCategoryChange = (e) => {
      const val = e.target.value;
      if (val === "new_cat_option") {
          setIsNewCategoryMode(true); setIsNewSubCategoryMode(true);
          setCategory(""); setSubCategory("");
      } else {
          setIsNewCategoryMode(false);
          setCategory(val);
          const subs = getSubCategoriesFor(val);
          if (subs.length > 0) {
              setIsNewSubCategoryMode(false);
              setSubCategory(subs[0]);
          } else {
              setIsNewSubCategoryMode(true);
              setSubCategory("");
          }
      }
  };

  const handleSubCategoryChange = (e) => {
      const val = e.target.value;
      if (val === "new_sub_option") {
          setIsNewSubCategoryMode(true);
          setSubCategory("");
      } else {
          setIsNewSubCategoryMode(false);
          setSubCategory(val);
      }
  };

  const addVariant = () => {
    if(!variantInput.size || !variantInput.price || !variantInput.mrp || !variantInput.stock) {
        toast.error("Fill details"); return;
    }
    setVariants([...variants, variantInput]);
    setVariantInput({ size: "", price: "", mrp: "", stock: "", batchNumber: "" });
  };
  const removeVariant = (i) => setVariants(variants.filter((_, idx) => idx !== i));

  // --- SUBMIT ---
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const finalCategory = isNewCategoryMode ? newCategoryInput : category;
    const finalSubCategory = isNewSubCategoryMode ? newSubCategoryInput : subCategory;

    if (variants.length === 0) { toast.error("Add variants"); return; }

    try {
      const formData = new FormData()
      formData.append("id", productId); // Important for Update
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", finalCategory);
      formData.append("subCategory", finalSubCategory);
      formData.append("bestsellar", bestsellar);
      formData.append("saltComposition", saltComposition);
      formData.append("manufacturer", manufacturer);
      formData.append("prescriptionRequired", prescriptionRequired);
      formData.append("expiryDate", new Date(expiryDate).getTime());
      formData.append("variants", JSON.stringify(variants));

      // Append Images IF selected (Otherwise backend keeps old ones)
      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(backendURL + "/api/product/update", formData, { headers: { token } })

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
      <h2 className='text-2xl font-bold mb-4'>Update Medicine</h2>
      
      {/* --- IMAGE UPLOAD SECTION (Allows Changing Images) --- */}
      <div>
        <p className='mb-2'>Update Images (Click to change)</p>
        <div className='flex gap-2'>
          <label htmlFor="image1">
            {/* Logic: Show New File Preview ? OR Show Old URL ? OR Show Upload Placeholder */}
            <img className='w-20 h-20 object-cover border' src={image1 ? URL.createObjectURL(image1) : (prevImg1 || assets.upload_area)} alt="" />
            <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1" hidden />
          </label>
          <label htmlFor="image2">
            <img className='w-20 h-20 object-cover border' src={image2 ? URL.createObjectURL(image2) : (prevImg2 || assets.upload_area)} alt="" />
            <input onChange={(e) => setImage2(e.target.files[0])} type="file" id="image2" hidden />
          </label>
          <label htmlFor="image3">
            <img className='w-20 h-20 object-cover border' src={image3 ? URL.createObjectURL(image3) : (prevImg3 || assets.upload_area)} alt="" />
            <input onChange={(e) => setImage3(e.target.files[0])} type="file" id="image3" hidden />
          </label>
          <label htmlFor="image4">
            <img className='w-20 h-20 object-cover border' src={image4 ? URL.createObjectURL(image4) : (prevImg4 || assets.upload_area)} alt="" />
            <input onChange={(e) => setImage4(e.target.files[0])} type="file" id="image4" hidden />
          </label>
        </div>
      </div>

      <div className='w-full'><p>Name</p><input onChange={(e) => setName(e.target.value)} value={name} className='w-full border p-2 rounded' required /></div>
      <div className='w-full'><p>Description</p><textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full border p-2 rounded' required /></div>

      <div className='flex gap-2 w-full'>
          <div className='w-full'><p>Salt</p><input onChange={(e)=>setSaltComposition(e.target.value)} value={saltComposition} className='w-full border p-2 rounded' /></div>
          <div className='w-full'><p>Manufacturer</p><input onChange={(e)=>setManufacturer(e.target.value)} value={manufacturer} className='w-full border p-2 rounded' /></div>
      </div>
      <div className='w-full max-w-[200px]'><p>Expiry</p><input type="date" onChange={(e)=>setExpiryDate(e.target.value)} value={expiryDate} className='w-full border p-2 rounded' /></div>

      {/* --- HYBRID CATEGORY --- */}
      <div className='flex gap-2 w-full'>
         <div className='w-full'>
            <p>Category</p>
            {isNewCategoryMode ? (
                <div className='flex gap-2'><input value={newCategoryInput} onChange={(e)=>setNewCategoryInput(e.target.value)} className='w-full border border-emerald-500 p-2 rounded' /><button type="button" onClick={()=>setIsNewCategoryMode(false)} className='text-red-500'>Cancel</button></div>
            ) : (
                <select onChange={handleCategoryChange} value={category} className='w-full border p-2 rounded'>
                    {mergedCategories.map((c, i) => <option key={i} value={c}>{c}</option>)}
                    <option value="new_cat_option" className='text-emerald-600 font-bold'>+ New Category</option>
                </select>
            )}
        </div>
        <div className='w-full'>
            <p>Sub Category</p>
            {isNewSubCategoryMode ? (
                <div className='flex gap-2'><input value={newSubCategoryInput} onChange={(e)=>setNewSubCategoryInput(e.target.value)} className='w-full border border-emerald-500 p-2 rounded' /><button type="button" onClick={()=>setIsNewSubCategoryMode(false)} className='text-red-500'>Cancel</button></div>
            ) : (
                <select onChange={handleSubCategoryChange} value={subCategory} className='w-full border p-2 rounded'>
                   {getSubCategoriesFor(category).map((s, i) => <option key={i} value={s}>{s}</option>)}
                   <option value="new_sub_option" className='text-emerald-600 font-bold'>+ New Sub-Category</option>
                </select>
            )}
        </div>
      </div>

      {/* --- VARIANTS --- */}
      <div className='w-full mt-4 p-4 bg-gray-50 border rounded'>
          <p className='font-bold mb-2'>Variants</p>
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

      <div className='flex gap-4 mt-4'>
        <div className='flex gap-2'><input onChange={() => setBestsellar(!bestsellar)} checked={bestsellar} type="checkbox" /><label>Bestseller</label></div>
        <div className='flex gap-2'><input onChange={() => setPrescriptionRequired(!prescriptionRequired)} checked={prescriptionRequired} type="checkbox" /><label>Rx Required</label></div>
      </div>

      <button type='submit' className='w-40 py-3 mt-4 bg-black text-white font-bold rounded hover:bg-gray-800'>UPDATE PRODUCT</button>
    </form>
  )
}

export default Update