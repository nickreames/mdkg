import fs from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { Presentation, PresentationFile } = require("@oai/artifact-tool");

const SOURCE_DIR = path.dirname(fileURLToPath(import.meta.url));
const RENDER_DIR = path.resolve(SOURCE_DIR, "../../rendered/prototypes/v2");
const SLIDE_DIR = path.join(RENDER_DIR, "slides");

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
} = {}) {
  const shape = addShape(slide, name, "textbox", position, "none");
  shape.text = text;
  shape.text.style = { fontSize, color, bold, alignment };
  return shape;
}

function addHeader(slide, eyebrow, title, subtitle, slideNumber) {
  addShape(slide, `header-current-${slideNumber}`, "roundRect", {
    left: 72, top: 39, width: 44, height: 8,
  }, C.aqua, "none", 4);
  addText(slide, `eyebrow-${slideNumber}`, eyebrow, {
    left: 128, top: 31, width: 600, height: 24,
  }, { fontSize: 16, color: C.teal, bold: true });
  addText(slide, `title-${slideNumber}`, title, {
    left: 72, top: 72, width: 1136, height: 58,
  }, { fontSize: 38, color: C.ink, bold: true });
  addText(slide, `subtitle-${slideNumber}`, subtitle, {
    left: 72, top: 137, width: 1136, height: 36,
  }, { fontSize: 19, color: C.muted });
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
  const shape = addShape(slide, name, "roundRect", position, fill, border, 18, "shadow-none", lineWidth);
  shape.text = text;
  shape.text.style = { fontSize: 16, color, bold: true, alignment: "center" };
  return shape;
}

function addMilestoneCard(slide, stage, index) {
  const x = 68 + index * 188;
  const above = index % 2 === 0;
  const y = above ? 196 : 405;
  const emphasized = index === 5;
  const fill = emphasized ? C.coralWash : C.surface;
  const border = emphasized ? C.coral : C.line;
  const card = addShape(slide, `stage-card-${index + 1}`, "roundRect", {
    left: x, top: y, width: 176, height: 126,
  }, fill, border, 18, "0px 5px 16px #08263A/10", 2);
  addText(slide, `stage-date-${index + 1}`, stage.date, {
    left: x + 14, top: y + 13, width: 148, height: 22,
  }, { fontSize: 16, color: emphasized ? C.coral : C.teal, bold: true });
  addText(slide, `stage-label-${index + 1}`, stage.label, {
    left: x + 7, top: y + 43, width: 162, height: 46,
  }, { fontSize: 16, color: C.ink, bold: true });
  addText(slide, `stage-product-${index + 1}`, stage.product, {
    left: x + 14, top: y + 97, width: 148, height: 23,
  }, { fontSize: 16, color: C.muted });

  addShape(slide, `stage-connector-${index + 1}`, "rect", {
    left: x + 86,
    top: above ? y + 126 : 359,
    width: 4,
    height: above ? 28 : 46,
  }, emphasized ? C.coral : C.blue);
  addShape(slide, `stage-dot-${index + 1}`, "ellipse", {
    left: x + 75, top: 340, width: 25, height: 25,
  }, emphasized ? C.coralWash : C.blueWash, emphasized ? C.coral : C.blue, 0, "shadow-none", 3);
  return card;
}

