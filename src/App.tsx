import { useState, useEffect } from 'react';
import { useSellers } from './hooks/useSellers';
import { SalesPage } from './pages/SalesPage';
import styles from './App.module.css';

const SELLER_STORAGE_KEY = 'merch-register-seller-id';

function App() {
  const { sellers, loading } = useSellers();
  const [storedSellerId, setStoredSellerId] = useState<string>(() => {
    return localStorage.getItem(SELLER_STORAGE_KEY) ?? '';
  });

  // Derive the effective seller ID: use stored if valid, otherwise first seller
  const sellerId =
    sellers.length > 0 && sellers.find((s) => s.id === storedSellerId)
      ? storedSellerId
      : sellers[0]?.id ?? '';

  useEffect(() => {
    if (sellerId) {
      localStorage.setItem(SELLER_STORAGE_KEY, sellerId);
    }
  }, [sellerId]);

  const handleSellerChange = (id: string) => {
    setStoredSellerId(id);
    localStorage.setItem(SELLER_STORAGE_KEY, id);
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (sellers.length === 0) {
    return (
      <div className={styles.loading}>
        No sellers configured. Run the seed script first.
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Merch Register</h1>
        <div className={styles.sellerPicker}>
          <label htmlFor="seller-select">Seller:</label>
          <select
            id="seller-select"
            value={sellerId}
            onChange={(e) => handleSellerChange(e.target.value)}
          >
            {sellers.map((seller) => (
              <option key={seller.id} value={seller.id}>
                {seller.name}
              </option>
            ))}
          </select>
        </div>
      </header>
      <main>
        <SalesPage sellerId={sellerId} />
      </main>
    </div>
  );
}

export default App;
