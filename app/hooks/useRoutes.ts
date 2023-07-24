import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { HiChat } from "react-icons/hi";
import { HiUsers } from "react-icons/hi2";

import useConversation from "./useConversation";

const useRoutes = () => {
  const pathname = usePathname();
  const { conversationId } = useConversation();

  const routes = useMemo(
    () => [
      {
        label: "Đoạn chat",
        href: "/conversations",
        icon: HiChat,
        active: pathname === "/conversations" || !!conversationId,
      },
      {
        label: "Người dùng",
        href: "/users",
        icon: HiUsers,
        active: pathname === "/users",
      },
    ],
    [pathname, conversationId]
  );

  return routes;
};

export default useRoutes;
