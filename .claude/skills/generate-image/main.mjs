#!/usr/bin/env node
// generate-image — Pollinations.ai backend (free, no API key).
// Reads JSON args from stdin, writes a PNG into public/imgs/generated/,
// prints JSON with both the on-disk path and the Next.js public URL.

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

function readStdin() {
  return new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (c) => (data += c));
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });
}

function slugify(s) {
  const cleaned = String(s ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return cleaned || "image";
}

const raw = await readStdin();
let args;
try {
  args = JSON.parse(raw);
} catch (e) {
  console.log(JSON.stringify({ error: `invalid JSON on stdin: ${e.message}` }));
  process.exit(0);
}

const promptInput = String(args.prompt ?? "").trim();
if (!promptInput) {
  console.log(JSON.stringify({ error: "prompt is required" }));
  process.exit(0);
}
const prompt = args.style ? `${promptInput}, ${args.style}` : promptInput;

const width = parseInt(args.width ?? 1024, 10);
const height = parseInt(args.height ?? 1024, 10);
const slug = slugify(args.slug);
const ts = Date.now();
const filename = `${slug}-${ts}.png`;

const outputDir = args.output_dir || "public/imgs/generated";
const outPath = join(outputDir, filename);

const params = new URLSearchParams({
  width: String(width),
  height: String(height),
  nologo: "true",
  enhance: "true",
});
if (args.seed != null) params.set("seed", String(args.seed));

const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params.toString()}`;

try {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 120_000);
  const res = await fetch(url, {
    headers: { "User-Agent": "shipany/0.1" },
    signal: controller.signal,
  });
  clearTimeout(timer);
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, buf);
} catch (e) {
  console.log(JSON.stringify({ error: e.message || String(e) }));
  process.exit(0);
}

const publicUrl = outPath.includes("public/")
  ? "/" + outPath.split("public/")[1]
  : outPath;

console.log(
  JSON.stringify({
    file: outPath,
    url: publicUrl,
    prompt,
    size: `${width}x${height}`,
  }),
);
