import { useState, useEffect } from 'react';
import { isSupabaseConfigured } from './lib/supabase';
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
      : (sellers[0]?.id ?? '');

  useEffect(() => {
    if (sellerId) {
      localStorage.setItem(SELLER_STORAGE_KEY, sellerId);
    }
  }, [sellerId]);

  const handleSellerChange = (id: string) => {
    setStoredSellerId(id);
    localStorage.setItem(SELLER_STORAGE_KEY, id);
  };

  if (!isSupabaseConfigured) {
    return (
      <div className={styles.app}>
        <header className={styles.header}>
          <h1 className={styles.title}>Merch Register</h1>
        </header>
        <main>
          <div className={styles.setup}>
            <h2>Setup Required</h2>
            <p>Supabase is not configured. To get started:</p>
            <ol>
              <li>Create a Supabase project at supabase.com</li>
              <li>
                Run the migration SQL from <code>supabase/migrations/</code>
              </li>
              <li>
                Copy <code>.env.example</code> to <code>.env</code> and fill in
                your credentials
              </li>
              <li>
                Run <code>npm run seed</code> to populate data
              </li>
              <li>Restart the dev server</li>
            </ol>
          </div>
        </main>
      </div>
    );
  }

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
