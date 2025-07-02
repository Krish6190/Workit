# Calorie Burn Calculator

A modern web application built with Next.js that helps users estimate the amount of exercise needed to burn off extra calories consumed. Enter your personal details and extra calorie intake, and the app calculates your Basal Metabolic Rate (BMR), Total Daily Energy Expenditure (TDEE), and the number of minutes or reps required for various exercises to balance your energy intake.

---

## Features

- **Personalized Calculations:** Input your age, sex, weight, height, and activity level for tailored results.
- **BMR & TDEE Estimates:** Calculates your Basal Metabolic Rate and Total Daily Energy Expenditure.
- **Exercise Equivalents:** See how many minutes of walking/sprinting, or how many push-ups/squats, are needed to burn your extra calories.
- **Educational:** Transparent about formulas and assumptions, helping users understand their energy balance.

---

## Formulas Used

- **BMR (Mifflin-St Jeor Equation):**
  - Men: `10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5`
  - Women: `10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161`
- **TDEE:** `BMR × Activity Factor`
- **Calories Burned (per activity):**
  - Walking: `3.5 MET × weight(kg) × duration(hours)`
  - Sprinting: `10 MET × weight(kg) × duration(hours)`
  - Push-ups: `~0.45 calories per rep`
  - Squats: `~0.13 calories per rep`

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**
git clone https://github.com/Krish6190/Workit.git
cd Workit


2. **Install dependencies:**
npm install

or
yarn install


3. **Run the development server:**
npm run dev

or
yarn dev


4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage

1. Enter your personal details (age, sex, weight, height, activity level).
2. Enter the number of extra calories you’ve consumed.
3. Click **Calculate** to see your BMR, TDEE, and the exercise equivalents needed to burn off the extra calories.

---

## Disclaimer

All calculations are **estimates** based on standard formulas and MET values. Actual calorie burn may vary depending on individual metabolism, exercise intensity, and other factors. This tool is for informational and motivational purposes only and should not be used as a substitute for professional medical or fitness advice.

---

## License

This project is open-source and available under the [MIT License](LICENSE).

---

**Contributions are welcome!**  
Feel free to open issues or submit pull requests for improvements.
