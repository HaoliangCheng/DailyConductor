const MODEL = "gemini-3-flash-preview";  // Replace with your LLM model
const GEMINI_API_KEY = "AI123456789"; // Replace with your key
const RECIPIENT_EMAIL = "test@test.com"; // Replace with your Gmail
const PROMPT_TEMPLATE = `
Act as a Senior AI Staff Engineer. Your audience is a technical peer who values high-density information and low-noise signals.
Your task is to find and summarize at least 5 significant Twitter posts, research papers, technical blog posts, and GitHub projects published yesterday that focus on:
- AI application
- AI Agents designing: Multi-agent systems, tool-use, or planning.
- Reinforcement Learning: RLVR, RLHF, or discovery of new algorithms.

For each item, provide:
1. Title (with a link to the source)
2. Key Contribution: A 2-sentence summary of why this work matters.
3. Practical Takeaway: How this might impact the development of agentic systems.

Focus on high-signal sources like GitHub projects, Twitter posts, arXiv, Hugging Face Daily Papers, and reputable technical blogs (e.g., OpenAI, DeepMind, Anthropic, open-source companies).

Output Formatting (Email Style):
Do not use Markdown, not include email subject. Only provide the response in a clean, professional email main content format (using standard text spacing or HTML).

Output Example:
"""
Dear XXX,
This is today's AI news you may interested:
1.
2.

Bests,
Your AI assistant
"""
`; // Replace with your prompt request

/**
 * Main function to fetch AI digest and send via email with retry logic.
 */
function sendDailyAiDigest() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;
  const date = new Date();
  date.setDate(date.getDate() - 1);
  const formattedDate = date.toLocaleDateString();

  const payload = {
    contents: [{
      parts: [{ text: PROMPT_TEMPLATE }]
    }],
    tools: [
      { google_search: {} }
    ]
  };

  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true // We'll handle the status codes manually for the retry logic
  };

  const maxRetries = 5;
  let lastError = null;
  let response = null;

  // Retry Loop
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      response = UrlFetchApp.fetch(url, options);
      const statusCode = response.getResponseCode();

      // Check if the response is successful (2xx range)
      if (statusCode >= 200 && statusCode < 300) {
        const json = JSON.parse(response.getContentText());
        
        // Extract text from Gemini response
        const aiResponse = json.candidates[0].content.parts[0].text;
        const htmlContent = `<div style="line-height: 1.15; font-family: Arial, sans-serif; white-space: pre-wrap;">${aiResponse}</div>`;
        
        // Send the successful email
        MailApp.sendEmail({
          to: RECIPIENT_EMAIL,
          subject: `Daily AI Digest: ${formattedDate}`,
          body: aiResponse, // Plain text fallback
          htmlBody: htmlContent // This forces the tight spacing
        });
        
        Logger.log(`Email sent successfully on attempt ${attempt}!`);
        return; // Exit function on success
      } else {
        lastError = `HTTP Error ${statusCode}: ${response.getContentText()}`;
      }
    } catch (e) {
      lastError = e.toString();
    }

    // If we're here, the attempt failed. Log and wait before retrying (exponential backoff)
    Logger.log(`Attempt ${attempt} failed: ${lastError}`);
    if (attempt < maxRetries) {
      const waitTime = 10000;
      Utilities.sleep(waitTime);
    }
  }

  // If we reach here, all retries failed
  handleFailure(lastError, formattedDate);
}

/**
 * Sends an error report if all retries fail.
 */
function handleFailure(error, date) {
  const errorMessage = `Daily AI Digest failed after 5 attempts for ${date}.\n\nError Details:\n${error}`;
  
  MailApp.sendEmail({
    to: RECIPIENT_EMAIL,
    subject: `FAILURE: Daily AI Digest - ${date}`,
    body: errorMessage
  });
  
  Logger.log("Final failure. Error email sent.");
}