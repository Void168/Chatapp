import { Sidebar } from "../components/sidebar/Sidebar";
import ConversationsList from "./components/ConversationList";

export default async function ConversationsLayout({children}: {children: React.ReactNode}) {
    return (
        <Sidebar>
            <div className="h-full">
                <ConversationsList initialItems={[]} />
                {children}
            </div>
        </Sidebar>
    )
}