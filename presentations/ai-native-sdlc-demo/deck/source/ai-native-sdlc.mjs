import fs from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { Presentation, PresentationFile } = require("@oai/artifact-tool");

const SOURCE_DIR = path.dirname(fileURLToPath(import.meta.url));
const DECK_DIR = path.resolve(SOURCE_DIR, "..");
const RENDER_DIR = path.join(DECK_DIR, "rendered");
const SLIDE_DIR = path.join(RENDER_DIR, "slides");
const QR_DIR = path.join(DECK_DIR, "assets", "qr");
const FINAL_PPTX = path.join(DECK_DIR, "ai-native-sdlc.pptx");

const C = {
  canvas: "#F7FBFD",
  surface: "#FFFFFF",
  ink: "#08263A",
  ink2: "#113A4E",
  muted: "#36566A",
  teal: "#005B57",
  blue: "#00566D",
  coral: "#9B2C2C",
  line: "#5E8392",
  wash: "#EAF4F7",
  tealWash: "#DDF4F4",
  blueWash: "#E7F5FB",
  coralWash: "#FDEAE8",
  cyan: "#3EDBFF",
  aqua: "#13C7B3",
  sea: "#5EEAD4",
};

const presentation = Presentation.create({
  slideSize: { width: 1280, height: 720 },
});

function addShape(
  slide,
  name,
  geometry,
  position,
  fill,
  line = "none",
  radius = 0,
  shadow = "shadow-none",
  lineWidth = 1,
) {
  return slide.shapes.add({
    geometry,
    name,
    position,
    fill,
    line: {
      style: "solid",
      fill: line,
      width: line === "none" ? 0 : lineWidth,
    },
    ...(radius ? { borderRadius: radius } : {}),
    shadow,
  });
}

function addText(slide, name, text, position, {
  fontSize = 20,
  color = C.ink,
  bold = false,
  alignment = "left",
  fontFamily,
} = {}) {
  const shape = addShape(slide, name, "textbox", position, "none");
  shape.text = text;
  shape.text.style = {
    fontSize,
    color,
    bold,
    alignment,
    ...(fontFamily ? { fontFamily } : {}),
  };
  return shape;
}

function addHeader(slide, eyebrow, title, subtitle, slideNumber) {
  addShape(slide, `header-current-${slideNumber}`, "roundRect", {
    left: 72, top: 39, width: 44, height: 8,
  }, C.aqua, "none", 4);
  addText(slide, `eyebrow-${slideNumber}`, eyebrow, {
    left: 128, top: 31, width: 760, height: 24,
  }, { fontSize: 16, color: C.teal, bold: true });
  addText(slide, `title-${slideNumber}`, title, {
    left: 72, top: 69, width: 1136, height: 58,
  }, { fontSize: 38, color: C.ink, bold: true });
  if (subtitle) {
    addText(slide, `subtitle-${slideNumber}`, subtitle, {
      left: 72, top: 136, width: 1136, height: 36,
    }, { fontSize: 19, color: C.muted });
  }
}

function addFooter(slide, sourceText, slideNumber) {
  addShape(slide, `footer-line-${slideNumber}`, "rect", {
    left: 72, top: 663, width: 1136, height: 2,
  }, C.line);
  addText(slide, `source-${slideNumber}`, sourceText, {
    left: 72, top: 674, width: 1045, height: 24,
  }, { fontSize: 16, color: C.muted });
  addText(slide, `folio-${slideNumber}`, String(slideNumber).padStart(2, "0"), {
    left: 1150, top: 674, width: 58, height: 24,
  }, { fontSize: 16, color: C.muted, bold: true, alignment: "right" });
}

function addPill(slide, name, text, position, fill, color, border = "none", lineWidth = 1) {
  const shape = addShape(
    slide,
    name,
    "roundRect",
    position,
    fill,
    border,
    18,
    "shadow-none",
    lineWidth,
  );
  shape.text = text;
  shape.text.style = { fontSize: 16, color, bold: true, alignment: "center" };
  return shape;
}

function setNotes(slide, narrative, timing, sources) {
  slide.speakerNotes.textFrame.setText(
    `${narrative}\nTiming: ${timing}\n\n[Sources]\n${sources.join("\n")}\n[/Sources]`,
  );
}

async function readImageBlob(imagePath) {
  const bytes = await fs.readFile(imagePath);
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}

function buildSlide1() {
  const slide = presentation.slides.add();
  slide.background.fill = C.canvas;

  addShape(slide, "title-current-underlay", "roundRect", {
    left: 72, top: 521, width: 1136, height: 18,
  }, C.tealWash, "none", 9);
  addShape(slide, "title-current", "roundRect", {
    left: 72, top: 527, width: 1136, height: 7,
  }, C.blue, "none", 4);
  addShape(slide, "title-cursor", "rect", {
    left: 72, top: 495, width: 8, height: 54,
  }, C.aqua);
  [830, 925, 1020, 1115].forEach((left, index) => {
    addShape(slide, `title-node-${index + 1}`, "ellipse", {
      left, top: 516, width: 28, height: 28,
    }, index === 3 ? C.coralWash : C.surface, index === 3 ? C.coral : C.blue, 0, "shadow-none", 3);
  });

  addText(slide, "title-kicker", "AI-NATIVE SOFTWARE DEVELOPMENT", {
    left: 72, top: 75, width: 720, height: 30,
  }, { fontSize: 18, color: C.teal, bold: true });
  addText(slide, "deck-title", "From autocomplete\nto a durable agentic SDLC", {
    left: 72, top: 122, width: 1000, height: 162,
  }, { fontSize: 58, color: C.ink, bold: true });
  addText(slide, "deck-subtitle",
    "How the unit of coding work changed—and why specifications, guardrails, and evidence matter more than ever.",
    { left: 72, top: 315, width: 980, height: 82 },
    { fontSize: 24, color: C.muted },
  );
  addPill(slide, "live-start-pill", "LIVE CODING GOAL STARTS NOW", {
    left: 72, top: 428, width: 330, height: 40,
  }, C.coralWash, C.ink, C.coral, 2);
  addText(slide, "title-folio", "01", {
    left: 1150, top: 601, width: 58, height: 24,
  }, { fontSize: 16, color: C.muted, bold: true, alignment: "right" });

  setNotes(
    slide,
    "Narrative job: establish the destination and dispatch the live demo before the first minute ends.\nSpeaker cue: Before we start, I am giving a coding agent a goal. It will work while we talk; near the end we will inspect both the result and the evidence.\nOffline rehearsal action: start only the fixture-backed cue clock.",
    "0:45",
    [
      "No external factual claim.",
      "Program narrative decision: presentations/ai-native-sdlc-demo/.mdkg/design/dec-2-use-a-source-backed-mixed-audience-ai-native-sdlc-narrative.md",
    ],
  );
}

function buildSlide2() {
  const slide = presentation.slides.add();
  slide.background.fill = C.canvas;
  addHeader(
    slide,
    "THE CHANGING UNIT OF WORK",
    "The unit of coding work kept expanding",
    "Capabilities accumulated; each new layer widened what a developer could delegate.",
    2,
  );

  const stages = [
    { label: "LINE", detail: "complete code", width: 4 },
    { label: "TURN", detail: "generate + refine", width: 7 },
    { label: "PROBLEM", detail: "reason through", width: 10 },
    { label: "REPO", detail: "search + edit + test", width: 13 },
    { label: "WORKFLOW", detail: "load practice", width: 16 },
    { label: "GOAL", detail: "plan + work + prove", width: 21 },
  ];

  addShape(slide, "unit-flow-underlay", "roundRect", {
    left: 94, top: 342, width: 1080, height: 38,
  }, C.tealWash, "none", 19);
  const stagePositions = [100, 276, 466, 656, 846, 1036];
  stages.forEach((stage, index) => {
    const x = stagePositions[index];
    const labelX = x + (index === 3 ? 24 : 0);
    addShape(slide, `unit-segment-${index + 1}`, "roundRect", {
      left: x,
      top: 361 - stage.width / 2,
      width: index === 5 ? 122 : 174,
      height: stage.width,
    }, index === 5 ? C.coral : index % 2 ? C.teal : C.blue, "none", stage.width / 2);
    addShape(slide, `unit-tick-${index + 1}`, "rect", {
      left: x + 6, top: 312, width: 3, height: 92,
    }, index === 5 ? C.coral : C.line);
    addText(slide, `unit-label-${index + 1}`, stage.label, {
      left: labelX, top: 239, width: index === 4 ? 174 : index === 5 ? 142 : 150, height: 30,
    }, { fontSize: 22, color: index === 5 ? C.coral : C.teal, bold: true });
    addText(slide, `unit-detail-${index + 1}`, stage.detail, {
      left: labelX, top: 275, width: index === 5 ? 142 : 150, height: 48,
    }, { fontSize: 17, color: C.ink });
  });
  addText(slide, "unit-conclusion", "More delegation → more need for durable intent and proof", {
    left: 238, top: 482, width: 804, height: 48,
  }, { fontSize: 28, color: C.ink, bold: true, alignment: "center" });
  addPill(slide, "overlap-caveat", "STAGES OVERLAP · CAPABILITIES ACCUMULATE", {
    left: 365, top: 555, width: 550, height: 38,
  }, C.blueWash, C.blue, C.blue, 2);
  addFooter(slide, "[1–12] Representative milestones; not exclusive product eras", 2);

  setNotes(
    slide,
    "Narrative job: frame the talk as a capability progression, not a product-history lecture.\nSpeaker cue: These stages overlap. New capabilities accumulate; they do not invalidate autocomplete, chat, or direct editing.",
    "1:40",
    [
      "Claim synthesis: deck/citations/claim-matrix.md, C01-C12.",
    ],
  );
}

