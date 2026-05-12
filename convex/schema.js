import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
export default defineSchema({
  Users: defineTable({
    name: v.string(),
    email: v.string(),
    picture: v.optional(v.string()),
    weight: v.number(),
    age: v.number(),
    activityLevel: v.union(
      v.literal("sedentary"),
      v.literal("moderate"),
      v.literal("active"),
    ),
  }),
});
