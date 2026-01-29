import { useState, useEffect } from 'react';
import { ArrowRight, Loader2, Pill, Heart, Bike, ShieldCheck, Sparkles } from 'lucide-react';
import { storeService } from '../api';

const WelcomeScreen = ({ onStart }) => {
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get current hour for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Fetch store data on mount
  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setLoading(true);
        const data = await storeService.getStore();
        setStoreData(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch store:', err);
        setError('Failed to load pharmacy information');
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, []);

  // Get store name from API data
  const storeName = storeData?.data?.StoreName || storeData?.StoreName || storeData?.data?.name || storeData?.name || 'Pharmacy';

  // Show loading state
  if (loading) {
    return (
      <div 
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{ background: 'linear-gradient(135deg, #00B17B 0%, #00d492 100%)' }}
      >
        <div className="text-center">
          <div 
            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
            style={{ 
              width: '80px', 
              height: '80px', 
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Loader2 size={40} color="white" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
          <p className="text-white mb-0 fw-medium">Loading...</p>
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-vh-100 d-flex flex-column"
      style={{ background: '#ffffff' }}
    >
      {/* Hero Section with Gradient */}
      <div 
        className="position-relative overflow-hidden"
        style={{ 
          background: 'linear-gradient(135deg, #00B17B 0%, #00c98a 50%, #00d492 100%)',
          borderRadius: '0 0 2.5rem 2.5rem',
          paddingTop: 'env(safe-area-inset-top)',
        }}
      >
        {/* Decorative circles */}
        <div 
          className="position-absolute"
          style={{ 
            width: '200px', 
            height: '200px', 
            borderRadius: '50%', 
            background: 'rgba(255,255,255,0.1)',
            top: '-50px',
            right: '-50px'
          }}
        />
        <div 
          className="position-absolute"
          style={{ 
            width: '150px', 
            height: '150px', 
            borderRadius: '50%', 
            background: 'rgba(255,255,255,0.08)',
            bottom: '20px',
            left: '-40px'
          }}
        />

        <div className="container px-4 py-5 position-relative" style={{ zIndex: 10 }}>
          {/* Pharmacy Logo/Icon */}
          <div className="text-center mb-4">
            {(storeData?.data?.logo || storeData?.logo) ? (
              <div 
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3 overflow-hidden"
                style={{ 
                  width: '90px', 
                  height: '90px', 
                  background: 'white',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
                }}
              >
                <img 
                  src={storeData?.data?.logo || storeData?.logo}
                  alt={storeName}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
            ) : (
              <div 
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}
              >
                <Pill size={40} color="white" strokeWidth={1.5} />
              </div>
            )}
          </div>

          {/* Pharmacy Name */}
          <div className="text-center text-white">
            <h1 
              className="fw-bold mb-2"
              style={{ 
                fontSize: 'clamp(1.75rem, 7vw, 2.5rem)',
                letterSpacing: '-0.5px'
              }}
            >
              {storeName}
            </h1>
            <p 
              className="mb-0 opacity-90"
              style={{ fontSize: 'clamp(0.9rem, 3.5vw, 1.1rem)' }}
            >
              Your trusted health partner
            </p>
          </div>

          {/* Greeting Card */}
          <div 
            className="mx-auto mt-4"
            style={{ maxWidth: '400px' }}
          >
            <div 
              className="rounded-4 p-4 text-center"
              style={{ 
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
            >
              <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                <Sparkles size={20} color="white" />
                <span className="text-white fw-medium">{getGreeting()}!</span>
              </div>
              <p className="text-white mb-0 opacity-90 small">
                Welcome to {storeName}. We're here to help with all your health needs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 px-3 py-4">
        <div className="container" style={{ maxWidth: '500px' }}>
          
          {/* Quick Features */}
          <div className="mb-4">
            <div className="d-flex gap-2 justify-content-center">
              <div 
                className="text-center p-3 rounded-4 flex-fill"
                style={{ background: '#f0fdf4', maxWidth: '120px' }}
              >
                <div 
                  className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2"
                  style={{ width: '44px', height: '44px', background: '#00B17B' }}
                >
                  <Pill size={20} color="white" />
                </div>
                <p className="mb-0 small fw-medium" style={{ color: '#1a1a2e', fontSize: '0.8rem' }}>Medicines</p>
              </div>
              <div 
                className="text-center p-3 rounded-4 flex-fill"
                style={{ background: '#fef3f2', maxWidth: '120px' }}
              >
                <div 
                  className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2"
                  style={{ width: '44px', height: '44px', background: '#ef4444' }}
                >
                  <Heart size={20} color="white" />
                </div>
                <p className="mb-0 small fw-medium" style={{ color: '#1a1a2e', fontSize: '0.8rem' }}>Healthcare</p>
              </div>
              <div 
                className="text-center p-3 rounded-4 flex-fill"
                style={{ background: '#eff6ff', maxWidth: '120px' }}
              >
                <div 
                  className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2"
                  style={{ width: '44px', height: '44px', background: '#3b82f6' }}
                >
                  <Bike size={20} color="white" />
                </div>
                <p className="mb-0 small fw-medium" style={{ color: '#1a1a2e', fontSize: '0.8rem' }}>Delivery</p>
              </div>
            </div>
          </div>

          {/* Trust Banner */}
          <div 
            className="d-flex align-items-center gap-3 p-3 rounded-4 mb-4"
            style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
          >
            <div 
              className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
              style={{ width: '44px', height: '44px', background: '#e0f7ef' }}
            >
              <ShieldCheck size={22} style={{ color: '#00B17B' }} />
            </div>
            <div>
              <p className="fw-semibold mb-0 small" style={{ color: '#1a1a2e' }}>100% Genuine Products</p>
              <p className="text-muted mb-0 small">All medicines are verified and authentic</p>
            </div>
          </div>

          {/* CTA Button */}
          <button
            className="btn w-100 py-3 fw-semibold d-flex align-items-center justify-content-center gap-2"
            style={{ 
              background: 'linear-gradient(135deg, #00B17B 0%, #00c98a 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '1rem',
              fontSize: '1.1rem',
              boxShadow: '0 4px 20px rgba(0, 177, 123, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onClick={onStart}
          >
            Get Started
            <ArrowRight size={22} />
          </button>

          {/* Footer text */}
          <p className="text-center text-muted small mt-3 mb-0">
            Order medicines and consult with pharmacists
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
