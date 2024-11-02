import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { pusherServer } from "@/app/libs/pusher";

const prisma = new PrismaClient();

interface IParams {
  conversationId: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  try {
    const currentUser = await getCurrentUser();

    const { conversationId } = params;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorised", { status: 401 });
    }

    // Find the existing conversation
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        messages: {
          include: {
            seen: true,
          },
        },
        users: true,
      },
    });

    if (!conversation) {
      return new NextResponse("Invalid Id", { status: 400 });
    }

    // find the last message
    const lastMessage = conversation.messages[conversation.messages.length - 1];

    if (!lastMessage) {
      return NextResponse.json(conversation);
    }

    const updateMessage = await prisma.message.update({
      where: {
        id: lastMessage.id,
      },
      include: {
        sender: true,
        seen: true,
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });

    await pusherServer.trigger(currentUser.email, "conversation:update", {
      id: conversationId,
      messages: [updateMessage],
    });

    if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
      return NextResponse.json(updateMessage);
    }

    await pusherServer.trigger(
      conversationId!,
      "message:update",
      updateMessage
    );

    return NextResponse.json(updateMessage);
  } catch (error) {
    console.log(error, "Error message seen");
    return new NextResponse("internal Error", { status: 500 });
  }
}
