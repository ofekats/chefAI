import fetch from "node-fetch";

export async function handler(event) {
  try {
    console.log("getImage handler started");

    const { prompt } = JSON.parse(event.body || "{}");
    console.log("Received prompt:", prompt);

    if (!prompt) {
      console.log("No prompt provided in request body");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No prompt provided" }),
      };
    }

    const apiUrl = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev";

    console.log("Sending request to external API:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    console.log("External API response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response from external API:", errorText);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: errorText }),
      };
    }

    const imageBuffer = await response.arrayBuffer();
    console.log("Received image buffer of length:", imageBuffer.byteLength);

    const base64Image = Buffer.from(imageBuffer).toString("base64");

    return {
  statusCode: 200,
  body: JSON.stringify({
    image: base64Image,
  }),
};


  } catch (error) {
    console.error("Unexpected error in getImage handler:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Unexpected server error",
        details: error.message || error.toString(),
      }),
    };
  }
}
