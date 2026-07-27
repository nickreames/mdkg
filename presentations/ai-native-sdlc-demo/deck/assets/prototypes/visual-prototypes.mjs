import fs from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { Presentation, PresentationFile } = require("@oai/artifact-tool");

const SOURCE_DIR = path.dirname(fileURLToPath(import.meta.url));
const RENDER_DIR = path.resolve(SOURCE_DIR, "../../rendered/prototypes");
const SLIDE_DIR = path.join(RENDER_DIR, "slides");

const C = {
  navy: "#061A2C",
  navy2: "#0A2840",
  cyan: "#3EDBFF",
  teal: "#13C7B3",
  sea: "#5EEAD4",
  coral: "#FF7A6E",
  paper: "#F4F8FB",
  mist: "#C2D4E1",
  muted: "#86A2B5",
  line: "#234A63",
  white: "#FFFFFF",
};

const presentation = Presentation.create({
  slideSize: { width: 1280, height: 720 },
});

function addShape(slide, name, geometry, position, fill, line = "none", radius = 0, shadow = "shadow-none") {
  return slide.shapes.add({
    geometry,
    name,
    position,
    fill,
    line: {
      style: "solid",
      fill: line,
      width: line === "none" ? 0 : 1,
    },
    ...(radius ? { borderRadius: radius } : {}),
    shadow,
  });
}

function addText(slide, name, text, position, {
  fontSize = 20,
  color = C.paper,
  bold = false,
  alignment = "left",
} = {}) {
  const shape = addShape(slide, name, "textbox", position, "none");
  shape.text = text;
  shape.text.style = { fontSize, color, bold, alignment };
  return shape;
}

function addHeader(slide, eyebrow, title, subtitle, slideNumber) {
  addText(slide, `eyebrow-${slideNumber}`, eyebrow, {
    left: 72, top: 45, width: 600, height: 22,
  }, { fontSize: 16, color: C.teal, bold: true });
  addText(slide, `title-${slideNumber}`, title, {
    left: 72, top: 75, width: 1110, height: 58,
  }, { fontSize: 38, color: C.paper, bold: true });
  addText(slide, `subtitle-${slideNumber}`, subtitle, {
    left: 72, top: 137, width: 1110, height: 34,
  }, { fontSize: 18, color: C.mist });
}

function addFooter(slide, sourceText, slideNumber) {
  addShape(slide, `footer-line-${slideNumber}`, "rect", {
    left: 72, top: 668, width: 1136, height: 1,
  }, C.line);
  addText(slide, `source-${slideNumber}`, sourceText, {
    left: 72, top: 679, width: 980, height: 20,
  }, { fontSize: 12, color: C.muted });
  addText(slide, `folio-${slideNumber}`, String(slideNumber).padStart(2, "0"), {
    left: 1150, top: 678, width: 58, height: 20,
  }, { fontSize: 12, color: C.muted, bold: true, alignment: "right" });
}

function addPill(slide, name, text, position, fill, color, border = "none") {
  const shape = addShape(slide, name, "roundRect", position, fill, border, 18);
  shape.text = text;
  shape.text.style = { fontSize: 14, color, bold: true, alignment: "center" };
  return shape;
}

function addMilestoneCard(slide, stage, index) {
  const x = 68 + index * 188;
  const above = index % 2 === 0;
  const y = above ? 207 : 402;
  const card = addShape(slide, `stage-card-${index + 1}`, "roundRect", {
    left: x, top: y, width: 176, height: 112,
  }, index === 5 ? C.navy2 : "#0B2236", index === 5 ? C.coral : C.line, 18,
  index === 5 ? "0px 5px 18px #13C7B3/25" : "shadow-none");
  addText(slide, `stage-date-${index + 1}`, stage.date, {
    left: x + 14, top: y + 14, width: 148, height: 20,
  }, { fontSize: 14, color: index === 5 ? C.coral : C.teal, bold: true });
  addText(slide, `stage-label-${index + 1}`, stage.label, {
    left: x + 14, top: y + 40, width: 148, height: 42,
  }, { fontSize: 15, color: C.paper, bold: true });
  addText(slide, `stage-product-${index + 1}`, stage.product, {
    left: x + 14, top: y + 87, width: 148, height: 18,
  }, { fontSize: 13, color: C.muted });

  addShape(slide, `stage-connector-${index + 1}`, "rect", {
    left: x + 86,
    top: above ? y + 112 : 358,
    width: 3,
    height: above ? 31 : 44,
  }, index === 5 ? C.coral : C.line);
  addShape(slide, `stage-dot-${index + 1}`, "ellipse", {
    left: x + 76, top: 340, width: 23, height: 23,
  }, index === 5 ? C.coral : C.cyan, C.navy, 0);
  return card;
}

