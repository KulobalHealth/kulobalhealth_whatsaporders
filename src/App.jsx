import { useState } from 'react';
import { CartProvider } from './context/CartContext';
import WelcomeScreen from './components/WelcomeScreen';
import ActionSelection from './components/ActionSelection';
import SearchPage from './components/SearchPage';
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';
import ConfirmationPage from './components/ConfirmationPage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('welcome');
  const [orderData, setOrderData] = useState(null);

  const renderPage = () => {
    switch (currentPage) {
      case 'welcome':
        return <WelcomeScreen onStart={() => setCurrentPage('action')} />;
      case 'action':
        return (
          <ActionSelection
            onSelectAction={(action) => {
              if (action === 'order') {
                setCurrentPage('search');
              } else {
                // For pharmacist, could open a modal or redirect
                alert('Pharmacist chat feature coming soon!');
              }
            }}
            onBack={() => setCurrentPage('welcome')}
          />
        );
      case 'search':
        return (
          <SearchPage
            onNext={() => setCurrentPage('cart')}
            onBack={() => setCurrentPage('action')}
          />
        );
      case 'cart':
        return (
          <CartPage
            onNext={() => setCurrentPage('checkout')}
            onBack={() => setCurrentPage('search')}
          />
        );
      case 'checkout':
        return (
          <CheckoutPage
            onComplete={(data) => {
              setOrderData(data);
              setCurrentPage('confirmation');
            }}
            onBack={() => setCurrentPage('cart')}
          />
        );
      case 'confirmation':
        return <ConfirmationPage orderData={orderData} onReset={() => {
          setOrderData(null);
          setCurrentPage('welcome');
        }} />;
      default:
        return <WelcomeScreen onStart={() => setCurrentPage('action')} />;
    }
  };

  return (
    <CartProvider>
      {renderPage()}
    </CartProvider>
  );
}

export default App;
