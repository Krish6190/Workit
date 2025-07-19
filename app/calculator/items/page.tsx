"use client"
import foodData from '../../../food_calories.json';
import { useState, useEffect } from 'react';
import { useDelayedNavigation } from '@/app/hooks/useDelayedNavigation';
import {HiArrowTurnLeftUp } from 'react-icons/hi2';

interface FoodItem {
  name: string;
  calories: number;
  serving: string;
  imageUrl: string;
}

interface SelectedItem {
  name: string;
  calories: number;
  quantity: number;
  totalItemCalories: number;
}

export default function ItemLoader() {
  const {navigateWithDelay}=useDelayedNavigation();
  const [suggestions, setSuggestions] = useState<string[]>(foodData.suggestedItems);
  const [newItem, setNewItem] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [showSummary, setShowSummary] = useState<boolean>(false);
  const foodItems: FoodItem[] = foodData.foodItems;
  let totalCalories = 0;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'e' || event.key === 'E') {
      event.preventDefault();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredItems = foodItems.filter(item =>
    item.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const handleAddItem = () => {
    const itemName = newItem.trim();
    setTimeout(() => setMessage(''), 5000);

    if (itemName === '') {
      setMessage('Please enter an item name');
      return;
    }

    if (!/^[A-Za-z\s]+$/.test(itemName)) {
      setMessage('Only alphabets and spaces are allowed');
      return;
    }

    if (foodItems.some(item => item.name.toLowerCase() === itemName.toLowerCase())) {
      setMessage('Item already exists in the list');
      return;
    }

    if (suggestions.includes(itemName)) {
      setMessage('Item already suggested');
      return;
    }

    const updatedSuggestions = [...suggestions, itemName];
    setSuggestions(updatedSuggestions);
    setNewItem('');
    setMessage(`"${itemName}" has been added to suggestions!`);

    fetch('/api/addSuggestion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newItem: itemName }),
    })
      .then(response => response.json())
      .then(data => {
        if (!data.success) {
          console.error('Failed to save suggestion:', data.message);
        }
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    <div className="item-container">
      <h2 className="item-title">
      <button
        type="button"
        className="items-back-btn"
        onClick={() => {
          const items: SelectedItem[] = [];
          const inputs = document.querySelectorAll('.item-des-input');
          inputs.forEach((input, index) => {
            const quantity = parseInt((input as HTMLInputElement).value) || 0;
            if (quantity > 0) {
              const item = filteredItems[index];
              items.push({
                name: item.name,
                calories: item.calories,
                quantity: quantity,
                totalItemCalories: item.calories * quantity
              });
            }
          });
          setSelectedItems(items);
          setShowSummary(true);
        }}
      >
        <HiArrowTurnLeftUp/>That's All
      </button>
        Select The Items You Had</h2>
      <div className="item-input-section">
        <div className="input-row">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search food items..."
            className="search-bar"
          />
          <div className="suggestion-input-container">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Suggest a new food item (alphabets only)"
              className="item-input"
            />
            <button onClick={handleAddItem} className="add-btn">Add Item</button>
            <p className="responsibility-note">*Ps be responsible with what you add </p>
            {message && <p className="message">{message}</p>}
          </div>
        </div>
      </div>
      <div className="item-row">
        {filteredItems.map((item, index) => (
          <div key={index} className="item-card">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="item-image"
              onError={(e) => {
                e.currentTarget.src = '/pictures/blank-profile.webp';
              }}
            />
            <div className='item-description-container'>
              <div className='item-description'>
                <h3 className="item-name">{item.name}</h3>
                <div className="item-info">
                  <span className="item-label">Calories:</span> {item.calories}
                </div>
                <div className="item-info">
                  <span className="item-label">Serving:</span> {item.serving}
                </div>
              </div>
              <div className='item-description'>
                <h3 className='item-name'>Quantity</h3>
                <input
                  type="number"
                  onKeyDown={handleKeyDown}
                  className='item-des-input'
                  placeholder='0'
                  onInput={(e) => {
                    const input = e.target as HTMLInputElement;
                    let cleanedValue = input.value;
                    cleanedValue = cleanedValue.replace(/^0+/, "");
                    if (cleanedValue === "") cleanedValue = "0";
                    const numericValue = parseInt(cleanedValue, 10);
                    if (numericValue > 20) {
                      cleanedValue = "20";
                    }
                    input.value = cleanedValue;
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      {showSummary && (
        <div className="summary-modal-positioned">
          <h3 className="summary-modal-title">Selected Items Summary</h3>
          {selectedItems.length === 0 ? (
            <p className="no-items-message">No items selected</p>
          ) : (
            <div className="selected-items-list">
              {selectedItems.map((item, index) => (
                <div key={index} className="selected-item">
                  <span className="selected-item-name">{item.name}</span>
                  <span className="selected-item-quantity">Qty: {item.quantity}</span>
                  <span className="selected-item-calories">{item.totalItemCalories} cal</span>
                </div>
              ))}
              <div className="summary-total-calories">
                <strong>Total Calories: {selectedItems.reduce((sum, item) => sum + item.totalItemCalories, 0)}</strong>
              </div>
            </div>
          )}
          <div className="summary-modal-buttons">
            <button 
              className="summary-close-btn"
              onClick={() => setShowSummary(false)}
            >
              Close
            </button>
            <button 
              className="summary-proceed-btn"
              onClick={() => {
                const totalCals = selectedItems.reduce((sum, item) => sum + item.totalItemCalories, 0);
                navigateWithDelay(`/calculator/?extraCalories=${totalCals}`);
              }}
            >
              Go to Calculator
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
