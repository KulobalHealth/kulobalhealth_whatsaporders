import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div 
      className="position-fixed bg-white shadow-lg p-3 p-md-4"
      style={{ 
        zIndex: 9999,
        bottom: 0,
        left: 0,
        right: 0,
        borderTop: '1px solid #e5e7eb'
      }}
    >
      <div className="container" style={{ maxWidth: '1200px' }}>
        <div className="d-flex flex-column align-items-center gap-3">
          <div className="text-center">
            <p className="mb-0 text-muted" style={{ fontSize: '14px' }}>
              🍪 We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
            </p>
          </div>
          <div className="d-flex gap-2 w-100 justify-content-center">
            <button
              onClick={handleDecline}
              className="btn btn-outline-secondary btn-sm px-4 flex-grow-1 flex-md-grow-0"
              style={{ maxWidth: '150px' }}
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="btn btn-sm px-4 flex-grow-1 flex-md-grow-0"
              style={{ background: '#00B17B', color: 'white', maxWidth: '150px' }}
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
