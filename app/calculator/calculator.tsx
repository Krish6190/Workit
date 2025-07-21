"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import NavigationBar from "../navigation";
import { useDelayedNavigation } from "../hooks/useDelayedNavigation";

interface FormState {
  age: string;
  sex: "male" | "female";
  weight: string;
  height: string;
  activityLevel: string;
  extraCalories: string;
}

interface Results {
  bmr: string;
  tdee: string;
  walkingMinutes: string;
  sprintingMinutes: string;
  pushups: string;
  squats: string;
}

interface InitialParams {
  age?: string;
  sex?: string;
  weight?: string;
  height?: string;
  activityLevel?: string;
  extraCalories?: string;
}

interface CalculatorProps {
  initialParams?: InitialParams;
}
function parseParameters(params: InitialParams = {}): FormState {
  const parseAge = (value?: string): string => {
    if (!value) return "25";
    const num = parseInt(value);
    if (isNaN(num) || num < 1 || num > 110) return "25";
    return num.toString();
  };

  const parseSex = (value?: string): "male" | "female" => {
    if (value === "male" || value === "female") return value;
    return "male";
  };

  const parseWeight = (value?: string): string => {
    if (!value) return "70";
    const num = parseFloat(value);
    if (isNaN(num) || num < 1 || num > 500) return "70";
    return num.toString();
  };

  const parseHeight = (value?: string): string => {
    if (!value) return "170";
    const num = parseFloat(value);
    if (isNaN(num) || num < 50 || num > 300) return "170";
    return num.toString();
  };

  const parseActivityLevel = (value?: string): string => {
    const validLevels = ["1.2", "1.375", "1.55", "1.725", "1.9"];
    if (value && validLevels.includes(value)) return value;
    return "1.2";
  };

  const parseExtraCalories = (value?: string): string => {
    if (!value) return "0";
    const num = parseFloat(value);
    if (isNaN(num) || num < 0) return "0";
    return num.toString();
  };

  return {
    age: parseAge(params.age),
    sex: parseSex(params.sex),
    weight: parseWeight(params.weight),
    height: parseHeight(params.height),
    activityLevel: parseActivityLevel(params.activityLevel),
    extraCalories: parseExtraCalories(params.extraCalories)
  };
}