function buildTimelineSlide() {
  const slide = presentation.slides.add();
  slide.background.fill = C.navy;
  addHeader(
    slide,
    "CAPABILITY PROGRESSION",
    "The unit of coding work kept expanding",
    "Capabilities accumulated. Product dates overlap; each stage adds reach without deleting the previous one.",
    1,
  );

  addShape(slide, "timeline-current", "rect", {
    left: 84, top: 349, width: 1082, height: 6,
  }, C.cyan, "none", 3, "0px 0px 16px #3EDBFF/35");
  addShape(slide, "timeline-arrow", "rightArrow", {
    left: 1148, top: 336, width: 64, height: 32,
  }, C.cyan);

  const stages = [
    { date: "2021", label: "AUTOCOMPLETE", product: "GitHub Copilot" },
    { date: "2022", label: "PROMPT\nENGINEERING", product: "ChatGPT" },
    { date: "2024", label: "REASONING", product: "OpenAI o1" },
    { date: "2025", label: "TOOL USE", product: "Claude Code" },
    { date: "2025", label: "CONDITIONAL\nCONTEXT", product: "SKILL.md" },
    { date: "2025–26", label: "LONG\nHORIZON", product: "Codex + Claude" },
  ];
  stages.forEach((stage, index) => addMilestoneCard(slide, stage, index));

  addPill(slide, "horizon-caveat",
    "Evidence rule  ·  human-equivalent task horizon ≠ elapsed agent runtime",
    { left: 318, top: 605, width: 644, height: 36 },
    "#102F46", C.mist, C.line);
  addFooter(slide, "[1–12] Primary sources and limitations in claim matrix + speaker notes", 1);

  slide.speakerNotes.textFrame.setText(
    "Narrative job: show a loose, overlapping progression from line completion to bounded goals.\n" +
    "Call out that capabilities accumulate; this is not a strict product chronology.\n" +
    "Mandatory caveat: an eight-hour benchmark or human-equivalent task horizon is not eight hours of elapsed agent runtime.\n\n" +
    "[Sources]\n" +
    "[1] https://github.blog/news-insights/product-news/introducing-github-copilot-ai-pair-programmer/\n" +
    "[2] https://openai.com/index/chatgpt/\n" +
    "[3] https://openai.com/index/learning-to-reason-with-llms/\n" +
    "[4] https://www.anthropic.com/news/claude-3-7-sonnet\n" +
    "[5] https://docs.cursor.com/en/agent/overview\n" +
    "[6] https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills\n" +
    "[7] https://openai.com/index/introducing-codex/\n" +
    "[8] https://openai.com/index/how-agents-are-transforming-work/\n" +
    "[9] https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents\n" +
    "[10] https://openai.com/index/gpt-4-1/\n" +
    "[11] https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents\n" +
    "[12] https://metr.org/time-horizons/\n" +
    "[/Sources]",
  );
}

