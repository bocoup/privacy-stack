import { Link } from "@remix-run/react";

export default function Privacy() {
  return (
    <div className="py-32 lg:px-8 leading-7 text-gray-700 space-y-4">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Privacy Policy
      </h1>
      <p>
        When you create an account on this website, the maintainer can see your
        account name, and the notes create. Your password is encrypted in the
        database.
      </p>
      <p>
        At anytime, you can view what data we store about you, and delete it
        from the{" "}
        <Link to="/data" className="underline">
          data
        </Link>{" "}
        page.
      </p>
      <p>
        We use the privacy-centric{" "}
        <a href="plausible.io" className="underline">
          plausible.io
        </a>{" "}
        analytics system to track activity on this website. We do not store
        Cookies, IP addresses, or any other personal data. All analytics data is
        stored in aggregate only.
      </p>
    </div>
  );
}
