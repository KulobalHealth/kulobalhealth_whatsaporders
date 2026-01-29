import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Upload, ShoppingCart, Package, ArrowLeft, Plus, Check, Pill, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { storeService } from '../api';

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const SearchPage = ({ onNext, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const { addToCart, getCartCount, cartItems } = useCart();

  // Debounce search query (300ms delay)
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Search inventory when debounced query changes
  useEffect(() => {
    const searchInventory = async () => {
      if (!debouncedSearchQuery.trim()) {
        setSearchResults([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await storeService.searchInventory(debouncedSearchQuery);
        
        // Debug: Log the full API response to see structure
        console.log('API Response:', JSON.stringify(data, null, 2));
        
        // Handle different API response structures
        let items = [];
        
        // Try various possible data paths
        if (data?.data?.data?.inventory) {
          items = data.data.data.inventory;
        } else if (data?.data?.inventory) {
          items = data.data.inventory;
        } else if (data?.data?.products) {
          items = data.data.products;
        } else if (data?.data?.items) {
          items = data.data.items;
        } else if (data?.inventory) {
          items = data.inventory;
        } else if (data?.products) {
          items = data.products;
        } else if (data?.items) {
          items = data.items;
        } else if (data?.data && Array.isArray(data.data)) {
          items = data.data;
        } else if (Array.isArray(data)) {
          items = data;
        }
        
        console.log('Extracted items:', items);
        
        setSearchResults(Array.isArray(items) ? items.slice(0, 10) : []);
        setError(null);
      } catch (err) {
        console.error('Failed to search inventory:', err);
        setError('Failed to search products');
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    searchInventory();
  }, [debouncedSearchQuery]);

  // Use search results directly (server-side filtering)
  const filteredMedications = searchResults;

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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        setSearchQuery('Paracetamol');
        setIsDropdownOpen(true);
      };
      reader.readAsDataURL(file);
    }
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
    <div className="min-vh-100 pb-5" style={{ paddingBottom: getCartCount() > 0 ? '120px' : '2rem' }}>
      <div className="container py-3 py-md-4" style={{ maxWidth: '1200px' }}>
        {/* Progress Indicator */}
        <div className="mb-4">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <button className="btn btn-link text-muted d-flex align-items-center gap-2 p-0" onClick={onBack}>
              <ArrowLeft size={20} />
              <span className="d-none d-sm-inline">Back</span>
            </button>
            <span className="small text-muted">Step 1 of 3</span>
          </div>
          <div className="progress" style={{ height: '6px' }}>
            <div className="progress-bar" role="progressbar" style={{ width: '33%', background: '#00B17B' }}></div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-4">
          <div 
            className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3 text-white"
            style={{ width: '56px', height: '56px', background: '#00B17B' }}
          >
            <Package size={28} />
          </div>
          <h1 className="h2 fw-bold mb-2" style={{ color: '#00B17B' }}>Browse Products</h1>
          <p className="text-muted">Search for medications or upload your prescription</p>
        </div>

        {/* Search and Upload Section */}
        <div className="mb-4">
          <div className="row g-2 g-md-3">
            <div className="col-12 col-md" ref={searchRef}>
              <div className="position-relative">
                <div className="input-group input-group-lg">
                  <span className="input-group-text bg-white border-end-0">
                    <Search className="text-muted" size={20} />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search for medications..."
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
                    {loading ? (
                      <div className="p-4 text-center">
                        <Loader2 size={24} style={{ color: '#00B17B', animation: 'spin 1s linear infinite' }} />
                        <p className="text-muted small mb-0 mt-2">Loading products...</p>
                        <style>{`
                          @keyframes spin {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
                          }
                        `}</style>
                      </div>
                    ) : filteredMedications.length > 0 ? (
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
            <div className="col-12 col-md-auto">
              <label htmlFor="image-upload" className="w-100">
                <div 
                  className="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2 w-100 py-2"
                  style={{ borderColor: '#00B17B', color: '#00B17B', height: '48px' }}
                >
                  <Upload size={20} />
                  Upload Photo
                </div>
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="d-none"
              />
            </div>
          </div>

          {uploadedImage && (
            <div className="card mt-3">
              <div className="card-body p-3">
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={uploadedImage}
                    alt="Uploaded prescription"
                    className="rounded"
                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                  />
                  <div>
                    <p className="fw-semibold mb-1">Image uploaded successfully</p>
                    <p className="text-muted small mb-0">Analyzing medication...</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cart Summary Footer */}
      {getCartCount() > 0 && (
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
                  <ShoppingCart style={{ color: '#00B17B' }} size={24} />
                </div>
                <div>
                  <p className="text-muted small mb-0">Items in cart</p>
                  <p className="h5 fw-bold mb-0">{getCartCount()} item{getCartCount() !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <button
                className="btn btn-lg w-100 w-md-auto fw-semibold d-flex align-items-center justify-content-center gap-2"
                style={{ background: '#00B17B', color: 'white', maxWidth: '300px' }}
                onClick={onNext}
              >
                Continue to Cart
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
