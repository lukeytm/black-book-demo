const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic();

const SIGNAL_SCHEMA = {
  type: "object",
  properties: {
    kind: { type: "string", enum: ["Company news"] },
    text: { type: "string" },
    when: { type: "string" },
  },
  required: ["kind", "text", "when"],
  additionalProperties: false,
};

const CONTACT_SCHEMA = {
  type: "object",
  properties: {
    id: { type: "string", description: "lowercase-kebab id, e.g. 'first-last'" },
    name: { type: "string" },
    company: { type: "string" },
    role: { type: "string" },
    heat: { type: "string", enum: ["warm", "cooling", "cold", "dormant"] },
    heatLabel: { type: "string", enum: ["Active", "Cooling", "Gone cold", "Dormant"] },
    days: { type: "integer" },
    daysLabel: { type: "string", description: "e.g. '7 months' for dormant contacts, empty string otherwise" },
    initials: { type: "string" },
    reason: { type: "string", description: "one sentence shown on the briefing card" },
    signal: { anyOf: [{ type: "null" }, SIGNAL_SCHEMA] },
    summary: { type: "string", description: "2-3 sentence paragraph for the contact detail page" },
    health: { type: "string", description: "short relationship status label" },
    timeline: {
      type: "array",
      items: {
        type: "object",
        properties: {
          date: { type: "string" },
          label: { type: "string" },
          detail: { type: "string" },
        },
        required: ["date", "label", "detail"],
        additionalProperties: false,
      },
    },
    draft: { type: "string", description: "full outreach message draft, 2-4 short paragraphs" },
    lastTopic: { type: "string" },
    threadSubject: { type: "string" },
    newSubject: { type: "string" },
  },
  required: [
    "id", "name", "company", "role", "heat", "heatLabel", "days", "daysLabel",
    "initials", "reason", "signal", "summary", "health", "timeline",
    "draft", "lastTopic", "threadSubject", "newSubject",
  ],
  additionalProperties: false,
};

const SIGNALS_FEED_ITEM_SCHEMA = {
  type: "object",
  properties: {
    contactId: { type: "string", description: "must match an id from the contacts array" },
    name: { type: "string" },
    company: { type: "string" },
    kind: { type: "string", enum: ["Company news"] },
    summary: { type: "string" },
    lastContact: { type: "string" },
    initials: { type: "string" },
  },
  required: ["contactId", "name", "company", "kind", "summary", "lastContact", "initials"],
  additionalProperties: false,
};

const INSIGHT_SCHEMA = {
  type: "object",
  properties: {
    topic: { type: "string" },
    discussed: { type: "string" },
    dormant: { type: "string" },
  },
  required: ["topic", "discussed", "dormant"],
  additionalProperties: false,
};

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    contacts: { type: "array", items: CONTACT_SCHEMA },
    signals: { type: "array", items: SIGNALS_FEED_ITEM_SCHEMA },
    insights: { type: "array", items: INSIGHT_SCHEMA },
  },
  required: ["contacts", "signals", "insights"],
  additionalProperties: false,
};

function buildPrompt({ firstName, title, company, tone, sells, idealClient, focus }) {
  return `You are generating realistic BUT FICTIONAL sample data for a demo of "Black Book" — a relationship-management tool for salespeople. The visitor trying this demo works in the following context:

Name: ${firstName}
Job title: ${title}
Company: ${company}
Communication tone: ${tone}
What they sell: ${sells}
Their ideal client: ${idealClient}
Current focus: ${focus}

Generate exactly 5 fictional contacts that would plausibly be in this person's professional network, given their industry and ideal client description. Use real, well-known company names appropriate to the industry (this is a common convention in sales demos), but invent plausible, generic-sounding fictional individual names for the people — do not depict any specific real person.

Distribute contacts across relationship states: 1 "warm" (active live conversation), 1 "cooling", 1 "cold", and 2 "dormant" (one of which should have a "signal" — a plausible, generic, invented piece of recent company news about their employer that creates a natural reason to reach back out; the other dormant contact can have signal: null). The warm/cooling/cold contacts should have signal: null.

Each contact's "draft" field should be a warm, on-brand outreach message written in the visitor's stated tone (${tone}), referencing the "reason" and, where present, the signal — written as if from ${firstName} at ${company}.

Also generate a top-level "signals" array (2-3 entries) of plausible fictional company-news items — only about companies tied to the contacts you created — and a top-level "insights" array (2-3 entries) about themes relevant to this person's industry and focus (${focus}).

Keep all company news and events entirely fictional but industry-plausible — do not report real current events.`;
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { firstName, title, company, tone, sells, idealClient, focus } = req.body || {};

  if (!firstName || !company || !sells) {
    res.status(400).json({ error: "Missing required profile fields" });
    return;
  }

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 8000,
      output_config: { format: { type: "json_schema", schema: RESPONSE_SCHEMA } },
      messages: [
        {
          role: "user",
          content: buildPrompt({ firstName, title, company, tone, sells, idealClient, focus }),
        },
      ],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock) {
      res.status(502).json({ error: "No generated content returned" });
      return;
    }

    const data = JSON.parse(textBlock.text);
    res.status(200).json(data);
  } catch (err) {
    console.error("generate.js error:", err);
    res.status(500).json({ error: "Generation failed" });
  }
};
