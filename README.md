# Daily Conductor: AI-Powered Information Automator

**Daily Conductor** is a lightweight, flexible Google Apps Script that uses Google's Gemini models to curate and email you any information you need every single day. Whether it's the latest research in AI, daily financial news, weather summaries, or personalized learning topics, this script handles the heavy lifting of searching and summarizing.

Whether you're a developer or someone looking to automate their daily routine, you'll find Google Apps Script perfect for this. It's **completely free to use**, and it handles the scheduling and the Gmail integration natively without requiring any advanced setup.

Since the Gemini API uses the `google_search` tool, it can browse the live web to find real-time information and summarize it for you. 

## 🔗 Live Example
You can view a read-only version of the script directly on Google Apps Script here: [Daily Conductor Example](https://script.google.com/d/1f0LxnL6vbLiqZ3_Ad-5YksJTPKUcGeC9uCHE_MyxOY04pf5PNdwvd81j/edit?usp=sharing)

## Key Features
- **Flexible Models**: Switch between any Gemini model (e.g., `gemini-3-flash`, `gemini-3-pro`).
- **Customizable Prompts**: Change the `PROMPT_TEMPLATE` to receive any type of digest (AI, News, Weather, Stocks, etc.).
- **Built-in Retry Logic**: Automatically retries up to 5 times with exponential backoff if the API request fails.
- **Error Notifications**: Sends you an email if the script fails after all retry attempts.

---

## ⚠️ Security Warning
**NEVER commit your actual `GEMINI_API_KEY` to GitHub.** 
The provided `Code.gs` uses a placeholder. Always keep your keys in a safe place and do not share them publicly.

## Setup Instructions

### Step 1: Get your API Key
1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Create a new API Key.

### Step 2: The Script & Customization
1. Go to [script.new](https://script.new/) to create a new Google Apps Script project.
2. Paste the contents of `Code.gs` into the editor.
3. **Customize the constants** at the top of the script:
   - `MODEL`: Set your preferred model (e.g., `"gemini-3-flash-preview"` for speed or `"gemini-3-pro"` for complex reasoning).
   - `GEMINI_API_KEY`: Paste your API key from Step 1.
   - `RECIPIENT_EMAIL`: The email address where you want to receive the digest.
   - `PROMPT_TEMPLATE`: Change this to define what information you want to receive and how it should be formatted.

### Step 3: Automate it (The "Everyday" Part)
1. In the Apps Script editor, click the **Triggers** (alarm clock icon) on the left sidebar.
2. Click **+ Add Trigger** at the bottom right.
3. Choose which function to run: `sendDailyAiDigest`.
4. Select event source: **Time-driven**.
5. Select type of time based trigger: **Day timer**.
6. Select time of day: (e.g., 6am to 7am).
7. Click **Save**. 

*Note: You will need to authorize the script to send emails and connect to external services during the first run or when saving the trigger.*

---

## Example Output
When configured for AI updates, your daily email will look like this:

> **Subject:** Daily AI Digest: 1/1/2026
>
> Dear XXX,
> This is today's AI updates:
>
> 1. **Title:** [DeepSeek-V3: Advancing Open-Source LLMs](https://arxiv.org/abs/2412.19437)
>    - **Key Contribution:** Introduces a multi-head latent attention mechanism and an auxiliary-loss-free load balancing strategy.
>    - **Practical Takeaway:** Demonstrates that high-performance models can be trained with significantly lower computational costs.
>
> ...
>
> Bests,
> Your AI assistant

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
