"use client";

import Avatar from "@/app/components/avatar/Avatar";
import AvatarGroup from "@/app/components/avatar/AvatarGroup";
import useOtherUser from "@/app/hooks/useOtherUser";
import { FullConversationType } from "@/app/types";
import clsx from "clsx";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { isYesterday } from "date-fns";
import vi from "date-fns/locale/vi";

const MILI_SECONDS_PER_DAY: number = 86400 * 1000;

enum Days {
  "Chủ Nhật",
  "Thứ Hai",
  "Thứ Ba",
  "Thứ Tư",
  "Thứ Năm",
  "Thứ Sáu",
  "Thứ Bảy",
}

interface ConversationBoxProps {
  data: FullConversationType;
  selected?: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
  data,
  selected,
}) => {
  const otherUser = useOtherUser(data);
  const session = useSession();
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`);
  }, [data.id, router]);

  const lastMessage = useMemo(() => {
    const messages = data.messages || [];

    return messages[messages.length - 1];
  }, [data.messages]);

  const userEmail = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false;
    }

    const seenArray = lastMessage.seen || [];

    if (!userEmail) {
      return false;
    }

    return seenArray.filter((user) => user.email === userEmail).length !== 0;
  }, [lastMessage, userEmail]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return "Đã gửi một ảnh";
    }

    if (lastMessage?.body) {
      return lastMessage.body;
    }

    return "Bắt đầu cuộc trò chuyện";
  }, [lastMessage]);

  function getToday<T>(type: T, day: number): T[keyof T] {
    const casted = day as keyof T;
    return type[casted];
  }

  let day = new Date(lastMessage?.createdAt).getDay();

  let dayDistance =
    (new Date().getTime() - new Date(lastMessage?.createdAt).getTime()) /
    MILI_SECONDS_PER_DAY;

  const formatDate = (time: string) => {
    if (isYesterday(new Date(lastMessage?.createdAt))) {
      return (time = `Hôm qua ${format(new Date(lastMessage?.createdAt), "p", {
        locale: vi,
      })}`);
    }
    if (dayDistance > 1) {
      return (time = `${getToday(Days, day)} ${format(
        new Date(lastMessage?.createdAt),
        "p",
        {
          locale: vi,
        }
      )}`);
    }
    if (dayDistance > 7) {
      return (time = `${format(new Date(lastMessage?.createdAt), "dd/MM", {
        locale: vi,
      })}`);
    }
    if (dayDistance > 365) {
      return (time = `${format(new Date(lastMessage?.createdAt), "dd/MM/YYYY", {
        locale: vi,
      })}`);
    }
    return format(new Date(lastMessage?.createdAt), "p", {
      locale: vi,
    });
  };

  return (
    <div
      onClick={handleClick}
      className={clsx(
        `w-full relative flex items-center space-x-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer px-2 py-3`,
        selected ? "bg-neutral-100" : "bg-white"
      )}
    >
      {data.isGroup ? (
        <AvatarGroup users={data.users} />
      ) : (
        <Avatar user={otherUser} />
      )}
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="flex justify-between mb-1">
            <p className="text-md font-medium text-gray-900">
              {data.name || otherUser.name}
            </p>
            {lastMessage?.createdAt && (
              <p className="text-xs text-gray-400 font-light">{formatDate(lastMessage?.createdAt.toString())}</p>
            )}
          </div>
          <div className="flex justify-between">
            <p
              className={clsx(
                `truncate text-sm`,
                hasSeen ? "text-gray-500" : "text-black font-semibold"
              )}
            >
              {lastMessageText}
            </p>
            <p className="truncate text-xs text-gray-500">
              {hasSeen ? "Đã xem" : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationBox;
