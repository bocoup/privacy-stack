import type { MetaFunction } from "@remix-run/node";

import {
  NavigationSite,
  NavigationSiteFooter,
} from "~/components/navigation-site";

export const meta: MetaFunction = () => [{ title: "Privacy Policy" }];

export default function About() {
  return (
    <div>
      <NavigationSite />
      <div className="mx-auto max-w-2xl px-6 lg:px-8 py-10 lg:py-24">
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="my-6 text-xl leading-8 text-gray-700">
          Our privacy policy is our commitment to you. We deeply value consent
          and honor your privacy and consent. With the Privacy Stack, you can
          easily view your data, mark it not to be sold, delete your data, and
          undo your signup completely.
        </p>
        <div className="mx-auto space-y-6 text-base leading-7 text-gray-700 lg:col-span-7">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              What we can see
            </h2>
            <p>
              When you create an account with the Privacy Stack Demo Notes App,
              our team can see your account&apos;s email address. You can fully
              delete your account after signing up, and we will not save a copy
              of it.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Our business model
            </h2>
            <p>
              The Privacy Stack is made by Bocoup. Bocoup is a consulting firm
              which builds software for clients. Our business model is fee for
              service. We will never sell your data.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Accessing your data
            </h2>
            <p>
              You can see all the data that the Privacy Stack Notes App stores
              about you in the data section when you are logged in.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Do not sell
            </h2>
            <p>
              We will never sell your date anyone. The Privacy Stack Notes App
              has a Do Not Sell preference built in because we think companies
              that sell data will use it as boilerplate.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Deleting your data
            </h2>
            <p>
              You can delete your usage data and your account, including all the
              data that the Privacy Stack Notes App stores about you, from the
              data section when you are logged in. When you delete your data, it
              is immediately and permanently deleted from the Privacy Stack
              Notes App database.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Website Analytics
            </h2>
            <p>
              We do not collect any site analytics data. We do not set tracking
              cookies, store IP addresses, or any other personal data when you
              browse our website.
            </p>
          </div>
        </div>
      </div>
      <NavigationSiteFooter />
    </div>
  );
}
