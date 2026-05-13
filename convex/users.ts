import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUser = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("Users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();
    return user;
  },
});
export const createUser = mutation({
  args: {
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
  },

  handler: async (ctx, args) => {
    const nuovoUtente = await ctx.db.insert("Users", {
      name: args.name,
      email: args.email,
      picture: args.picture,
      weight: args.weight,
      age: args.age,
      activityLevel: args.activityLevel,
    });
    return nuovoUtente;
  },
});
