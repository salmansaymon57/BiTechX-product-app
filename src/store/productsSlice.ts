// src/store/productsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError} from 'axios';
import type { AuthState } from './authSlice';

// Define types (adjust based on your API)
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  // Add other fields like imageUrl if needed
}

interface ProductsState {
  products: Product[];
  totalPages: number;
  currentPage: number;
  searchTerm: string;
  loading: boolean;
  error: string | null;
  singleProduct: Product | null; // For details/edit
}

interface FetchProductsParams {
  page?: number;
  search?: string;
}

interface CreateProductPayload {
  name: string;
  description?: string;
  price: number;
  category: string;
}

interface UpdateProductPayload {
  id: string;
  data: Partial<Product>;
}


export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  imageUrl?: string; 
}

// Async thunks
// In productsSlice.ts, update fetchProducts thunk (and others)
export const fetchProducts = createAsyncThunk<
  { products: Product[]; totalPages: number },
  FetchProductsParams,
  { rejectValue: string }
>('products/fetchProducts', async ({ page = 1, search = '' }, { rejectWithValue, getState }) => {
  try {
    const state = getState() as { auth: AuthState };
    const token = state.auth.token;
    if (!token) return rejectWithValue('No auth token');

    const params = new URLSearchParams({ page: page.toString() });
    if (search) params.append('search', search);
    const response = await axios.get(`/products?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return {
      products: response.data.products || [],
      totalPages: response.data.totalPages || 1,
    };
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>; // Type guard
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch products');
  }
});

// Similarly for createProduct:
export const createProduct = createAsyncThunk<
  Product,
  CreateProductPayload,
  { rejectValue: string }
>('products/createProduct', async (productData, { rejectWithValue, getState }) => {
  try {
    const state = getState() as { auth: AuthState };
    const token = state.auth.token;
    if (!token) return rejectWithValue('No auth token');

    const response = await axios.post('/products', productData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(err.response?.data?.message || 'Failed to create product');
  }
});

// updateProduct:
export const updateProduct = createAsyncThunk<
  Product,
  UpdateProductPayload,
  { rejectValue: string }
>('products/updateProduct', async ({ id, data }, { rejectWithValue, getState }) => {
  try {
    const state = getState() as { auth: AuthState };
    const token = state.auth.token;
    if (!token) return rejectWithValue('No auth token');

    const response = await axios.put(`/products/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(err.response?.data?.message || 'Failed to update product');
  }
});

// deleteProduct:
export const deleteProduct = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('products/deleteProduct', async (id, { rejectWithValue, getState }) => {
  try {
    const state = getState() as { auth: AuthState };
    const token = state.auth.token;
    if (!token) return rejectWithValue('No auth token');

    await axios.delete(`/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return id;
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(err.response?.data?.message || 'Failed to delete product');
  }
});

// fetchSingleProduct:
export const fetchSingleProduct = createAsyncThunk<
  Product,
  string,
  { rejectValue: string }
>('products/fetchSingleProduct', async (id, { rejectWithValue, getState }) => {
  try {
    const state = getState() as { auth: AuthState };
    const token = state.auth.token;
    if (!token) return rejectWithValue('No auth token');

    const response = await axios.get(`/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch product');
  }
});

const initialState: ProductsState = {
  products: [],
  totalPages: 0,
  currentPage: 1,
  searchTerm: '',
  loading: false,
  error: null,
  singleProduct: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    updateProductLocal: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
      if (state.singleProduct?.id === action.payload.id) {
        state.singleProduct = action.payload;
      }
    },
    deleteProductLocal: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
      // Adjust totalPages if needed (simple approximation)
      if (state.products.length === 0 && state.currentPage > 1) {
        state.currentPage -= 1;
      }
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Fetch failed';
      });

    // Create
  builder
    .addCase(createProduct.fulfilled, (state, _action) => { // Prefix with _
      state.products.unshift(_action.payload);
      state.totalPages = Math.max(state.totalPages, 1);
    });

  // Update
  builder
    .addCase(updateProduct.fulfilled, (state, _action) => { // Prefix with _
      state.loading = false;
    });

    // Delete
    builder
      .addCase(deleteProduct.fulfilled, (state, action) => {
        // Use local reducer for delete
        state.loading = false;
      });
      // In src/store/productsSlice.ts, update extraReducers for delete
    builder
      .addCase(deleteProduct.fulfilled, (state, _action) => {
    // Already removed optimistically; just clear loading
    state.loading = false;
    // Optional: Refetch if needed, but since we dispatch fetch after, it's covered
      });

    builder.addCase(updateProduct.fulfilled, (state, _action) => { 
      state.loading = false;
    });  

    // Single fetch
    builder
      .addCase(fetchSingleProduct.fulfilled, (state, action) => {
        state.singleProduct = action.payload;
        state.loading = false;
      });
  },
});

export const { setProducts, updateProductLocal, deleteProductLocal, setCurrentPage, setSearchTerm } = productsSlice.actions;
export default productsSlice.reducer;