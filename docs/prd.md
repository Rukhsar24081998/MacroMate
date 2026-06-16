# Product Requirements Document

# Product Name

MacroMate

## Product Vision

Enable fitness-focused individuals to instantly understand the nutritional value of custom meals without performing manual calculations.

---

## Product Goal

Provide a simple meal-building experience that calculates calories, macronutrients, and key nutritional information using trusted nutrition data.

---

## Data Source

Primary Source:

USDA FoodData Central API

Reasoning:

* Reliable and standardized nutrition data
* Large food catalog
* Supports calorie, macro, and micronutrient calculations
* Eliminates the need to manually maintain food records during MVP

---

## User Story

As a fitness-focused individual,

I want to enter ingredients and quantities,

so that I can instantly understand the nutritional value of my meal and make informed nutrition decisions.

---

## Core User Flow

1. Search for a food item.
2. Select a food item.
3. Enter quantity.
4. Add ingredient to meal.
5. Repeat for additional ingredients.
6. View total nutritional summary.

---

## MVP Features

### Food Search

Users can search foods using USDA FoodData Central API.

### Quantity Input

Supported units:

* Grams
* Milliliters
* Servings

### Meal Builder

Users can add multiple ingredients to a meal.

### Nutrition Calculation

Calculate:

* Calories
* Protein
* Carbohydrates
* Fat
* Fiber

### Meal Summary

Display meal-level nutritional totals.

---

## Out of Scope

* Authentication
* Social features
* Barcode scanning
* Photo recognition
* Workout tracking
* Diet recommendations
* Wearable integrations

---

## Success Metrics

### North Star Metric

Meals successfully calculated per active user per week.

### Supporting Metrics

* Meal completion rate
* Average ingredients per meal
* Time to create meal
* Weekly active users
* Repeat usage rate

---

## Assumptions

1. Users value convenience over perfect precision.
2. Most users primarily care about calories and protein.
3. Reducing calculation effort increases consistency.
