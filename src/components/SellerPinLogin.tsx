import { useState } from 'react';
import styles from './SellerPinLogin.module.css';

interface SellerPinLoginProps {
  onLogin: (pin: string) => void;
  loading: boolean;
  error: string | null;
}

export function SellerPinLogin({
  onLogin,
  loading,
  error,
}: SellerPinLoginProps) {
  const [pin, setPin] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim()) {
      onLogin(pin.trim());
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Enter Your PIN</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="password"
          inputMode="numeric"
          autoComplete="off"
          className={styles.input}
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="PIN"
          aria-label="Seller PIN"
          disabled={loading}
          autoFocus
        />
        {error && <div className={styles.error}>{error}</div>}
        <button
          type="submit"
          className={styles.submit}
          disabled={!pin.trim() || loading}
        >
          {loading ? 'Checking...' : 'Log In'}
        </button>
      </form>
    </div>
  );
}
