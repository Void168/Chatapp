'use client'

import { Conversation } from "@prisma/client";

interface ConversationsListProps {
    initialItems: Conversation[]
 }

const ConversationsList: React.FC<ConversationsListProps> = ({
  initialItems,
}) => {
  return <div></div>;
};

export default ConversationsList;
