import { useState, useEffect } from 'react';
import { User, Phone, Mail, MapPin, Home, Package, ArrowLeft, CheckCircle, Loader2, MessageCircle, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { storeService } from '../api';
import { STORE_USERNAME } from '../api/config';

const CheckoutPage = ({ onComplete, onBack }) => {
  const { cartItems, deliveryInfo, updateDeliveryInfo, getCartTotal, clearCart } = useCart();
  const [storeData, setStoreData] = useState(null);
  const [loadingStore, setLoadingStore] = useState(false);
  const [storeError, setStoreError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Fetch store data when pickup is selected
  useEffect(() => {
    const fetchStoreData = async () => {
      if (deliveryInfo.deliveryMethod === 'pickup') {
        try {
          setLoadingStore(true);
          setStoreError(null);
          const data = await storeService.getStore();
          // Handle response structure
          const store = data?.data || data;
          setStoreData(store);
        } catch (err) {
          console.error('Failed to fetch store data:', err);
          setStoreError('Failed to load store information');
        } finally {
          setLoadingStore(false);
        }
      }
    };

    fetchStoreData();
  }, [deliveryInfo.deliveryMethod]);
  
  const handleNext = async () => {
    try {
      setSubmitting(true);
      setSubmitError(null);

      // Debug: Log cart items to see what we have
      console.log('Cart items:', JSON.stringify(cartItems, null, 2));

      // Prepare order data matching the backend API schema
      const orderData = {
        username: STORE_USERNAME,
        deliveryAddress: '',
        personalData: {
          name: deliveryInfo.fullName,
          Location: deliveryInfo.deliveryMethod === 'delivery' ? 'Home Delivery' : 'Store Pickup',
          contactNumber: deliveryInfo.phone,
          email: deliveryInfo.email
        },
        attachment: '',
        imageOnly: false,
        orders: cartItems.map(item => ({
          drugId: item.drugId || item.uuid || String(item.id),
          quantity: item.quantity
        }))
      };

      console.log('Submitting order data:', JSON.stringify(orderData, null, 2));

      // Submit order via WhatsApp endpoint
      const response = await storeService.submitWhatsAppOrder(orderData);
      console.log('Order submitted successfully:', response);
      
      // Clear cart and proceed to confirmation with order data
      clearCart();
      onComplete(response?.data || response);
    } catch (error) {
      console.error('Failed to submit order:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      setSubmitError(error.message || 'Failed to submit order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid = () => {
    if (!deliveryInfo.fullName || !deliveryInfo.phone || !deliveryInfo.email) {
      return false;
    }
    return true;
  };

  return (
    <div className="min-vh-100 pb-4">
      <div className="container py-3 py-md-4" style={{ maxWidth: '800px' }}>
        {/* Progress Indicator */}
        <div className="mb-4">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <button className="btn btn-link text-muted d-flex align-items-center gap-2 p-0" onClick={onBack}>
              <ArrowLeft size={20} />
              <span className="d-none d-sm-inline">Back</span>
            </button>
            <span className="small text-muted">Step 3 of 3</span>
          </div>
          <div className="progress" style={{ height: '6px' }}>
            <div className="progress-bar" role="progressbar" style={{ width: '100%', background: '#00B17B' }}></div>
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
          <h1 className="h2 fw-bold mb-2" style={{ color: '#00B17B' }}>Delivery Details</h1>
          <p className="text-muted">Complete your order information</p>
        </div>

        {/* Main Content */}
        <div className="card border-0 mb-4" style={{ borderRadius: '0.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div className="card-body p-3 p-md-4">
            {/* Personal Information Section */}
            <div className="mb-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="p-2 rounded-3" style={{ background: '#e6f7f1' }}>
                  <User style={{ color: '#00B17B' }} size={24} />
                </div>
                <div>
                  <h5 className="fw-bold mb-0">Personal Information</h5>
                  <small className="text-muted">Your contact details</small>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small">Full Name <span className="text-danger">*</span></label>
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <User size={18} className="text-muted" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Kwabena Amoah"
                    value={deliveryInfo.fullName}
                    onChange={(e) => updateDeliveryInfo({ fullName: e.target.value })}
                  />
                </div>
              </div>

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label small">Phone Number <span className="text-danger">*</span></label>
                  <div className="input-group">
                    <span className="input-group-text bg-white">
                      <Phone size={18} className="text-muted" />
                    </span>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="+233 267 7890 123"
                      value={deliveryInfo.phone}
                      onChange={(e) => updateDeliveryInfo({ phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label small">Email Address <span className="text-danger">*</span></label>
                  <div className="input-group">
                    <span className="input-group-text bg-white">
                      <Mail size={18} className="text-muted" />
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="kwabena@kulobal.com"
                      value={deliveryInfo.email}
                      onChange={(e) => updateDeliveryInfo({ email: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <hr className="my-4" />

            {/* Delivery Method Section */}
            <div className="mb-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="p-2 rounded-3" style={{ background: '#e6f7f1' }}>
                  <Package style={{ color: '#00B17B' }} size={24} />
                </div>
                <div>
                  <h5 className="fw-bold mb-0">Delivery Method</h5>
                  <small className="text-muted">Choose how to receive your order</small>
                </div>
              </div>

              <div className="d-flex flex-column gap-2 mb-3">
                <div 
                  className={`card border ${deliveryInfo.deliveryMethod === 'delivery' ? 'border-success' : ''}`}
                  style={{ cursor: 'pointer', borderRadius: '0.5rem' }}
                  onClick={() => updateDeliveryInfo({ deliveryMethod: 'delivery' })}
                >
                  <div className="card-body p-3">
                    <div className="d-flex align-items-start gap-3">
                      <input 
                        type="radio" 
                        className="form-check-input mt-1" 
                        checked={deliveryInfo.deliveryMethod === 'delivery'} 
                        onChange={() => updateDeliveryInfo({ deliveryMethod: 'delivery' })}
                        style={{ accentColor: '#00B17B' }}
                      />
                      <div>
                        <div className="d-flex align-items-center gap-2 fw-semibold">
                          <Home size={18} />
                          Home Delivery
                        </div>
                        <small className="text-muted">Get your medications delivered to your doorstep (₵5.99)</small>
                      </div>
                    </div>
                  </div>
                </div>

                <div 
                  className={`card border ${deliveryInfo.deliveryMethod === 'pickup' ? 'border-success' : ''}`}
                  style={{ cursor: 'pointer', borderRadius: '0.5rem' }}
                  onClick={() => updateDeliveryInfo({ deliveryMethod: 'pickup' })}
                >
                  <div className="card-body p-3">
                    <div className="d-flex align-items-start gap-3">
                      <input 
                        type="radio" 
                        className="form-check-input mt-1" 
                        checked={deliveryInfo.deliveryMethod === 'pickup'} 
                        onChange={() => updateDeliveryInfo({ deliveryMethod: 'pickup' })}
                        style={{ accentColor: '#00B17B' }}
                      />
                      <div>
                        <div className="d-flex align-items-center gap-2 fw-semibold">
                          <Package size={18} />
                          Store Pickup
                        </div>
                        <small className="text-muted">Pick up your order from our pharmacy (Free)</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {deliveryInfo.deliveryMethod === 'pickup' && (
                <div className="card border-0" style={{ background: '#f0fdf4', borderRadius: '0.5rem' }}>
                  <div className="card-body p-3">
                    {loadingStore ? (
                      <div className="d-flex align-items-center gap-2">
                        <Loader2 size={20} style={{ color: '#00B17B', animation: 'spin 1s linear infinite' }} />
                        <span className="text-muted small">Loading store information...</span>
                        <style>{`
                          @keyframes spin {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
                          }
                        `}</style>
                      </div>
                    ) : storeError ? (
                      <p className="text-danger small mb-0">{storeError}</p>
                    ) : storeData ? (
                      <>
                        <h6 className="fw-semibold mb-2 d-flex align-items-center gap-2">
                          <CheckCircle style={{ color: '#00B17B' }} size={20} />
                          Pickup Location
                        </h6>
                        <p className="fw-medium mb-1">{storeData.StoreName || storeData.storeName || 'Pharmacy Store'}</p>
                        {storeData.address && (
                          <p className="small text-muted mb-1 d-flex align-items-center gap-2">
                            <MapPin size={14} />
                            {storeData.address}
                          </p>
                        )}
                        {(storeData.whatSapp || storeData.whatsapp || storeData.phone) && (
                          <p className="small mb-2 d-flex align-items-center gap-2">
                            <Phone size={14} style={{ color: '#00B17B' }} />
                            <span>{storeData.whatSapp || storeData.whatsapp || storeData.phone}</span>
                          </p>
                        )}
                        {(storeData.whatSapp || storeData.whatsapp) && (
                          <a 
                            href={`https://wa.me/${(storeData.whatSapp || storeData.whatsapp).replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm d-inline-flex align-items-center gap-2"
                            style={{ background: '#25D366', color: 'white', borderRadius: '0.5rem' }}
                          >
                            <MessageCircle size={16} />
                            Chat on WhatsApp
                          </a>
                        )}
                      </>
                    ) : (
                      <>
                        <h6 className="fw-semibold mb-2 d-flex align-items-center gap-2">
                          <CheckCircle style={{ color: '#00B17B' }} size={20} />
                          Pickup Location
                        </h6>
                        <p className="small text-muted mb-0">Store information will be displayed here</p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {submitError && (
              <div className="alert alert-danger d-flex align-items-center gap-2 mt-3" role="alert">
                <AlertCircle size={20} />
                <span>{submitError}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="d-flex flex-column flex-md-row gap-2 mt-4">
              <button
                className="btn btn-outline-secondary flex-fill py-2 d-flex align-items-center justify-content-center gap-2"
                onClick={onBack}
                disabled={submitting}
              >
                <ArrowLeft size={20} />
                Back to Cart
              </button>
              <button
                className="btn btn-lg flex-fill fw-semibold d-flex align-items-center justify-content-center gap-2"
                style={{ background: '#00B17B', color: 'white' }}
                onClick={handleNext}
                disabled={!isFormValid() || submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                    Submitting...
                  </>
                ) : (
                  <>
                    Complete Order
                    <CheckCircle size={20} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Order Total */}
        <div className="card border-0" style={{ background: '#f0fdf4', borderRadius: '0.75rem' }}>
          <div className="card-body p-3 p-md-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
              <div>
                <p className="text-muted small mb-0">Order Total</p>
                <p className="h3 fw-bold mb-0" style={{ color: '#00B17B' }}>
                  ₵{(getCartTotal() + (deliveryInfo.deliveryMethod === 'pickup' ? 0 : 5.99)).toFixed(2)}
                </p>
              </div>
              <div className="text-md-end">
                <p className="text-muted small mb-0">Payment on {deliveryInfo.deliveryMethod === 'pickup' ? 'Pickup' : 'Delivery'}</p>
                <p className="text-muted small mb-0">Cash, Card, or Digital Payment</p>
                <p className="text-muted small mb-0">All Payment will be instructed by the pharmacy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
