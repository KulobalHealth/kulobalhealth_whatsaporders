import { useState } from 'react';
import { CartProvider } from './context/CartContext';
import SearchPage from './components/SearchPage';
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';
import ConfirmationPage from './components/ConfirmationPage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('search');
  const [orderData, setOrderData] = useState(null);

  const renderPage = () => {
    switch (currentPage) {
      case 'search':
        return (
          <SearchPage
            onNext={() => setCurrentPage('cart')}
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
          setCurrentPage('search');
        }} />;
      default:
        return (
          <SearchPage
            onNext={() => setCurrentPage('cart')}
          />
        );
    }
  };

  return (
    <CartProvider>
      <div className="h-screen flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto">
          {renderPage()}
        </main>
      </div>
    </CartProvider>
  );
}

export default App;
