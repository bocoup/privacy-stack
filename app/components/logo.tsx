import { LockClosedIcon } from "@heroicons/react/20/solid";
import { Link } from "@remix-run/react";
export function Logo() {
  return (
    <Link to="/" className="flex gap-2 items-center font-semibold">
      <LockClosedIcon className="w-6" />
      Privacy Stack
    </Link>
  );
}
