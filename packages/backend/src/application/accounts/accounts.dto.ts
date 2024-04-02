import { z } from "zod";

export const CreateAccountSchema = z.object({
    userId: z.string(),
    username: z.string().min(3).max(20),
    createdAt: z.date(),
    updatedAt: z.date(),
    lastSeenAt: z.date(),
    walletPubKey: z.string(),
    walletPrivateKey: z.string(),
    groupId: z.string(),
    referredBy: z.string()
  });