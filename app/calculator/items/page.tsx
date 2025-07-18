"use client"
import foodData from '../../../food_calories.json';
import { useState, useEffect } from 'react';

interface FoodItem {
  name: string;
  calories: number;
  serving: string;
  imageUrl: string;
}

export default function ItemLoader() {
  const [suggestions, setSuggestions] = useState<string[]>(foodData.suggestedItems);
  const [newItem, setNewItem] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const foodItems: FoodItem[] = foodData.foodItems;
  
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
      <h2 className="item-title">Select The Items You Had</h2>
      
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
            <h3 className="item-name">{item.name}</h3>
            <div className="item-info">
              <span className="item-label">Calories:</span> {item.calories}
            </div>
            <div className="item-info">
              <span className="item-label">Serving:</span> {item.serving}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
