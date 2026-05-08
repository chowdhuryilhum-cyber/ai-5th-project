const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cars = require("../mockData");

const router = express.Router();

// Initialize Gemini Client inside a function so it doesn't crash on load
let genAI;
try {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key_to_prevent_crash");
} catch (e) {
  console.error("Failed to init genAI", e);
}

router.post("/", async (req, res) => {
  try {
    const body = req.body || {};
    const message = body.message;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // 1. Ask Gemini to extract search parameters
    const prompt = `
      You are an AI assistant for a used car search platform.
      Extract the following search parameters from the user's message:
      - brand (string, e.g., "BMW", "Toyota", "Honda", null if not specified)
      - price_max (number, maximum price in USD, e.g., 20000, null if not specified)
      - location (string, e.g., "Dhaka", "New York", null if not specified)
      
      User message: "${message}"
      
      Return ONLY a raw JSON object with the extracted parameters. Do not include markdown formatting or backticks.
      Example: {"brand": "BMW", "price_max": 20000, "location": null}
    `;

    let extractedParams = { brand: null, price_max: null, location: null };
    
    if (process.env.GEMINI_API_KEY && genAI) {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      const textResponse = response.text().trim();
      const jsonString = textResponse.replace(/```json/g, "").replace(/```/g, "").trim();
      extractedParams = JSON.parse(jsonString);
    } else {
      const lowerMessage = message.toLowerCase();
      if (lowerMessage.includes("bmw")) extractedParams.brand = "BMW";
      if (lowerMessage.includes("toyota")) extractedParams.brand = "Toyota";
      if (lowerMessage.includes("honda")) extractedParams.brand = "Honda";
      if (lowerMessage.includes("dhaka")) extractedParams.location = "Dhaka";
      
      const priceMatch = lowerMessage.match(/(?:under|<)\s*\$?(\d+)(k)?/);
      if (priceMatch) {
        extractedParams.price_max = parseInt(priceMatch[1]) * (priceMatch[2] ? 1000 : 1);
      }
    }

    console.log("Extracted Params:", extractedParams);

    // 2. Filter the mock database
    const filteredCars = cars.filter(car => {
      let match = true;
      if (extractedParams.brand && car.brand.toLowerCase() !== extractedParams.brand.toLowerCase()) {
        match = false;
      }
      if (extractedParams.price_max && car.price > extractedParams.price_max) {
        match = false;
      }
      if (extractedParams.location && !car.location.toLowerCase().includes(extractedParams.location.toLowerCase())) {
        match = false;
      }
      return match;
    });

    // 3. Formulate AI response message
    let replyText = `I found ${filteredCars.length} cars matching your criteria.`;
    if (filteredCars.length === 0) {
      replyText = "Sorry, I couldn't find any cars matching your criteria.";
    } else if (extractedParams.brand && extractedParams.price_max) {
      replyText = `Here are the ${extractedParams.brand}s I found under $${extractedParams.price_max}:`;
    } else if (extractedParams.brand) {
      replyText = `Here are the ${extractedParams.brand}s I found:`;
    }

    return res.json({
      reply: replyText,
      results: filteredCars,
      debugParams: extractedParams
    });

  } catch (error) {
    console.error("Error processing search:", error);
    return res.status(500).json({ error: "Failed to process search request: " + error.message });
  }
});

module.exports = router;