function buildTimelineSlide() {
  const slide = presentation.slides.add();
  slide.background.fill = C.canvas;
  addHeader(
    slide,
    "CAPABILITY PROGRESSION",
    "The unit of coding work kept expanding",
    "Capabilities accumulated. Product dates overlap; each stage adds reach without deleting the previous one.",
    1,
  );

  addShape(slide, "timeline-current-underlay", "roundRect", {
    left: 84, top: 345, width: 1082, height: 14,
  }, C.tealWash, "none", 7);
  addShape(slide, "timeline-current", "roundRect", {
    left: 84, top: 349, width: 1082, height: 6,
  }, C.blue, "none", 3);
  addShape(slide, "timeline-arrow", "rightArrow", {
    left: 1148, top: 336, width: 64, height: 32,
  }, C.blue);

  const stages = [
    { date: "2021", label: "AUTOCOMPLETE", product: "GitHub Copilot" },
    { date: "2022", label: "PROMPT\nENGINEERING", product: "ChatGPT" },
    { date: "2024", label: "REASONING", product: "OpenAI o1" },
    { date: "2025", label: "TOOL USE", product: "Claude Code" },
    { date: "2025", label: "CONDITIONAL\nCONTEXT", product: "SKILL.md" },
    { date: "2025–26", label: "LONG\nHORIZON", product: "Codex + Claude" },
  ];
  stages.forEach((stage, index) => addMilestoneCard(slide, stage, index));

  addPill(
    slide,
    "horizon-caveat",
    "Evidence rule  ·  human-equivalent task horizon ≠ elapsed agent runtime",
    { left: 286, top: 604, width: 708, height: 38 },
    C.coralWash,
    C.ink,
    C.coral,
    2,
  );
  addFooter(slide, "[1–12] Primary sources and limitations in claim matrix + notes", 1);

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
  slide.background.fill = C.canvas;
  addHeader(
    slide,
    "THE OPERATING MODEL",
    "A dependable agentic SDLC has one durable loop",
    "Not more ceremony—better project state for the next human or agent.",
    2,
  );

  const cards = [
    { x: 72, n: "01", title: "PLAN", detail: "Requirements\nDecisions\nGuardrails", accent: C.cyan, wash: C.blueWash },
    { x: 475, n: "02", title: "WORK", detail: "One bounded node\nExplicit authority\nClear handoff", accent: C.aqua, wash: C.tealWash },
    { x: 878, n: "03", title: "EVIDENCE", detail: "Tests + receipts\nCheckpoints\nValidated state", accent: C.sea, wash: C.tealWash },
  ];

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

  addShape(slide, "flow-arrow-1", "rightArrow", {
    left: 411, top: 328, width: 54, height: 34,
  }, C.blue);
  addShape(slide, "flow-arrow-2", "rightArrow", {
    left: 814, top: 328, width: 54, height: 34,
  }, C.teal);

  addShape(slide, "questions-band", "roundRect", {
    left: 72, top: 524, width: 1136, height: 101,
  }, C.ink, C.blue, 18, "shadow-none", 2);
  const questions = [
    { x: 96, q: "WHAT COMPLETED?", a: "accepted outcome" },
    { x: 444, q: "WHY?", a: "requirements + decisions" },
    { x: 770, q: "WHAT COMES NEXT?", a: "next authorized node" },
  ];
  questions.forEach((item, index) => {
    addText(slide, `question-${index + 1}`, item.q, {
      left: item.x, top: 548, width: 300, height: 24,
    }, { fontSize: 17, color: index === 1 ? C.aqua : C.cyan, bold: true });
    addText(slide, `answer-${index + 1}`, item.a, {
      left: item.x, top: 583, width: 300, height: 23,
    }, { fontSize: 17, color: C.canvas });
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

function addGoalField(slide, prefix, x, y, label, value, accent = C.teal, width = 365) {
  addText(slide, `${prefix}-label-${label}`, label.toUpperCase(), {
    left: x, top: y, width: 190, height: 22,
  }, { fontSize: 16, color: accent, bold: true });
  addText(slide, `${prefix}-value-${label}`, value, {
    left: x, top: y + 25, width, height: 40,
  }, { fontSize: 17, color: C.ink, bold: true });
}

function buildRevealSlide() {
  const slide = presentation.slides.add();
  slide.background.fill = C.canvas;
  addHeader(
    slide,
    "SOURCE → EXECUTION PROOF",
    "Reusable specification → specialized, executed proof",
    "Same goal identity. Sharper requirements. Inspectable evidence.",
    3,
  );

  addShape(slide, "source-goal-card", "roundRect", {
    left: 72, top: 199, width: 458, height: 391,
  }, C.surface, C.line, 22, "0px 6px 18px #08263A/10", 2);
  addPill(slide, "source-pill", "SOURCE TEMPLATE", {
    left: 96, top: 221, width: 190, height: 34,
  }, C.blueWash, C.blue, C.blue, 2);
  addText(slide, "source-goal-id", "goal-1", {
    left: 96, top: 273, width: 240, height: 48,
  }, { fontSize: 34, color: C.ink, bold: true });
  addGoalField(slide, "source", 96, 337, "Objective", "Create a public landing page");
  addGoalField(slide, "source", 96, 416, "Requirements", "Ocean Flow + bounded sections");
  addGoalField(slide, "source", 96, 495, "State", "Reusable · not yet executed", C.muted);

  addShape(slide, "specialize-arrow-underlay", "roundRect", {
    left: 553, top: 367, width: 152, height: 16,
  }, C.tealWash, "none", 8);
  addShape(slide, "specialize-arrow", "rightArrow", {
    left: 558, top: 348, width: 142, height: 55,
  }, C.blue);
  addPill(slide, "specialize-pill", "SPECIALIZE", {
    left: 560, top: 302, width: 138, height: 32,
  }, C.surface, C.ink, C.line, 2);

  addShape(slide, "executed-goal-card", "roundRect", {
    left: 728, top: 179, width: 480, height: 431,
  }, C.surface, C.teal, 22, "0px 8px 22px #005B57/15", 3);
  addShape(slide, "executed-current", "roundRect", {
    left: 728, top: 179, width: 480, height: 12,
  }, C.aqua, "none", 6);
  addPill(slide, "executed-pill", "SPECIALIZED + EXECUTED", {
    left: 752, top: 207, width: 250, height: 34,
  }, C.tealWash, C.teal, C.teal, 2);
  addText(slide, "executed-goal-id", "goal-1", {
    left: 752, top: 258, width: 240, height: 48,
  }, { fontSize: 34, color: C.ink, bold: true });
  addGoalField(slide, "executed", 752, 318, "Positioning", "Selected audience + promise");
  addGoalField(slide, "executed", 752, 390, "Requirements", "Static Astro · zero client JS");
  addGoalField(slide, "executed", 752, 462, "Work", "4 / 4 bounded nodes complete");
  addGoalField(slide, "executed", 752, 534, "Evidence", "Build · routes · exact SHA", C.teal);

  addPill(
    slide,
    "fixture-warning",
    "ILLUSTRATIVE STRUCTURE · NOT A LIVE DEMO RECEIPT",
    { left: 374, top: 622, width: 532, height: 34 },
    C.coralWash,
    C.ink,
    C.coral,
    2,
  );
  addFooter(slide, "Program EDD fixture · final reveal uses sanitized goals, work, and receipts", 3);

  slide.speakerNotes.textFrame.setText(
    "Narrative job: prepare the audience to read the reveal as source-to-execution proof, without teaching graph mechanics.\n" +
    "This prototype is an illustrative structure only. It is not evidence that Demo 2 or Demo 3 exists.\n" +
    "Speaker cue: read this as a reusable starting specification becoming a specific, executed specification.\n\n" +
    "[Sources]\n" +
    "Program architecture contract: presentations/ai-native-sdlc-demo/.mdkg/design/edd-1-ai-native-sdlc-presentation-demo-program-architecture-and-execution.md\n" +
    "[/Sources]",
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

function rating(ratio) {
  if (ratio >= 7) return "AAA normal text";
  if (ratio >= 4.5) return "AA normal / AAA large text";
  if (ratio >= 3) return "AA large text / non-text 3:1";
  return "Fail";
}

async function writeAccessibilityReceipt() {
  const pairs = [
    { use: "Primary text on canvas", foreground: C.ink, background: C.canvas, requirement: 7 },
    { use: "Primary text on surface", foreground: C.ink, background: C.surface, requirement: 7 },
    { use: "Secondary text on canvas", foreground: C.muted, background: C.canvas, requirement: 7 },
    { use: "Secondary text on surface", foreground: C.muted, background: C.surface, requirement: 7 },
    { use: "Teal accent text on canvas", foreground: C.teal, background: C.canvas, requirement: 7 },
    { use: "Blue accent text on canvas", foreground: C.blue, background: C.canvas, requirement: 7 },
    { use: "Coral warning text on canvas", foreground: C.coral, background: C.canvas, requirement: 7 },
    { use: "Light text on dark anchor", foreground: C.canvas, background: C.ink, requirement: 7 },
    { use: "Cyan text on dark anchor", foreground: C.cyan, background: C.ink, requirement: 7 },
    { use: "Aqua text on dark anchor", foreground: C.aqua, background: C.ink, requirement: 7 },
    { use: "Functional boundary on canvas", foreground: C.line, background: C.canvas, requirement: 3 },
    { use: "Functional boundary on surface", foreground: C.line, background: C.surface, requirement: 3 },
    { use: "Dark text on cyan marker", foreground: C.ink, background: C.cyan, requirement: 7 },
    { use: "Dark text on aqua marker", foreground: C.ink, background: C.aqua, requirement: 7 },
    { use: "Dark text on seafoam marker", foreground: C.ink, background: C.sea, requirement: 7 },
  ].map((pair) => {
    const ratio = contrastRatio(pair.foreground, pair.background);
    if (ratio < pair.requirement) {
      throw new Error(`${pair.use} contrast ${ratio.toFixed(2)} is below ${pair.requirement}:1`);
    }
    return { ...pair, ratio: Number(ratio.toFixed(2)), rating: rating(ratio) };
  });

  await fs.writeFile(
    path.join(RENDER_DIR, "accessibility-palette.json"),
    `${JSON.stringify({
      standard: "WCAG 2.2 relative-luminance contrast",
      thresholds: {
        "AA normal text": 4.5,
        "AA large text": 3,
        "AAA normal text": 7,
        "AAA large text": 4.5,
        "non-text functional graphics": 3,
      },
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
  await writeAccessibilityReceipt();

  const pptx = await PresentationFile.exportPptx(presentation);
  await pptx.save(path.join(SOURCE_DIR, "ai-native-sdlc-visual-prototypes-v2.pptx"));
}

await main();