function buildPlanWorkEvidenceSlide() {
  const slide = presentation.slides.add();
  slide.background.fill = C.navy;
  addHeader(
    slide,
    "THE OPERATING MODEL",
    "A dependable agentic SDLC has one durable loop",
    "Not more ceremony—better project state for the next human or agent.",
    2,
  );

  const cards = [
    { x: 72, n: "01", title: "PLAN", detail: "Requirements\nDecisions\nGuardrails", accent: C.cyan },
    { x: 475, n: "02", title: "WORK", detail: "One bounded node\nExplicit authority\nClear handoff", accent: C.teal },
    { x: 878, n: "03", title: "EVIDENCE", detail: "Tests + receipts\nCheckpoints\nValidated state", accent: C.sea },
  ];

  cards.forEach((item, index) => {
    addShape(slide, `pwe-card-${index + 1}`, "roundRect", {
      left: item.x, top: 213, width: 330, height: 274,
    }, "#0B2236", C.line, 22, "0px 8px 20px #000000/18");
    addShape(slide, `pwe-accent-${index + 1}`, "roundRect", {
      left: item.x + 22, top: 235, width: 54, height: 54,
    }, item.accent, "none", 27);
    addText(slide, `pwe-number-${index + 1}`, item.n, {
      left: item.x + 22, top: 251, width: 54, height: 22,
    }, { fontSize: 16, color: C.navy, bold: true, alignment: "center" });
    addText(slide, `pwe-title-${index + 1}`, item.title, {
      left: item.x + 95, top: 244, width: 204, height: 38,
    }, { fontSize: 29, color: C.paper, bold: true });
    addShape(slide, `pwe-rule-${index + 1}`, "rect", {
      left: item.x + 22, top: 309, width: 286, height: 2,
    }, C.line);
    addText(slide, `pwe-detail-${index + 1}`, item.detail, {
      left: item.x + 24, top: 337, width: 280, height: 116,
    }, { fontSize: 20, color: C.mist });
  });

  addShape(slide, "flow-arrow-1", "rightArrow", {
    left: 411, top: 325, width: 54, height: 34,
  }, C.cyan);
  addShape(slide, "flow-arrow-2", "rightArrow", {
    left: 814, top: 325, width: 54, height: 34,
  }, C.teal);

  addShape(slide, "questions-band", "roundRect", {
    left: 72, top: 530, width: 1136, height: 93,
  }, C.navy2, C.line, 18);
  const questions = [
    { x: 96, q: "WHAT COMPLETED?", a: "accepted outcome" },
    { x: 444, q: "WHY?", a: "requirements + decisions" },
    { x: 770, q: "WHAT COMES NEXT?", a: "next authorized node" },
  ];
  questions.forEach((item, index) => {
    addText(slide, `question-${index + 1}`, item.q, {
      left: item.x, top: 552, width: 300, height: 24,
    }, { fontSize: 17, color: index === 1 ? C.teal : C.cyan, bold: true });
    addText(slide, `answer-${index + 1}`, item.a, {
      left: item.x, top: 582, width: 300, height: 22,
    }, { fontSize: 17, color: C.paper });
  });

  addFooter(slide, "[14] mdkg canonical Plan → Work → Evidence product source", 2);
  slide.speakerNotes.textFrame.setText(
    "Narrative job: introduce the smallest memorable mdkg operating model.\n" +
    "Primary claim: dependable agentic work connects an explicit plan to bounded execution and inspectable proof.\n\n" +
    "[Sources]\n" +
    "[14] https://github.com/nickreames/mdkg/blob/580be1e6efffe852e9996186e85e2bcbcd3e3e3b/mdkg-dev/src/pages/index.astro\n" +
    "[/Sources]",
  );
}

function addGoalField(slide, prefix, x, y, label, value, accent = C.teal) {
  addText(slide, `${prefix}-label-${label}`, label.toUpperCase(), {
    left: x, top: y, width: 160, height: 20,
  }, { fontSize: 12, color: accent, bold: true });
  addText(slide, `${prefix}-value-${label}`, value, {
    left: x, top: y + 24, width: 365, height: 43,
  }, { fontSize: 17, color: C.paper, bold: true });
}

