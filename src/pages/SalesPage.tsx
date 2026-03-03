import { useReducer } from 'react';
import type { Product, CartItem, PaymentMethod } from '../lib/types';
import { cartTotalCents } from '../lib/format';
import { useCategories } from '../hooks/useCategories';
import { useProducts } from '../hooks/useProducts';
import { useRecordCart } from '../hooks/useRecordCart';
import { BreadcrumbNav } from '../components/BreadcrumbNav';
import { CategoryGrid } from '../components/CategoryGrid';
import { ProductPicker } from '../components/ProductPicker';
import { CartBar } from '../components/CartBar';
import { CartReview } from '../components/CartReview';
import { CartCheckout } from '../components/CartCheckout';
import { SaleConfirmation } from '../components/SaleConfirmation';
import styles from './SalesPage.module.css';

function cartItemKey(item: CartItem): string {
  return `${item.product_id}::${item.product_variant_id ?? ''}`;
}

type PathSegment = { id: string | null; name: string };

type State =
  | {
      phase: 'BROWSING';
      path: PathSegment[];
      currentCategoryId: string | null;
      cart: CartItem[];
      selectedProduct: Product | null;
    }
  | {
      phase: 'CART_REVIEW';
      path: PathSegment[];
      currentCategoryId: string | null;
      cart: CartItem[];
    }
  | {
      phase: 'CHECKOUT';
      path: PathSegment[];
      currentCategoryId: string | null;
      cart: CartItem[];
    }
  | {
      phase: 'CONFIRMED';
      items: CartItem[];
      totalCents: number;
      paymentMethod: PaymentMethod;
    };

type Action =
  | { type: 'DRILL_DOWN'; categoryId: string; categoryName: string }
  | { type: 'NAVIGATE_TO'; categoryId: string | null }
  | { type: 'SELECT_PRODUCT'; product: Product }
  | { type: 'DISMISS_PICKER' }
  | {
      type: 'ADD_TO_CART';
      product: Product;
      quantity: number;
      variantId?: string | null;
      variantDisplayName?: string | null;
      variantPriceCents?: number | null;
    }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | {
      type: 'UPDATE_CART_ITEM';
      productId: string;
      variantId?: string | null;
      quantity: number;
    }
  | {
      type: 'REMOVE_CART_ITEM';
      productId: string;
      variantId?: string | null;
    }
  | { type: 'PROCEED_TO_CHECKOUT' }
  | { type: 'BACK_TO_CART' }
  | { type: 'CHECKOUT_COMPLETE'; paymentMethod: PaymentMethod }
  | { type: 'DONE' };

const initialState: State = {
  phase: 'BROWSING',
  path: [{ id: null, name: 'Home' }],
  currentCategoryId: null,
  cart: [],
  selectedProduct: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'DRILL_DOWN': {
      if (state.phase !== 'BROWSING') return state;
      return {
        ...state,
        path: [
          ...state.path,
          { id: action.categoryId, name: action.categoryName },
        ],
        currentCategoryId: action.categoryId,
        selectedProduct: null,
      };
    }
    case 'NAVIGATE_TO': {
      if (state.phase !== 'BROWSING' && state.phase !== 'CART_REVIEW')
        return state;
      const targetIndex = state.path.findIndex(
        (s) => s.id === action.categoryId,
      );
      if (targetIndex === -1) return state;
      return {
        phase: 'BROWSING',
        path: state.path.slice(0, targetIndex + 1),
        currentCategoryId: action.categoryId,
        cart: state.cart,
        selectedProduct: null,
      };
    }
    case 'SELECT_PRODUCT': {
      if (state.phase !== 'BROWSING') return state;
      return { ...state, selectedProduct: action.product };
    }
    case 'DISMISS_PICKER': {
      if (state.phase !== 'BROWSING') return state;
      return { ...state, selectedProduct: null };
    }
    case 'ADD_TO_CART': {
      if (state.phase !== 'BROWSING') return state;
      const variantId = action.variantId ?? null;
      const newItem: CartItem = {
        product_id: action.product.id,
        product_name: action.product.name,
        unit_price_cents:
          action.variantPriceCents ?? action.product.price_cents,
        quantity: action.quantity,
        product_variant_id: variantId,
        variant_display_name: action.variantDisplayName ?? null,
      };
      const itemKey = cartItemKey(newItem);
      const existing = state.cart.findIndex(
        (item) => cartItemKey(item) === itemKey,
      );
      const newCart =
        existing === -1
          ? [...state.cart, newItem]
          : state.cart.map((item, i) =>
              i === existing ? { ...item, quantity: action.quantity } : item,
            );
      return { ...state, cart: newCart, selectedProduct: null };
    }
    case 'OPEN_CART': {
      if (state.phase !== 'BROWSING' || state.cart.length === 0) return state;
      return {
        phase: 'CART_REVIEW',
        path: state.path,
        currentCategoryId: state.currentCategoryId,
        cart: state.cart,
      };
    }
    case 'CLOSE_CART': {
      if (state.phase !== 'CART_REVIEW') return state;
      return {
        phase: 'BROWSING',
        path: state.path,
        currentCategoryId: state.currentCategoryId,
        cart: state.cart,
        selectedProduct: null,
      };
    }
    case 'UPDATE_CART_ITEM': {
      if (state.phase !== 'CART_REVIEW') return state;
      const clampedQty = Math.max(1, Math.min(999, action.quantity));
      const targetVariantId = action.variantId ?? null;
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.product_id === action.productId &&
          item.product_variant_id === targetVariantId
            ? { ...item, quantity: clampedQty }
            : item,
        ),
      };
    }
    case 'REMOVE_CART_ITEM': {
      if (state.phase !== 'CART_REVIEW') return state;
      const removeVariantId = action.variantId ?? null;
      const newCart = state.cart.filter(
        (item) =>
          !(
            item.product_id === action.productId &&
            item.product_variant_id === removeVariantId
          ),
      );
      if (newCart.length === 0) {
        return {
          phase: 'BROWSING',
          path: state.path,
          currentCategoryId: state.currentCategoryId,
          cart: [],
          selectedProduct: null,
        };
      }
      return { ...state, cart: newCart };
    }
    case 'PROCEED_TO_CHECKOUT': {
      if (state.phase !== 'CART_REVIEW') return state;
      return {
        phase: 'CHECKOUT',
        path: state.path,
        currentCategoryId: state.currentCategoryId,
        cart: state.cart,
      };
    }
    case 'BACK_TO_CART': {
      if (state.phase !== 'CHECKOUT') return state;
      return {
        phase: 'CART_REVIEW',
        path: state.path,
        currentCategoryId: state.currentCategoryId,
        cart: state.cart,
      };
    }
    case 'CHECKOUT_COMPLETE': {
      if (state.phase !== 'CHECKOUT') return state;
      return {
        phase: 'CONFIRMED',
        items: state.cart,
        totalCents: cartTotalCents(state.cart),
        paymentMethod: action.paymentMethod,
      };
    }
    case 'DONE':
      return initialState;
    default:
      return state;
  }
}

