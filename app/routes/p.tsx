import { Outlet } from "@remix-run/react";

import { NavigationSite, NavigationSiteFooter } from "~/components/navigation";

export default function Page() {
  return (
    <div>
      <NavigationSite />
      <Outlet />
      <NavigationSiteFooter />
    </div>
  );
}
