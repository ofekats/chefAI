import fetch from "node-fetch";

export async function handler(event) {
  try {
    console.log("getImage handler started");

    const { prompt } = JSON.parse(event.body || "{}");
    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No prompt provided" }),
      };
    }


    const apiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&seed=42`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      const errorText = await response.text();
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: errorText }),
      };
    }


    const arrayBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    return {
      statusCode: 200,
      body: JSON.stringify({ image: base64Image }),
    };

  } catch (error) {
    console.error("Unexpected error in getImage handler:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Unexpected server error", details: error.message }),
    };
  }
}
