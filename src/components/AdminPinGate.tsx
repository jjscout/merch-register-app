import { useState } from 'react';
import styles from './AdminPinGate.module.css';

interface AdminPinGateProps {
  correctPin: string;
  onUnlock: () => void;
}

export function AdminPinGate({ correctPin, onUnlock }: AdminPinGateProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === correctPin) {
      setError(null);
      onUnlock();
    } else {
      setError('Incorrect admin PIN');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Admin Access</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="password"
          inputMode="numeric"
          autoComplete="off"
          className={styles.input}
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="Admin PIN"
          aria-label="Admin PIN"
          autoFocus
        />
        {error && <div className={styles.error}>{error}</div>}
        <button type="submit" className={styles.submit} disabled={!pin.trim()}>
          Unlock
        </button>
      </form>
    </div>
  );
}
