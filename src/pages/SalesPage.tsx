import { useReducer } from 'react';
import type { Product, PaymentMethod } from '../lib/types';
import { useCategories } from '../hooks/useCategories';
import { useProducts } from '../hooks/useProducts';
import { useRecordSale } from '../hooks/useRecordSale';
import { BreadcrumbNav } from '../components/BreadcrumbNav';
import { CategoryGrid } from '../components/CategoryGrid';
import { SaleForm } from '../components/SaleForm';
import { SaleConfirmation } from '../components/SaleConfirmation';
import styles from './SalesPage.module.css';

type PathSegment = { id: string | null; name: string };

type State =
  | { phase: 'BROWSING'; path: PathSegment[]; currentCategoryId: string | null }
  | { phase: 'SALE_FORM'; path: PathSegment[]; currentCategoryId: string; product: Product }
  | {
      phase: 'CONFIRMED';
      productName: string;
      quantity: number;
      totalCents: number;
      paymentMethod: PaymentMethod;
    };

type Action =
  | { type: 'DRILL_DOWN'; categoryId: string; categoryName: string }
  | { type: 'NAVIGATE_TO'; categoryId: string | null }
  | { type: 'SELECT_PRODUCT'; product: Product }
  | { type: 'CANCEL_SALE' }
  | {
      type: 'SALE_COMPLETE';
      productName: string;
      quantity: number;
      totalCents: number;
      paymentMethod: PaymentMethod;
    }
  | { type: 'DONE' };

const initialState: State = {
  phase: 'BROWSING',
  path: [{ id: null, name: 'Home' }],
  currentCategoryId: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'DRILL_DOWN': {
      if (state.phase !== 'BROWSING') return state;
      return {
        phase: 'BROWSING',
        path: [...state.path, { id: action.categoryId, name: action.categoryName }],
        currentCategoryId: action.categoryId,
      };
    }
    case 'NAVIGATE_TO': {
      if (state.phase !== 'BROWSING') return state;
      const targetIndex = state.path.findIndex((s) => s.id === action.categoryId);
      if (targetIndex === -1) return state;
      return {
        phase: 'BROWSING',
        path: state.path.slice(0, targetIndex + 1),
        currentCategoryId: action.categoryId,
      };
    }
    case 'SELECT_PRODUCT': {
      if (state.phase !== 'BROWSING') return state;
      return {
        phase: 'SALE_FORM',
        path: state.path,
        currentCategoryId: state.currentCategoryId!,
        product: action.product,
      };
    }
    case 'CANCEL_SALE': {
      if (state.phase !== 'SALE_FORM') return state;
      return {
        phase: 'BROWSING',
        path: state.path,
        currentCategoryId: state.currentCategoryId,
      };
    }
    case 'SALE_COMPLETE':
      return {
        phase: 'CONFIRMED',
        productName: action.productName,
        quantity: action.quantity,
        totalCents: action.totalCents,
        paymentMethod: action.paymentMethod,
      };
    case 'DONE':
      return initialState;
    default:
      return state;
  }
}

interface SalesPageProps {
  sellerId: string;
}

export function SalesPage({ sellerId }: SalesPageProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const currentCategoryId =
    state.phase === 'BROWSING' || state.phase === 'SALE_FORM'
      ? state.currentCategoryId
      : null;
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories(state.phase === 'BROWSING' ? currentCategoryId : null);
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useProducts(state.phase === 'BROWSING' ? currentCategoryId : null);
  const {
    recordSale,
    loading: recordingLoading,
    error: recordError,
  } = useRecordSale();

  const dataLoading = categoriesLoading || productsLoading;
  const dataError = categoriesError || productsError || recordError;

  const handleSubmitSale = async (data: {
    quantity: number;
    paymentMethod: PaymentMethod;
  }) => {
    if (state.phase !== 'SALE_FORM') return;

    const sale = await recordSale({
      product_id: state.product.id,
      seller_id: sellerId,
      quantity: data.quantity,
      unit_price_cents: state.product.price_cents,
      payment_method: data.paymentMethod,
      sold_at: new Date().toISOString(),
    });

    if (sale) {
      dispatch({
        type: 'SALE_COMPLETE',
        productName: state.product.name,
        quantity: data.quantity,
        totalCents: data.quantity * state.product.price_cents,
        paymentMethod: data.paymentMethod,
      });
    }
  };

  if (state.phase === 'CONFIRMED') {
    return (
      <div className={styles.page}>
        <SaleConfirmation
          productName={state.productName}
          quantity={state.quantity}
          totalCents={state.totalCents}
          paymentMethod={state.paymentMethod}
          onDone={() => dispatch({ type: 'DONE' })}
        />
      </div>
    );
  }

  if (state.phase === 'SALE_FORM') {
    return (
      <div className={styles.page}>
        {recordError && <div className={styles.error}>{recordError}</div>}
        <BreadcrumbNav path={state.path} onNavigate={() => dispatch({ type: 'CANCEL_SALE' })} />
        <SaleForm
          product={state.product}
          onSubmit={handleSubmitSale}
          onCancel={() => dispatch({ type: 'CANCEL_SALE' })}
          loading={recordingLoading}
        />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {dataError && <div className={styles.error}>{dataError}</div>}
      <BreadcrumbNav
        path={state.path}
        onNavigate={(categoryId) => dispatch({ type: 'NAVIGATE_TO', categoryId })}
      />
      {dataLoading ? (
        <div className={styles.loading}>Loading...</div>
      ) : (
        <CategoryGrid
          categories={categories}
          products={products}
          onSelectCategory={(categoryId) => {
            const cat = categories.find((c) => c.id === categoryId);
            if (cat) {
              dispatch({ type: 'DRILL_DOWN', categoryId, categoryName: cat.name });
            }
          }}
          onSelectProduct={(product) => dispatch({ type: 'SELECT_PRODUCT', product })}
        />
      )}
    </div>
  );
}
