// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { exampleRouter } from "./example";
import { protectedExampleRouter } from "./protected-example-router";
import { seederRouter } from "./seeder";
import { clubRouter } from "./clubs";
import { fixtureRouter } from "./fixtures";

export const appRouter = createRouter()
    .transformer(superjson)
    .merge("seeder.", seederRouter)
    .merge("clubs.", clubRouter)
    .merge("fixtures.", fixtureRouter)
    .merge("example.", exampleRouter)
    .merge("question.", protectedExampleRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
