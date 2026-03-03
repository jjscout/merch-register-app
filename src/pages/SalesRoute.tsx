import { useState, useEffect } from 'react';
import { isSupabaseConfigured } from '../lib/supabase';
import { useActiveEvent } from '../hooks/useActiveEvent';
import { useSellerByPin } from '../hooks/useSellerByPin';
import { SalesPage } from './SalesPage';
import { SellerPinLogin } from '../components/SellerPinLogin';
import { NoActiveEvent } from '../components/NoActiveEvent';
import styles from './SalesRoute.module.css';

const SELLER_STORAGE_KEY = 'merch-register-seller-id';
const SELLER_NAME_KEY = 'merch-register-seller-name';

export function SalesRoute() {
  const {
    event: activeEvent,
    loading: eventLoading,
    error: eventError,
  } = useActiveEvent();
  const {
    lookupByPin,
    loading: pinLoading,
    error: pinError,
  } = useSellerByPin();

  const [sellerId, setSellerId] = useState<string>(() => {
    return localStorage.getItem(SELLER_STORAGE_KEY) ?? '';
  });
  const [sellerName, setSellerName] = useState<string>(() => {
    return localStorage.getItem(SELLER_NAME_KEY) ?? '';
  });

  useEffect(() => {
    if (sellerId) {
      localStorage.setItem(SELLER_STORAGE_KEY, sellerId);
      localStorage.setItem(SELLER_NAME_KEY, sellerName);
    } else {
      localStorage.removeItem(SELLER_STORAGE_KEY);
      localStorage.removeItem(SELLER_NAME_KEY);
    }
  }, [sellerId, sellerName]);

  const handlePinSubmit = async (pin: string) => {
    const seller = await lookupByPin(pin);
    if (seller) {
      setSellerId(seller.id);
      setSellerName(seller.name);
    }
  };

  const handleChangeSeller = () => {
    setSellerId('');
    setSellerName('');
  };

  if (!isSupabaseConfigured) {
    return (
      <div className={styles.setup}>
        <h2>Setup Required</h2>
        <p>Supabase is not configured. To get started:</p>
        <ol>
          <li>Create a Supabase project at supabase.com</li>
          <li>
            Run the migration SQL from <code>supabase/migrations/</code>
          </li>
          <li>
            Copy <code>.env.example</code> to <code>.env</code> and fill in your
            credentials
          </li>
          <li>
            Run <code>npm run seed</code> to populate data
          </li>
          <li>Restart the dev server</li>
        </ol>
      </div>
    );
  }

  if (eventLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!activeEvent) {
    return <NoActiveEvent error={eventError} />;
  }

  if (!sellerId) {
    return (
      <SellerPinLogin
        onLogin={handlePinSubmit}
        loading={pinLoading}
        error={pinError}
      />
    );
  }

  return (
    <div>
      <div className={styles.sellerBar}>
        <span className={styles.sellerName}>{sellerName}</span>
        <span className={styles.eventName}>{activeEvent.name}</span>
        <button
          type="button"
          className={styles.changeSeller}
          onClick={handleChangeSeller}
        >
          Change Seller
        </button>
      </div>
      <SalesPage key={sellerId} sellerId={sellerId} eventId={activeEvent.id} />
    </div>
  );
}
