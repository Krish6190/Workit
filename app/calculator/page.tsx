"use client"
import React, { useState, ChangeEvent } from "react";

interface FormState {
  age: number;
  sex: "male" | "female";
  weight: number; 
  height: number; 
  activityLevel: number;
  extraCalories: number;
}

interface Results {
  bmr: string;
  tdee: string;
  walkingMinutes: string;
  sprintingMinutes: string;
  pushups: string;
  squats: string;
}

export default function Calculator() {
  const [form, setForm] = useState<FormState>({
    age: 25,
    sex: "male",
    weight: 70,
    height: 170,
    activityLevel: 1.2,
    extraCalories: 0,
  });

  const [results, setResults] = useState<Results | null>(null);

  function calculateBMR({ age, sex, weight, height }: FormState): number {
    if (sex === "male") {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "sex" ? value : Number(value),
    }));
  }

  function calculate() {
    const bmr = calculateBMR(form);
    const tdee = bmr * form.activityLevel;
    const calories = form.extraCalories;

    const walkingMinutes = (calories / (3.5 * form.weight / 60)).toFixed(1);
    const sprintingMinutes = (calories / (10 * form.weight / 60)).toFixed(1);
    const pushups = (calories / 0.45).toFixed(0);
    const squats = (calories / 0.13).toFixed(0);

    setResults({
      bmr: bmr.toFixed(0),
      tdee: tdee.toFixed(0),
      walkingMinutes,
      sprintingMinutes,
      pushups,
      squats,
    });
  }

  return (
    <div className="results">
      <h1>Calorie Burn Calculator</h1>
      <label>
        Age:{" "}
        <input
          type="number"
          name="age"
          value={form.age}
          onChange={handleChange}
          min={0}
        />
      </label>
      <br />
      <label>
        Sex:{" "}
        <select name="sex" value={form.sex} onChange={handleChange}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </label>
      <br />
      <label>
        Weight (kg):{" "}
        <input
          type="number"
          name="weight"
          value={form.weight}
          onChange={handleChange}
          min={0}
        />
      </label>
      <br />
      <label>
        Height (cm):{" "}
        <input
          type="number"
          name="height"
          value={form.height}
          onChange={handleChange}
          min={0}
        />
      </label>
      <br />
      <label>
        Activity Level:{" "}
        <select
          name="activityLevel"
          value={form.activityLevel}
          onChange={handleChange}
        >
          <option value={1.2}>Sedentary</option>
          <option value={1.375}>Lightly active</option>
          <option value={1.55}>Moderately active</option>
          <option value={1.725}>Active</option>
          <option value={1.9}>Very active</option>
        </select>
      </label>
      <br />
      <label>
        Extra Calories Consumed:{" "}
        <input
          type="number"
          name="extraCalories"
          value={form.extraCalories}
          onChange={handleChange}
          min={0}
        />
      </label>
      <br />
      <button onClick={calculate}>Calculate</button>

      {results && (
        <div style={{ marginTop: 20 }}>
          <h2>Results</h2>
          <p>BMR: {results.bmr} kcal/day</p>
          <p>Toal Calories Burned to Survive: {results.tdee} kcal/day</p>
          <p>Walking minutes to burn extra calories: {results.walkingMinutes}</p>
          <p>Sprinting minutes to burn extra calories: {results.sprintingMinutes}</p>
          <p>Push-ups needed: {results.pushups}</p>
          <p>Squats needed: {results.squats}</p>
        </div>
      )}
    </div>
  );
}
