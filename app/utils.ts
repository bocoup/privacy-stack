import { useMatches } from "@remix-run/react";
import { type ClassValue, clsx } from "clsx";
import { Home, Notebook } from "lucide-react";
import { useMemo } from "react";
import { twMerge } from "tailwind-merge";

import type { UserWithRelations } from "~/models/user.server";

const DEFAULT_REDIRECT = "/";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT,
) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
  id: string,
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id],
  );
  return route?.data as Record<string, unknown>;
}

function isUser(user: unknown): user is UserWithRelations {
  return (
    user != null &&
    typeof user === "object" &&
    "email" in user &&
    typeof user.email === "string"
  );
}

export function useOptionalUser(): UserWithRelations | undefined {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser(): UserWithRelations {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead.",
    );
  }
  return maybeUser;
}

export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}

export function classNames(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function getDomain() {
  return process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.DEFAULT_URL;
}

export function colorLuminance(hex: string, lum: number) {
  hex = String(hex).replace(/[^0-9a-f]/gi, "");
  if (hex.length < 6) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  lum = lum || 0;

  let rgb = "#",
    c,
    i;
  for (i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i * 2, 2), 16);
    c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
    rgb += ("00" + c).substr(c.length);
  }

  return rgb;
}

export interface SelectionTypeEntity {
  name: string;
  color: string;
  image: string | undefined;
  imageDescription: string | undefined;
}

const WEEK_IN_MILLIS = 6.048e8,
  DAY_IN_MILLIS = 8.64e7,
  HOUR_IN_MILLIS = 3.6e6,
  MIN_IN_MILLIS = 6e4,
  SEC_IN_MILLIS = 1e3;

export const timeFromNow = (date: string) => {
  const formatter = new Intl.RelativeTimeFormat("en", { style: "long" });

  const millis = new Date(date).getTime();
  const diff = millis - new Date().getTime();
  if (Math.abs(diff) > WEEK_IN_MILLIS)
    return formatter.format(Math.trunc(diff / WEEK_IN_MILLIS), "week");
  else if (Math.abs(diff) > DAY_IN_MILLIS)
    return formatter.format(Math.trunc(diff / DAY_IN_MILLIS), "day");
  else if (Math.abs(diff) > HOUR_IN_MILLIS)
    return formatter.format(
      Math.trunc((diff % DAY_IN_MILLIS) / HOUR_IN_MILLIS),
      "hour",
    );
  else if (Math.abs(diff) > MIN_IN_MILLIS)
    return formatter.format(
      Math.trunc((diff % HOUR_IN_MILLIS) / MIN_IN_MILLIS),
      "minute",
    );
  else
    return formatter.format(
      Math.trunc((diff % MIN_IN_MILLIS) / SEC_IN_MILLIS),
      "second",
    );
};

export function isDark(color: string) {
  const hexColor = +(
    "0x" + color.slice(1).replace((color.length < 5 && /./g) || "", "$&$&")
  );
  const r = hexColor >> 16;
  const g = (hexColor >> 8) & 255;
  const b = hexColor & 255;
  const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
  if (hsp > 127.5) {
    return false;
  } else {
    return true;
  }
}

export const dashboardNavigation = [
  { label: "Dashboard", to: "/app/dashboard", icon: Home },
  { label: "Notes", to: "/app/dashboard/notes", icon: Notebook },
];
export const settingsNavigation = [
  { label: "Profile", to: "/app/settings/profile" },
  { label: "Data", to: "/app/settings/data" },
];

export const staticNavigation = [
  { label: "Privacy", to: "/privacy" },
  { label: "About", to: "/about" },
];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
