import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, Upload, ShoppingCart, Package, ArrowRight, Plus, Check, Pill, Loader2, X, Camera, Image, FileImage, CheckCircle, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { storeService } from '../api';

const SearchPage = ({ onNext }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [allInventory, setAllInventory] = useState([]); // Store all inventory items
  const [loading, setLoading] = useState(true); // Loading state for initial fetch
  const [error, setError] = useState(null);
  const [storeData, setStoreData] = useState(null);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const { addToCart, getCartCount, cartItems, prescription, setPrescriptionImage, clearPrescription } = useCart();

  // Fetch store data and all inventory on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        console.log('Fetching store and inventory data...');
        
        // Fetch store data and inventory in parallel
        const [storeResponse, inventoryResponse] = await Promise.all([
          storeService.getStore(),
          storeService.getInventory()
        ]);
        
        console.log('Store response:', storeResponse);
        console.log('Inventory response:', inventoryResponse);
        
        // Set store data
        const store = storeResponse?.data || storeResponse;
        setStoreData(store);
        
        // Handle different API response structures for inventory
        let items = [];
        const data = inventoryResponse;
        
        // Log the structure to understand response format
        console.log('Inventory data structure:', JSON.stringify(data, null, 2).substring(0, 500));
        
        if (data?.data?.data?.inventory) {
          items = data.data.data.inventory;
          console.log('Found items at: data.data.data.inventory');
        } else if (data?.data?.inventory) {
          items = data.data.inventory;
          console.log('Found items at: data.data.inventory');
        } else if (data?.data?.products) {
          items = data.data.products;
          console.log('Found items at: data.data.products');
        } else if (data?.data?.items) {
          items = data.data.items;
          console.log('Found items at: data.data.items');
        } else if (data?.inventory) {
          items = data.inventory;
          console.log('Found items at: data.inventory');
        } else if (data?.products) {
          items = data.products;
          console.log('Found items at: data.products');
        } else if (data?.items) {
          items = data.items;
          console.log('Found items at: data.items');
        } else if (data?.data && Array.isArray(data.data)) {
          items = data.data;
          console.log('Found items at: data.data (array)');
        } else if (Array.isArray(data)) {
          items = data;
          console.log('Found items at: root (array)');
        } else {
          console.log('Could not find inventory items in response');
        }
        
        console.log('Loaded inventory items:', items.length, items.slice(0, 2));
        setAllInventory(Array.isArray(items) ? items : []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch initial data:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);

  // Filter inventory locally based on search query (instant search)
  const filteredMedications = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }
    
    const query = searchQuery.toLowerCase().trim();
    
    return allInventory
      .filter(item => {
        const name = (item.drug_name || item.generic_name || item.brand_name || item.name || '').toLowerCase();
        const brand = (item.brand_name || '').toLowerCase();
        const category = (item.category || item.type || '').toLowerCase();
        
        return name.includes(query) || brand.includes(query) || category.includes(query);
      })
      .slice(0, 15); // Limit to 15 results for performance
  }, [searchQuery, allInventory]);

  // Check if item is in cart
  const isInCart = (medId) => {
    return cartItems.some(item => item.id === medId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setSelectedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isDropdownOpen || filteredMedications.length === 0) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filteredMedications.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelectMedication(filteredMedications[selectedIndex]);
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      setSelectedIndex(-1);
    }
  };

  // Compress image to reduce file size for API submission
  const compressImage = (file, maxWidth = 1024, quality = 0.7) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Scale down if larger than maxWidth
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to base64 with compression
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedBase64);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB before compression
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert('Please upload an image file (JPG, PNG, WebP)');
      return;
    }
    
    if (file.size > MAX_FILE_SIZE) {
      alert('File size must be less than 10MB');
      return;
    }

    try {
      // Compress the image
      const compressedBase64 = await compressImage(file, 1024, 0.7);
      const compressedSize = Math.round((compressedBase64.length * 3) / 4); // Approximate size
      
      setPrescriptionImage({
        file: file,
        base64: compressedBase64,
        fileName: file.name,
        fileType: 'image/jpeg',
        fileSize: compressedSize
      });
      
      console.log(`Image compressed: ${(file.size / 1024).toFixed(1)}KB -> ${(compressedSize / 1024).toFixed(1)}KB`);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image. Please try again.');
    }
    
    // Reset file input
    if (e.target) e.target.value = '';
  };

  const handleRemovePrescription = () => {
    clearPrescription();
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleSelectMedication = (medication) => {
    addToCart(medication);
    setSearchQuery('');
    setIsDropdownOpen(false);
    setSelectedIndex(-1);
  };

  const handleAddToCart = (medication) => {
    addToCart(medication);
  };

  return (
    <div className="h-100 pb-3" style={{ paddingBottom: (getCartCount() > 0 || prescription) ? '100px' : '1rem' }}>
      <div className="container py-5" style={{ maxWidth: '800px', marginTop: '4rem' }}>
        {/* Header / Pharmacy Branding */}
        <div className="text-center mb-4">
          {/* Pharmacy Logo/Icon */}
          <div 
            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
            style={{ 
              width: '80px', 
              height: '80px', 
              background: 'linear-gradient(135deg, #00B17B 0%, #00d492 100%)',
              boxShadow: '0 4px 20px rgba(0, 177, 123, 0.3)'
            }}
          >
            <Package size={40} color="white" />
          </div>
          
          {/* Pharmacy Name */}
          <h1 className="h3 fw-bold mb-1" style={{ color: '#1a1a2e' }}>
            {storeData?.StoreName || storeData?.storeName || 'Pharmacy'}
          </h1>
          
          {/* Location (if available) */}
          {storeData?.address && (
            <p className="text-muted small mb-2 d-flex align-items-center justify-content-center gap-1">
              <MapPin size={14} />
              {storeData.address}
            </p>
          )}
          
          {/* Welcome Message */}
          <div 
            className="mt-3 p-3 rounded-3 mx-auto"
            style={{ 
              background: 'linear-gradient(135deg, #f0fdf4 0%, #e6f7f1 100%)',
              maxWidth: '500px'
            }}
          >
            <p className="mb-1 fw-medium" style={{ color: '#00B17B' }}>
              👋 Welcome! Ready to place your order?
            </p>
            <p className="text-muted small mb-0">
              {loading 
                ? 'Loading products...' 
                : `${allInventory.length} products available • Search or upload prescription`
              }
            </p>
          </div>
        </div>

        {/* Search and Upload Section */}
        <div className="mb-4">
          <div className="row g-2 g-md-3 flex-nowrap">
            <div className="col" ref={searchRef}>
              <div className="position-relative">
                <div className="input-group input-group-lg">
                  <span className="input-group-text bg-white border-end-0">
                    {loading ? (
                      <Loader2 size={20} className="text-muted" style={{ animation: 'spin 1s linear infinite' }} />
                    ) : (
                      <Search className="text-muted" size={20} />
                    )}
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder={loading ? "Loading products..." : "Search for medications..."}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsDropdownOpen(true);
                      setSelectedIndex(-1);
                    }}
                    onFocus={() => searchQuery.trim() && setIsDropdownOpen(true)}
                    onKeyDown={handleKeyDown}
                    style={{ 
                      borderBottomLeftRadius: isDropdownOpen && filteredMedications.length > 0 ? 0 : undefined,
                      borderBottomRightRadius: isDropdownOpen && filteredMedications.length > 0 ? 0 : undefined,
                    }}
                  />
                </div>

                {/* Search Dropdown Results */}
                {isDropdownOpen && searchQuery.trim() && (
                  <div 
                    ref={dropdownRef}
                    className="position-absolute w-100 bg-white border rounded-bottom shadow-lg"
                    style={{ 
                      top: '100%', 
                      left: 0, 
                      zIndex: 1050,
                      maxHeight: '350px',
                      overflowY: 'auto',
                      borderTop: 'none',
                    }}
                  >
                    {filteredMedications.length > 0 ? (
                      <>
                        <div className="px-3 py-2 bg-light border-bottom">
                          <small className="text-muted fw-medium">
                            {filteredMedications.length} result{filteredMedications.length !== 1 ? 's' : ''} found
                          </small>
                        </div>
                        {filteredMedications.map((medication, index) => {
                          // Handle API field names from inventory response
                          const medId = medication.id || medication._id || index;
                          const medUuid = medication.uuid || medication.drugId || '';
                          const medName = medication.drug_name || medication.generic_name || medication.brand_name || medication.name || 'Unknown Product';
                          const medBrand = medication.brand_name || '';
                          const medCategory = medication.category || medication.type || '';
                          const medPrice = medication.selling_price || medication.price || medication.cost_price || 0;
                          const medUnit = medication.unit_measure || 'unit';
                          const medQuantity = medication.quantity_available || medication.quantity || 0;
                          
                          return (
                            <div
                              key={medId}
                              className="d-flex align-items-center gap-3 p-3 border-bottom"
                              style={{ 
                                cursor: 'pointer',
                                backgroundColor: selectedIndex === index ? '#f0fdf4' : (isInCart(medId) ? '#fafafa' : 'white'),
                                transition: 'background-color 0.15s ease',
                              }}
                              onClick={() => handleSelectMedication({ 
                                ...medication, 
                                id: medId,
                                drugId: medUuid,
                                name: medName, 
                                price: medPrice, 
                                category: medCategory,
                                brand: medBrand,
                                unit: medUnit,
                                quantityAvailable: medQuantity
                              })}
                              onMouseEnter={() => setSelectedIndex(index)}
                            >
                              {/* Medication Icon */}
                              <div 
                                className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                                style={{ 
                                  width: '48px', 
                                  height: '48px', 
                                  background: 'linear-gradient(135deg, #e0f7ef 0%, #c6f0e0 100%)',
                                }}
                              >
                                <Pill size={22} style={{ color: '#00B17B' }} />
                              </div>

                              {/* Medication Details */}
                              <div className="flex-grow-1 min-width-0">
                                <p className="fw-semibold mb-0 text-truncate text-capitalize" style={{ color: '#1a1a2e' }}>
                                  {medName}
                                </p>
                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                  {medBrand && <span className="small text-muted">{medBrand}</span>}
                                  {medBrand && medCategory && <span className="small text-muted">•</span>}
                                  {medCategory && <span className="small text-muted">{medCategory}</span>}
                                </div>
                                <div className="d-flex align-items-center gap-2 mt-1">
                                  {medPrice > 0 && (
                                    <span className="small fw-bold" style={{ color: '#00B17B' }}>
                                      ₵{Number(medPrice).toFixed(2)}/{medUnit}
                                    </span>
                                  )}
                                  {medQuantity > 0 && (
                                    <span className="badge bg-light text-muted" style={{ fontSize: '0.7rem' }}>
                                      {medQuantity} available
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Add Button */}
                              <button
                                className="btn btn-sm d-flex align-items-center justify-content-center flex-shrink-0"
                                style={{ 
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '50%',
                                  background: isInCart(medId) ? '#00B17B' : '#e0f7ef',
                                  color: isInCart(medId) ? 'white' : '#00B17B',
                                  border: 'none',
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectMedication({ 
                                    ...medication, 
                                    id: medId,
                                    drugId: medUuid,
                                    name: medName, 
                                    price: medPrice, 
                                    category: medCategory,
                                    brand: medBrand,
                                    unit: medUnit,
                                    quantityAvailable: medQuantity
                                  });
                                }}
                              >
                                {isInCart(medId) ? <Check size={18} /> : <Plus size={18} />}
                              </button>
                            </div>
                          );
                        })}
                      </>
                    ) : (
                      <div className="p-4 text-center">
                        <div 
                          className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                          style={{ width: '56px', height: '56px', background: '#f3f4f6' }}
                        >
                          <Search size={24} className="text-muted" />
                        </div>
                        <p className="fw-medium mb-1" style={{ color: '#1a1a2e' }}>No medications found</p>
                        <p className="text-muted small mb-0">Try a different search term</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="col-auto d-flex align-items-center">
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn d-flex align-items-center justify-content-center gap-1"
                  style={{ 
                    color: '#00B17B', 
                    height: '48px',
                    width: '48px',
                    background: '#FFFDFA',
                    border: 'none',
                    padding: 0
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Image size={20} />
                </button>
                <button
                  type="button"
                  className="btn d-flex align-items-center justify-content-center gap-1"
                  style={{ 
                    background: '#00B17B',
                    color: 'white', 
                    height: '48px',
                    width: '48px',
                    padding: 0
                  }}
                  onClick={() => cameraInputRef.current?.click()}
                >
                  <Camera size={20} />
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                onChange={handleImageUpload}
                className="d-none"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                className="d-none"
              />
            </div>
          </div>

          {/* Prescription Image Preview */}
          {prescription && (
            <div className="card mt-3 border-success" style={{ borderRadius: '0.75rem' }}>
              <div className="card-body p-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="position-relative flex-shrink-0">
                    <img
                      src={prescription.base64}
                      alt="Uploaded prescription"
                      className="rounded"
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                    />
                    <button
                      type="button"
                      className="btn btn-danger btn-sm rounded-circle position-absolute d-flex align-items-center justify-content-center"
                      style={{ 
                        top: '-8px', 
                        right: '-8px', 
                        width: '24px', 
                        height: '24px', 
                        padding: 0 
                      }}
                      onClick={handleRemovePrescription}
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <CheckCircle size={18} style={{ color: '#00B17B' }} />
                      <p className="fw-semibold mb-0" style={{ color: '#00B17B' }}>Prescription uploaded</p>
                    </div>
                    <p className="text-muted small mb-0">{prescription.fileName}</p>
                    <p className="text-muted small mb-0">{(prescription.fileSize / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                
                {/* Continue Button */}
                <div className="mt-3 pt-3 border-top">
                  <button
                    className="btn btn-lg w-100 fw-semibold d-flex align-items-center justify-content-center gap-2"
                    style={{ background: '#00B17B', color: 'white', borderRadius: '0.75rem' }}
                    onClick={onNext}
                  >
                    Continue to Fill Details
                    <ArrowRight size={20} />
                  </button>
                  <p className="text-muted small text-center mt-2 mb-0">
                    Or search for more medications below
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cart Summary Footer */}
      {(getCartCount() > 0 || prescription) && (
        <div 
          className="fixed-bottom bg-white border-top p-3"
          style={{ boxShadow: '0 -4px 20px rgba(0,0,0,0.1)' }}
        >
          <div className="container" style={{ maxWidth: '1200px' }}>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
              <div className="d-flex align-items-center gap-3">
                <div 
                  className="d-flex align-items-center justify-content-center rounded-circle"
                  style={{ width: '48px', height: '48px', background: '#e6f7f1' }}
                >
                  {prescription && getCartCount() === 0 ? (
                    <FileImage style={{ color: '#00B17B' }} size={24} />
                  ) : (
                    <ShoppingCart style={{ color: '#00B17B' }} size={24} />
                  )}
                </div>
                <div>
                  {prescription && getCartCount() === 0 ? (
                    <>
                      <p className="text-muted small mb-0">Ready to submit</p>
                      <p className="h5 fw-bold mb-0">Prescription uploaded</p>
                    </>
                  ) : (
                    <>
                      <p className="text-muted small mb-0">
                        {prescription ? 'Items + Prescription' : 'Items in cart'}
                      </p>
                      <p className="h5 fw-bold mb-0">
                        {getCartCount()} item{getCartCount() !== 1 ? 's' : ''}
                        {prescription && ' + Rx'}
                      </p>
                    </>
                  )}
                </div>
              </div>
              <button
                className="btn btn-lg w-100 w-md-auto fw-semibold d-flex align-items-center justify-content-center gap-2"
                style={{ background: '#00B17B', color: 'white', maxWidth: '300px' }}
                onClick={onNext}
              >
                {prescription && getCartCount() === 0 ? 'Continue with Prescription' : 'Continue to Cart'}
                <ShoppingCart size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
