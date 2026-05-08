const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cars = require("../mockData");

const router = express.Router();

// Initialize Gemini Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key_to_prevent_crash");

router.post("/", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
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

    // Only call Gemini if a real API key is present, otherwise fallback to basic keyword matching for demonstration
    let extractedParams = { brand: null, price_max: null, location: null };
    
    if (process.env.GEMINI_API_KEY) {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      const textResponse = response.text().trim();
      // Clean up potential markdown formatting (if Gemini includes ```json)
      const jsonString = textResponse.replace(/```json/g, "").replace(/```/g, "").trim();
      extractedParams = JSON.parse(jsonString);
    } else {
      // Basic fallback logic for when API key is not yet provided by the user
      const lowerMessage = message.toLowerCase();
      if (lowerMessage.includes("bmw")) extractedParams.brand = "BMW";
      if (lowerMessage.includes("toyota")) extractedParams.brand = "Toyota";
      if (lowerMessage.includes("honda")) extractedParams.brand = "Honda";
      if (lowerMessage.includes("dhaka")) extractedParams.location = "Dhaka";
      
      // Simple price extraction like "$20k" or "20000"
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

    res.json({
      reply: replyText,
      results: filteredCars,
      debugParams: extractedParams
    });

  } catch (error) {
    console.error("Error processing search:", error);
    res.status(500).json({ error: "Failed to process search request" });
  }
});

module.exports = router;
