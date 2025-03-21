"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { Menu, Transition } from "@headlessui/react";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { Button } from "./ui/Button";
import { SearchBar } from "./SearchBar";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Movies", href: "/movies" },
  { name: "TV Shows", href: "/tv" },
  { name: "Watchlist", href: "/watchlist" },
];

export function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="text-xl font-bold">MovieRec</span>
        </Link>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-foreground/80",
                  pathname === item.href
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <SearchBar />

            {session ? (
              <Menu as="div" className="relative ml-3">
                <Menu.Button className="flex items-center space-x-2">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || ""}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <UserCircleIcon className="h-8 w-8 text-gray-400" />
                  )}
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/profile"
                          className={cn(
                            active ? "bg-gray-100" : "",
                            "block px-4 py-2 text-sm text-gray-700"
                          )}
                        >
                          Your Profile
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => signOut()}
                          className={cn(
                            active ? "bg-gray-100" : "",
                            "block w-full px-4 py-2 text-left text-sm text-gray-700"
                          )}
                        >
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => signIn()}
              >
                Sign in
              </Button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
} 