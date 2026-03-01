import { useState, useEffect } from 'react';
import { useSellers } from './hooks/useSellers';
import { SalesPage } from './pages/SalesPage';
import styles from './App.module.css';

const SELLER_STORAGE_KEY = 'merch-register-seller-id';

function App() {
  const { sellers, loading } = useSellers();
  const [sellerId, setSellerId] = useState<string>(() => {
    return localStorage.getItem(SELLER_STORAGE_KEY) ?? '';
  });

  useEffect(() => {
    if (sellerId) {
      localStorage.setItem(SELLER_STORAGE_KEY, sellerId);
    }
  }, [sellerId]);

  // Auto-select if only one seller or if stored seller still valid
  useEffect(() => {
    if (sellers.length > 0 && !sellers.find((s) => s.id === sellerId)) {
      setSellerId(sellers[0].id);
    }
  }, [sellers, sellerId]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (sellers.length === 0) {
    return <div className={styles.loading}>No sellers configured. Run the seed script first.</div>;
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
            onChange={(e) => setSellerId(e.target.value)}
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
