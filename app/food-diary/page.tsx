'use client';

import { useState, useEffect } from 'react';
import foodData from '../../food_calories.json';

interface FoodItem {
  name: string;
  calories: number;
  serving: string;
  imageUrl?: string;
}

interface FoodLogItem {
  id?: number;
  name: string;
  calories: number;
  serving: string;
  quantity: number;
  imageUrl?: string;
  time?: string;
}

interface FoodLog {
  id: number;
  date: string;
  totalCalories: number;
  items: FoodLogItem[];
}

const FoodDiary = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dailyItems, setDailyItems] = useState<FoodLogItem[]>([]);
  const [availableFoods] = useState<FoodItem[]>(foodData.foodItems);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState<number | string>(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCalories, setTotalCalories] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const filteredFoods = availableFoods.filter(food => 
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchFoodLogs = async () => {
      try {
        const dateString = selectedDate.toISOString().split('T')[0];
        const response = await fetch(`/api/food-log?date=${dateString}`);
        
        if (response.ok) {
          const logs: FoodLog[] = await response.json();
          if (logs.length > 0) {
            setDailyItems(logs[0].items || []);
            setTotalCalories(logs[0].totalCalories || 0);
          } else {
            setDailyItems([]);
            setTotalCalories(0);
          }
        } else {
          console.error('Failed to fetch food logs');
          setDailyItems([]);
          setTotalCalories(0);
        }
      } catch (error) {
        console.error('Error fetching food logs:', error);
        setDailyItems([]);
        setTotalCalories(0);
      }
    };

    fetchFoodLogs();
  }, [selectedDate]);
  const handleAddFood = async () => {
    const numQuantity = typeof quantity === 'string' ? parseFloat(quantity) : quantity;
    if (!selectedFood || !numQuantity || numQuantity <= 0) {
      setMessage('Please select a food and enter a valid quantity.');
      return;
    }

    const newItem: FoodLogItem = {
      name: selectedFood.name,
      calories: selectedFood.calories,
      serving: selectedFood.serving,
      quantity: numQuantity,
      imageUrl: selectedFood.imageUrl,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedItems = [...dailyItems, newItem];
    setDailyItems(updatedItems);
    
    const newTotal = updatedItems.reduce((sum, item) => 
      sum + (item.calories * item.quantity), 0
    );
    setTotalCalories(newTotal);
    setSelectedFood(null);
    setQuantity(1);
    setSearchTerm('');
    setMessage('Food item added! Don\'t forget to save your log.');
  };

  const handleSave = async () => {
    if (dailyItems.length === 0) {
      setMessage('No food items to save.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/food-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: selectedDate.toISOString(),
          items: dailyItems,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage('Food log saved successfully!');
        console.log('Food log saved:', result);
      } else {
        const error = await response.json();
        setMessage(error.error || 'Failed to save food log.');
      }
    } catch (error) {
      console.error('Error saving food log:', error);
      setMessage('Failed to save food log.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = dailyItems.filter((_, i) => i !== index);
    setDailyItems(updatedItems);
    
    const newTotal = updatedItems.reduce((sum, item) => 
      sum + (item.calories * item.quantity), 0
    );
    setTotalCalories(newTotal);
    setMessage('Item removed from daily log.');
  };

  return (
    <div className="food-diary-container">
      <div className="food-diary-content">
        <h1 className="food-diary-title">Food Diary</h1>
        
        <div className="food-diary-section">
          <h2 className="food-diary-section-title">Select Date</h2>
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="food-diary-date-input"
          />
        </div>

        <div className="food-diary-section">
          <h2 className="food-diary-section-title">Add Food Entry</h2>
          
          <div className="food-search-container">
            <label className="food-search-label">Search Food</label>
            <input
              type="text"
              placeholder="Type to search foods..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="food-search-input"
            />
          </div>

          {searchTerm && (
            <div className="food-selection-dropdown">
              {filteredFoods.map((food, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedFood(food);
                    setSearchTerm(food.name);
                  }}
                  className="food-selection-item"
                >
                  {food.imageUrl && (
                    <img src={food.imageUrl} alt={food.name} className="food-selection-image" />
                  )}
                  <div className="food-selection-details">
                    <div className="food-selection-name">{food.name}</div>
                    <div className="food-selection-calories">{food.calories} cal per {food.serving}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="food-quantity-container">
            <div>
              <label className="food-quantity-label">Quantity</label>
              <input
                type="number"
                min="0"
                step="1"
                value={quantity}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow empty string or just set the value directly
                  setQuantity(value === '' ? '' : value);
                }}
                onBlur={(e) => {
                  // When user leaves the field, ensure it's a valid number
                  const value = e.target.value;
                  if (value === '' || parseFloat(value) <= 0 || isNaN(parseFloat(value))) {
                    setQuantity(1);
                  } else {
                    setQuantity(parseFloat(value));
                  }
                }}
                onFocus={(e) => e.target.select()}
                className="food-quantity-input"
              />
            </div>
            {selectedFood && (
              <span className="food-quantity-calories">
                = {Math.round(selectedFood.calories * (typeof quantity === 'string' ? parseFloat(quantity) || 0 : quantity))} calories
              </span>
            )}
          </div>

          <button
            onClick={handleAddFood}
            disabled={!selectedFood}
            className="food-add-btn"
          >
            Add Food
          </button>
        </div>

        <div className="food-diary-section">
          <h2 className="food-diary-section-title">
            Food Entries for {selectedDate.toLocaleDateString()}
          </h2>
          
          {dailyItems.length === 0 ? (
            <p className="food-no-entries">No food entries for this day.</p>
          ) : (
            <div className="food-entries-list">
              {dailyItems.map((item, index) => (
                <div key={index} className="food-entry-item">
                  <div className="food-entry-content">
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt={item.name} className="food-entry-image" />
                    )}
                    <div className="food-entry-details">
                      <div className="food-entry-name">{item.name}</div>
                      <div className="food-entry-info">
                        {item.quantity} × {item.serving} = {Math.round(item.calories * item.quantity)} cal
                      </div>
                      {item.time && <div className="food-entry-time">Added at {item.time}</div>}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="food-remove-btn"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="food-diary-section">
          <h2 className="food-diary-section-title">Daily Summary</h2>
          <div className="food-summary">
            <div className="food-summary-calories">{totalCalories}</div>
            <div className="food-summary-label">Total Calories</div>
            <div className="food-summary-items">{dailyItems.length} food items logged</div>
          </div>
        </div>

        <div className="food-save-container">
          <button
            onClick={handleSave}
            disabled={isLoading || dailyItems.length === 0}
            className="food-save-btn"
          >
            {isLoading ? 'Saving...' : 'Save Food Log'}
          </button>
        </div>

        {message && (
          <div className="food-message">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodDiary;
