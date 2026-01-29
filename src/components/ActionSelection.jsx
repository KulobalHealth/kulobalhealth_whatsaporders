import { ShoppingBag, MessageCircle, ArrowRight, Phone, Clock, Headphones, ChevronLeft, Sparkles, Shield } from 'lucide-react';

const ActionSelection = ({ onSelectAction, onBack }) => {
  return (
    <div 
      className="min-vh-100 d-flex flex-column"
      style={{ 
        background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 50%, #f8f9fa 100%)',
      }}
    >
      {/* Top Navigation */}
      <div className="p-3 pt-4">
        <button 
          className="btn btn-light rounded-circle d-flex align-items-center justify-content-center shadow-sm"
          style={{ width: '44px', height: '44px' }}
          onClick={onBack}
        >
          <ChevronLeft size={22} style={{ color: '#00B17B' }} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column justify-content-center px-3 px-md-4 pb-4" style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        
        {/* Header with Icon */}
        <div className="text-center mb-4">
          <div 
            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3 shadow-sm"
            style={{ 
              width: '70px', 
              height: '70px', 
              background: 'linear-gradient(135deg, #00B17B 0%, #00d492 100%)',
            }}
          >
            <Sparkles size={32} color="white" />
          </div>
          <h1 
            className="fw-bold mb-2" 
            style={{ 
              fontSize: 'clamp(1.5rem, 6vw, 2rem)',
              color: '#1a1a2e'
            }}
          >
            How can we help you?
          </h1>
          <p className="text-muted mb-0" style={{ fontSize: 'clamp(0.9rem, 3.5vw, 1rem)' }}>
            Select an option below to continue
          </p>
        </div>

        {/* Action Cards */}
        <div className="d-flex flex-column gap-3 mb-4">
          
          {/* Place Order Card */}
          <div 
            className="card border-0 overflow-hidden"
            style={{ 
              borderRadius: '1.25rem',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 4px 20px rgba(0, 177, 123, 0.15)',
            }}
            onClick={() => onSelectAction('order')}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.01)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 177, 123, 0.25)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 177, 123, 0.15)';
            }}
            onTouchStart={(e) => {
              e.currentTarget.style.transform = 'scale(0.98)';
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <div 
              className="card-body p-4"
              style={{ 
                background: 'linear-gradient(135deg, #00B17B 0%, #00c98a 50%, #00d492 100%)',
              }}
            >
              <div className="d-flex align-items-center gap-3">
                <div 
                  className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                  style={{ 
                    width: '60px', 
                    height: '60px', 
                    background: 'rgba(255, 255, 255, 0.25)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <ShoppingBag size={28} color="white" strokeWidth={2} />
                </div>
                <div className="flex-grow-1">
                  <h2 className="h5 fw-bold text-white mb-1">Place an Order</h2>
                  <p className="text-white mb-0 small" style={{ opacity: 0.9 }}>
                    Search medications or upload prescription
                  </p>
                </div>
                <div 
                  className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                  style={{ 
                    width: '40px', 
                    height: '40px', 
                    background: 'rgba(255, 255, 255, 0.3)',
                  }}
                >
                  <ArrowRight size={20} color="white" />
                </div>
              </div>
              
              {/* Quick benefits */}
              <div className="d-flex gap-3 mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                <span className="badge d-flex align-items-center gap-1" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 500 }}>
                  <Shield size={12} /> Verified Products
                </span>
                <span className="badge d-flex align-items-center gap-1" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 500 }}>
                  <Clock size={12} /> Fast Delivery
                </span>
              </div>
            </div>
          </div>

          {/* Talk to Pharmacist Card */}
          <div 
            className="card border-0 overflow-hidden"
            style={{ 
              borderRadius: '1.25rem',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              background: 'white',
            }}
            onClick={() => onSelectAction('pharmacist')}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.01)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.12)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
            }}
            onTouchStart={(e) => {
              e.currentTarget.style.transform = 'scale(0.98)';
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-3">
                <div 
                  className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                  style={{ 
                    width: '60px', 
                    height: '60px', 
                    background: 'linear-gradient(135deg, #e0f7ef 0%, #c6f0e0 100%)',
                  }}
                >
                  <Headphones size={28} style={{ color: '#00B17B' }} strokeWidth={2} />
                </div>
                <div className="flex-grow-1">
                  <h2 className="h5 fw-bold mb-1" style={{ color: '#1a1a2e' }}>Talk to a Pharmacist</h2>
                  <p className="text-muted mb-0 small">
                    Get expert advice on your medications
                  </p>
                </div>
                <div 
                  className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                  style={{ 
                    width: '40px', 
                    height: '40px', 
                    background: '#f0fdf4',
                  }}
                >
                  <ArrowRight size={20} style={{ color: '#00B17B' }} />
                </div>
              </div>
              
              {/* Online indicator */}
              <div className="d-flex align-items-center gap-2 mt-3 pt-3" style={{ borderTop: '1px solid #e9ecef' }}>
                <span 
                  className="d-inline-block rounded-circle"
                  style={{ 
                    width: '10px', 
                    height: '10px', 
                    background: '#22c55e',
                    boxShadow: '0 0 8px rgba(34, 197, 94, 0.5)',
                    animation: 'pulse 2s infinite',
                  }}
                ></span>
                <span className="small text-muted">Pharmacists available now</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info Card */}
        <div 
          className="card border-0"
          style={{ 
            background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)',
            borderRadius: '1rem',
          }}
        >
          <div className="card-body p-3">
            <div className="row g-3">
              <div className="col-6">
                <div 
                  className="d-flex flex-column align-items-center text-center p-2 rounded-3"
                  style={{ background: 'white' }}
                >
                  <div 
                    className="d-flex align-items-center justify-content-center rounded-circle mb-2"
                    style={{ width: '40px', height: '40px', background: '#e0f7ef' }}
                  >
                    <Phone size={18} style={{ color: '#00B17B' }} />
                  </div>
                  <p className="small text-muted mb-0">Call us</p>
                  <p className="fw-semibold mb-0 small">1-800-PHARMA</p>
                </div>
              </div>
              <div className="col-6">
                <div 
                  className="d-flex flex-column align-items-center text-center p-2 rounded-3"
                  style={{ background: 'white' }}
                >
                  <div 
                    className="d-flex align-items-center justify-content-center rounded-circle mb-2"
                    style={{ width: '40px', height: '40px', background: '#e0f7ef' }}
                  >
                    <Clock size={18} style={{ color: '#00B17B' }} />
                  </div>
                  <p className="small text-muted mb-0">Open hours</p>
                  <p className="fw-semibold mb-0 small">9AM - 8PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pulse animation for online indicator */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default ActionSelection;
