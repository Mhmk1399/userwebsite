/**
 * Cart Service - Handles all cart operations via backend API
 * Replaces IndexedDB with MongoDB backend
 */

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  colorCode: string;
  properties: { name: string; value: string }[];
}

export interface AddToCartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  colorCode?: string;
  properties?: { name: string; value: string }[];
}

export interface Cart {
  _id?: string;
  userId: string;
  storeId: string;
  items: CartItem[];
  createdAt?: string;
  updatedAt?: string;
}

class CartService {
  private cartCache: CartItem[] | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_DURATION = 5000; // Cache for 5 seconds

  private getStoreId(): string {
    return process.env.STORE_ID || localStorage.getItem("storeId") || "";
  }

  private invalidateCache(): void {
    this.cartCache = null;
    this.cacheTimestamp = 0;
  }

  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("tokenUser");
  }

  private getUserId(): string | null {
    if (typeof window === "undefined") return null;
    const token = this.getAuthToken();
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId;
    } catch {
      return null;
    }
  }

  /**
   * Load cart items from backend (with caching)
   */
  async loadCart(forceRefresh: boolean = false): Promise<CartItem[]> {
    try {
      const userId = this.getUserId();
      const storeId = this.getStoreId();

      if (!userId) {
        console.log("No user logged in");
        return [];
      }

      // Return cached data if still valid
      const now = Date.now();
      if (
        !forceRefresh &&
        this.cartCache !== null &&
        now - this.cacheTimestamp < this.CACHE_DURATION
      ) {
        return this.cartCache;
      }

      const response = await fetch("/api/cart", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          userId: userId,
          storeId: storeId,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          // Cart not found, return empty array
          this.cartCache = [];
          this.cacheTimestamp = now;
          return [];
        }
        throw new Error(`Failed to load cart: ${response.status}`);
      }

      const result = await response.json();
      const items = result.data?.items || [];
      
      // Ensure each item has an id field (composite key)
      const normalizedItems = items.map((item: CartItem) => ({
        ...item,
        id: item.id || `${item.productId}_${item.colorCode || ""}_${JSON.stringify(item.properties || [])}`,
        colorCode: item.colorCode || "",
        properties: item.properties || [],
      }));

      // Update cache
      this.cartCache = normalizedItems;
      this.cacheTimestamp = now;

      return normalizedItems;
    } catch (error) {
      console.error("Error loading cart:", error);
      return [];
    }
  }

  /**
   * Add item to cart or update quantity
   */
  async addToCart(item: AddToCartItem): Promise<boolean> {
    try {
      const token = this.getAuthToken();
      const userId = this.getUserId();
      const storeId = this.getStoreId();

      if (!token || !userId) {
        throw new Error("Authentication required");
      }

      // Ensure required fields have defaults
      const normalizedItem: CartItem = {
        ...item,
        id: `${item.productId}_${item.colorCode || ""}_${JSON.stringify(item.properties || [])}`,
        colorCode: item.colorCode || "",
        properties: item.properties || [],
      };

      // First, load existing cart
      const existingItems = await this.loadCart();

      // Create unique key for item
      const itemKey = normalizedItem.id;

      // Check if item exists
      const existingItemIndex = existingItems.findIndex((i) => i.id === itemKey);

      let updatedItems: CartItem[];

      if (existingItemIndex > -1) {
        // Update quantity
        updatedItems = [...existingItems];
        updatedItems[existingItemIndex].quantity += normalizedItem.quantity;
      } else {
        // Add new item
        updatedItems = [...existingItems, normalizedItem];
      }

      // Save to backend
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          storeId,
          items: updatedItems,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update quantity: ${response.status}`);
      }

      // Invalidate cache and dispatch cart update event
      this.invalidateCache();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cartUpdated"));
      }

      return true;
    } catch (error) {
      console.error("Error updating quantity:", error);
      throw error;
    }
  }

  /**
   * Update item quantity
   */
  async updateQuantity(itemId: string, change: number): Promise<boolean> {
    try {
      const userId = this.getUserId();
      const storeId = this.getStoreId();

      if (!userId) {
        throw new Error("Authentication required");
      }

      // Load current cart
      const items = await this.loadCart();

      // Find and update item
      const itemIndex = items.findIndex((i) => {
        const key = `${i.productId}_${i.colorCode || ""}_${JSON.stringify(i.properties || [])}`;
        return key === itemId;
      });

      if (itemIndex === -1) {
        console.error("Item not found:", itemId);
        console.error("Available items:", items.map(i => ({
          id: i.id,
          key: `${i.productId}_${i.colorCode || ""}_${JSON.stringify(i.properties || [])}`
        })));
        throw new Error("Item not found in cart");
      }

      const newQuantity = items[itemIndex].quantity + change;

      if (newQuantity <= 0) {
        // Remove item
        return await this.removeItem(itemId);
      }

      // Update quantity
      items[itemIndex].quantity = newQuantity;

      // Save to backend
      const token = this.getAuthToken();
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          storeId,
          items,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Update quantity error:", errorData);
        throw new Error(`Failed to update quantity: ${response.status}`);
      }

      // Invalidate cache and dispatch cart update event
      this.invalidateCache();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cartUpdated"));
      }

      return true;
    } catch (error) {
      console.error("Error updating quantity:", error);
      throw error;
    }
  }

  /**
   * Remove item from cart
   */
  async removeItem(itemId: string): Promise<boolean> {
    try {
      const userId = this.getUserId();
      const storeId = this.getStoreId();
      const token = this.getAuthToken();

      if (!userId || !token) {
        throw new Error("Authentication required");
      }

      // Load current cart
      const items = await this.loadCart();

      // Filter out the item
      const updatedItems = items.filter((i) => {
        const key = `${i.productId}_${i.colorCode || ""}_${JSON.stringify(i.properties || [])}`;
        return key !== itemId;
      });

      // If cart is empty after removal, delete it instead of updating
      if (updatedItems.length === 0) {
        return await this.clearCart();
      }

      // Save to backend
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          storeId,
          items: updatedItems,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Remove item error:", errorData);
        throw new Error(`Failed to remove item: ${response.status}`);
      }

      // Invalidate cache and dispatch cart update event
      this.invalidateCache();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cartUpdated"));
      }

      return true;
    } catch (error) {
      console.error("Error removing item:", error);
      throw error;
    }
  }

  /**
   * Clear entire cart
   */
  async clearCart(): Promise<boolean> {
    try {
      const userId = this.getUserId();
      const storeId = this.getStoreId();

      if (!userId) {
        throw new Error("Authentication required");
      }

      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          userId: userId,
          storeId: storeId,
        },
      });

      if (!response.ok && response.status !== 404) {
        throw new Error(`Failed to clear cart: ${response.status}`);
      }

      // Invalidate cache and dispatch cart update event
      this.invalidateCache();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cartUpdated"));
      }

      return true;
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  }

  /**
   * Get cart item count
   */
  async getItemCount(): Promise<number> {
    const items = await this.loadCart();
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }

  /**
   * Calculate cart total
   */
  async getCartTotal(): Promise<number> {
    const items = await this.loadCart();
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}

// Export singleton instance
export const cartService = new CartService();