export default function Calculator({ initialParams }: CalculatorProps) {
  const [form, setForm] = useState<FormState>(() => parseParameters(initialParams));
  const { navigateWithDelay } = useDelayedNavigation();

  const [results, setResults] = useState<Results | null>(null);
  const [selectedMode, setSelectedMode] = useState<"walking" | "sprinting">("walking");

  function calculateBMR({ age, sex, weight, height }: FormState): number {
    const ageNum = Number(age);
    const weightNum = Number(weight);
    const heightNum = Number(height);
    if (sex === "male") {
      return 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
    } else {
      return 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const bmr = calculateBMR(form);
    const tdee = bmr * Number(form.activityLevel);
    const calories = (Number(form.extraCalories)-tdee)>0?Number(form.extraCalories)-tdee:0;
    const weightNum = Number(form.weight);
    const walkCalPerMin = 8.6 * weightNum / 60;
    const sprintCalPerMin = 18 * weightNum / 60;

    const walkingMinutes = calories / walkCalPerMin;
    const sprintingMinutes = calories / sprintCalPerMin;
    let pushups = 0;
    let squats = 0;
    let walkingDisplay = 0;
    let sprintingDisplay = 0;

    if (walkingMinutes <= 5) {
      walkingDisplay = walkingMinutes;
      walkingDisplay = sprintingMinutes;
    } else {
      const first5MinCals = 5 * walkCalPerMin;
      const remainingCals = calories - first5MinCals;

      const eachPart = remainingCals / 3;

      walkingDisplay = 5 + (eachPart / walkCalPerMin);
      sprintingDisplay = 5 + (eachPart / sprintCalPerMin);
      pushups = eachPart / 0.40;
      squats = eachPart / 0.225;
    }

    setTimeout(() => {
      setResults({
        bmr: bmr.toFixed(0),
        tdee: tdee.toFixed(0),
        walkingMinutes: walkingDisplay.toFixed(1),
        sprintingMinutes: sprintingDisplay.toFixed(1),
        pushups: pushups ? pushups.toFixed(0) : "0",
        squats: squats ? squats.toFixed(0) : "0",
      });
    }, 500);
  }


  return (
    <div>
      <NavigationBar />
      <div className="calculator-layout">
        <div className="calculator-container">
          <div className="calculator-section">
            <h1>Calorie Burn Calculator</h1>
            <form className="calculator-form" onSubmit={handleSubmit}>
              <div className="form-container">
                <div className="form-row full-width">
                  <div className="label">
                    <label htmlFor="age">Age:</label>
                    <input
                      id="age"
                      type="number"
                      name="age"
                      value={form.age}
                      onChange={handleChange}
                      min={0}
                      max={110}
                    />
                  </div>
                </div>

                <div className="form-row full-width">
                  <div className="label">
                    <label htmlFor="sex">Sex:</label>
                    <div className="option-group">
                      <button
                        type="button"
                        className={`option ${form.sex === 'male' ? 'active' : ''}`}
                        onClick={() => setForm(prev => ({ ...prev, sex: 'male' }))}
                      >
                        Male
                      </button>
                      <button
                        type="button"
                        className={`option ${form.sex === 'female' ? 'active' : ''}`}
                        onClick={() => setForm(prev => ({ ...prev, sex: 'female' }))}
                      >
                        Female
                      </button>
                    </div>
                  </div>
                </div>

                <div className="form-row two-columns">
                  <div className="label">
                    <label htmlFor="weight">Weight (kg):</label>
                    <input
                      id="weight"
                      type="number"
                      name="weight"
                      value={form.weight}
                      onChange={handleChange}
                      min={0}
                    />
                  </div>

                  <div className="label">
                    <label htmlFor="height">Height (cm):</label>
                    <input
                      id="height"
                      type="number"
                      name="height"
                      value={form.height}
                      onChange={handleChange}
                      min={0}
                    />
                  </div>
                </div>

                <div className="form-row two-columns">
                  <div className="label">
                    <label htmlFor="activityLevel">Activity Level:</label>
                    <select
                      id="activityLevel"
                      name="activityLevel"
                      value={form.activityLevel}
                      onChange={handleChange}
                    >
                      <option value="1.2">Sedentary</option>
                      <option value="1.375">Lightly active</option>
                      <option value="1.55">Moderately active</option>
                      <option value="1.725">Active</option>
                      <option value="1.9">Very active</option>
                    </select>
                  </div>

                  <div className="label">
                    <label htmlFor="extraCalories">Total Calorie Intake:</label>
                    <input
                      id="extraCalories"
                      type="number"
                      name="extraCalories"
                      value={form.extraCalories}
                      onChange={handleChange}
                      min={0}
                    />
                  </div>
                </div>
              </div>
              <div className="button-group">
                <button 
                  type="button" 
                  className="pick-items-btn"
                  onClick={() => navigateWithDelay("/calculator/items")}
                >
                  Pick Items
                </button>
                <button type="submit">Calculate</button>
              </div>
            </form>
          </div>
          
          <div className="results-section">
            <div className="results-panel">
              {results ? (
                <>
                  <h2>Results</h2>
                  <p>Choose what you like:
                    <button
                      className={selectedMode === "walking" ? "active" : ""}
                      onClick={() => setSelectedMode("walking")}
                      style={{ margin: "0 5px", padding: "2px 6px" }}
                    >
                      Walking
                    </button>
                    <button
                      className={selectedMode === "sprinting" ? "active" : ""}
                      onClick={() => setSelectedMode("sprinting")}
                      style={{ margin: "0 5px", padding: "2px 6px" }}
                    >
                      Sprinting
                    </button>
                  </p>
                  <p>BMR: {results.bmr} kcal/day</p>
                  <p>Calories Burned to Survive: {results.tdee} kcal/day</p>
                  {selectedMode === "walking" ? (
                    <p>Walking(5km/h): {results.walkingMinutes} min</p>
                  ) : (
                    <p>Sprinting(8km/h): {results.sprintingMinutes} min</p>
                  )}
                  <p>Push-ups: {results.pushups}</p>
                  <p>Squats: {results.squats}</p>
                </>
              ) : (
                <div style={{ color: "#888", textAlign: "center" }}>
                  <p>Enter your details and press Calculate to see results.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
