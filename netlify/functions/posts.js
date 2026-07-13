import { getStore } from "@netlify/blobs";

const KEY = "posts";

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" }
  });

export default async (req) => {
  const store = getStore("golftroop-calendar");

  if (req.method === "GET") {
    const rec = await store.get(KEY, { type: "json" });
    return json({ posts: rec?.posts ?? null, updatedAt: rec?.updatedAt ?? null });
  }

  if (req.method === "PUT") {
    let body;
    try { body = await req.json(); } catch { return json({ error: "bad json" }, 400); }
    if (!Array.isArray(body?.posts)) return json({ error: "posts must be an array" }, 400);

    const rec = { posts: body.posts, updatedAt: new Date().toISOString() };
    await store.setJSON(KEY, rec);
    return json(rec);
  }

  return json({ error: "method not allowed" }, 405);
};

export const config = { path: "/api/posts" };
