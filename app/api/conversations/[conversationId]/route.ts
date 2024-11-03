import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { pusherServer } from "@/app/libs/pusher";

const prisma = new PrismaClient();

interface IParams {
  conversationId: string; // Make this required
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const { conversationId } = params; // No need for optional chaining here
    const currentUser = await getCurrentUser();

    // Check if the user is authenticated
    if (!currentUser?.id) {
      return new NextResponse("Unauthorised", { status: 401 });
    }

    // Validate that the conversation exists
    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });

    if (!existingConversation) {
      return new NextResponse("Invalid Id", { status: 400 });
    }

    // Delete the conversation only if the user is part of it
    const deletedConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id],
        },
      },
    });

    // Notify users about the conversation deletion
    existingConversation.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, "conversation:remove", existingConversation);
      }
    });

    return NextResponse.json(deletedConversation);
  } catch (error) {
    console.error(error, "ERROR_CONVERSATION_DELETE"); // Use console.error for better logging
    return new NextResponse("Internal Error", { status: 500 });
  }
}
