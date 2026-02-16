import { GeneratedContent, generateContent } from "./openai";
import giftcards from "./data/giftcards.json";
import fs from "fs";
import path from "path";

const CACHE_PATH = path.join(process.cwd(), ".content-cache.json");

type ContentCache = Record<string, GeneratedContent>;

let memoryCache: ContentCache | null = null;

function loadCache(): ContentCache {
  if (memoryCache) return memoryCache;
  try {
    if (fs.existsSync(CACHE_PATH)) {
      const raw = fs.readFileSync(CACHE_PATH, "utf-8");
      memoryCache = JSON.parse(raw);
      return memoryCache!;
    }
  } catch {
    // ignore
  }
  memoryCache = {};
  return memoryCache;
}

function saveCache(cache: ContentCache) {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
  memoryCache = cache;
}

export async function getContentForCard(
  slug: string,
): Promise<GeneratedContent> {
  const cache = loadCache();
  if (cache[slug]) return cache[slug];

  const card = giftcards.find((c) => c.url === slug);
  if (!card) throw new Error(`Card not found: ${slug}`);

  const content = await generateContent(card);
  cache[slug] = content;
  saveCache(cache);

  return content;
}

export async function preGenerateAllContent(): Promise<void> {
  console.log("[content] Pre-generating content for all cards...");
  for (const card of giftcards) {
    await getContentForCard(card.url);
    console.log(`[content] ✓ ${card.name}`);
  }
  console.log("[content] Done.");
}
