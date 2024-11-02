"use client";

import clsx from "clsx";
import Link from "next/link";

interface MobileItemProps {
  label: string;
  href: string;
  icon: React.ElementType;
  active?: boolean;
  onClick?: () => void;
}
const MobileItem: React.FC<MobileItemProps> = ({
  href,
  icon: Icon,
  active,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  };
  return (
    <Link
    
      onClick={handleClick}
      href={href}
      className={clsx(
        `flex w-full gap-x-3 p-3 text-sm font-semibold leading-6 text-gray-500 hover:text-blue-500 hover:bg-gray-300`,
        active && `bg-gray-100 text-blue-500`
      )}
    >
      <Icon className="w-6 h-6 mx-auto" />
    </Link>
  );
};

export default MobileItem;
