# Technical Constraints

## Technology Stack

Frontend:

* Next.js
* TypeScript
* Tailwind CSS

## Nutrition Data Source

USDA FoodData Central API

The application should use USDA FoodData Central as the primary source of nutrition data.

Required nutrition values:

* Calories
* Protein
* Carbohydrates
* Fat
* Fiber

## MVP Requirements

* No authentication
* No database required for V1
* Nutrition data fetched directly from USDA API
* Users can build meals using multiple ingredients
* All calculations should happen client-side after nutrition data is retrieved

## Future Enhancements

* Saved meals
* User accounts
* LLM-based meal parsing
