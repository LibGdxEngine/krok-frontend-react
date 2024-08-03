// components/Sidebar.js
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import profileImage from "../../../../public/profile.svg";
import { useAuth } from "@/context/AuthContext";
import React from "react";
const Sidebar = React.memo(({ user, onTapClicked, currentTap }) => {
  const router = useRouter();
  const { logout } = useAuth();
  const navItems = [
    { name: "Profile", href: "profile" },
    { name: "History", href: "history" },
    { name: "Favourite", href: "favorite" },
    { name: "Notes", href: "notes" },
    // {name: 'Logout', href: 'logout'},
  ];
  if (!user) return <>Loading...</>;
  return (
    <div
      className="w-1/3 sm:w-full bg-white shadow-md flex justify-center"
      style={{ flexDirection: "column" }}
    >
      <div className="p-4">
        <Image
          className="w-24 h-24 rounded-full mx-auto"
          src={profileImage}
          width={150}
          height={150}
          alt="Profile Picture"
        />
        <h2 className="mt-4 text-center text-xl font-semibold">
          {user.first_name} {user.last_name}
        </h2>
        <p className="mt-2 text-center text-gray-600">{user.email}</p>
      </div>
      <nav style={{ cursor: "pointer" }} className="mt-10">
        {navItems.map((item) => (
          <div
            onClick={() => {
              onTapClicked(item.href);
            }}
            key={item.name}
            className={`h-28 ${
              currentTap === item.href.toLowerCase().trim()
                ? "bg-searchColor"
                : ""
            } 
                    flex items-center justify-center ${
                      currentTap === item.href.toLowerCase().trim()
                        ? "text-white"
                        : "text-gray-500"
                    } border border-gray-50`}
          >
            {item.name}
          </div>
        ))}
        <div
          onClick={() => {
            logout();
            router.replace("/signin");
          }}
          className={`h-28 flex items-center justify-center border border-gray-50`}
        >
          Logout
        </div>
      </nav>
    </div>
  );
  Sidebar.displayName = "Sidebar";
});

export default Sidebar;
