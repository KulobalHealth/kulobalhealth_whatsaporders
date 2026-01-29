import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft, ArrowRight, Pill } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage = ({ onNext, onBack }) => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();

  const subtotal = getCartTotal();

  if (cartItems.length === 0) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center p-3">
        <div className="text-center" style={{ maxWidth: '400px' }}>
          <div 
            className="d-flex align-items-center justify-content-center rounded-circle mx-auto mb-4"
            style={{ width: '96px', height: '96px', background: '#f3f4f6' }}
          >
            <ShoppingBag size={48} className="text-muted" />
          </div>
          <h2 className="h3 fw-bold mb-2">Your cart is empty</h2>
          <p className="text-muted mb-4">Add some medications to get started</p>
          <button 
            className="btn btn-lg fw-semibold"
            style={{ background: '#00B17B', color: 'white' }}
            onClick={onBack}
          >
            Browse Medications
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 pb-4">
      <div className="container py-3 py-md-4" style={{ maxWidth: '1000px' }}>
        {/* Progress Indicator */}
        <div className="mb-4">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <button className="btn btn-link text-muted d-flex align-items-center gap-2 p-0" onClick={onBack}>
              <ArrowLeft size={20} />
              <span className="d-none d-sm-inline">Back</span>
            </button>
            <span className="small text-muted">Step 2 of 3</span>
          </div>
          <div className="progress" style={{ height: '6px' }}>
            <div className="progress-bar" role="progressbar" style={{ width: '66%', background: '#00B17B' }}></div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-4">
          <div 
            className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3 text-white"
            style={{ width: '56px', height: '56px', background: '#00B17B' }}
          >
            <ShoppingBag size={28} />
          </div>
          <h1 className="h2 fw-bold mb-2" style={{ color: '#00B17B' }}>Review Your Cart</h1>
          <p className="text-muted">Check your items and adjust quantities</p>
        </div>

        <div className="row g-4">
          {/* Cart Items */}
          <div className="col-12 col-lg-8">
            <div className="d-flex flex-column gap-3">
              {cartItems.map((item) => (
                <div key={item.id} className="card border-0" style={{ borderRadius: '0.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <div className="card-body p-3">
                    <div className="d-flex gap-3">
                      <div 
                        className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                        style={{ 
                          width: '64px', 
                          height: '64px', 
                          background: 'linear-gradient(135deg, #e0f7ef 0%, #c6f0e0 100%)',
                        }}
                      >
                        <Pill size={28} style={{ color: '#00B17B' }} />
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h6 className="fw-semibold mb-0">{item.name}</h6>
                            <small className="text-muted">{item.category}</small>
                          </div>
                          <button
                            className="btn btn-sm text-danger p-1"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-2">
                          <div className="d-flex align-items-center gap-2">
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              style={{ width: '32px', height: '32px', padding: 0 }}
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus size={14} />
                            </button>
                            <span className="fw-semibold" style={{ minWidth: '24px', textAlign: 'center' }}>{item.quantity}</span>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              style={{ width: '32px', height: '32px', padding: 0 }}
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <span className="fw-bold" style={{ color: '#00B17B' }}>
                            ₵{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                className="btn btn-link text-muted w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={onBack}
              >
                <ArrowLeft size={20} />
                Add More Items
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-12 col-lg-4">
            <div className="card border-0 sticky-lg-top" style={{ borderRadius: '0.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', top: '1rem' }}>
              <div className="card-body p-3 p-md-4">
                <h5 className="fw-bold mb-3">Order Summary</h5>
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Subtotal</span>
                    <span className="fw-semibold">₵{subtotal.toFixed(2)}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="d-flex justify-content-between">
                    <span className="fw-bold">Total</span>
                    <span className="fw-bold" style={{ color: '#00B17B' }}>₵{subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="card-footer bg-transparent border-0 p-3 p-md-4 pt-0">
                <button
                  className="btn btn-lg w-100 fw-semibold d-flex align-items-center justify-content-center gap-2"
                  style={{ background: '#00B17B', color: 'white' }}
                  onClick={onNext}
                >
                  Proceed to Delivery
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
