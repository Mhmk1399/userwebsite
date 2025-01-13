"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      loadCartItems();
    }, []);
  
    const loadCartItems = async () => {
      const db = await openDB();
      const transaction = (db as IDBDatabase).transaction('cart', 'readonly');
      const store = transaction.objectStore('cart');
      const request = store.getAll();
      request.onsuccess = () => {
        setCartItems(request.result as CartItem[]);
        setLoading(false);
      };
      request.onerror = () => {
        console.error("Failed to load cart items");
        setLoading(false);
      };
      setLoading(false);
    };
  
    const updateQuantity = async (itemId: string, change: number) => {
      const db = await openDB();
      const transaction = (db as IDBDatabase).transaction('cart', 'readwrite');
      const store = transaction.objectStore('cart');
      
      const item = cartItems.find(item => item.id === itemId);
      if (!item) return;
  
      const newQuantity = Math.max(0, item.quantity + change);
      
      if (newQuantity === 0) {
        // Remove item if quantity becomes 0
        await store.delete(itemId);
        setCartItems(prev => prev.filter(item => item.id !== itemId));
      } else {
        // Update quantity
        const updatedItem = { ...item, quantity: newQuantity };
        await store.put(updatedItem);
        setCartItems(prev =>
          prev.map(item => 
            item.id === itemId ? updatedItem : item
          )
        );
      }
    };
  const calculateTotal = () => 
    cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  async function submitOrder(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> {
    event.preventDefault();
    if (cartItems.length === 0) {
      alert("سبد خرید شما خالی است");
      return;
    }

    try {
      // Simulate order submission
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("سفارش شما با موفقیت ثبت شد");
      // Clear cart after successful order submission
      const db = await openDB();
      const transaction = (db as IDBDatabase).transaction('cart', 'readwrite');
      const store = transaction.objectStore('cart');
      store.clear();
      setCartItems([]);
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("خطایی در ثبت سفارش رخ داده است");
    }
  }
  return (
    <div className="min-h-screen bg-gray-50  px-4 sm:px-6 lg:px-8 pt-36">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">سبد خرید شما</h1>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
          </div>
        ) : cartItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
            <p className="text-gray-600 text-lg">سبد خرید شما خالی است</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2">
        {cartItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-md p-6 mb-4 flex items-center"
          >
            <Image
              src={item.image}
              alt={item.name}
              width={80}
              height={80}
              className="rounded-md object-cover"
            />
            <div className="flex-1 mr-4">
              <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
              <p className="text-gray-600">{item.price.toLocaleString()} تومان</p>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => updateQuantity(item.id, -1)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                -
              </button>
              <span className="mx-2">{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.id, 1)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                +
              </button>
            </div>
          </motion.div>
        ))}
      </div>


            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">خلاصه سفارش</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>جمع کل</span>
                    <span>{calculateTotal().toLocaleString()} تومان</span>
                  </div>
                  <div className="flex justify-between">
                    <span>هزینه ارسال</span>
                    <span>رایگان</span>
                  </div>
                  <hr className="my-4" />
                  <div className="flex justify-between font-semibold">
                    <span>مبلغ قابل پرداخت</span>
                    <span>{calculateTotal().toLocaleString()} تومان</span>
                  </div>
                  <button 
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
                    onClick={submitOrder}
                  >
                    ادامه فرآیند خرید
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

async function openDB() {
  return await new Promise((resolve, reject) => {
    const request = indexedDB.open('CartDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('cart')) {
        db.createObjectStore('cart', { keyPath: 'id' });
      }
    };
  });
}
