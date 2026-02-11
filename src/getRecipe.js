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


// export async function getImageFromRecipe(prompt) {
//   const res = await fetch("/.netlify/functions/getImage", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ prompt })
//   })
//   if (!res.ok) {
//     const errorData = await res.json();
//     console.error("Image generation error:", errorData);
//       return null;
//   }
//   const data = await res.json();
//   console.log("image data:", data.imageUrl)
//   // if (!data.image || typeof data.image !== "string") {
//   //   console.error("No image returned from API:", data);
//   //   return null;
//   // }

//   return data.imageUrl; 
// } 
export async function getImageFromRecipe(prompt) {
  const res = await fetch("/.netlify/functions/getImage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    console.error("Image generation error:", errorData);
    return null;
  }

  const data = await res.json();
  return data.image;  // זה כבר Base64
}



export function extractTitle(recipeText) {
  const lines = recipeText.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('#') || trimmed.startsWith('**')) {
      return line.replace('# ', '').replaceAll('*', '').trim();
    }
  }
  return '';
}
