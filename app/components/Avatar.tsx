"use client";
import { User } from "@prisma/client";
import Image from "next/image";
import useActiveList from "../hooks/useActiveList";
interface AvatarProps {
  user?: User;
}
const Avatar: React.FC<AvatarProps> = ({ user }) => {
  const { members } = useActiveList();
  const isActive = user?.email ? members.indexOf(user?.email!) !== -1 : false;

  return (
    <div className="relative">
      <div
        className="
          relative
          inline-block
          rounded-full
          overflow-hidden
          w-9
          h-9
          md:w-11
          md:h-11
          border
          border-gray-200
        "
      >
        <Image
          src={user?.image || "/images/placeholder.png"}
          fill
          alt="Avatar"
        />
      </div>
      {isActive && (
        <span className="absolute block rounded-full bg-green-500 ring-2 ring-white top-0 right-0 h-2 w-2 md:h-2 md:w-2" />
      )}
    </div>
  );
};

export default Avatar;