interface SalesPageProps {
  sellerId: string;
  eventId?: string;
}

export function SalesPage({ sellerId, eventId }: SalesPageProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const browsingCategoryId =
    state.phase === 'BROWSING' ? state.currentCategoryId : null;
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories(browsingCategoryId);
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useProducts(browsingCategoryId);
  const {
    recordCart,
    loading: recordingLoading,
    error: recordError,
  } = useRecordCart();

  const dataLoading = categoriesLoading || productsLoading;
  const dataError = categoriesError || productsError;

  const handleCheckout = async (paymentMethod: PaymentMethod) => {
    if (state.phase !== 'CHECKOUT') return;

    const result = await recordCart({
      cart: state.cart,
      sellerId,
      paymentMethod,
      eventId,
    });

    if (result) {
      dispatch({ type: 'CHECKOUT_COMPLETE', paymentMethod });
    }
  };

  if (state.phase === 'CONFIRMED') {
    return (
      <div className={styles.page}>
        <SaleConfirmation
          items={state.items}
          totalCents={state.totalCents}
          paymentMethod={state.paymentMethod}
          onDone={() => dispatch({ type: 'DONE' })}
        />
      </div>
    );
  }

  if (state.phase === 'CHECKOUT') {
    return (
      <div className={styles.page}>
        <CartCheckout
          cart={state.cart}
          onConfirm={handleCheckout}
          onBack={() => dispatch({ type: 'BACK_TO_CART' })}
          loading={recordingLoading}
          error={recordError}
        />
      </div>
    );
  }

  if (state.phase === 'CART_REVIEW') {
    return (
      <div className={styles.page}>
        <CartReview
          cart={state.cart}
          onUpdateItem={(productId, quantity, variantId) =>
            dispatch({
              type: 'UPDATE_CART_ITEM',
              productId,
              quantity,
              variantId,
            })
          }
          onRemoveItem={(productId, variantId) =>
            dispatch({ type: 'REMOVE_CART_ITEM', productId, variantId })
          }
          onCheckout={() => dispatch({ type: 'PROCEED_TO_CHECKOUT' })}
          onContinueShopping={() => dispatch({ type: 'CLOSE_CART' })}
        />
      </div>
    );
  }

  // BROWSING phase
  // TODO: When variant selection is added, pass variantId here too
  const existingCartQty = state.selectedProduct
    ? (state.cart.find(
        (i) =>
          i.product_id === state.selectedProduct!.id &&
          i.product_variant_id === null,
      )?.quantity ?? 0)
    : 0;

  return (
    <div
      className={state.cart.length > 0 ? styles.pageWithCartBar : styles.page}
    >
      {dataError && <div className={styles.error}>{dataError}</div>}
      <BreadcrumbNav
        path={state.path}
        onNavigate={(categoryId) =>
          dispatch({ type: 'NAVIGATE_TO', categoryId })
        }
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
              dispatch({
                type: 'DRILL_DOWN',
                categoryId,
                categoryName: cat.name,
              });
            }
          }}
          onSelectProduct={(product) =>
            dispatch({ type: 'SELECT_PRODUCT', product })
          }
        />
      )}
      {state.selectedProduct && (
        <ProductPicker
          product={state.selectedProduct}
          existingQuantity={existingCartQty}
          onAddToCart={(quantity) =>
            dispatch({
              type: 'ADD_TO_CART',
              product: state.selectedProduct as Product,
              quantity,
            })
          }
          onClose={() => dispatch({ type: 'DISMISS_PICKER' })}
        />
      )}
      {state.cart.length > 0 && (
        <CartBar
          cart={state.cart}
          onOpenCart={() => dispatch({ type: 'OPEN_CART' })}
        />
      )}
    </div>
  );
}
