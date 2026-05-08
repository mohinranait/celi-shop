

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICartItem } from "../service/orders/type";

type TCartState = {
  carts: ICartItem[];
  totalItems: number;
  subtotal: number;
  discount: number;
  open: boolean;
};

const initialState: TCartState = {
  carts: [],
  totalItems: 0,
  subtotal: 0,
  discount: 0,
  open: false,
};


const calculateSubtotal = (carts: ICartItem[]) => {
  return carts.reduce((total, item) => {
    return total + item.salePrice * item.quantity;
  }, 0);
};

const calculateTotalQuantity = (carts: ICartItem[]) => {
  return carts.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
};


const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ cart: ICartItem }>) => {
      const { cart } = action.payload;
      const existingItemIndex = state.carts.findIndex(
        (item) =>
          item.sku === cart.sku &&
          item.productId === cart.productId &&
          JSON.stringify(item.selectedVariants) === JSON.stringify(cart.selectedVariants)
      )

      let updatedCart: ICartItem[]
      if (existingItemIndex > -1) {
        updatedCart = [...state.carts]
        updatedCart[existingItemIndex].quantity += cart.quantity
      } else {
        updatedCart = [...state.carts, cart]
      }
      state.carts = updatedCart;
      state.totalItems = calculateTotalQuantity(state.carts)
      state.subtotal = calculateSubtotal(state.carts);
    },
    removeToCart: (state, action: PayloadAction<{ productId: string; sku: string }>) => {
      const { productId, sku } = action.payload
      state.carts = state.carts.filter(
        (item) =>
          !(
            item.sku === sku &&
            item.productId === productId
          )
      );

      state.totalItems = calculateTotalQuantity(state.carts)
      state.subtotal = calculateSubtotal(state.carts);
    },
    toggleCartDroware: (state) => {
      state.open = !state.open
    },
    updateCartQuantity: (
      state,
      action: PayloadAction<{
        productId: string;
        sku: string;
        quantity: number;
      }>
    ) => {
      const { productId, sku, quantity } = action.payload;

      const itemIndex = state.carts.findIndex(
        (item) => item.productId === productId && item.sku === sku
      );

      if (itemIndex > -1) {
        if (quantity <= 0) {
          state.carts.splice(itemIndex, 1);
        } else {
          state.carts[itemIndex].quantity = quantity;
        }
      }

      state.totalItems = calculateTotalQuantity(state.carts)
      state.subtotal = calculateSubtotal(state.carts);
    },
  },
});

export const { addToCart, removeToCart, toggleCartDroware, updateCartQuantity } = cartSlice.actions;
export default cartSlice.reducer;
