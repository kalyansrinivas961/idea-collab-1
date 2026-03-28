const Groq = require("groq-sdk");

// Check if API key is loaded
if (!process.env.GROQ_API_KEY) {
  console.error("CRITICAL ERROR: GROQ_API_KEY is not defined in the environment!");
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

const getAIResponse = async (req, res) => {
  const { message, history } = req.body;
  
  if (!message) {
    return res.status(400).json({ message: "Message is required" });
  }

  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("Groq API key is missing. Please check your .env file.");
    }

    // System prompt to set context
    const systemInstruction = `You are the IdeaCollab AI Assistant. 
    IdeaCollab is a platform where users can post startup ideas, collaborate with others, and find developers or designers.
    Your goal is to help users navigate the platform and provide advice on their business ideas.
    Keep your responses helpful, concise, and professional. Use Markdown for formatting if needed.`;

    // Format history for Groq (expects { role, content })
    // history might be in Gemini format { role, parts: [{ text }] } or standard { role, content }
    const formattedHistory = (history || []).map(h => {
      if (h.parts && h.parts[0]) {
        return {
          role: h.role === "model" ? "assistant" : "user",
          content: h.parts[0].text
        };
      }
      return {
        role: h.role === "model" ? "assistant" : h.role,
        content: h.content || h.text
      };
    });

    const messages = [
      { role: "system", content: systemInstruction },
      ...formattedHistory,
      { role: "user", content: message }
    ];

    console.log("Sending message to Groq (llama-3.3-70b-versatile):", message);
    const chatCompletion = await groq.chat.completions.create({
      messages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    const response = chatCompletion.choices[0]?.message?.content || "";
    console.log("Received response from Groq:", response);

    res.json({ response });
  } catch (error) {
    console.error("Groq AI Full Error Details:", {
      message: error.message,
      stack: error.stack,
      apiKeyPresent: !!process.env.GROQ_API_KEY,
    });
    res.status(500).json({ 
      message: "AI processing failed", 
      details: error.message 
    });
  }
};

const enhanceDescription = async (req, res) => {
  const { text, mode, title, category } = req.body;

  if (!text && mode !== "generate") {
    return res.status(400).json({ message: "Text is required" });
  }

  try {
    let systemInstruction = `You are an expert startup consultant and copywriter for IdeaCollab. 
    Your goal is to help users improve their startup idea descriptions. 
    Always maintain a high standard of quality, clarity, and engagement.
    Keep the output within 2000 characters.`;

    let userPrompt = "";

    switch (mode) {
      case "professional":
        userPrompt = `Rewrite this startup idea description to be more professional, formal, and suitable for investors: "${text}"`;
        break;
      case "creative":
        userPrompt = `Rewrite this startup idea description to be more creative, visionary, and inspiring: "${text}"`;
        break;
      case "concise":
        userPrompt = `Make this startup idea description more concise and punchy, while keeping all key information: "${text}"`;
        break;
      case "expand":
        userPrompt = `Expand this brief startup idea or problem description into a comprehensive, engaging narrative. 
        Provide detailed context, potential use cases, and elaborate on the core value proposition. 
        The original text is: "${text}". 
        Title: "${title || "N/A"}". 
        Category: "${category || "N/A"}". 
        Return ONLY the expanded description, no conversational text.`;
        break;
      case "grammar":
        userPrompt = `Correct the grammar, spelling, and punctuation of this description without changing its meaning: "${text}"`;
        break;
      case "suggest":
        userPrompt = `The user is writing a description for an idea titled "${title || "N/A"}" in the category "${category || "N/A"}". They have written: "${text}". Provide 2-3 short, contextually relevant sentences to complete or continue their thought. Return ONLY the suggested additions, no conversational text.`;
        break;
      case "generate":
        userPrompt = `Generate a compelling startup idea description based on the title "${title || "Untitled"}" and category "${category || "General"}".`;
        break;
      default:
        userPrompt = `Refine and improve this startup idea description for better clarity and impact: "${text}"`;
    }

    const messages = [
      { role: "system", content: systemInstruction },
      { role: "user", content: userPrompt }
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    const response = chatCompletion.choices[0]?.message?.content || "";
    
    // For suggestions, we might want to clean up the output
    let finalResponse = response.trim();
    if (mode === "suggest") {
      // Remove quotes if the AI added them
      finalResponse = finalResponse.replace(/^["']|["']$/g, "");
    }

    res.json({ 
      enhancedText: finalResponse,
      metadata: {
        mode,
        timestamp: new Date().toISOString(),
        model: "llama-3.3-70b-versatile"
      }
    });
  } catch (error) {
    console.error("Groq AI Enhancement Error:", error);
    res.status(500).json({ message: "Failed to enhance description", details: error.message });
  }
};

module.exports = { getAIResponse, enhanceDescription };
