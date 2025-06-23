import fetch from "node-fetch";

export async function handler(event) {
  try {
    console.log("Generating image from recipe...");

    const { prompt } = JSON.parse(event.body || "{}");
    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No prompt provided" }),
      };
    }
    console.log("before");
    const response = await fetch("https://api.1min.ai/api/features", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-KEY": process.env.ONE_MIN_AI_KEY, 
      },
      body: JSON.stringify({
        type: "IMAGE_GENERATOR",
        model: "midjourney",
        promptObject: {
          prompt: prompt,
          num_outputs: 1,
          aspect_ratio: "1:1",
        },
      }),
    });
    console.log("after data");
    const data = await response.json();
    console.log("into json");
    console.log("response:", response);
    
    if (!response.ok) {
      console.error("Image generation error:", data);
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: "Image generation failed",
          details: data,
        }),
      };
    }

    if (!data.outputs || data.outputs.length === 0) {
      console.error("No image output received:", data);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "No image output received",
          details: data,
        }),
      };
    }
    const imageUrl = data.outputs[0].url || data.outputs[0];
    console.log("imageUrl:", imageUrl);

    console.log("Image generated:", imageUrl);

    return {
      statusCode: 200,
      body: JSON.stringify({ imageUrl }),
    };
  } catch (err) {
    console.error("Unexpected error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Unexpected error occurred",
        details: err.message || err.toString(),
      }),
    };
  }
}
