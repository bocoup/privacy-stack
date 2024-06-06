import { LockClosedIcon } from "@heroicons/react/20/solid";
import { Link } from "@remix-run/react";

import { useSettings } from "~/utils";
export function Logo() {
  const settings = useSettings();
  return (
    <Link to="/" className="flex gap-2 items-center font-semibold">
      {settings?.logo ? (
        <img
          src={settings?.logo}
          alt={settings?.logoDescription || ""}
          className="w-6"
        />
      ) : (
        <LockClosedIcon className="w-6" />
      )}
      {settings?.name || "Privacy Stack"}
    </Link>
  );
}
