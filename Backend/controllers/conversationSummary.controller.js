import { PrismaClient } from "@prisma/client"; // tumhara prisma client


const prisma = new PrismaClient();

export async function getSummary(conversationId) {
  return await prisma.ConversationSummaries.findUnique({
    where: { ConversationId : conversationId }, 
  });
}

export async function upsertSummary(conversationId, userId, summaryText) {
  return await prisma.conversationSummaries.upsert({
  where: {
    ConversationId: conversationId
  },
  update: {
    Summary: summaryText,
    UpdatedAt: new Date(),
  },
  create: {
    ConversationId: conversationId,
    UserId: Number(userId),
    Summary: summaryText,
  },
});
}