function buildSlide3() {
  const slide = presentation.slides.add();
  slide.background.fill = C.canvas;
  addHeader(
    slide,
    "2021 · AUTOCOMPLETE",
    "Autocomplete changed the typing loop",
    "Copilot made whole-line and whole-function suggestions part of everyday editor work.",
    3,
  );

  addShape(slide, "autocomplete-code", "roundRect", {
    left: 72, top: 205, width: 690, height: 372,
  }, C.ink, C.blue, 24, "0px 8px 22px #08263A/14", 2);
  addText(slide, "autocomplete-file", "cart.ts", {
    left: 100, top: 228, width: 200, height: 24,
  }, { fontSize: 16, color: C.aqua, bold: true, fontFamily: "SFMono-Regular" });
  addText(slide, "autocomplete-code-solid",
    "function total(items) {\n  return items.reduce((sum, item) =>",
    { left: 100, top: 291, width: 610, height: 106 },
    { fontSize: 23, color: C.canvas, fontFamily: "SFMono-Regular" },
  );
  addText(slide, "autocomplete-code-ghost",
    "    sum + item.price, 0);\n}",
    { left: 100, top: 407, width: 610, height: 88 },
    { fontSize: 23, color: C.cyan, bold: true, fontFamily: "SFMono-Regular" },
  );
  addShape(slide, "autocomplete-cursor", "rect", {
    left: 100, top: 517, width: 5, height: 31,
  }, C.aqua);
  addPill(slide, "autocomplete-unit", "UNIT · NEXT LINE OR FUNCTION", {
    left: 800, top: 226, width: 382, height: 38,
  }, C.blueWash, C.blue, C.blue, 2);
  addText(slide, "autocomplete-human-label", "HUMAN ROLE", {
    left: 800, top: 306, width: 220, height: 24,
  }, { fontSize: 18, color: C.teal, bold: true });
  addText(slide, "autocomplete-human", "Author the code.\nAccept or reject the suggestion.", {
    left: 800, top: 341, width: 360, height: 80,
  }, { fontSize: 24, color: C.ink, bold: true });
  addText(slide, "autocomplete-constraint-label", "CONTEXT LIMIT", {
    left: 800, top: 457, width: 220, height: 24,
  }, { fontSize: 18, color: C.coral, bold: true });
  addText(slide, "autocomplete-constraint", "Mostly the code visible—or retrieved—inside the editor.", {
    left: 800, top: 492, width: 360, height: 72,
  }, { fontSize: 20, color: C.muted });
  addFooter(slide, "[1] GitHub Copilot technical preview", 3);

  setNotes(
    slide,
    "Narrative job: make the original interaction model concrete.\nPrimary claim: GitHub Copilot brought whole-line and whole-function suggestions into the typing loop.",
    "1:50",
    [
      "[1] GitHub, Introducing GitHub Copilot: your AI pair programmer, 2021-06-29: https://github.blog/news-insights/product-news/introducing-github-copilot-ai-pair-programmer/",
    ],
  );
}

function buildSlide4() {
  const slide = presentation.slides.add();
  slide.background.fill = C.canvas;
  addHeader(
    slide,
    "2022 · CONVERSATIONAL CODING",
    "Conversation made coding iterative",
    "Generate, explain, and refine turned the developer into the source of missing context.",
    4,
  );

  const turns = [
    { x: 72, y: 216, w: 520, label: "GENERATE", text: "Draft a parser for this payload.", fill: C.blueWash, line: C.blue },
    { x: 314, y: 341, w: 520, label: "EXPLAIN", text: "Why does it fail on empty input?", fill: C.tealWash, line: C.teal },
    { x: 556, y: 466, w: 520, label: "REFINE", text: "Keep the API; add validation and tests.", fill: C.coralWash, line: C.coral },
  ];
  turns.forEach((turn, index) => {
    addShape(slide, `conversation-turn-${index + 1}`, "roundRect", {
      left: turn.x, top: turn.y, width: turn.w, height: 96,
    }, turn.fill, turn.line, 22, "0px 6px 18px #08263A/08", 2);
    addText(slide, `conversation-label-${index + 1}`, turn.label, {
      left: turn.x + 24, top: turn.y + 17, width: 154, height: 24,
    }, { fontSize: 17, color: turn.line, bold: true });
    addText(slide, `conversation-text-${index + 1}`, turn.text, {
      left: turn.x + 24, top: turn.y + 49, width: turn.w - 48, height: 30,
    }, { fontSize: 21, color: C.ink, bold: true });
  });
  addShape(slide, "conversation-constraint-line", "rect", {
    left: 1096, top: 242, width: 3, height: 300,
  }, C.coral);
  addText(slide, "conversation-constraint", "Useful context\nstill lived in\nconversation.", {
    left: 1115, top: 321, width: 142, height: 132,
  }, { fontSize: 18, color: C.coral, bold: true });
  addFooter(slide, "[2] ChatGPT research preview", 4);

  setNotes(
    slide,
    "Narrative job: show the jump from passive suggestion to iterative dialogue.\nPrimary claim: conversational models let developers generate, explain, challenge, and refine code through follow-up turns.",
    "2:00",
    [
      "[2] OpenAI, Introducing ChatGPT, 2022-11-30: https://openai.com/index/chatgpt/",
    ],
  );
}

function buildSlide5() {
  const slide = presentation.slides.add();
  slide.background.fill = C.canvas;
  addHeader(
    slide,
    "2024 · REASONING",
    "Reasoning became a capability lever",
    "More inference can improve hard problems—but it cannot recover requirements that were never supplied.",
    5,
  );

  addShape(slide, "reasoning-path-a", "rightArrow", {
    left: 226, top: 293, width: 248, height: 30,
  }, C.blue);
  addShape(slide, "reasoning-path-b", "rightArrow", {
    left: 454, top: 215, width: 210, height: 112,
  }, C.line);
  addShape(slide, "reasoning-path-c", "rightArrow", {
    left: 454, top: 319, width: 210, height: 112,
  }, C.coral);
  addShape(slide, "reasoning-path-d", "rightArrow", {
    left: 646, top: 293, width: 236, height: 30,
  }, C.teal);

  const nodes = [
    { x: 72, y: 252, w: 170, h: 116, title: "PROBLEM", detail: "multi-step task", fill: C.surface, line: C.blue },
    { x: 451, y: 185, w: 208, h: 94, title: "CHECK", detail: "find a flaw", fill: C.blueWash, line: C.blue },
    { x: 451, y: 385, w: 208, h: 94, title: "REVISE", detail: "try another path", fill: C.coralWash, line: C.coral },
    { x: 870, y: 252, w: 192, h: 116, title: "ANSWER", detail: "validated result", fill: C.tealWash, line: C.teal },
  ];
  nodes.forEach((node, index) => {
    addShape(slide, `reasoning-node-${index + 1}`, "roundRect", {
      left: node.x, top: node.y, width: node.w, height: node.h,
    }, node.fill, node.line, 20, "0px 5px 16px #08263A/08", 2);
    addText(slide, `reasoning-node-title-${index + 1}`, node.title, {
      left: node.x + 18, top: node.y + 20, width: node.w - 36, height: 28,
    }, { fontSize: 22, color: node.line, bold: true, alignment: "center" });
    addText(slide, `reasoning-node-detail-${index + 1}`, node.detail, {
      left: node.x + 18, top: node.y + 57, width: node.w - 36, height: 28,
    }, { fontSize: 17, color: C.ink, alignment: "center" });
  });

  addShape(slide, "reasoning-boundary", "roundRect", {
    left: 1084, top: 217, width: 136, height: 250,
  }, C.ink, C.ink, 18, "shadow-none", 2);
  addText(slide, "reasoning-boundary-text", "MISSING\nINTENT\nSTAYS\nMISSING", {
    left: 1098, top: 270, width: 108, height: 150,
  }, { fontSize: 18, color: C.cyan, bold: true, alignment: "center" });
  addFooter(slide, "[3] OpenAI o1-preview", 5);

  setNotes(
    slide,
    "Narrative job: distinguish better problem solving from simply producing more text.\nPrimary claim: o1 made additional test-time reasoning a visible capability lever for difficult problems.",
    "2:10",
    [
      "[3] OpenAI, Learning to reason with LLMs, 2024-09-12: https://openai.com/index/learning-to-reason-with-llms/",
    ],
  );
}

