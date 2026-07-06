const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic();

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    sells: { type: "string", description: "One sentence: what this person most plausibly sells, given their title and company" },
    client: { type: "string", description: "One sentence: who their ideal client most plausibly is" },
    focus: { type: "string", description: "One sentence: a plausible current business focus or goal" },
  },
  required: ["sells", "client", "focus"],
  additionalProperties: false,
};

function buildPrompt({ title, company }) {
  return `Given only a person's job title and company, infer plausible, generic answers for a sales-relationship-management demo. Be concise (under 20 words each) and business-plausible — this is a best guess to pre-fill a form the person can still edit.

Job title: ${title}
Company: ${company}

Return:
- sells: what this person most likely sells or offers in their role
- client: who their ideal client/customer most likely is
- focus: a plausible current business focus or goal for someone in this role`;
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { title, company } = req.body || {};

  if (!title || !company) {
    res.status(400).json({ error: "Missing title or company" });
    return;
  }

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1000,
      output_config: { format: { type: "json_schema", schema: RESPONSE_SCHEMA } },
      messages: [{ role: "user", content: buildPrompt({ title, company }) }],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock) {
      res.status(502).json({ error: "No generated content returned" });
      return;
    }

    res.status(200).json(JSON.parse(textBlock.text));
  } catch (err) {
    console.error("infer-business.js error:", err);
    res.status(500).json({ error: "Inference failed" });
  }
};
