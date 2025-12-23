import { treaty } from "@elysiajs/eden";
import { app } from "../app/api/[[...slugs]]/route";

const baseUrl = process.env.NEXT_PUBLIC_URL || "localhost:3000";
export const client = treaty<typeof app>(baseUrl).api;