function buildSlide6() {
  const slide = presentation.slides.add();
  slide.background.fill = C.canvas;
  addHeader(
    slide,
    "2025 · TOOL-USING AGENTS",
    "The harness made agents operational",
    "Search, files, terminals, tests, and source control turned model output into repository work.",
    6,
  );

  const center = { x: 522, y: 278, w: 236, h: 188 };
  const ports = [
    { x: 112, y: 220, title: "SEARCH", fill: C.blueWash, line: C.blue },
    { x: 112, y: 456, title: "FILES", fill: C.tealWash, line: C.teal },
    { x: 963, y: 220, title: "TERMINAL", fill: C.coralWash, line: C.coral },
    { x: 963, y: 456, title: "TESTS + GIT", fill: C.tealWash, line: C.teal },
  ];
  ports.forEach((port, index) => {
    const startX = port.x < center.x ? port.x + 205 : center.x + center.w;
    const width = port.x < center.x ? center.x - startX : port.x - startX;
    addShape(slide, `tool-connector-${index + 1}`, "rightArrow", {
      left: startX,
      top: port.y + 32,
      width: Math.max(width, 34),
      height: 26,
    }, port.line);
  });
  ports.forEach((port, index) => {
    addShape(slide, `tool-port-${index + 1}`, "roundRect", {
      left: port.x, top: port.y, width: 205, height: 88,
    }, port.fill, port.line, 20, "0px 5px 16px #08263A/08", 2);
    addText(slide, `tool-port-label-${index + 1}`, port.title, {
      left: port.x + 12, top: port.y + 27, width: 181, height: 32,
    }, { fontSize: 22, color: port.line, bold: true, alignment: "center" });
  });
  addShape(slide, "tool-agent-core", "roundRect", {
    left: center.x, top: center.y, width: center.w, height: center.h,
  }, C.ink, C.blue, 30, "0px 8px 22px #08263A/16", 3);
  addText(slide, "tool-agent-core-title", "CODING\nAGENT", {
    left: center.x + 30, top: center.y + 38, width: center.w - 60, height: 78,
  }, { fontSize: 31, color: C.canvas, bold: true, alignment: "center" });
  addText(slide, "tool-agent-core-detail", "model + harness", {
    left: center.x + 30, top: center.y + 132, width: center.w - 60, height: 28,
  }, { fontSize: 17, color: C.aqua, bold: true, alignment: "center" });
  addPill(slide, "tool-boundary", "TOOLS INCREASE REACH—NOT INTENT", {
    left: 395, top: 568, width: 490, height: 40,
  }, C.coralWash, C.ink, C.coral, 2);
  addFooter(slide, "[4] Claude Code · [5] Cursor Agent", 6);

  setNotes(
    slide,
    "Narrative job: explain why the harness matters as much as the model.\nPrimary claim: Claude Code, Cursor, and comparable harnesses connected models to search, file editing, terminals, tests, and source control.\nOptional timing cut: omit the supporting Cursor sentence.",
    "2:10",
    [
      "[4] Anthropic, Claude 3.7 Sonnet and Claude Code, 2025-02-24: https://www.anthropic.com/news/claude-3-7-sonnet",
      "[5] Cursor, Agent Overview, accessed 2026-07-26: https://docs.cursor.com/en/agent/overview",
    ],
  );
}

function buildSlide7() {
  const slide = presentation.slides.add();
  slide.background.fill = C.canvas;
  addHeader(
    slide,
    "2025 · CONDITIONAL CONTEXT",
    "Skills made context conditional",
    "A task signal can load specialized procedure only when the work calls for it.",
    7,
  );

  addShape(slide, "skill-signal-arrow", "rightArrow", {
    left: 380, top: 346, width: 190, height: 42,
  }, C.blue);
  addShape(slide, "skill-load-arrow", "rightArrow", {
    left: 708, top: 346, width: 190, height: 42,
  }, C.teal);

  addShape(slide, "skill-folder", "roundRect", {
    left: 72, top: 229, width: 330, height: 284,
  }, C.surface, C.blue, 24, "0px 8px 22px #08263A/10", 2);
  addShape(slide, "skill-folder-tab", "roundRect", {
    left: 98, top: 205, width: 142, height: 50,
  }, C.blueWash, C.blue, 16, "shadow-none", 2);
  addText(slide, "skill-file", "SKILL.md", {
    left: 104, top: 284, width: 266, height: 54,
  }, { fontSize: 34, color: C.ink, bold: true });
  addText(slide, "skill-contents", "instructions\nscripts\nresources", {
    left: 104, top: 359, width: 230, height: 104,
  }, { fontSize: 22, color: C.muted });

  addShape(slide, "skill-match", "ellipse", {
    left: 535, top: 275, width: 210, height: 210,
  }, C.coralWash, C.coral, 0, "shadow-none", 3);
  addText(slide, "skill-match-text", "TASK\nMATCH", {
    left: 570, top: 330, width: 140, height: 86,
  }, { fontSize: 30, color: C.coral, bold: true, alignment: "center" });

  addShape(slide, "active-context", "roundRect", {
    left: 870, top: 228, width: 338, height: 286,
  }, C.ink, C.teal, 28, "0px 8px 22px #005B57/15", 3);
  addText(slide, "active-context-label", "ACTIVE CONTEXT", {
    left: 904, top: 270, width: 270, height: 32,
  }, { fontSize: 22, color: C.aqua, bold: true, alignment: "center" });
  addText(slide, "active-context-body", "Metadata stays visible.\n\nFull procedure loads\nwhen relevant.", {
    left: 910, top: 327, width: 258, height: 132,
  }, { fontSize: 22, color: C.canvas, bold: true, alignment: "center" });
  addPill(slide, "skill-limit", "PROJECT STATE STILL NEEDS DURABLE OWNERSHIP", {
    left: 350, top: 563, width: 580, height: 40,
  }, C.blueWash, C.ink, C.blue, 2);
  addFooter(slide, "[6] Agent Skills and SKILL.md", 7);

  setNotes(
    slide,
    "Narrative job: introduce Agent Skills as a bridge from reusable prompts to task-triggered procedural knowledge.\nPrimary claim: SKILL.md packages instructions and resources that an agent discovers and loads when relevant.",
    "2:00",
    [
      "[6] Anthropic, Equipping agents for the real world with Agent Skills, 2025-10-16; open-standard update 2025-12-18: https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills",
    ],
  );
}

function addMilestoneCard(slide, stage, index) {
  const x = 68 + index * 188;
  const above = index % 2 === 0;
  const y = above ? 196 : 405;
  const emphasized = index === 5;
  addShape(slide, `timeline-card-${index + 1}`, "roundRect", {
    left: x, top: y, width: 176, height: 126,
  }, emphasized ? C.coralWash : C.surface, emphasized ? C.coral : C.line, 18, "0px 5px 16px #08263A/10", 2);
  addText(slide, `timeline-date-${index + 1}`, stage.date, {
    left: x + 14, top: y + 13, width: 148, height: 22,
  }, { fontSize: 16, color: emphasized ? C.coral : C.teal, bold: true });
  addText(slide, `timeline-label-${index + 1}`, stage.label, {
    left: x + 7, top: y + 43, width: 162, height: 46,
  }, { fontSize: 16, color: C.ink, bold: true });
  addText(slide, `timeline-product-${index + 1}`, stage.product, {
    left: x + 14, top: y + 97, width: 148, height: 23,
  }, { fontSize: 16, color: C.muted });
  addShape(slide, `timeline-connector-${index + 1}`, "rect", {
    left: x + 86,
    top: above ? y + 126 : 359,
    width: 4,
    height: above ? 28 : 46,
  }, emphasized ? C.coral : C.blue);
  addShape(slide, `timeline-dot-${index + 1}`, "ellipse", {
    left: x + 75, top: 340, width: 25, height: 25,
  }, emphasized ? C.coralWash : C.blueWash, emphasized ? C.coral : C.blue, 0, "shadow-none", 3);
}

