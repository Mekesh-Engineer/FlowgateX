// =============================================================================
// CART MODAL — Shopping cart for attendee event tickets
// Uses CSS classes from cart.css for consistent styling
// =============================================================================

import { useState, useEffect } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, CreditCard, Ticket } from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface CartItem {
  id: string;
  eventName: string;
  eventDate: string;
  ticketType: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// =============================================================================
// MOCK DATA
// =============================================================================

const MOCK_CART_ITEMS: CartItem[] = [
  {
    id: '1',
    eventName: 'Tech Conference 2026',
    eventDate: 'Feb 15, 2026',
    ticketType: 'VIP Pass',
    price: 2500,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&h=200&fit=crop',
  },
  {
    id: '2',
    eventName: 'Startup Pitch Night',
    eventDate: 'Feb 20, 2026',
    ticketType: 'General Admission',
    price: 500,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=200&h=200&fit=crop',
  },
];

// =============================================================================
// UTILITIES
// =============================================================================

function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const [cartItems, setCartItems] = useState(MOCK_CART_ITEMS);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + tax;

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Update quantity
  const updateQuantity = (id: string, delta: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  // Remove item
  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  if (!isOpen) return null;

  return (
    <div className="cart-overlay" role="dialog" aria-modal="true" aria-labelledby="cart-title">
      {/* Backdrop */}
      <div className="cart-backdrop" onClick={onClose} aria-hidden="true" />

      {/* Modal */}
      <div className="cart-modal-container">
        {/* Header */}
        <header className="cart-header">
          <div className="cart-header-info">
            <div className="cart-header-icon">
              <ShoppingBag size={20} />
            </div>
            <div className="cart-header-text">
              <h2 id="cart-title" className="cart-title">Your Cart</h2>
              <p className="cart-count">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cart-close-btn"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </header>

        {/* Cart Items */}
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <Ticket size={48} className="cart-empty-icon" />
              <p className="cart-empty-title">Your cart is empty</p>
              <p className="cart-empty-text">Browse events to add tickets</p>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <article key={item.id} className="cart-item">
                  {/* Event Image */}
                  <div className="cart-item-image">
                    <img src={item.image} alt={item.eventName} />
                  </div>

                  {/* Item Details */}
                  <div className="cart-item-details">
                    <h3 className="cart-item-title">{item.eventName}</h3>
                    <p className="cart-item-meta">
                      {item.eventDate} • {item.ticketType}
                    </p>
                    <div className="cart-item-row">
                      <span className="cart-item-price">{formatCurrency(item.price)}</span>
                      {/* Quantity Controls */}
                      <div className="cart-quantity">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="cart-quantity-btn"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="cart-quantity-value">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="cart-quantity-btn"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="cart-remove-btn"
                    aria-label={`Remove ${item.eventName}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Totals */}
        {cartItems.length > 0 && (
          <footer className="cart-footer">
            {/* Price Breakdown */}
            <div className="cart-price-breakdown">
              <div className="cart-price-row">
                <span className="cart-price-label">Subtotal</span>
                <span className="cart-price-value">{formatCurrency(subtotal)}</span>
              </div>
              <div className="cart-price-row">
                <span className="cart-price-label">GST (18%)</span>
                <span className="cart-price-value">{formatCurrency(tax)}</span>
              </div>
              <div className="cart-price-total">
                <span className="cart-price-label">Total</span>
                <span className="cart-price-value">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="cart-actions">
              <button
                type="button"
                onClick={clearCart}
                className="cart-btn cart-btn-secondary"
              >
                Clear Cart
              </button>
              <button
                type="button"
                className="cart-btn cart-btn-primary"
              >
                <CreditCard size={16} />
                Checkout
              </button>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}
