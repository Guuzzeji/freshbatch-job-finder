---
name: trend-tweet-drafter
description: Analyzes code changes, searches the web for current trends/memes, and drafts engaging, naturally-voiced Twitter/X posts.
license: MIT
---

## What I do
1. I take a git diff, a summary of recent commits, or a manual description of a change.
2. I use my available web search tools to identify today's tech trends, active developer memes, and popular discussions.
3. I align the technical value of your change with these trends to maximize engagement.
4. I generate multiple draft options for a Twitter/X post that sound completely human and natural.

## When to use me
Use this skill when you have just shipped a feature, fixed a bug, or completed a project and want to share it on social media in a way that feels highly relevant to the current timeline.

## Tone & Style Guardrails (Crucial)
* **Write like a developer, not a brand:** Use casual, conversational phrasing. Lowercase is acceptable if it fits the vibe. 
* **Show, don't hype:** Avoid cringe, overly enthusiastic corporate speak. Never use phrases like "Excited to share...", "Revolutionize your workflow!", "Check this out! 👇", or "Thrilled to announce...".
* **Emoji discipline:** Use a maximum of 1-2 emojis per tweet, or none at all. Avoid the classic bot spam (🚀, 🔥, 💻, 🧠).
* **Hashtag minimalism:** Tech Twitter hates hashtag stuffing. Use at most *one* highly relevant community hashtag (e.g., `#buildinpublic`) or omit them entirely if the text stands on its own. 
* **Slang & Framing:** Lean into current developer phrasing where natural (e.g., "finally got X cooking," "just raw dogged a refactor," "built a tiny tool to solve X," "ship it").

## Instructions
When invoked, execute the following steps strictly in order:

1. **Analyze the Change:** Review the provided code changes or description. Identify the core engineering problem solved.
2. **Search the Web:** 
   - Search for current trending topics, debates, or memes in software engineering and tech right now.
   - Look for specific phrasings or inside jokes currently circulating in the developer ecosystem.
3. **Drafting:** Write 3 distinct tweet variations adhering strictly to the **Tone & Style Guardrails**:
   - **Option 1: The Casual Flex:** A low-friction, one-to-two sentence summary of what you built and why it's cool. Sounds like a casual update to a friend.
   - **Option 2: The Trend/Meme Hijack:** Explicitly hooks the code change into a current tech timeline debate or active meme found during the web search.
   - **Option 3: The Short-Form Story:** A punchy "problem vs. solution" or "how it started vs. how it's going" format using clean line breaks.
4. **Visual Asset Recommendations:** Suggest 1-2 specific screenshots or visuals the user should attach to the tweet. 
   - *Good examples to suggest:* A split-screen "Before vs. After" of the code block, a raw terminal output showing a massive speed increase, or a clean architecture diagram.
   - *Never suggest:* Generic stock photos, corporate banners, or basic UI screenshots without any annotations.