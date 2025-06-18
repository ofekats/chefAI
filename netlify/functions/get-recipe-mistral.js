
import { InferenceClient  } from '@huggingface/inference'
import { CohereClient } from 'cohere-ai';

const hf =  new InferenceClient(process.env.HF_ACCESS_TOKEN);
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY, // Initialize with API key directly
});

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. 
You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, 
but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page.
`


export async function handler(event) {
    console.log("here")
  try {
    console.log("ingredients:", event.body)
    const { ingredients } = JSON.parse(event.body || "{}")

    const ingredientsString = ingredients.join(", ")

    const response = await hf.chatCompletion({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!` }
      ],
      max_tokens: 1024
    })

    return {
      statusCode: 200,
      body: JSON.stringify({ recipe: response.choices[0].message.content })
    }

  } catch (err) {
    console.log("trying again with a diffrent model")
    console.warn('Hugging Face failed, trying Cohere fallback:', err)
    try {
      const { ingredients } = JSON.parse(event.body || '{}')
      const ingredientsString = ingredients.join(', ')

      const cohereResponse = await cohere.generate({
        model: 'command-r-plus',
        prompt: `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. 
You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, 
but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page.

Please return the recipe with the following markdown structure:
### Recipe Title
#### Ingredients
- ...
#### Instructions
1. ...

The ingredients are: ${ingredientsString}
Please provide a recipe.`,
        max_tokens: 300,
        temperature: 0.7,
      })

      const recipeText = cohereResponse.generations?.[0]?.text || "No recipe returned";
      console.log(recipeText)
      return {
        statusCode: 200,
        body: JSON.stringify({ recipe: recipeText }),
      }
    } catch (fallbackErr) {
      console.error('Fallback Cohere model also failed:', fallbackErr)
      return {
        statusCode: 500,
        body: JSON.stringify({ error: `Both models failed. ${fallbackErr.message}` }),
      }
    }
  }
}