function buildSlide8() {
  const slide = presentation.slides.add();
  slide.background.fill = C.canvas;
  addHeader(
    slide,
    "LONG-HORIZON, GOAL-DRIVEN WORK",
    "The work is outgrowing a single context window",
    "Larger delegated tasks make continuity, recovery, and completion criteria part of the engineering problem.",
    8,
  );

  addShape(slide, "horizon-metric-panel", "roundRect", {
    left: 72, top: 212, width: 520, height: 330,
  }, C.surface, C.blue, 26, "0px 8px 22px #00566D/10", 2);
  addText(slide, "horizon-metric-kicker", "CODEX USAGE STUDY", {
    left: 112, top: 246, width: 440, height: 28,
  }, { fontSize: 18, color: C.blue, bold: true, alignment: "center" });
  addText(slide, "horizon-metric-value", "25.6%", {
    left: 112, top: 292, width: 440, height: 108,
  }, { fontSize: 78, color: C.blue, bold: true, alignment: "center" });
  addText(slide, "horizon-metric-copy",
    "of sampled individual users submitted at least one request estimated above eight hours of human work",
    { left: 122, top: 410, width: 420, height: 92 },
    { fontSize: 21, color: C.ink, bold: true, alignment: "center" },
  );

  addShape(slide, "horizon-continuity-panel", "roundRect", {
    left: 628, top: 212, width: 580, height: 330,
  }, C.tealWash, C.teal, 26, "0px 8px 22px #005B57/10", 2);
  addText(slide, "horizon-continuity-kicker", "LONG-RUNNING HARNESS WORK", {
    left: 668, top: 246, width: 500, height: 28,
  }, { fontSize: 18, color: C.teal, bold: true, alignment: "center" });
  const windows = [
    { x: 684, label: "CONTEXT\nWINDOW 1", detail: "initialize" },
    { x: 862, label: "CONTEXT\nWINDOW 2", detail: "continue" },
    { x: 1040, label: "CONTEXT\nWINDOW 3", detail: "verify" },
  ];
  windows.slice(0, -1).forEach((item, index) => {
    addShape(slide, `horizon-window-arrow-${index + 1}`, "rightArrow", {
      left: item.x + 138, top: 354, width: 36, height: 28,
    }, C.teal);
  });
  windows.forEach((item, index) => {
    addShape(slide, `horizon-window-${index + 1}`, "roundRect", {
      left: item.x, top: 310, width: 138, height: 132,
    }, C.surface, C.teal, 18, "0px 4px 12px #005B57/08", 2);
    addText(slide, `horizon-window-label-${index + 1}`, item.label, {
      left: item.x + 12, top: 333, width: 114, height: 50,
    }, { fontSize: 17, color: C.ink, bold: true, alignment: "center" });
    addText(slide, `horizon-window-detail-${index + 1}`, item.detail, {
      left: item.x + 12, top: 400, width: 114, height: 24,
    }, { fontSize: 16, color: C.teal, bold: true, alignment: "center" });
  });
  addText(slide, "horizon-continuity-copy", "Durable requirements and progress records carry the goal forward.", {
    left: 680, top: 468, width: 476, height: 46,
  }, { fontSize: 19, color: C.ink, bold: true, alignment: "center" });

  addPill(slide, "timeline-caveat",
    "HUMAN-EQUIVALENT TASK SIZE IS NOT ELAPSED AGENT RUNTIME",
    { left: 342, top: 578, width: 596, height: 42 },
    C.coralWash,
    C.ink,
    C.coral,
    2,
  );
  addFooter(slide, "[8] Codex usage study · [9] long-running harnesses · [12] METR methodology", 8);

  setNotes(
    slide,
    "Narrative job: establish with concrete evidence that the unit of work can now be a delegated engineering goal whose continuity spans multiple working contexts.\nMandatory caveat: the 25.6 percent figure is a vendor study of estimated human-equivalent task size. A benchmark or human-equivalent eight-hour task is not eight hours of elapsed agent runtime.",
    "2:20",
    [
      "[8] OpenAI, How agents are transforming work, 2026-06-25: https://openai.com/index/how-agents-are-transforming-work/",
      "[9] Anthropic, Effective harnesses for long-running agents, 2025-11-26: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents",
      "[12] METR, Task-Completion Time Horizons of Frontier AI Models, updated 2026-05-08: https://metr.org/time-horizons/",
    ],
  );
}

function buildSlide9() {
  const slide = presentation.slides.add();
  slide.background.fill = C.canvas;
  addHeader(
    slide,
    "CAPABILITY IS A SYSTEM",
    "Four capabilities improved together",
    "Model quality, context capacity, harness reach, and task horizon reinforce one another—but remain distinct.",
    9,
  );

  const streams = [
    { y: 223, label: "MODEL CAPABILITY", detail: "reasoning + generation", color: C.blue, wash: C.blueWash },
    { y: 312, label: "CONTEXT CAPACITY", detail: "larger working windows", color: C.teal, wash: C.tealWash },
    { y: 401, label: "HARNESS + TOOLS", detail: "search · edit · run · test", color: C.coral, wash: C.coralWash },
    { y: 490, label: "TASK HORIZON", detail: "multi-turn goal pursuit", color: C.teal, wash: C.tealWash },
  ];
  streams.forEach((stream, index) => {
    addShape(slide, `system-stream-${index + 1}`, "rightArrow", {
      left: 72, top: stream.y, width: 760 + index * 48, height: 48,
    }, stream.wash, stream.color, 0, "shadow-none", 2);
    addText(slide, `system-stream-label-${index + 1}`, stream.label, {
      left: 100, top: stream.y + 10, width: 280, height: 28,
    }, { fontSize: 20, color: stream.color, bold: true });
    addText(slide, `system-stream-detail-${index + 1}`, stream.detail, {
      left: 390, top: stream.y + 11, width: 290, height: 26,
    }, { fontSize: 18, color: C.ink });
  });
  addShape(slide, "system-channel", "roundRect", {
    left: 1012, top: 220, width: 196, height: 322,
  }, C.ink, C.blue, 30, "0px 8px 22px #08263A/16", 3);
  addText(slide, "system-channel-title", "WIDER\nUNIT OF\nWORK", {
    left: 1040, top: 298, width: 140, height: 132,
  }, { fontSize: 30, color: C.canvas, bold: true, alignment: "center" });
  addText(slide, "system-channel-detail", "system outcome", {
    left: 1035, top: 467, width: 150, height: 28,
  }, { fontSize: 16, color: C.aqua, bold: true, alignment: "center" });
  addFooter(slide, "[3] reasoning · [4] harness · [8] horizon · [10] context", 9);

  setNotes(
    slide,
    "Narrative job: separate capability dimensions that are often collapsed into the phrase the model got better.\nOptional timing cut: present only the four labels and skip examples.",
    "1:40",
    [
      "[3] OpenAI, Learning to reason with LLMs: https://openai.com/index/learning-to-reason-with-llms/",
      "[4] Anthropic, Claude 3.7 Sonnet and Claude Code: https://www.anthropic.com/news/claude-3-7-sonnet",
      "[8] OpenAI, How agents are transforming work: https://openai.com/index/how-agents-are-transforming-work/",
      "[10] OpenAI, Introducing GPT-4.1 in the API: https://openai.com/index/gpt-4-1/",
    ],
  );
}

function buildSlide10() {
  const slide = presentation.slides.add();
  slide.background.fill = C.canvas;
  addHeader(
    slide,
    "CONTEXT CAPACITY",
    "Capacity is not continuity",
    "A larger reservoir helps only when the working channel selects, maintains, and recovers the right context.",
    10,
  );

  addShape(slide, "context-reservoir", "ellipse", {
    left: 72, top: 201, width: 520, height: 372,
  }, C.blueWash, C.blue, 0, "0px 8px 24px #00566D/10", 3);
  addText(slide, "context-reservoir-number", "1M", {
    left: 160, top: 267, width: 344, height: 104,
  }, { fontSize: 76, color: C.blue, bold: true, alignment: "center" });
  addText(slide, "context-reservoir-label", "tokens of capacity\nin GPT-4.1", {
    left: 162, top: 385, width: 340, height: 76,
  }, { fontSize: 24, color: C.ink, bold: true, alignment: "center" });
  addText(slide, "context-reservoir-caveat", "Capacity ≠ perfect retrieval", {
    left: 162, top: 488, width: 340, height: 30,
  }, { fontSize: 17, color: C.coral, bold: true, alignment: "center" });

  addShape(slide, "context-channel", "rightArrow", {
    left: 548, top: 354, width: 660, height: 62,
  }, C.ink);
  const gates = [
    { x: 682, label: "SELECT" },
    { x: 850, label: "MAINTAIN" },
    { x: 1032, label: "RECOVER" },
  ];
  gates.forEach((gate, index) => {
    addShape(slide, `context-gate-${index + 1}`, "roundRect", {
      left: gate.x, top: 305, width: 142, height: 160,
    }, index === 2 ? C.coralWash : C.surface, index === 2 ? C.coral : C.teal, 18, "0px 5px 16px #08263A/08", 2);
    addText(slide, `context-gate-label-${index + 1}`, gate.label, {
      left: gate.x + 10, top: 360, width: 122, height: 32,
    }, { fontSize: 20, color: index === 2 ? C.coral : C.teal, bold: true, alignment: "center" });
  });
  addPill(slide, "context-conclusion", "BIGGER WINDOWS HELP · DURABLE PROJECT STATE STILL MATTERS", {
    left: 318, top: 584, width: 644, height: 40,
  }, C.tealWash, C.ink, C.teal, 2);
  addFooter(slide, "[10] GPT-4.1 context · [11] context-engineering guidance", 10);

  setNotes(
    slide,
    "Narrative job: overturn the assumption that a larger window is a project-memory system.\nPrimary claim: one-million-token capacity and long-context improvements coexist with retrieval limits and the need to curate high-signal context.",
    "2:10",
    [
      "[10] OpenAI, Introducing GPT-4.1 in the API, 2025-04-14: https://openai.com/index/gpt-4-1/",
      "[11] Anthropic, Effective context engineering for AI agents, 2025-09-29: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
    ],
  );
}

