export default async function getRecipeFromMistral(ingredientsArr) {
    const res = await fetch("/.netlify/functions/get-recipe-mistral", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients: ingredientsArr })
    })
    const data = await res.json()
    return data.recipe
  }