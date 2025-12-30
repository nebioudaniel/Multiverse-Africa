import { initEdgeStore } from "@edgestore/server";
import { createEdgeStoreNextHandler } from "@edgestore/server/adapters/next/app";

const es = initEdgeStore.create();

export const edgeStoreRouter = es.router({
  documents: es.fileBucket({
    maxSize: 30 * 1024 * 1024, // 30MB
  }),
});

// 👇 Export the type for frontend
export type EdgeStoreRouter = typeof edgeStoreRouter;

export const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
});

// Route file
export const GET = handler;
export const POST = handler;
