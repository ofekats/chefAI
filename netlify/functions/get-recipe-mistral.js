
import { InferenceClient  } from '@huggingface/inference'

const hf =  new InferenceClient(process.env.HF_ACCESS_TOKEN);


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

    console.log("FULL RESPONSE:", JSON.stringify(response, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ recipe: response.choices[0].message.content })
    }

  } catch (err) {
    console.error("ERROR in handler:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    }
  }
}
