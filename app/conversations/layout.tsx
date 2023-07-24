import getConversations from "../actions/getConversations";
import { Sidebar } from "../components/sidebar/Sidebar";
import ConversationsList from "./components/ConversationList";

export default async function ConversationsLayout({ children }: { children: React.ReactNode }) {
    const conversations = await getConversations()
    
    return (
      <Sidebar>
        <div className="h-full">
          <ConversationsList initialItems={conversations} />
          {children}
        </div>
      </Sidebar>
    );
}