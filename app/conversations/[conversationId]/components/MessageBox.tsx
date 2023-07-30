"use client";

import Avatar from "@/app/components/avatar/Avatar";
import { FullMessageType } from "@/app/types";
import clsx from "clsx";
import { format } from "date-fns";
import vi from "date-fns/locale/vi";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import ImageModal from "./modal/ImageModal";
import { isYesterday } from "date-fns/esm";


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

interface MessageBoxProps {
  data: FullMessageType;
  isLast?: boolean;
}

const MessageBox: React.FC<MessageBoxProps> = ({ data, isLast }) => {
  const session = useSession();
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const isOwn = session?.data?.user?.email === data?.sender?.email;
  const seenList = (data.seen || [])
    .filter((user) => user.email !== data?.sender?.email)
    .map((user) => user.name)
    .join(", ");

  const container = clsx("flex g-3 p-4", isOwn && "justify-end");

  const avatar = clsx(isOwn ? "order-2" : "mr-2");

  const body = clsx("flex flex-col gap-2 mr-2", isOwn && "items-end");

  const message = clsx(
    "text-sm w-fit overflow-hidden",
    isOwn ? "bg-sky-500 text-white" : "bg-gray-100",
    data.image ? "rounded-md p-0" : "rounded-full py-2 px-3"
  );

  function getToday<T>(type: T, day: number): T[keyof T] {
    const casted = day as keyof T;
    return type[casted];
  }

  let day = new Date(data.createdAt).getDay();

  let dayDistance =
    (new Date().getTime() - new Date(data.createdAt).getTime()) /
    MILI_SECONDS_PER_DAY;

  const formatDate = (time: string) => {
    if (isYesterday(new Date(data.createdAt))) {
      return (time = `Hôm qua ${format(new Date(data.createdAt), "p", {
        locale: vi,
      })}`);
    }
    if (dayDistance > 1) {
      return (time = `${getToday(Days, day)} ${format(
        new Date(data.createdAt),
        "p",
        {
          locale: vi,
        }
      )}`);
    }
    if (dayDistance > 7) {
      return (time = `${format(new Date(data.createdAt), "dd/MM", {
        locale: vi,
      })}`);
    }
    if (dayDistance > 365) {
      return (time = `${format(new Date(data.createdAt), "dd/MM/YYYY", {
        locale: vi,
      })}`);
    }
    return format(new Date(data.createdAt), "p", {
      locale: vi,
    });
  };

  return (
    <div className={container}>
      <div className={avatar}>
        <Avatar user={data.sender} />
      </div>
      <div className={body}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500 font-semibold">
            {data.sender.name}
          </div>
          <div className="text-xs text-gray-400">
            {formatDate(new Date(data.createdAt).toString())}
          </div>
        </div>
        <div className={message}>
          <ImageModal
            src={data.image}
            isOpen={imageModalOpen}
            onClose={() => setImageModalOpen(false)}
          />
          {data.image ? (
            <Image
              onClick={() => setImageModalOpen(true)}
              alt="Image"
              height={288}
              width={288}
              src={data.image}
              className="object-cover cursor-pointer hover:scale-105 transition translate duration-150 rounded-lg"
            />
          ) : (
            <div>{data.body}</div>
          )}
        </div>
        {isLast && isOwn && seenList.length > 0 && (
          <div className="text-xs font-light text-gray-500">Đã xem</div>
        )}
      </div>
    </div>
  );
};

export default MessageBox;