function buildSlide11() {
  const slide = presentation.slides.add();
  slide.background.fill = C.canvas;
  addHeader(
    slide,
    "THE SDLC IMPLICATION",
    "Context engineering becomes SDLC engineering",
    "A capable agent stays dependable only when durable anchors hold intent, authority, and proof in place.",
    11,
  );

  addShape(slide, "anchor-current-underlay", "roundRect", {
    left: 118, top: 392, width: 1044, height: 24,
  }, C.tealWash, "none", 12);
  addShape(slide, "anchor-current", "rightArrow", {
    left: 118, top: 386, width: 1044, height: 36,
  }, C.blue);
  const anchors = [
    {
      x: 128,
      title: "SPECIFICATION",
      detail: "what good looks like",
      fill: C.blueWash,
      line: C.blue,
    },
    {
      x: 469,
      title: "GUARDRAILS",
      detail: "what must stay bounded",
      fill: C.coralWash,
      line: C.coral,
    },
    {
      x: 810,
      title: "EVIDENCE",
      detail: "what proves completion",
      fill: C.tealWash,
      line: C.teal,
    },
  ];
  anchors.forEach((anchor, index) => {
    addShape(slide, `anchor-line-${index + 1}`, "rect", {
      left: anchor.x + 157, top: 282, width: 4, height: 190,
    }, anchor.line);
    addShape(slide, `anchor-weight-${index + 1}`, "ellipse", {
      left: anchor.x + 132, top: 447, width: 54, height: 54,
    }, anchor.fill, anchor.line, 0, "shadow-none", 3);
    addShape(slide, `anchor-label-${index + 1}`, "roundRect", {
      left: anchor.x, top: 217, width: 318, height: 116,
    }, C.surface, anchor.line, 20, "0px 6px 18px #08263A/08", 2);
    addText(slide, `anchor-title-${index + 1}`, anchor.title, {
      left: anchor.x + 18, top: 240, width: 282, height: 30,
    }, { fontSize: 24, color: anchor.line, bold: true, alignment: "center" });
    addText(slide, `anchor-detail-${index + 1}`, anchor.detail, {
      left: anchor.x + 18, top: 282, width: 282, height: 26,
    }, { fontSize: 17, color: C.ink, alignment: "center" });
  });
  addText(slide, "anchor-conclusion", "Without these anchors, reach grows faster than reliability.", {
    left: 230, top: 548, width: 820, height: 44,
  }, { fontSize: 29, color: C.ink, bold: true, alignment: "center" });
  addFooter(slide, "[9] long-running harnesses · [11] context engineering", 11);

  setNotes(
    slide,
    "Narrative job: land the central takeaway before introducing mdkg.\nPrimary claim: capable coding agents still need durable specifications, guardrails, and evidence to form a dependable SDLC.\nDo not cut this slide.",
    "1:50",
    [
      "[9] Anthropic, Effective harnesses for long-running agents: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents",
      "[11] Anthropic, Effective context engineering for AI agents: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
    ],
  );
}

function buildSlide12() {
  const slide = presentation.slides.add();
  slide.background.fill = C.canvas;
  addHeader(
    slide,
    "WHY MDKG",
    "I built mdkg to stay at the architecture layer",
    "The goal was not to type faster. It was to make better decisions—and give agents durable structure to execute them.",
    12,
  );

  addShape(slide, "creator-noise-field", "roundRect", {
    left: 72, top: 213, width: 470, height: 338,
  }, C.wash, C.line, 24, "shadow-none", 2);
  const noise = [
    { text: "more tabs", x: 111, y: 248, color: C.line },
    { text: "longer prompts", x: 220, y: 318, color: C.muted },
    { text: "re-explain context", x: 122, y: 401, color: C.line },
    { text: "repeat the plan", x: 264, y: 471, color: C.muted },
  ];
  noise.forEach((item, index) => {
    addText(slide, `creator-noise-${index + 1}`, item.text, {
      left: item.x, top: item.y, width: 250, height: 32,
    }, { fontSize: 22, color: item.color, bold: index % 2 === 0 });
  });
  addShape(slide, "creator-transition-arrow", "rightArrow", {
    left: 547, top: 349, width: 126, height: 48,
  }, C.blue);
  addShape(slide, "creator-focus-plane", "roundRect", {
    left: 687, top: 197, width: 521, height: 370,
  }, C.ink, C.teal, 28, "0px 8px 24px #005B57/18", 3);
  addText(slide, "creator-focus-kicker", "HUMAN ATTENTION", {
    left: 729, top: 242, width: 430, height: 28,
  }, { fontSize: 18, color: C.aqua, bold: true, alignment: "center" });
  addText(slide, "creator-focus-architecture", "ARCHITECTURE", {
    left: 719, top: 308, width: 458, height: 58,
  }, { fontSize: 40, color: C.canvas, bold: true, alignment: "center" });
  addShape(slide, "creator-focus-rule", "rect", {
    left: 759, top: 386, width: 378, height: 3,
  }, C.aqua);
  addText(slide, "creator-focus-planning", "PLANNING", {
    left: 719, top: 414, width: 458, height: 58,
  }, { fontSize: 40, color: C.canvas, bold: true, alignment: "center" });
  addText(slide, "creator-focus-detail", "agents execute within durable structure", {
    left: 729, top: 507, width: 438, height: 28,
  }, { fontSize: 17, color: C.aqua, alignment: "center" });
  addPill(slide, "creator-takeaway", "PERSONAL-PROJECT VELOCITY WITHOUT GIVING UP DESIGN JUDGMENT", {
    left: 288, top: 588, width: 704, height: 40,
  }, C.coralWash, C.ink, C.coral, 2);
  addFooter(slide, "", 12);

  setNotes(
    slide,
    "Narrative job: provide a brief personal transition without turning the talk into a founder story.\nSpeaker cue: I wanted to move faster on personal projects, but the part I cared about was not typing more code. It was making the architecture and planning decisions—and giving agents enough durable structure to execute them.",
    "1:10",
    [
      "First-person creator account; no external factual claim.",
    ],
  );
}

function buildSlide13() {
  const slide = presentation.slides.add();
  slide.background.fill = C.canvas;
  addHeader(
    slide,
    "THE MISSING LAYER",
    "The missing layer is durable project state",
    "A transcript can help a conversation. A repository must preserve what the next human or agent needs to act.",
    13,
  );

  addShape(slide, "state-arrow", "rightArrow", {
    left: 484, top: 344, width: 170, height: 48,
  }, C.blue);
  addShape(slide, "state-chat", "roundRect", {
    left: 72, top: 219, width: 430, height: 326,
  }, C.blueWash, C.blue, 28, "0px 6px 18px #00566D/08", 2);
  addText(slide, "state-chat-title", "CHAT", {
    left: 108, top: 255, width: 160, height: 36,
  }, { fontSize: 24, color: C.blue, bold: true });
  addText(slide, "state-chat-lines",
    "“Here is the goal…”\n\n“Remember the constraint…”\n\n“What did we decide?”",
    { left: 108, top: 314, width: 346, height: 166 },
    { fontSize: 22, color: C.muted, bold: true },
  );
  addText(slide, "state-chat-fade", "conversation fades", {
    left: 108, top: 499, width: 260, height: 24,
  }, { fontSize: 16, color: C.coral, bold: true });

  addShape(slide, "state-repo", "roundRect", {
    left: 638, top: 197, width: 570, height: 370,
  }, C.surface, C.teal, 28, "0px 8px 24px #005B57/12", 3);
  addText(slide, "state-repo-title", "REPOSITORY-OWNED STATE", {
    left: 682, top: 231, width: 484, height: 38,
  }, { fontSize: 24, color: C.teal, bold: true });
  const stateRows = [
    "requirements",
    "decisions",
    "authority",
    "accepted evidence",
    "next authorized work",
  ];
  stateRows.forEach((row, index) => {
    addShape(slide, `state-row-rule-${index + 1}`, "rect", {
      left: 682, top: 298 + index * 50, width: 36, height: 4,
    }, index === 2 ? C.coral : C.aqua);
    addText(slide, `state-row-${index + 1}`, row, {
      left: 742, top: 283 + index * 50, width: 390, height: 30,
    }, { fontSize: 22, color: C.ink, bold: index === 4 });
  });
  addPill(slide, "state-conclusion", "REVIEWABLE · ADDRESSABLE · RECOVERABLE", {
    left: 390, top: 595, width: 500, height: 38,
  }, C.tealWash, C.ink, C.teal, 2);
  addFooter(slide, "[14] mdkg project-state operating model", 13);

  setNotes(
    slide,
    "Narrative job: define the problem mdkg addresses without presenting a CLI feature list.\nPrimary claim: chat transcripts and large prompts do not, by themselves, preserve scope, decisions, authority, accepted evidence, and next work as reviewable project state.",
    "1:50",
    [
      "Program requirements: presentations/ai-native-sdlc-demo/.mdkg/design/prd-1-ai-native-sdlc-presentation-and-live-demo-program-requirements.md",
    ],
  );
}

