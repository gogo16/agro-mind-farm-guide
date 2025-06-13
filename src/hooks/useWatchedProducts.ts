
import { useState, useEffect } from 'react';

export const useWatchedProducts = () => {
  const [watchedProducts, setWatchedProducts] = useState<string[]>([]);

  // Încarcă preferințele din localStorage
  useEffect(() => {
    const savedWatchedProducts = localStorage.getItem('watchedProducts');
    
    if (savedWatchedProducts) {
      setWatchedProducts(JSON.parse(savedWatchedProducts));
    } else {
      // Implicit să urmărească grâu și porumb
      setWatchedProducts(['wheat', 'corn']);
    }
  }, []);

  // Salvează preferințele în localStorage
  const saveWatchedProducts = (products: string[]) => {
    setWatchedProducts(products);
    localStorage.setItem('watchedProducts', JSON.stringify(products));
  };

  const toggleProductWatch = (productId: string) => {
    const newWatchedProducts = watchedProducts.includes(productId)
      ? watchedProducts.filter(id => id !== productId)
      : [...watchedProducts, productId];
    saveWatchedProducts(newWatchedProducts);
  };

  return {
    watchedProducts,
    toggleProductWatch
  };
};
