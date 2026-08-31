import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// This app is primarily an SSG site: the public marketing pages are pre-rendered
// at build time and served from Workers Static Assets (read-only incremental
// cache). Revalidation is not used, so no R2/KV/Durable Object infra is needed.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