function buildSlide14() {
  const slide = presentation.slides.add();
  slide.background.fill = C.canvas;
  addHeader(
    slide,
    "THE OPERATING MODEL",
    "Plan → Work → Evidence",
    "One durable loop connects explicit intent to bounded execution and inspectable proof.",
    14,
  );

  const cards = [
    { x: 72, n: "01", title: "PLAN", detail: "Requirements\nDecisions\nGuardrails", accent: C.cyan, wash: C.blueWash },
    { x: 475, n: "02", title: "WORK", detail: "One bounded node\nExplicit authority\nClear handoff", accent: C.aqua, wash: C.tealWash },
    { x: 878, n: "03", title: "EVIDENCE", detail: "Tests + receipts\nCheckpoints\nValidated state", accent: C.sea, wash: C.tealWash },
  ];
  addShape(slide, "pwe-arrow-1", "rightArrow", {
    left: 411, top: 328, width: 54, height: 34,
  }, C.blue);
  addShape(slide, "pwe-arrow-2", "rightArrow", {
    left: 814, top: 328, width: 54, height: 34,
  }, C.teal);
  cards.forEach((item, index) => {
    addShape(slide, `pwe-card-${index + 1}`, "roundRect", {
      left: item.x, top: 208, width: 330, height: 278,
    }, C.surface, C.line, 22, "0px 8px 20px #08263A/10", 2);
    addShape(slide, `pwe-topwash-${index + 1}`, "roundRect", {
      left: item.x + 2, top: 210, width: 326, height: 99,
    }, item.wash, "none", 20);
    addShape(slide, `pwe-accent-${index + 1}`, "ellipse", {
      left: item.x + 22, top: 232, width: 58, height: 58,
    }, item.accent, C.ink, 0, "shadow-none", 2);
    addText(slide, `pwe-number-${index + 1}`, item.n, {
      left: item.x + 24, top: 249, width: 54, height: 23,
    }, { fontSize: 16, color: C.ink, bold: true, alignment: "center" });
    addText(slide, `pwe-title-${index + 1}`, item.title, {
      left: item.x + 100, top: 241, width: 204, height: 39,
    }, { fontSize: 29, color: C.ink, bold: true });
    addShape(slide, `pwe-rule-${index + 1}`, "rect", {
      left: item.x + 22, top: 320, width: 286, height: 2,
    }, C.line);
    addText(slide, `pwe-detail-${index + 1}`, item.detail, {
      left: item.x + 24, top: 348, width: 280, height: 112,
    }, { fontSize: 20, color: C.ink2 });
  });
  addShape(slide, "pwe-conclusion", "roundRect", {
    left: 235, top: 540, width: 810, height: 70,
  }, C.ink, C.blue, 18, "shadow-none", 2);
  addText(slide, "pwe-conclusion-text", "THE FINISH LINE IS ACCEPTED EVIDENCE.", {
    left: 270, top: 562, width: 740, height: 28,
  }, { fontSize: 21, color: C.aqua, bold: true, alignment: "center" });
  addFooter(slide, "[14] mdkg Plan → Work → Evidence", 14);

  setNotes(
    slide,
    "Narrative job: introduce the smallest memorable mdkg operating model.\nPrimary claim: dependable agentic work connects an explicit plan to bounded execution and inspectable proof.",
    "2:00",
    [
      "[14] mdkg canonical landing-page source at inspected commit 580be1e6efffe852e9996186e85e2bcbcd3e3e3b: https://github.com/nickreames/mdkg/blob/580be1e6efffe852e9996186e85e2bcbcd3e3e3b/mdkg-dev/src/pages/index.astro",
    ],
  );
}

function buildSlide15() {
  const slide = presentation.slides.add();
  slide.background.fill = C.canvas;
  addHeader(
    slide,
    "RECOVERABLE PROJECT STATE",
    "Durable context answers three questions",
    "A project should make completion, rationale, and next work recoverable without replaying the entire conversation.",
    15,
  );

  addShape(slide, "ledger-spine", "roundRect", {
    left: 116, top: 207, width: 22, height: 396,
  }, C.ink, "none", 11);
  const rows = [
    {
      y: 221,
      number: "01",
      question: "WHAT COMPLETED?",
      answer: "The accepted outcome, tests, and checkpoint.",
      color: C.blue,
      fill: C.blueWash,
    },
    {
      y: 354,
      number: "02",
      question: "WHY?",
      answer: "The requirements and decisions that shaped the work.",
      color: C.teal,
      fill: C.tealWash,
    },
    {
      y: 487,
      number: "03",
      question: "WHAT COMES NEXT?",
      answer: "The next authorized node—not a guess at the backlog.",
      color: C.coral,
      fill: C.coralWash,
    },
  ];
  rows.forEach((row, index) => {
    addShape(slide, `ledger-connector-${index + 1}`, "rect", {
      left: 126, top: row.y + 55, width: 70, height: 4,
    }, row.color);
    addShape(slide, `ledger-number-${index + 1}`, "ellipse", {
      left: 96, top: row.y + 38, width: 62, height: 62,
    }, row.fill, row.color, 0, "shadow-none", 3);
    addText(slide, `ledger-number-text-${index + 1}`, row.number, {
      left: 100, top: row.y + 57, width: 54, height: 24,
    }, { fontSize: 17, color: row.color, bold: true, alignment: "center" });
    addText(slide, `ledger-question-${index + 1}`, row.question, {
      left: 216, top: row.y, width: 520, height: 42,
    }, { fontSize: 31, color: row.color, bold: true });
    addText(slide, `ledger-answer-${index + 1}`, row.answer, {
      left: 216, top: row.y + 58, width: 882, height: 38,
    }, { fontSize: 22, color: C.ink, bold: true });
  });
  addFooter(slide, "[14] mdkg project-state operating model", 15);

  setNotes(
    slide,
    "Narrative job: make the operating model useful to engineers and leaders immediately.\nPrimary claim: durable project state should answer what completed, why it was done, and what comes next.",
    "1:40",
    [
      "[14] mdkg program requirements and canonical product source: https://github.com/nickreames/mdkg/blob/580be1e6efffe852e9996186e85e2bcbcd3e3e3b/mdkg-dev/src/pages/index.astro",
    ],
  );
}

function buildSlide16() {
  const slide = presentation.slides.add();
  slide.background.fill = C.canvas;
  addHeader(
    slide,
    "WHERE MDKG FITS",
    "mdkg keeps the human at the architecture layer",
    "Structured Markdown holds durable project state while coding agents keep using their existing harnesses.",
    16,
  );

  addShape(slide, "architecture-layer", "roundRect", {
    left: 72, top: 202, width: 1136, height: 126,
  }, C.ink, C.teal, 24, "0px 7px 20px #005B57/14", 3);
  addText(slide, "architecture-layer-kicker", "HUMAN DECISIONS", {
    left: 110, top: 228, width: 340, height: 26,
  }, { fontSize: 18, color: C.aqua, bold: true });
  addText(slide, "architecture-layer-title", "Architecture · planning · authority", {
    left: 110, top: 267, width: 980, height: 42,
  }, { fontSize: 31, color: C.canvas, bold: true });

  addShape(slide, "repo-layer", "roundRect", {
    left: 152, top: 371, width: 976, height: 112,
  }, C.surface, C.blue, 22, "0px 6px 18px #00566D/09", 2);
  addText(slide, "repo-layer-title", "REPO-OWNED MARKDOWN KNOWLEDGE GRAPH", {
    left: 188, top: 393, width: 904, height: 30,
  }, { fontSize: 22, color: C.blue, bold: true, alignment: "center" });
  addText(slide, "repo-layer-items", "goals · requirements · decisions · work · checkpoints", {
    left: 188, top: 440, width: 904, height: 28,
  }, { fontSize: 20, color: C.ink, bold: true, alignment: "center" });

  addShape(slide, "harness-connector-1", "rect", {
    left: 358, top: 483, width: 4, height: 40,
  }, C.line);
  addShape(slide, "harness-connector-2", "rect", {
    left: 638, top: 483, width: 4, height: 40,
  }, C.line);
  addShape(slide, "harness-connector-3", "rect", {
    left: 918, top: 483, width: 4, height: 40,
  }, C.line);
  [
    { x: 232, label: "CODEX", fill: C.blueWash, line: C.blue },
    { x: 512, label: "CLAUDE CODE", fill: C.tealWash, line: C.teal },
    { x: 792, label: "OTHER HARNESSES", fill: C.coralWash, line: C.coral },
  ].forEach((item, index) => {
    addShape(slide, `harness-${index + 1}`, "roundRect", {
      left: item.x, top: 521, width: 256, height: 74,
    }, item.fill, item.line, 18, "shadow-none", 2);
    addText(slide, `harness-label-${index + 1}`, item.label, {
      left: item.x + 14, top: 544, width: 228, height: 30,
    }, { fontSize: 20, color: item.line, bold: true, alignment: "center" });
  });
  addFooter(slide, "[13] pre-v1 public alpha · [14] Plan → Work → Evidence", 16);

  setNotes(
    slide,
    "Narrative job: position mdkg as Git-native context engineering, not an agent harness or replacement for engineering judgment.\nPrimary claim: structured Markdown can keep goals, requirements, decisions, work, and checkpoints addressable in the repository while coding agents use their existing tools.",
    "2:15",
    [
      "[13] mdkg Public Alpha Contract at inspected commit 580be1e6efffe852e9996186e85e2bcbcd3e3e3b: https://github.com/nickreames/mdkg/blob/580be1e6efffe852e9996186e85e2bcbcd3e3e3b/docs/start-here/public-alpha-contract.md",
      "[14] mdkg canonical landing-page source: https://github.com/nickreames/mdkg/blob/580be1e6efffe852e9996186e85e2bcbcd3e3e3b/mdkg-dev/src/pages/index.astro",
    ],
  );
}

