import type { Seller } from '../lib/types';
import styles from './SellerPicker.module.css';

interface SellerPickerProps {
  sellers: Seller[];
  onSelect: (sellerId: string) => void;
}

export function SellerPicker({ sellers, onSelect }: SellerPickerProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Select Your Seller</h2>
      <div className={styles.grid}>
        {sellers.map((seller) => (
          <button
            key={seller.id}
            type="button"
            className={styles.sellerButton}
            onClick={() => onSelect(seller.id)}
          >
            {seller.name}
          </button>
        ))}
      </div>
    </div>
  );
}
