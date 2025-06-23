export default async function getRecipeFromMistral(ingredientsArr) {
    const res = await fetch("/.netlify/functions/get-recipe-mistral", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients: ingredientsArr })
    })
    const data = await res.json()
    return data.recipe
  }

export async function checkIngredients(ingredientsArr) {
    const res = await fetch("/.netlify/functions/checkIngredients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients: ingredientsArr })
    })
    const data = await res.json()
    return data
  }  


export async function getImageFromRecipe(prompt) {
  console.log("prompt:", prompt)
  const res = await fetch("/.netlify/functions/getImage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  })
  const data = await res.json()
  return data.imageUrl
} 

export function extractTitle(recipeText) {
  const lines = recipeText.split('\n');
  for (const line of lines) {
    if (line.startsWith('### ')) {
      return line.replace('### ', '').trim();
    }
  }
  return '';
}