function addGoalField(slide, prefix, x, y, label, value, accent = C.teal, width = 365) {
  addText(slide, `${prefix}-label-${label}`, label.toUpperCase(), {
    left: x, top: y, width: 190, height: 22,
  }, { fontSize: 16, color: accent, bold: true });
  addText(slide, `${prefix}-value-${label}`, value, {
    left: x, top: y + 25, width, height: 40,
  }, { fontSize: 17, color: C.ink, bold: true });
}

function buildSlide17() {
  const slide = presentation.slides.add();
  slide.background.fill = C.canvas;
  addHeader(
    slide,
    "REUSABLE → SPECIALIZED",
    "A reusable specification becomes bounded execution",
    "The goal stays recognizable while the audience, requirements, work, and proof become specific.",
    17,
  );

  addShape(slide, "source-goal", "roundRect", {
    left: 72, top: 199, width: 458, height: 391,
  }, C.surface, C.line, 22, "0px 6px 18px #08263A/10", 2);
  addPill(slide, "source-goal-pill", "SOURCE SPECIFICATION", {
    left: 96, top: 221, width: 270, height: 34,
  }, C.blueWash, C.blue, C.blue, 2);
  addText(slide, "source-goal-id", "goal-1", {
    left: 96, top: 273, width: 240, height: 48,
  }, { fontSize: 34, color: C.ink, bold: true });
  addGoalField(slide, "source", 96, 337, "Objective", "Create a public landing page");
  addGoalField(slide, "source", 96, 416, "Fixed guardrails", "Ocean Flow · static Astro");
  addGoalField(slide, "source", 96, 495, "Variable", "Audience · offer · composition", C.muted);

  addShape(slide, "specialize-underlay", "roundRect", {
    left: 553, top: 367, width: 152, height: 16,
  }, C.tealWash, "none", 8);
  addShape(slide, "specialize-arrow", "rightArrow", {
    left: 558, top: 348, width: 142, height: 55,
  }, C.blue);
  addPill(slide, "specialize-label", "SPECIALIZE", {
    left: 560, top: 302, width: 138, height: 32,
  }, C.surface, C.ink, C.line, 2);

  addShape(slide, "executed-goal", "roundRect", {
    left: 728, top: 179, width: 480, height: 431,
  }, C.surface, C.teal, 22, "0px 8px 22px #005B57/15", 3);
  addShape(slide, "executed-current", "roundRect", {
    left: 728, top: 179, width: 480, height: 12,
  }, C.aqua, "none", 6);
  addPill(slide, "executed-goal-pill", "SPECIALIZED EXECUTION", {
    left: 752, top: 207, width: 238, height: 34,
  }, C.tealWash, C.teal, C.teal, 2);
  addText(slide, "executed-goal-id", "goal-1", {
    left: 752, top: 258, width: 240, height: 48,
  }, { fontSize: 34, color: C.ink, bold: true });
  addGoalField(slide, "executed", 752, 318, "Positioning", "Selected audience + promise");
  addGoalField(slide, "executed", 752, 390, "Requirements", "Static Astro · zero client JS");
  addGoalField(slide, "executed", 752, 462, "Work", "Bounded nodes · explicit authority");
  addGoalField(slide, "executed", 752, 534, "Evidence", "Build · routes · receipts", C.teal);
  addFooter(slide, "", 17);

  setNotes(
    slide,
    "Narrative job: prepare the audience to read the reveal as source-to-execution proof without teaching graph mechanics.\nSpeaker cue: I am not asking you to learn graph mechanics. Read this as a reusable starting specification becoming a bounded, specialized execution.\nThe displayed fields come from the accepted Goal 2 interface contract; they describe the reusable execution contract and do not claim that a future Demo 2 or Demo 3 run has completed.",
    "1:35",
    [
      "Demo architecture contract: presentations/ai-native-sdlc-demo/.mdkg/design/edd-1-ai-native-sdlc-presentation-demo-program-architecture-and-execution.md",
      "Accepted Goal 2 interface: presentations/ai-native-sdlc-demo/artifacts/demo-platform/interface-contract.json",
    ],
  );
}

function buildSlide18() {
  const slide = presentation.slides.add();
  slide.background.fill = C.ink;
  addShape(slide, "reveal-current-underlay", "roundRect", {
    left: 128, top: 503, width: 1024, height: 16,
  }, C.teal, "none", 8);
  addShape(slide, "reveal-current", "roundRect", {
    left: 128, top: 507, width: 1024, height: 7,
  }, C.aqua, "none", 4);
  [236, 484, 732, 980].forEach((left, index) => {
    addShape(slide, `reveal-node-${index + 1}`, "ellipse", {
      left, top: 490, width: 40, height: 40,
    }, index === 3 ? C.coralWash : C.ink, index === 3 ? C.coral : C.aqua, 0, "shadow-none", 3);
  });
  addText(slide, "reveal-kicker", "LIVE REVEAL", {
    left: 128, top: 112, width: 1024, height: 30,
  }, { fontSize: 20, color: C.aqua, bold: true, alignment: "center" });
  addText(slide, "reveal-title", "Let’s inspect the run", {
    left: 128, top: 188, width: 1024, height: 92,
  }, { fontSize: 60, color: C.canvas, bold: true, alignment: "center" });
  addText(slide, "reveal-subtitle", "Source specification  →  specialized goal  →  output  →  evidence", {
    left: 128, top: 319, width: 1024, height: 46,
  }, { fontSize: 25, color: C.sea, bold: true, alignment: "center" });
  addText(slide, "reveal-prompt", "What completed?   Why?   What comes next?", {
    left: 128, top: 400, width: 1024, height: 38,
  }, { fontSize: 23, color: C.canvas, alignment: "center" });

  setNotes(
    slide,
    "Narrative job: provide a clean audience-facing transition from the deck to the live browser reveal.\nSuccess branch: show source goal, specialized Demo 3 goal, output, Plan → Work → Evidence, and exact-SHA/live-route receipts.\nStill-running branch: state that Demo 3 is still running and use the sealed fallback.\nHard-blocker branch: show the blocker receipt and authority boundary, then use the sealed fallback.\nDo not expose the branch decision tree on screen; select the honest branch in the browser.",
    "2:05 target; 2:15 maximum",
    [
      "Event and fallback contract: presentations/ai-native-sdlc-demo/.mdkg/work/goal-7-execute-and-reveal-the-live-demo-3-goal.md",
      "Accepted Goal 2 interface fixture: presentations/ai-native-sdlc-demo/artifacts/demo-platform/interface-contract.json",
    ],
  );
}

