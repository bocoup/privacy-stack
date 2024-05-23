import { LockClosedIcon } from "@heroicons/react/20/solid";
import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

import {
  NavigationSite,
  NavigationSiteFooter,
} from "~/components/navigation-site";
import PhoneMockup from "~/components/phone-mockup";
import { Button } from "~/components/ui/button";
import { useOptionalUser } from "~/utils";

import { features } from "./features";

export const meta: MetaFunction = () => [{ title: "Bocoup Notes" }];

export default function Index() {
  const user = useOptionalUser();

  return (
    <div className="">
      <NavigationSite />

      <div className="mx-auto max-w-6xl px-6 py-6 sm:py-8 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:pt-24 lg:pb-10">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
          <h1 className="max-w-lg text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Privacy first.
          </h1>
          <p className="text-lg leading-8 text-gray-600 my-10">
            The Privacy Stack is an open source web app with consent-centered
            privacy design and accessible components. You get GDPR and CCPA
            compliance out of the box with easy data access and deletion, and
            undo-signup. We also packed in a lot of other goodies, like user
            profiles, file uploads, and a UI library with lots of patterns to
            choose from. The Privacy Stack comes with a demo notes app, which
            you can try out here:
          </p>

          {user ? (
            <div className="flex gap-4">
              <Button asChild variant="secondary">
                <Link to="/app/settings/data">Check your data</Link>
              </Button>

              <Button asChild>
                <Link to="/app/dashboard/notes">Create a note</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4 w-64 mx-auto mt-0 md:mt-18">
              <div className="flex gap-4 justify-between w-full">
                <Button asChild variant="secondary" className="flex-1">
                  <Link to="/auth/login"> Log in</Link>
                </Button>
                <Button asChild className="flex-1">
                  <Link to="/auth/join">Sign up</Link>
                </Button>
              </div>
              <p className=" text-xs font-bold text-slate-700 p-1 rounded text-center gap-2  flex px-4">
                <LockClosedIcon className="w-4" />
                We make it easy to undo signup.
              </p>{" "}
            </div>
          )}
        </div>

        <PhoneMockup>
          <img
            alt="Screenshot of the data access screen."
            src="/site/data-mobile.png"
          />
        </PhoneMockup>
      </div>

      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="text-base font-semibold leading-7 text-slate-600">
              Start with privacy defaults
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Build Privacy-centric Apps
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              With the Privacy Stack you get a fully featured web app with
              privacy enthusiastically baked in, and heap of developer
              conveniences to make your work smoother.
            </p>
          </div>
        </div>
        <div className="relative overflow-hidden pt-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <img
              src="/site/edit-note.png"
              alt="App screenshot"
              className="mb-[-12%] rounded-xl shadow-2xl ring-1 ring-gray-900/10"
              width={2432}
              height={1442}
            />
            <div className="relative" aria-hidden="true">
              <div className="absolute -inset-x-20 bottom-0 bg-gradient-to-t from-white pt-[7%]" />
            </div>
          </div>
        </div>
        <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
          <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base leading-7 text-gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-9">
                <dt className="font-semibold text-gray-900 flex gap-2">
                  {feature.icon}
                  {feature.name}
                </dt>{" "}
                <dd
                  className="inline"
                  dangerouslySetInnerHTML={{ __html: feature.description }}
                ></dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="bg-white">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Try out the demo app.
              <br />
              Sign up is totally reversible.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
              This website is a deployment of the Privacy Stack template. You
              can sign up here and see all the features that come with the
              template.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/auth/join"
                className="rounded-md bg-slate-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign up
              </Link>
              <Link
                to="/about"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <NavigationSiteFooter />
    </div>
  );
}
