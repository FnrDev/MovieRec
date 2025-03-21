"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Menu, Transition } from "@headlessui/react";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { Button } from "./ui/Button";
import { SearchBar } from "./SearchBar";
import { motion, AnimatePresence } from "framer-motion";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Movies", href: "/movies" },
  { name: "TV Shows", href: "/tv" },
  { name: "Watchlist", href: "/watchlist" },
];

export function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
            <motion.span 
              className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              MovieRec
            </motion.span>
          </Link>

          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-all duration-200 hover:text-primary relative py-1.5",
                  "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300",
                  "hover:after:w-full",
                  pathname === item.href
                    ? "text-primary after:w-full"
                    : "text-foreground/70 hover:text-foreground/90"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <SearchBar />

          {session ? (
            <Menu as="div" className="relative ml-3">
              <Menu.Button className="flex items-center space-x-2 hover:opacity-80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-full">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || ""}
                    className="h-9 w-9 rounded-full ring-2 ring-background transition-transform hover:scale-105"
                  />
                ) : (
                  <UserCircleIcon className="h-9 w-9 text-foreground/60" />
                )}
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-150"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-3 w-56 origin-top-right rounded-xl bg-card py-2 shadow-lg ring-1 ring-black/5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/profile"
                        className={cn(
                          active ? "bg-muted" : "",
                          "block px-4 py-2.5 text-sm transition-colors hover:text-primary"
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
                          active ? "bg-muted" : "",
                          "block w-full px-4 py-2.5 text-left text-sm transition-colors text-destructive hover:text-destructive/80"
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
            <div className="hidden md:flex md:items-center space-x-4 whitespace-nowrap">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = '/auth/signin'}
                className="text-foreground/70 hover:text-foreground h-9 px-4 transition-all duration-200"
              >
                Sign In
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => window.location.href = '/auth/register'}
                className="bg-primary hover:bg-primary/90 h-9 px-5 font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
              >
                Get Started
              </Button>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2 text-foreground/60 hover:bg-muted hover:text-foreground transition-colors md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className="md:hidden">
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-1.5 px-4 pb-4 pt-2"
            >
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "block rounded-lg px-3 py-2.5 text-base font-medium transition-all duration-200",
                    pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/60 hover:bg-muted hover:text-foreground"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {!session && (
                <div className="mt-4 space-y-2">
                  <Link
                    href="/auth/signin"
                    className="block rounded-lg px-3 py-2.5 text-base font-medium text-foreground/60 hover:bg-muted hover:text-foreground transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block rounded-lg bg-primary px-3 py-2.5 text-base font-medium text-primary-foreground hover:bg-primary/90 text-center transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
} 