function buildRevealSlide() {
  const slide = presentation.slides.add();
  slide.background.fill = C.navy;
  addHeader(
    slide,
    "SOURCE → EXECUTION PROOF",
    "Reusable specification → specialized, executed proof",
    "Same goal identity. Sharper requirements. Inspectable evidence.",
    3,
  );

  addShape(slide, "source-goal-card", "roundRect", {
    left: 72, top: 203, width: 458, height: 385,
  }, "#0B2236", C.line, 22);
  addPill(slide, "source-pill", "SOURCE TEMPLATE", {
    left: 96, top: 225, width: 180, height: 30,
  }, "#153B52", C.cyan);
  addText(slide, "source-goal-id", "goal-1", {
    left: 96, top: 272, width: 240, height: 48,
  }, { fontSize: 34, color: C.paper, bold: true });
  addGoalField(slide, "source", 96, 338, "Objective", "Create a public landing page");
  addGoalField(slide, "source", 96, 417, "Requirements", "Ocean Flow + bounded sections");
  addGoalField(slide, "source", 96, 496, "State", "Reusable · not yet executed", C.muted);

  addShape(slide, "specialize-arrow", "rightArrow", {
    left: 558, top: 355, width: 142, height: 55,
  }, C.cyan);
  addPill(slide, "specialize-pill", "SPECIALIZE", {
    left: 566, top: 314, width: 126, height: 28,
  }, C.navy2, C.mist, C.line);

  addShape(slide, "executed-goal-card", "roundRect", {
    left: 728, top: 183, width: 480, height: 425,
  }, C.navy2, C.teal, 22, "0px 8px 22px #13C7B3/18");
  addPill(slide, "executed-pill", "SPECIALIZED + EXECUTED", {
    left: 752, top: 205, width: 224, height: 30,
  }, C.teal, C.navy);
  addText(slide, "executed-goal-id", "goal-1", {
    left: 752, top: 251, width: 240, height: 48,
  }, { fontSize: 34, color: C.paper, bold: true });
  addGoalField(slide, "executed", 752, 317, "Positioning", "Selected audience + promise");
  addGoalField(slide, "executed", 752, 390, "Requirements", "Static Astro · zero client JS");
  addGoalField(slide, "executed", 752, 463, "Work", "4 / 4 bounded nodes complete");
  addGoalField(slide, "executed", 752, 536, "Evidence", "Build · routes · exact SHA", C.sea);

  addPill(slide, "fixture-warning",
    "ILLUSTRATIVE STRUCTURE · NOT A LIVE DEMO RECEIPT",
    { left: 398, top: 628, width: 484, height: 30 },
    "#2D2731", C.coral, C.coral);
  addFooter(slide, "Program EDD fixture · final reveal uses sanitized source, goal, work, and receipts", 3);

  slide.speakerNotes.textFrame.setText(
    "Narrative job: prepare the audience to read the reveal as source-to-execution proof, without teaching graph mechanics.\n" +
    "This prototype is an illustrative structure only. It is not evidence that Demo 2 or Demo 3 exists.\n" +
    "Speaker cue: read this as a reusable starting specification becoming a specific, executed specification.\n\n" +
    "[Sources]\n" +
    "Program architecture contract: presentations/ai-native-sdlc-demo/.mdkg/design/edd-1-ai-native-sdlc-presentation-demo-program-architecture-and-execution.md\n" +
    "[/Sources]",
  );
}

async function writeBlob(filePath, blob) {
  await fs.writeFile(filePath, new Uint8Array(await blob.arrayBuffer()));
}

async function main() {
  await fs.mkdir(SLIDE_DIR, { recursive: true });
  buildTimelineSlide();
  buildPlanWorkEvidenceSlide();
  buildRevealSlide();

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
    kind: "slide,textbox,shape,notes,layout",
    maxChars: 30000,
  });
  await fs.writeFile(path.join(RENDER_DIR, "inspect.ndjson"), snapshot.ndjson);

  const pptx = await PresentationFile.exportPptx(presentation);
  await pptx.save(path.join(SOURCE_DIR, "ai-native-sdlc-visual-prototypes.pptx"));
}

await main();
