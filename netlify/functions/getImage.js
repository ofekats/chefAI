import { InferenceClient } from "@huggingface/inference";

const hf = new InferenceClient(process.env.HF_ACCESS_TOKEN);

export async function handler(event) {
  try {
    console.log("getImage handler started");

    const { prompt } = JSON.parse(event.body || "{}");
    console.log("Received prompt:", prompt);

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No prompt provided" }),
      };
    }

    // מודל חינמי יותר של Hugging Face
    const model = "stabilityai/stable-diffusion-2";

    console.log("Sending request to model:", model);

    const imageBytes = await hf.textToImage({
      model,
      inputs: prompt,
      parameters: {
        width: 512,
        height: 512,
        guidance_scale: 7.5,
      },
    });

    console.log("Received image bytes length:", imageBytes.byteLength);

    const base64Image = Buffer.from(imageBytes).toString("base64");

    return {
      statusCode: 200,
      body: JSON.stringify({ image: base64Image }),
    };
  } catch (error) {
    console.error("Unexpected error in getImage handler:", error);

    // טיפול בשגיאות קרדיטים או מודל שלא נמצא
    let errorMessage = error.message || error.toString();
    if (error?.httpResponse?.body?.error) {
      errorMessage = error.httpResponse.body.error;
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to generate image",
        details: errorMessage,
      }),
    };
  }
}
