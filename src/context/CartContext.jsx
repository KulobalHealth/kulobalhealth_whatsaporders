import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [prescription, setPrescription] = useState(null);
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    deliveryMethod: 'delivery', // 'delivery' or 'pickup'
    notes: ''
  });

  const addToCart = (medication) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === medication.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === medication.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...medication, quantity: 1 }];
    });
  };

  const removeFromCart = (medicationId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== medicationId));
  };

  const updateQuantity = (medicationId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(medicationId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === medicationId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const updateDeliveryInfo = (info) => {
    setDeliveryInfo(prev => ({ ...prev, ...info }));
  };

  const setPrescriptionImage = (prescriptionData) => {
    setPrescription(prescriptionData);
  };

  const clearPrescription = () => {
    setPrescription(null);
  };

  const value = {
    cartItems,
    deliveryInfo,
    prescription,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    updateDeliveryInfo,
    setPrescriptionImage,
    clearPrescription
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
