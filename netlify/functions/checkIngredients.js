import fs from "fs/promises";
import path from "path";
import fetch from "node-fetch";

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const INGREDIENTS_FILE = path.resolve("netlify/functions/data/verifiedIngredients.json");


async function readIngredientsFile() {
  try {
    const data = await fs.readFile(INGREDIENTS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function writeIngredientsFile(data) {
  await fs.writeFile(INGREDIENTS_FILE, JSON.stringify(data, null, 2));
}

async function checkIngredientWithAPI(ingredient) {
  const url = `https://api.spoonacular.com/food/ingredients/search?query=${encodeURIComponent(
    ingredient
  )}&number=1&apiKey=${SPOONACULAR_API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Spoonacular API error");
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

    const localIngredients = await readIngredientsFile();
    
    let allValid = true;

    for (const ing of ingredients) {
      const lowerIng = ing.toLowerCase();

      if (localIngredients[lowerIng]) {
        console.log(lowerIng, "already in the ingredient file")
        continue;
    }

      const valid = await checkIngredientWithAPI(lowerIng);

      if (valid) {
        const corrected = valid.correctedName;
        localIngredients[corrected] = true;
        if (corrected !== lowerIng) {
            corrections[lowerIng] = corrected;
        }
      } else {
        allValid = false;
        break;
      }
    }
    console.log("corrections:",corrections)
    await writeIngredientsFile(localIngredients);
    return {
      statusCode: 200,
      body: JSON.stringify({
        answer: allValid ? "YES" : "NO",
        corrections,
        }),
    };
  } catch (err) {
    console.log(err)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
