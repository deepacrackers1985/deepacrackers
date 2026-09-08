import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import { API_BASE_URL } from '../../../Config';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logout from '../Logout';

const Spinner = ({ size = 'sm', color = 'text-white' }) => (
  <svg className={`animate-spin ${size === 'sm' ? 'w-4 h-4' : 'w-8 h-8'} ${color}`} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
    <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
  </svg>
);

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-3">
      <Spinner size="lg" color="text-blue-500" />
      <p className="text-sm text-gray-400 font-medium">Loading inventory…</p>
    </div>
  </div>
);

const INITIAL_PRODUCT_VALUES = {
  serialNum: '',
  productName: '',
  price: '',
  per: '',
  discount: '0',
  youtube_link: '',
  dimension: '',
  colour: '',
  contain: '',
  chemical_composition: '',
  loudness: '',
  duration: '',
  safety_distance: '',
  visual_effects: '',
  how_to_ignite: '',
  description: '',
};

export default function Inventory() {
  const [focused, setFocused] = useState({});
  const [values, setValues] = useState(INITIAL_PRODUCT_VALUES);
  const [productType, setProductType] = useState('');
  const [newProductType, setNewProductType] = useState('');
  const [productTypes, setProductTypes] = useState([]);
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [discountWarning, setDiscountWarning] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productTypeToDelete, setProductTypeToDelete] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [savingOrder, setSavingOrder] = useState(false);
  const [orderSavedAlert, setOrderSavedAlert] = useState(false);

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    const updated = [...productTypes];
    const item = updated.splice(draggedIndex, 1)[0];
    updated.splice(targetIndex, 0, item);
    setProductTypes(updated);
    setDraggedIndex(null);
  };

  const moveCategory = (index, direction) => {
    const newTypes = [...productTypes];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newTypes.length) return;
    const temp = newTypes[index];
    newTypes[index] = newTypes[targetIndex];
    newTypes[targetIndex] = temp;
    setProductTypes(newTypes);
  };

  const saveCategoryOrder = async () => {
    setSavingOrder(true);
    try {
      const orderPayload = productTypes.map(t => typeof t === 'string' ? t : (t?.product_type || ''));
      const endpoints = [
        `${API_BASE_URL}/api/category-order`,
        `${API_BASE_URL}/api/product-types`,
        `${API_BASE_URL}/api/inventory/category-order`,
        `http://localhost:5000/api/category-order`,
        `http://localhost:5000/api/product-types`,
      ];

      let success = false;
      let lastErrMsg = '';

      for (const endpoint of endpoints) {
        try {
          const res = await fetch(endpoint, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order: orderPayload }),
          });
          if (res.ok) {
            success = true;
            break;
          } else {
            const data = await res.json().catch(() => ({}));
            lastErrMsg = data.message || res.statusText;
          }
        } catch (err) {
          lastErrMsg = err.message;
        }
      }

      if (success) {
        setOrderSavedAlert(true);
        setTimeout(() => setOrderSavedAlert(false), 3000);
      } else {
        alert(`Failed to save category order: ${lastErrMsg}`);
      }
    } catch (e) {
      console.error('saveCategoryOrder error:', e);
      alert(`Error saving category display order: ${e.message}`);
    } finally {
      setSavingOrder(false);
    }
  };
  const [submitLoading, setSubmitLoading] = useState(false);
  const [createTypeLoading, setCreateTypeLoading] = useState(false);
  const [deleteTypeLoading, setDeleteTypeLoading] = useState(false);

  // ── all original logic/API calls unchanged ────────────────────────────────

  const fetchProductTypes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/product-types`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch product types');
      const validTypes = data
        .filter(item => item && item.product_type && typeof item.product_type === 'string')
        .map(item => item.product_type);
      setProductTypes(validTypes);
    } catch (err) {
      console.error('Error fetching product types:', err);
      setError(err.message);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchProductTypes();
    const intervalId = setInterval(fetchProductTypes, 180000);
    return () => clearInterval(intervalId);
  }, []);

  const handleFocus = (inputId) => {
    setFocused((prev) => ({ ...prev, [inputId]: true }));
  };

  const handleBlur = (inputId) => {
    setFocused((prev) => ({ ...prev, [inputId]: values[inputId] !== '' }));
  };

  const handleChange = (inputId, event) => {
    const value = event.target.value;
    if (inputId === 'discount') {
      if (value === '') {
        setDiscountWarning('');
        setValues((prev) => ({ ...prev, [inputId]: value }));
      } else {
        const numValue = parseFloat(value);
        if (isNaN(numValue) || numValue < 0 || numValue > 100) {
          setDiscountWarning('Discount must be between 0 and 100%');
          setValues((prev) => ({ ...prev, [inputId]: numValue < 0 ? '0' : '100' }));
        } else {
          setDiscountWarning('');
          setValues((prev) => ({ ...prev, [inputId]: value }));
        }
      }
    } else if (inputId === 'price') {
      if (value === '') {
        setError('');
        setValues((prev) => ({ ...prev, [inputId]: value }));
      } else {
        const numValue = parseFloat(value);
        if (isNaN(numValue) || numValue < 0) {
          setError('Price must be a valid positive number');
          setValues((prev) => ({ ...prev, [inputId]: '0' }));
        } else {
          setError('');
          setValues((prev) => ({ ...prev, [inputId]: value }));
        }
      }
    } else {
      setValues((prev) => ({ ...prev, [inputId]: value }));
    }
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    const allowedTypes = [...allowedImageTypes, ...allowedVideoTypes];
    const validFiles = [];
    for (const file of files) {
      const fileType = file.type.toLowerCase();
      if (!allowedTypes.includes(fileType)) {
        setError('Only JPG, PNG, GIF images and MP4, WebM, Ogg videos are allowed');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Each file must be less than 5MB');
        return;
      }
      validFiles.push(file);
    }
    setError('');
    setImages(validFiles);
  };

  const handleProductTypeChange = (event) => {
    setProductType(event.target.value);
    setValues(INITIAL_PRODUCT_VALUES);
    setFocused({});
    setImages([]);
    setError('');
    setSuccess('');
    setDiscountWarning('');
  };

  const handleNewProductTypeChange = (event) => {
    setNewProductType(event.target.value);
  };

  const handleCreateProductType = async () => {
    if (!newProductType) {
      setError('Product type name is required');
      return;
    }
    const formattedProductType = newProductType.toLowerCase().replace(/\s+/g, '_');
    if (productTypes.includes(formattedProductType)) {
      setError('Product type already exists');
      return;
    }
    try {
      setCreateTypeLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/product-types`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_type: formattedProductType }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to create product type');
      setProductTypes([...productTypes, formattedProductType]);
      setNewProductType('');
      setSuccess('Product type created successfully!');
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setCreateTypeLoading(false);
    }
  };

  const handleDeleteProductType = async () => {
    if (!productTypeToDelete) return;
    try {
      setDeleteTypeLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/product-types/${productTypeToDelete}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to delete product type');
      setProductTypes(productTypes.filter((type) => type !== productTypeToDelete));
      setSuccess('Product type deleted successfully!');
      setError('');
      if (productType === productTypeToDelete) {
        setProductType('');
        setValues(INITIAL_PRODUCT_VALUES);
        setImages([]);
        setFocused({});
        setDiscountWarning('');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleteTypeLoading(false);
      setShowDeleteModal(false);
      setProductTypeToDelete(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setDiscountWarning('');
    const missingFields = [];
    if (!values.serialNum) missingFields.push('Serial Number');
    if (!values.productName) missingFields.push('Product Name');
    if (!values.price) missingFields.push('Price');
    if (!values.per) missingFields.push('Per');
    if (!productType) missingFields.push('Product Type');
    if (missingFields.length > 0) {
      setError(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      return;
    }
    const price = parseFloat(values.price);
    const discount = values.discount ? parseFloat(values.discount) : 0;
    if (isNaN(price) || price < 0) { setError('Price must be a valid positive number'); return; }
    if (values.discount && (isNaN(discount) || discount < 0 || discount > 100)) {
      setError('Discount must be a valid number between 0 and 100%');
      return;
    }
    const formData = new FormData();
    formData.append('serial_number', values.serialNum);
    formData.append('productname', values.productName);
    formData.append('price', values.price);
    formData.append('dprice', values.price || '0');
    formData.append('per', values.per);
    formData.append('discount', values.discount || '0');

    // Embed specifications into description for universal fallback compatibility and pass directly
    const cleanDesc = (values.description || '').trim();
    const ytLink = (values.youtube_link || '').trim();
    const dimension = (values.dimension || '').trim();
    const colour = (values.colour || '').trim();
    const contain = (values.contain || '').trim();
    const chemical_composition = (values.chemical_composition || '').trim();
    const loudness = (values.loudness || '').trim();
    const duration = (values.duration || '').trim();
    const safety_distance = (values.safety_distance || '').trim();
    const visual_effects = (values.visual_effects || '').trim();
    const how_to_ignite = (values.how_to_ignite || '').trim();

    let fullDesc = cleanDesc;
    if (contain) fullDesc += `\n[contain:${contain}]`;
    if (chemical_composition) fullDesc += `\n[chem:${chemical_composition}]`;
    if (loudness) fullDesc += `\n[loud:${loudness}]`;
    if (duration) fullDesc += `\n[dur:${duration}]`;
    if (safety_distance) fullDesc += `\n[safety:${safety_distance}]`;
    if (visual_effects) fullDesc += `\n[effect:${visual_effects}]`;
    if (how_to_ignite) fullDesc += `\n[ignite:${how_to_ignite}]`;
    if (dimension) fullDesc += `\n[dim:${dimension}]`;
    if (colour) fullDesc += `\n[col:${colour}]`;
    if (ytLink) fullDesc += `\n[yt:${ytLink}]`;

    formData.append('description', fullDesc.trim());
    formData.append('youtube_link', ytLink);
    formData.append('dimension', dimension);
    formData.append('colour', colour);
    formData.append('contain', contain);
    formData.append('chemical_composition', chemical_composition);
    formData.append('loudness', loudness);
    formData.append('duration', duration);
    formData.append('safety_distance', safety_distance);
    formData.append('visual_effects', visual_effects);
    formData.append('how_to_ignite', how_to_ignite);

    formData.append('product_type', productType);
    if (Array.isArray(images) && images.length > 0) {
      images.forEach(file => formData.append('images', file));
    }
    for (let [key, value] of formData.entries()) {
      console.log(`FormData: ${key} = ${value}`);
    }
    try {
      setSubmitLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/products`, { method: 'POST', body: formData });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || result.message || 'Failed to save product');
      setSuccess('Product saved successfully!');
      setValues(INITIAL_PRODUCT_VALUES);
      setImages([]);
      setFocused({});
      setDiscountWarning('');
      event.target.reset();
    } catch (err) {
      console.error('Submission error:', err);
      setError(`Failed to save product: ${err.message}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  const formatProductTypeDisplay = (type) => {
    if (!type || typeof type !== 'string') return 'Unknown Type';
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // ── shared UI classes ─────────────────────────────────────────────────────
  const ic = "block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all";
  const sc = "block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer";
  const lc = "block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5";

  const renderFormFields = () => {
    if (!productType) return null;

    const renderMedia = (media, idx) => {
      let src;
      let isVideo = false;
      if (media instanceof File) {
        src = URL.createObjectURL(media);
        isVideo = media.type.startsWith('video/');
      } else {
        return <span key={idx} className="text-gray-500 text-sm">Invalid media</span>;
      }
      return isVideo ? (
        <div key={idx} className="relative">
          <video src={src} controls className="h-20 w-20 object-cover rounded-lg border border-gray-200" onLoad={() => URL.revokeObjectURL(src)} />
          <button type="button" onClick={() => setImages(images.filter((_, index) => index !== idx))}
            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-lg">×</button>
        </div>
      ) : (
        <div key={idx} className="relative">
          <img src={src || '/placeholder.svg'} alt={`media-${idx}`} className="h-20 w-20 object-cover rounded-lg border border-gray-200" onLoad={() => URL.revokeObjectURL(src)} />
          <button type="button" onClick={() => setImages(images.filter((_, index) => index !== idx))}
            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-lg">×</button>
        </div>
      );
    };

    return (
      <>
        <div className="mobile:col-span-6">
          <label htmlFor={`serial-num-${productType}`} className={lc}>Serial Number <span className="text-red-400">*</span></label>
          <input type="text" id={`serial-num-${productType}`} name="serialNum" required value={values.serialNum}
            onChange={(e) => handleChange('serialNum', e)} onFocus={() => handleFocus('serialNum')} onBlur={() => handleBlur('serialNum')} className={ic} />
        </div>
        <div className="mobile:col-span-6">
          <label htmlFor="product-name" className={lc}>Product Name <span className="text-red-400">*</span></label>
          <input type="text" id="product-name" name="productName" required value={values.productName}
            onChange={(e) => handleChange('productName', e)} onFocus={() => handleFocus('productName')} onBlur={() => handleBlur('productName')} className={ic} />
        </div>
        <div className="mobile:col-span-6 sm:col-span-3">
          <label htmlFor="price" className={lc}>Price (INR) <span className="text-red-400">*</span></label>
          <input type="number" id="price" name="price" required min="0" step="0.01" value={values.price}
            onChange={(e) => handleChange('price', e)} onFocus={() => handleFocus('price')} onBlur={() => handleBlur('price')} className={ic} />
        </div>
        <div className="mobile:col-span-3 sm:col-span-3">
          <label htmlFor="per" className={lc}>Per <span className="text-red-400">*</span></label>
          <select id="per" name="per" required value={values.per}
            onChange={(e) => handleChange('per', e)} onFocus={() => handleFocus('per')} onBlur={() => handleBlur('per')} className={sc}>
            <option value="">Select</option>
            <option value="pieces">Pieces</option>
            <option value="box">Box</option>
            <option value="pkt">Pkt</option>
          </select>
        </div>
        <div className="mobile:col-span-3 sm:col-span-3">
          <label htmlFor="discount" className={lc}>Discount (%)</label>
          <input type="number" id="discount" name="discount" min="0" max="100" step="0.01" value={values.discount}
            onChange={(e) => handleChange('discount', e)} onFocus={() => handleFocus('discount')} onBlur={() => handleBlur('discount')} className={ic} />
          {discountWarning && <p className="mt-1 text-xs text-red-500">{discountWarning}</p>}
        </div>
        <div className="mobile:col-span-6 sm:col-span-3">
          <label htmlFor="youtube_link" className={lc}>YouTube Link (Video URL)</label>
          <input
            type="url"
            id="youtube_link"
            name="youtube_link"
            value={values.youtube_link}
            onChange={(e) => handleChange('youtube_link', e)}
            onFocus={() => handleFocus('youtube_link')}
            onBlur={() => handleBlur('youtube_link')}
            placeholder="e.g. https://www.youtube.com/watch?v=..."
            className={ic}
          />
        </div>
        <div className="mobile:col-span-6 sm:col-span-3">
          <label htmlFor="dimension" className={lc}>Dimension / Size</label>
          <input
            type="text"
            id="dimension"
            name="dimension"
            value={values.dimension}
            onChange={(e) => handleChange('dimension', e)}
            onFocus={() => handleFocus('dimension')}
            onBlur={() => handleBlur('dimension')}
            placeholder="e.g. 15 x 10 x 5 cm or 7 inch"
            className={ic}
          />
        </div>
        <div className="mobile:col-span-6 sm:col-span-3">
          <label htmlFor="colour" className={lc}>Colour / Visual Effect</label>
          <input
            type="text"
            id="colour"
            name="colour"
            value={values.colour}
            onChange={(e) => handleChange('colour', e)}
            onFocus={() => handleFocus('colour')}
            onBlur={() => handleBlur('colour')}
            placeholder="e.g. Multi-Colour, Golden Sparkles, Red & Green"
            className={ic}
          />
        </div>

        {/* Specifications Table Section (Displayed on Product Card & Description Table) */}
        <div className="mobile:col-span-6 pt-3 pb-1 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800">
              Product Specifications Table Details (Displayed under Description)
            </h4>
          </div>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Fill these attributes to display the exact colored specification table for this product.
          </p>
        </div>

        <div className="mobile:col-span-6 sm:col-span-3">
          <label htmlFor="contain" className={lc}>Contain / Pack Contents</label>
          <input
            type="text"
            id="contain"
            name="contain"
            value={values.contain}
            onChange={(e) => handleChange('contain', e)}
            onFocus={() => handleFocus('contain')}
            onBlur={() => handleBlur('contain')}
            placeholder="e.g. 05 Pcs (Per Box)"
            className={ic}
          />
        </div>

        <div className="mobile:col-span-6 sm:col-span-3">
          <label htmlFor="chemical_composition" className={lc}>Chemical Composition</label>
          <input
            type="text"
            id="chemical_composition"
            name="chemical_composition"
            value={values.chemical_composition}
            onChange={(e) => handleChange('chemical_composition', e)}
            onFocus={() => handleFocus('chemical_composition')}
            onBlur={() => handleBlur('chemical_composition')}
            placeholder='e.g. "AI", "S", "KNO3", "CHARCOAL", "DEXTRIN"'
            className={ic}
          />
        </div>

        <div className="mobile:col-span-6 sm:col-span-3">
          <label htmlFor="loudness" className={lc}>Loudness</label>
          <input
            type="text"
            id="loudness"
            name="loudness"
            value={values.loudness}
            onChange={(e) => handleChange('loudness', e)}
            onFocus={() => handleFocus('loudness')}
            onBlur={() => handleBlur('loudness')}
            placeholder="e.g. Soundless / Medium / High Decibel"
            className={ic}
          />
        </div>

        <div className="mobile:col-span-6 sm:col-span-3">
          <label htmlFor="duration" className={lc}>Duration</label>
          <input
            type="text"
            id="duration"
            name="duration"
            value={values.duration}
            onChange={(e) => handleChange('duration', e)}
            onFocus={() => handleFocus('duration')}
            onBlur={() => handleBlur('duration')}
            placeholder="e.g. It lasts for 20 Seconds Each."
            className={ic}
          />
        </div>

        <div className="mobile:col-span-6 sm:col-span-3">
          <label htmlFor="safety_distance" className={lc}>Safety Distance</label>
          <input
            type="text"
            id="safety_distance"
            name="safety_distance"
            value={values.safety_distance}
            onChange={(e) => handleChange('safety_distance', e)}
            onFocus={() => handleFocus('safety_distance')}
            onBlur={() => handleBlur('safety_distance')}
            placeholder="e.g. To be safe stand at 5 Meters distance"
            className={ic}
          />
        </div>

        <div className="mobile:col-span-6 sm:col-span-3">
          <label htmlFor="visual_effects" className={lc}>Visual Effects</label>
          <input
            type="text"
            id="visual_effects"
            name="visual_effects"
            value={values.visual_effects}
            onChange={(e) => handleChange('visual_effects', e)}
            onFocus={() => handleFocus('visual_effects')}
            onBlur={() => handleBlur('visual_effects')}
            placeholder="e.g. Once it is lit, it reaches up the sky Fly up in air with Golden drone effect"
            className={ic}
          />
        </div>

        <div className="mobile:col-span-6">
          <label htmlFor="how_to_ignite" className={lc}>How To Ignite?</label>
          <input
            type="text"
            id="how_to_ignite"
            name="how_to_ignite"
            value={values.how_to_ignite}
            onChange={(e) => handleChange('how_to_ignite', e)}
            onFocus={() => handleFocus('how_to_ignite')}
            onBlur={() => handleBlur('how_to_ignite')}
            placeholder="e.g. perfect angle light it with an agarpathi."
            className={ic}
          />
        </div>

        <div className="mobile:col-span-6">
          <label htmlFor="description" className={lc}>Description (Paragraph text)</label>
          <textarea id="description" name="description" rows="3" value={values.description}
            onChange={(e) => handleChange('description', e)} onFocus={() => handleFocus('description')} onBlur={() => handleBlur('description')}
            className={`${ic} resize-none`} placeholder="Enter product description paragraph (e.g. Dragon Fly are the favorite's crackers to all...)" />
        </div>
        <div className="mobile:col-span-6">
          <label htmlFor="image" className={lc}>Image Upload</label>
          <input type="file" id="image" name="images" accept="image/jpeg,image/jpg,image/png,image/gif,video/mp4,video/webm,video/ogg" multiple onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 cursor-pointer" />
          {images.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-2">Selected media:</p>
              <div className="flex flex-wrap gap-2">{images.map((file, idx) => renderMedia(file, idx))}</div>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#f5f6f8]">
      <Sidebar />
      <Logout />
      <div className="flex-1 hundred:ml-64 mobile:ml-0 hundred:px-8 mobile:px-4 pt-8 pb-16">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Header */}
          <div className="pb-3 border-b border-gray-200">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-blue-500 mb-0.5">Stock</p>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Add Items</h1>
          </div>

          {error && <div className="px-4 py-3 rounded-lg border bg-red-50 border-red-200 text-red-700 text-sm">{error}</div>}
          {success && <div className="px-4 py-3 rounded-lg border bg-emerald-50 border-emerald-200 text-emerald-700 text-sm">{success}</div>}

          {pageLoading ? <PageLoader /> : (
            <>
              {/* Product Types Panel */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/70">
                  <h2 className="text-sm font-bold text-gray-700">Product Types</h2>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                      <label htmlFor="new-product-type" className={lc}>Create New Product Type</label>
                      <div className="flex gap-2">
                        <input type="text" id="new-product-type" value={newProductType} onChange={handleNewProductTypeChange}
                          className={ic} placeholder="Enter product type name" />
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="button" onClick={handleCreateProductType}
                          disabled={createTypeLoading}
                          className={`flex-shrink-0 h-9 w-9 rounded-lg text-white flex items-center justify-center shadow-sm transition-colors ${createTypeLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                          {createTypeLoading ? <Spinner /> : <FaPlus className="h-3.5 w-3.5" />}
                        </motion.button>
                      </div>
                    </div>
                    <div className="sm:col-span-4">
                      <label htmlFor="product-type" className={lc}>Select Product Type</label>
                      <select id="product-type" value={productType} onChange={handleProductTypeChange} className={sc}>
                        <option value="">Select</option>
                        {productTypes.map(type => (
                          <option key={type} value={type}>{formatProductTypeDisplay(type)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className={lc}>Category Display Sequence (Drag & Drop or use ▲ ▼ to re-arrange)</p>
                        <p className="text-[11px] text-gray-500">Drag any item to reorder. The customer website and PDF pricelist will follow this exact sequence automatically.</p>
                      </div>
                      <button
                        type="button"
                        onClick={saveCategoryOrder}
                        disabled={savingOrder}
                        className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50"
                      >
                        {savingOrder ? "Saving Sequence..." : "Save Display Order"}
                      </button>
                    </div>

                    {orderSavedAlert && (
                      <div className="mb-3 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                        ✓ Category display sequence saved successfully!
                      </div>
                    )}

                    {productTypes.length === 0 ? (
                      <p className="text-sm text-gray-400">No product types available.</p>
                    ) : (
                      <ul className="space-y-2">
                        {productTypes.map((type, idx) => (
                          <li
                            key={type}
                            draggable
                            onDragStart={(e) => handleDragStart(e, idx)}
                            onDragOver={(e) => handleDragOver(e, idx)}
                            onDrop={(e) => handleDrop(e, idx)}
                            className={`flex items-center justify-between bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-lg transition-all cursor-grab active:cursor-grabbing hover:border-blue-300 hover:bg-blue-50/30 ${
                              draggedIndex === idx ? "opacity-40 border-blue-400 bg-blue-100/50" : ""
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-mono font-bold text-gray-400 w-6">#{idx + 1}</span>
                              <span className="text-gray-400 text-xs">☰</span>
                              <span className="text-sm text-gray-800 font-semibold">{formatProductTypeDisplay(type)}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => moveCategory(idx, -1)}
                                className="w-7 h-7 rounded bg-white border border-gray-200 hover:bg-gray-100 text-gray-600 text-xs flex items-center justify-center disabled:opacity-30"
                              >
                                ▲
                              </button>
                              <button
                                type="button"
                                disabled={idx === productTypes.length - 1}
                                onClick={() => moveCategory(idx, 1)}
                                className="w-7 h-7 rounded bg-white border border-gray-200 hover:bg-gray-100 text-gray-600 text-xs flex items-center justify-center disabled:opacity-30"
                              >
                                ▼
                              </button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => { setProductTypeToDelete(type); setShowDeleteModal(true); }}
                                className="ml-1 text-red-400 hover:text-red-600 transition-all p-1"
                              >
                                <FaTrash className="h-3.5 w-3.5" />
                              </motion.button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Form */}
              {productType ? (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/70">
                    <h2 className="text-sm font-bold text-gray-700">
                      New Product — <span className="text-blue-500">{formatProductTypeDisplay(productType)}</span>
                    </h2>
                  </div>
                  <form onSubmit={handleSubmit} className="p-6">
                    <div className="border-b border-gray-100 pb-6">
                      <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
                        {renderFormFields()}
                      </div>
                    </div>
                    <div className="mt-5 flex justify-end gap-3">
                      <button type="button" onClick={() => {
                        setValues(INITIAL_PRODUCT_VALUES);
                        setImages([]); setProductType(''); setFocused({}); setDiscountWarning('');
                      }} className="h-9 px-5 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all cursor-pointer">
                        Cancel
                      </button>
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit"
                        disabled={submitLoading}
                        className={`h-9 px-6 rounded-lg text-white text-sm font-bold shadow-sm transition-colors cursor-pointer flex items-center gap-2 ${submitLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                        {submitLoading ? <><Spinner />Saving…</> : 'Save'}
                      </motion.button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="flex justify-center items-center bg-white border-2 border-dashed border-gray-200 rounded-xl py-16">
                  <p className="text-sm text-gray-400 font-medium text-center">
                    Please select or create a product type to add items
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center"
              onClick={(e) => e.stopPropagation()}>
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTrash className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Confirm Deletion</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete <span className="font-semibold text-gray-700">"{formatProductTypeDisplay(productTypeToDelete)}"</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 h-11 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold text-sm transition-colors">
                  Cancel
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={handleDeleteProductType}
                  disabled={deleteTypeLoading}
                  className={`flex-1 h-11 rounded-xl text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 ${deleteTypeLoading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}`}>
                  {deleteTypeLoading ? <><Spinner />Deleting…</> : 'Delete'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}