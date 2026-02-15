import { CheckCircle, Home, Package, Phone, Mail, MapPin, Calendar, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ConfirmationPage = ({ orderData, onReset }) => {
  const { deliveryInfo, clearCart } = useCart();

  const handleNewOrder = () => {
    clearCart();
    onReset();
  };

  // Get order details from API response
  const orderNumber = orderData?.orderNumber || 'N/A';
  const totalCost = orderData?.amountPayable || orderData?.totalCost || 0;
  const orderItems = orderData?.orders || [];
  const customerName = orderData?.personalData?.name || deliveryInfo.fullName;
  const customerPhone = orderData?.personalData?.contactNumber || deliveryInfo.phone;
  const customerEmail = orderData?.personalData?.email || deliveryInfo.email;
  const deliveryMethod = orderData?.personalData?.Location || deliveryInfo.deliveryMethod;
  
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + (deliveryMethod === 'Store Pickup' ? 1 : 3));

  return (
    <div className="h-100 d-flex align-items-center justify-content-center p-3 p-md-4">
      <div className="container" style={{ maxWidth: '700px' }}>
        {/* Success Icon */}
        <div className="text-center mb-4">
          <div 
            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
            style={{ width: '80px', height: '80px', background: '#dcfce7' }}
          >
            <CheckCircle style={{ color: '#00B17B' }} size={48} />
          </div>
          <h1 className="display-5 fw-bold mb-2" style={{ color: '#00B17B' }}>
            Order Confirmed!
          </h1>
          <p className="h5 text-muted">Thank you, {customerName}!</p>
          <p className="text-muted small">Your order has been successfully placed</p>
        </div>

        {/* Order Number Card */}
        <div 
          className="card text-white text-center mb-4 border-0"
          style={{ background: '#00B17B', borderRadius: '1rem' }}
        >
          <div className="card-body p-4">
            <p className="small opacity-75 mb-1">Order Number</p>
            <p className="display-6 fw-bold mb-1">{orderNumber}</p>
            <p className="small opacity-75 mb-0">Keep this number for tracking your order</p>
          </div>
        </div>

        {/* Order Details */}
        <div className="card border-0 mb-4" style={{ borderRadius: '0.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div className="card-body p-3 p-md-4">
            <h5 className="fw-bold mb-4">Order Details</h5>
            
            {/* Delivery Info */}
            <div className="p-3 rounded-3 mb-4" style={{ background: '#f0fdf4' }}>
              <div className="d-flex gap-3">
                {deliveryMethod === 'Home Delivery' ? (
                  <Home style={{ color: '#00B17B' }} size={24} className="flex-shrink-0 mt-1" />
                ) : (
                  <Package style={{ color: '#00B17B' }} size={24} className="flex-shrink-0 mt-1" />
                )}
                <div className="flex-grow-1">
                  <h6 className="fw-semibold mb-2">
                    {deliveryMethod === 'Home Delivery' ? 'Home Delivery' : 'Store Pickup'}
                  </h6>
                  {deliveryMethod === 'Home Delivery' ? (
                    <div className="small text-muted">
                      <p className="d-flex align-items-center gap-2 mb-1">
                        <Calendar size={14} />
                        Estimated delivery: {estimatedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                      </p>
                      <p className="mb-0">The pharmacy will contact you via WhatsApp for delivery details</p>
                    </div>
                  ) : (
                    <div className="small text-muted">
                      <p className="d-flex align-items-center gap-2 mb-0 fw-semibold" style={{ color: '#00B17B' }}>
                        <Clock size={14} />
                        Ready for pickup - we'll notify you via WhatsApp
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="row g-3 mb-4">
              <div className="col-6">
                <div className="p-3 rounded-3" style={{ background: '#f3f4f6' }}>
                  <div className="d-flex align-items-center gap-2 text-muted small mb-1">
                    <Phone size={14} />
                    <span>Phone</span>
                  </div>
                  <p className="fw-semibold mb-0 small">{customerPhone}</p>
                </div>
              </div>
              <div className="col-6">
                <div className="p-3 rounded-3" style={{ background: '#f3f4f6' }}>
                  <div className="d-flex align-items-center gap-2 text-muted small mb-1">
                    <Mail size={14} />
                    <span>Email</span>
                  </div>
                  <p className="fw-semibold mb-0 small text-truncate">{customerEmail}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h6 className="fw-semibold mb-3">Items Ordered ({orderData?.numberOfItems || orderItems.length})</h6>
              <div className="d-flex flex-column gap-2 mb-3">
                {orderItems.map((item, index) => (
                  <div key={item._id || index} className="d-flex justify-content-between align-items-center p-2 rounded" style={{ background: '#f3f4f6' }}>
                    <div>
                      <p className="fw-medium mb-0 small text-capitalize">{item.drugName || item.drug_name}</p>
                      <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>
                        {item.brand_name} • Qty: {item.quantity} × ₵{item.unitPrice}
                      </p>
                    </div>
                    <span className="fw-semibold small">₵{item.totalPrice?.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-top pt-3">
                {orderData?.discount > 0 && (
                  <div className="d-flex justify-content-between text-success small mb-1">
                    <span>Discount</span>
                    <span>-₵{orderData.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between h5 fw-bold">
                  <span>Total</span>
                  <span style={{ color: '#00B17B' }}>
                    ₵{totalCost.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="card border-0 mb-4" style={{ background: '#f0fdf4', borderRadius: '0.75rem' }}>
          <div className="card-body p-3 p-md-4">
            <h6 className="fw-semibold mb-3 d-flex align-items-center gap-2">
              <CheckCircle style={{ color: '#00B17B' }} size={20} />
              What's Next?
            </h6>
            {deliveryMethod === 'Home Delivery' ? (
              <ul className="list-unstyled small text-muted mb-0">
                <li className="d-flex gap-2 mb-2">
                  <span style={{ color: '#00B17B' }}>1.</span>
                  <span>The pharmacy will contact you via WhatsApp</span>
                </li>
                <li className="d-flex gap-2 mb-2">
                  <span style={{ color: '#00B17B' }}>2.</span>
                  <span>Confirm delivery details and payment method</span>
                </li>
                <li className="d-flex gap-2 mb-0">
                  <span style={{ color: '#00B17B' }}>3.</span>
                  <span>Receive your medications at your doorstep</span>
                </li>
              </ul>
            ) : (
              <ul className="list-unstyled small text-muted mb-0">
                <li className="d-flex gap-2 mb-2">
                  <span style={{ color: '#00B17B' }}>1.</span>
                  <span>The pharmacy will notify you when your order is ready</span>
                </li>
                <li className="d-flex gap-2 mb-2">
                  <span style={{ color: '#00B17B' }}>2.</span>
                  <span>Visit the pharmacy with your order number</span>
                </li>
                <li className="d-flex gap-2 mb-0">
                  <span style={{ color: '#00B17B' }}>3.</span>
                  <span>Complete payment and collect your medications</span>
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="d-flex flex-column flex-sm-row gap-2">
          <button
            className="btn btn-lg flex-fill fw-semibold"
            style={{ background: '#00B17B', color: 'white' }}
            onClick={handleNewOrder}
          >
            Place Another Order
          </button>
          <button
            className="btn btn-lg btn-outline-secondary flex-fill fw-semibold"
          >
            Track Order
          </button>
        </div>

        <p className="text-center text-muted small mt-4">
          Need help? Contact us at 1-800-PHARMACY
        </p>
      </div>
    </div>
  );
};

export default ConfirmationPage;
