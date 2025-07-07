# Calorie Burn Calculator

A modern web application built with Next.js that helps users estimate the amount of exercise needed to burn off extra calories consumed. Enter your personal details and extra calorie intake, and the app calculates your Basal Metabolic Rate (BMR), Total Daily Energy Expenditure (TDEE), and the number of minutes or reps required for various exercises to balance your energy intake.

---

## Features

- **Personalized Calculations:** Input your age, sex, weight, height, and activity level for tailored results.
- **BMR & TDEE Estimates:** Calculates your Basal Metabolic Rate and Total Daily Energy Expenditure.
- **Exercise Equivalents:** See how many minutes of walking or sprinting, or how many push-ups or squats, are needed to burn your extra calories.
- **Interactive Choice:** After calculation, choose to see either walking or sprinting time, with push-ups and squats always displayed.
- **Educational:** Transparent about formulas and assumptions, helping users understand their energy balance.
- **Modern UI:** Responsive and user-friendly design.

---

## Formulas Used

- **BMR (Mifflin-St Jeor Equation):**
  - Men: `10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5`
  - Women: `10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161`
- **TDEE:** `BMR × Activity Factor`
- **Calories Burned (per activity):**
  - Walking: `3.5 MET × weight(kg) × duration(hours)`
  - Sprinting: `11 MET × weight(kg) × duration(hours)`
  - Push-ups: `~0.45 calories per rep`
  - Squats: `~0.13 calories per rep`
- **Exercise Distribution Logic:**
  - If walking time to burn all extra calories is ≤ 5 min: all calories assigned to walking.
  - If walking time > 5 min: first 5 min worth of calories to walking; remaining calories are split equally into walking, push-ups, and squats.
  - Sprinting time is also calculated the same way.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**
git clone https://github.com/Krish6190/Workit.git
cd Workit

text

2. **Install dependencies:**
npm install

text
or
yarn install

text

3. **Run the development server:**
npm run dev

text
or
yarn dev

text

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage

1. Enter your personal details (age, sex, weight, height, activity level).
2. Enter the number of extra calories you’ve consumed.
3. Click **Calculate** to see your BMR, TDEE, and the exercise equivalents needed to burn off the extra calories.
4. After calculation, choose to view either walking or sprinting time; push-ups and squats are always displayed.

---

## Disclaimer

All calculations are **estimates** based on standard formulas and MET values. Actual calorie burn may vary depending on individual metabolism, exercise intensity, and other factors. This tool is for informational and motivational purposes only and should not be used as a substitute for professional medical or fitness advice.

---

## License

This project is open-source and available under the [MIT License](LICENSE).

---

**Contributions are welcome!**  
Feel free to open issues or submit pull requests for improvements and new features.
