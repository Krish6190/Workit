"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";

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

export default function Calculator() {
  const [form, setForm] = useState<FormState>({
    age: "25",
    sex: "male",
    weight: "70",
    height: "170",
    activityLevel: "1.2",
    extraCalories: "0",
  });

  const [results, setResults] = useState<Results | null>(null);

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
    const calories = Number(form.extraCalories);
    const weightNum = Number(form.weight);

    const walkingMinutes = weightNum
      ? (calories / (3.5 * weightNum / 60)).toFixed(1)
      : "0";
    const sprintingMinutes = weightNum
      ? (calories / (10 * weightNum / 60)).toFixed(1)
      : "0";
    const pushups = (calories / 0.45).toFixed(0);
    const squats = (calories / 0.13).toFixed(0);

    setTimeout(() => {
      setResults({
        bmr: bmr.toFixed(0),
        tdee: tdee.toFixed(0),
        walkingMinutes,
        sprintingMinutes,
        pushups,
        squats,
      });
    }, 500);
  }

  return (
    <div className="calculator-container">
      <form className="calculator-form" onSubmit={handleSubmit}>
        <h1>Calorie Burn Calculator</h1>

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

        <div className="label">
          <label htmlFor="sex">Sex:</label>
          <select
            id="sex"
            name="sex"
            value={form.sex}
            onChange={handleChange}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

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
          <label htmlFor="extraCalories">Extra Calories Consumed:</label>
          <input
            id="extraCalories"
            type="number"
            name="extraCalories"
            value={form.extraCalories}
            onChange={handleChange}
            min={0}
          />
        </div>

        <button type="submit">Calculate</button>
      </form>

      <div className="results-panel">
        {results ? (
          <>
            <h2>Results</h2>
            <p>BMR: {results.bmr} kcal/day</p>
            <p>Total Calories Burned to Survive: {results.tdee} kcal/day</p>
            <p>Walking minutes to burn extra calories: {results.walkingMinutes}</p>
            <p>Sprinting minutes to burn extra calories: {results.sprintingMinutes}</p>
            <p>Push-ups needed: {results.pushups}</p>
            <p>Squats needed: {results.squats}</p>
          </>
        ) : (
          <div style={{ color: "#888", textAlign: "center"}}>
            <p>Enter your details and press Calculate to see results.</p>
          </div>
        )}
      </div>
    </div>
  );
}
