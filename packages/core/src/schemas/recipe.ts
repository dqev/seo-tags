import type { RecipeSchema } from '../types.js';

export function buildRecipeSchema(data: RecipeSchema): Record<string, any> {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: data.name,
    image: data.image,
    author: {
      '@type': 'Person',
      name: data.author
    },
    recipeIngredient: data.ingredients,
    recipeInstructions: data.instructions.map(inst => ({
      '@type': 'HowToStep',
      text: inst.text
    }))
  };

  if (data.description) schema.description = data.description;
  if (data.prepTime) schema.prepTime = data.prepTime;
  if (data.cookTime) schema.cookTime = data.cookTime;
  if (data.totalTime) schema.totalTime = data.totalTime;
  if (data.servings) schema.recipeYield = data.servings;
  
  if (data.calories) {
    schema.nutrition = {
      '@type': 'NutritionInformation',
      calories: data.calories
    };
  }

  if (data.rating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: data.rating.value,
      reviewCount: data.rating.count
    };
  }

  return schema;
}
