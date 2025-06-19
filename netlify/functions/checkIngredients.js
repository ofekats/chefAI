import fetch from "node-fetch";

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;


async function checkIngredientWithAPI(ingredient) {
  const url = `https://api.spoonacular.com/food/ingredients/search?query=${encodeURIComponent(
    ingredient
  )}&number=1&apiKey=${SPOONACULAR_API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 402 && json.message?.includes("daily points limit")) {
      const error = new Error("Spoonacular API daily limit reached");
      error.code = 402;
      throw error;
    }
    throw new Error("Spoonacular API error");
  }
  const json = await res.json();

  if (json.results && json.results.length > 0) {
    const firstResult = json.results[0];
    console.log(`You searched for: "${ingredient}", closest match: "${firstResult.name}"`);
    return { valid: true, correctedName: firstResult.name.toLowerCase() };
  }

  return { valid: false };
}

export async function handler(event) {
  try {
    const { ingredients } = JSON.parse(event.body);
    const corrections = {};
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Ingredients must be a non-empty array" }),
      };
    }

    let allValid = true;

    for (const ing of ingredients) {
      const lowerIng = ing.toLowerCase();

      const valid = await checkIngredientWithAPI(lowerIng);

      if (valid) {
        const corrected = valid.correctedName;
        if(!corrected){
            return {
            statusCode: 500,
            body: JSON.stringify({ error: "ingredient undefined in the API" }),
            };
        }
        if (corrected !== lowerIng) {
            corrections[lowerIng] = corrected;
        }
      } else {
        allValid = false;
        break;
      }
    }
    console.log("corrections:",corrections)
    return {
      statusCode: 200,
      body: JSON.stringify({
        answer: allValid ? "YES" : "NO",
        corrections,
        }),
    };
  } catch (err) {
    if (err.code === 402) {
      return {
        statusCode: 503, // 503 Service Unavailable
        body: JSON.stringify({
          error: "Sorry, the Spoonacular API daily limit has been reached. Please try again later.",
        }),
      };
    }

    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
