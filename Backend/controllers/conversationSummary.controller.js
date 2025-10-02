import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// ✅ Get summary for a conversation + user + model
export async function getSummary(conversationId, userId, modelId) {
  console.log(conversationId, userId, modelId);

  if (!conversationId || !userId || !modelId) {
    throw new Error("conversationId, userId and modelId are required");
  }

  return await prisma.conversationSummaries.findUnique({
    where: {
      ConversationId_UserId_ModelId: { // ✅ use camelCase version
        ConversationId: Number(conversationId),
        UserId: Number(userId),
        ModelId: Number(modelId),
      },
    },
  });
}

// ✅ Upsert summary
export async function upsertSummary(conversationId, userId, modelId, summary) {
  console.log(conversationId, userId, modelId, summary);

  if (!conversationId || !userId || !modelId) {
    throw new Error("conversationId, userId and modelId are required");
  }

  return await prisma.conversationSummaries.upsert({
    where: {
      ConversationId_UserId_ModelId: { // ✅ use same key here
        ConversationId: Number(conversationId),
        UserId: Number(userId),
        ModelId: Number(modelId),
      },
    },
    update: {
      Summary: summary,   // ✅ fixed: use the function parameter
      UpdatedAt: new Date(),
    },
    create: {
      ConversationId: Number(conversationId),
      UserId: Number(userId),
      ModelId: Number(modelId),
      Summary: summary,
      UpdatedAt: new Date(),
    },
  });
}