async function buildSlide19() {
  const slide = presentation.slides.add();
  slide.background.fill = C.canvas;
  addHeader(
    slide,
    "TRY THE PUBLIC ALPHA",
    "Try mdkg on one real project",
    "Use the quickstart, keep the experiment bounded, and send feedback that improves the pre-v1 workflow.",
    19,
  );

  const quickstartBlob = await readImageBlob(path.join(QR_DIR, "quickstart.png"));
  const issuesBlob = await readImageBlob(path.join(QR_DIR, "issues.png"));
  slide.images.add({
    blob: quickstartBlob,
    contentType: "image/png",
    alt: "QR code for the mdkg quickstart URL",
    fit: "contain",
    position: { left: 152, top: 221, width: 296, height: 296 },
  });
  slide.images.add({
    blob: issuesBlob,
    contentType: "image/png",
    alt: "QR code for the mdkg GitHub Issues feedback URL",
    fit: "contain",
    position: { left: 832, top: 221, width: 296, height: 296 },
  });
  addText(slide, "quickstart-label", "QUICKSTART", {
    left: 112, top: 532, width: 376, height: 32,
  }, { fontSize: 24, color: C.blue, bold: true, alignment: "center" });
  addText(slide, "quickstart-url", "docs.mdkg.dev/start-here/quickstart/", {
    left: 72, top: 576, width: 456, height: 28,
  }, { fontSize: 16, color: C.ink, bold: true, alignment: "center" });
  addText(slide, "feedback-label", "SEND FEEDBACK", {
    left: 792, top: 532, width: 376, height: 32,
  }, { fontSize: 24, color: C.teal, bold: true, alignment: "center" });
  addText(slide, "feedback-url", "github.com/nickreames/mdkg/issues", {
    left: 752, top: 576, width: 456, height: 28,
  }, { fontSize: 16, color: C.ink, bold: true, alignment: "center" });
  addShape(slide, "cta-divider", "rect", {
    left: 638, top: 236, width: 3, height: 342,
  }, C.line);
  addPill(slide, "alpha-status", "PRE-V1 · PUBLIC ALPHA · ACTIVE IMPROVEMENT", {
    left: 394, top: 617, width: 492, height: 36,
  }, C.coralWash, C.ink, C.coral, 2);
  addFooter(slide, "[13] mdkg Public Alpha Contract", 19);

  setNotes(
    slide,
    "Narrative job: close with a bounded, honest invitation.\nSpoken close: Try mdkg on one real project and send me feedback.\nBoth QR assets were generated locally and scan-tested against the readable displayed URLs.",
    "0:45 maximum",
    [
      "[13] mdkg Public Alpha Contract at inspected commit 580be1e6efffe852e9996186e85e2bcbcd3e3e3b: https://github.com/nickreames/mdkg/blob/580be1e6efffe852e9996186e85e2bcbcd3e3e3b/docs/start-here/public-alpha-contract.md",
      "Quickstart QR and displayed URL: https://docs.mdkg.dev/start-here/quickstart/",
      "Feedback QR and displayed URL: https://github.com/nickreames/mdkg/issues",
      "Local scan receipt: presentations/ai-native-sdlc-demo/deck/assets/qr/scan-receipt.json",
    ],
  );
}

function buildSlide20() {
  const slide = presentation.slides.add();
  slide.background.fill = C.canvas;
  addHeader(
    slide,
    "REFERENCE",
    "Sources",
    "Primary sources for the capability timeline and product claims.",
    20,
  );

  const sources = [
    "[1] GitHub · Copilot technical preview · 2021",
    "[2] OpenAI · ChatGPT research preview · 2022",
    "[3] OpenAI · o1 reasoning · 2024",
    "[4] Anthropic · Claude Code · 2025",
    "[5] Cursor · Agent overview · living docs",
    "[6] Anthropic · Agent Skills · 2025",
    "[7] OpenAI · Introducing Codex · 2025",
    "[8] OpenAI · Agents transforming work · 2026",
    "[9] Anthropic · Long-running harnesses · 2025",
    "[10] OpenAI · GPT-4.1 context · 2025",
    "[11] Anthropic · Context engineering · 2025",
    "[12] METR · Task-completion time horizons · 2026",
    "[13] mdkg · Public Alpha Contract",
    "[14] mdkg · Plan → Work → Evidence source",
  ];
  sources.forEach((source, index) => {
    const column = index < 7 ? 0 : 1;
    const row = index % 7;
    const x = column === 0 ? 72 : 654;
    const y = 198 + row * 59;
    addShape(slide, `source-index-rule-${index + 1}`, "rect", {
      left: x, top: y + 11, width: 28, height: 4,
    }, index === 12 ? C.coral : index % 2 ? C.teal : C.blue);
    addText(slide, `source-index-${index + 1}`, source, {
      left: x + 44, top: y, width: 510, height: 34,
    }, { fontSize: 16, color: C.ink, bold: true });
  });
  addFooter(slide, "Full URLs and claim limitations are retained in speaker notes.", 20);

  setNotes(
    slide,
    "Narrative job: provide an unspoken appendix index for numbered markers. Do not present this slide unless a source question calls for it.",
    "0:00",
    [
      "Complete source list: deck/citations/claim-matrix.md",
      "[1] https://github.blog/news-insights/product-news/introducing-github-copilot-ai-pair-programmer/",
      "[2] https://openai.com/index/chatgpt/",
      "[3] https://openai.com/index/learning-to-reason-with-llms/",
      "[4] https://www.anthropic.com/news/claude-3-7-sonnet",
      "[5] https://docs.cursor.com/en/agent/overview",
      "[6] https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills",
      "[7] https://openai.com/index/introducing-codex/",
      "[8] https://openai.com/index/how-agents-are-transforming-work/",
      "[9] https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents",
      "[10] https://openai.com/index/gpt-4-1/",
      "[11] https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
      "[12] https://metr.org/time-horizons/",
      "[13] https://github.com/nickreames/mdkg/blob/580be1e6efffe852e9996186e85e2bcbcd3e3e3b/docs/start-here/public-alpha-contract.md",
      "[14] https://github.com/nickreames/mdkg/blob/580be1e6efffe852e9996186e85e2bcbcd3e3e3b/mdkg-dev/src/pages/index.astro",
    ],
  );
}

function relativeLuminance(hex) {
  const channels = hex.slice(1).match(/../g).map((value) => parseInt(value, 16) / 255);
  const linear = channels.map((value) => (
    value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  ));
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrastRatio(a, b) {
  const first = relativeLuminance(a);
  const second = relativeLuminance(b);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

async function writeAccessibilityReceipt() {
  const pairs = [
    { use: "Primary text on canvas", foreground: C.ink, background: C.canvas, requirement: 7 },
    { use: "Primary text on surface", foreground: C.ink, background: C.surface, requirement: 7 },
    { use: "Secondary text on canvas", foreground: C.muted, background: C.canvas, requirement: 7 },
    { use: "Teal accent text on canvas", foreground: C.teal, background: C.canvas, requirement: 7 },
    { use: "Blue accent text on canvas", foreground: C.blue, background: C.canvas, requirement: 7 },
    { use: "Coral accent text on canvas", foreground: C.coral, background: C.canvas, requirement: 7 },
    { use: "Light text on dark anchor", foreground: C.canvas, background: C.ink, requirement: 7 },
    { use: "Cyan text on dark anchor", foreground: C.cyan, background: C.ink, requirement: 7 },
    { use: "Aqua text on dark anchor", foreground: C.aqua, background: C.ink, requirement: 7 },
    { use: "Functional boundary on canvas", foreground: C.line, background: C.canvas, requirement: 3 },
    { use: "Functional boundary on surface", foreground: C.line, background: C.surface, requirement: 3 },
  ].map((pair) => {
    const ratio = contrastRatio(pair.foreground, pair.background);
    if (ratio < pair.requirement) {
      throw new Error(`${pair.use} contrast ${ratio.toFixed(2)} is below ${pair.requirement}:1`);
    }
    return { ...pair, ratio: Number(ratio.toFixed(2)) };
  });
  await fs.writeFile(
    path.join(RENDER_DIR, "accessibility-palette.json"),
    `${JSON.stringify({
      standard: "WCAG 2.2 relative-luminance contrast",
      minimumTextSizePt: 16,
      pairs,
    }, null, 2)}\n`,
  );
}

async function writeBlob(filePath, blob) {
  await fs.writeFile(filePath, new Uint8Array(await blob.arrayBuffer()));
}

async function main() {
  await fs.mkdir(SLIDE_DIR, { recursive: true });

  buildSlide1();
  buildSlide2();
  buildSlide3();
  buildSlide4();
  buildSlide5();
  buildSlide6();
  buildSlide7();
  buildSlide8();
  buildSlide9();
  buildSlide10();
  buildSlide11();
  buildSlide12();
  buildSlide13();
  buildSlide14();
  buildSlide15();
  buildSlide16();
  buildSlide17();
  buildSlide18();
  await buildSlide19();
  buildSlide20();

  for (const [index, slide] of presentation.slides.items.entries()) {
    const stem = `slide-${String(index + 1).padStart(2, "0")}`;
    await writeBlob(
      path.join(SLIDE_DIR, `${stem}.png`),
      await presentation.export({ slide, format: "png", scale: 2 }),
    );
    const layout = await slide.export({ format: "layout" });
    await fs.writeFile(path.join(SLIDE_DIR, `${stem}.layout.json`), await layout.text());
  }

  await writeBlob(
    path.join(RENDER_DIR, "contact-sheet.webp"),
    await presentation.export({ format: "webp", montage: true, scale: 1 }),
  );
  const snapshot = await presentation.inspect({
    kind: "slide,textbox,shape,image,notes,layout",
    maxChars: 150000,
  });
  await fs.writeFile(path.join(RENDER_DIR, "inspect.ndjson"), snapshot.ndjson);
  await writeAccessibilityReceipt();

  const pptx = await PresentationFile.exportPptx(presentation);
  await pptx.save(FINAL_PPTX);
}

await main();
