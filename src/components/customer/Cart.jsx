import React from 'react';
import { X, Plus, Minus } from 'lucide-react';

export default function Cart({ cart, onUpdateQuantity, onRemoveItem, onCheckout }) {
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Your Order</h2>
        <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {cart.reduce((count, item) => count + item.quantity, 0)} items
        </span>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Your cart is empty</p>
          <p className="text-sm text-gray-400 mt-2">Add items to get started</p>
        </div>
      ) : (
        <>
          <div className="space-y-4 flex-grow overflow-y-auto max-h-[calc(100vh-300px)] pr-2">
            {cart.map((item) => (
              <div key={item._id} className="flex items-start py-3 border-b border-gray-100">
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <button 
                      onClick={() => onRemoveItem(item._id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                  <div className="flex items-center mt-2">
                    <button 
                      onClick={() => onUpdateQuantity(item._id, Math.max(1, item.quantity - 1))}
                      className="p-1 text-gray-500 hover:bg-gray-100 rounded-full"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="mx-2 w-6 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                      className="p-1 text-gray-500 hover:bg-gray-100 rounded-full"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-gray-200 pt-4">
            <div className="flex justify-between text-lg font-semibold mb-4">
              <span>Total:</span>
              <span>${calculateTotal()}</span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full bg-[#FF8A00] text-white py-2.5 rounded-lg font-medium hover:bg-[#e67a00] transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}