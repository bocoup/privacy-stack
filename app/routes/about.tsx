import {
  ArrowUturnLeftIcon,
  CheckBadgeIcon,
  HandThumbUpIcon,
  WindowIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { EnvelopeClosedIcon } from "@radix-ui/react-icons";
import type { MetaFunction } from "@remix-run/node";

import {
  NavigationSite,
  NavigationSiteFooter,
} from "~/components/navigation-site";
import PhoneMockup from "~/components/phone-mockup";

export const meta: MetaFunction = () => [{ title: "About Roberts App" }];

export default function About() {
  return (
    <div>
      <NavigationSite />
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-10 lg:py-24">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Reusable Privacy Design
          </h1>
          <p className="mt-6 text-xl leading-8 text-gray-700">
            We have been working on privacy design patterns at Bocoup, and this
            open source repository contains full stack implementations of some
            of those designs.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:mt-10 lg:max-w-none lg:grid-cols-12">
          <div className="relative lg:order-2 lg:col-span-5">
            <figure className="border-l border-slate-600 pl-8">
              <blockquote className="text-xl font-semibold leading-8 tracking-tight text-gray-900">
                <p>&aquot;A quote from a co-designer&aquot;</p>
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-x-4">
                <span className="bg-gray-300 mt-1 h-10 w-10 flex-none object-cover rounded-full" />
                <div className="text-sm leading-6">
                  <div className="font-semibold text-gray-900">Their name</div>
                </div>
              </figcaption>
            </figure>
          </div>

          <div className="lg:order-first max-w-xl text-base leading-7 text-gray-700 lg:col-span-7 space-y-8">
            <p>
              The Privacy Stack has been pulled together from our pattern libray
              and a dozen or so prototypes we&apos;ve built over the last two
              years at Bocoup. We made it so that we wouldn&apos;t have to make
              it again, and now we&apos;ve open sourced it so you don&apos;t
              have to either. Fork{" "}
              <a
                className="underline"
                href="https://github.com/bocoup/privacy-stack"
              >
                this project on github
              </a>{" "}
              and checkout the{" "}
              <a className="underline" href="https://bocoup.com/blog">
                Bocoup Blog
              </a>{" "}
              for walks through how to use it.
            </p>
            <p></p>
          </div>

          <div className="relative lg:order-4 lg:col-span-5">
            <figure className="border-l border-slate-600 pl-8 space-y-4">
              <div>
                <h3 className="text-lg font-bold tracking-tight text-gray-900">
                  Default welcome page
                </h3>
                <p className="text-slate-500 text-sm">Comes with undo signup</p>
              </div>
              <PhoneMockup>
                <img
                  src="/site/data-delete.png"
                  alt="Preview of the undo sign up screen."
                />
              </PhoneMockup>
            </figure>
          </div>

          <div className="lg:order-3 max-w-xl text-base leading-7 text-gray-700 lg:col-span-7 space-y-8">
            <h2 className="font-bold leading-6">
              We built the Privacy Stack with these features
            </h2>
            <ul className="max-w-xl space-y-8 text-gray-600">
              <li className="flex gap-x-3">
                <ArrowUturnLeftIcon
                  className="mt-1 h-5 w-5 flex-none text-slate-600"
                  aria-hidden="true"
                />
                <span>
                  <strong className="font-semibold text-gray-900">
                    Undo Signup:
                  </strong>{" "}
                  Start with preset phrases instead of building sentences from
                  pictures.
                </span>
              </li>
              <li className="flex gap-x-3">
                <CheckBadgeIcon
                  className="mt-1 h-5 w-5 flex-none text-slate-600"
                  aria-hidden="true"
                />
                <span>
                  <strong className="font-semibold text-gray-900">
                    GDPR and CCPA:
                  </strong>{" "}
                  Data access, deletion and do not sell come integrated with
                  full user controls.
                </span>
              </li>
              <li className="flex gap-x-3">
                <HandThumbUpIcon
                  className="mt-1 h-5 w-5 flex-none text-slate-600"
                  aria-hidden="true"
                />
                <span>
                  <strong className="font-semibold text-gray-900">
                    Consent first:
                  </strong>{" "}
                  Enthusiastic language is baked in throughout the UI to
                  celebrate the people who use their app when they decide to
                  delete their data.
                </span>
              </li>
              <li className="flex gap-x-3">
                <EnvelopeClosedIcon
                  className="mt-1 h-5 w-5 flex-none text-slate-600"
                  aria-hidden="true"
                />
                <span>
                  <strong className="font-semibold text-gray-900">
                    Transactional Emails:
                  </strong>{" "}
                  Transactional emails for verification and forgot password are
                  baked in with sendgrid, just add an API key.
                </span>
              </li>
              <li className="flex gap-x-3">
                <WindowIcon
                  className="mt-1 h-5 w-5 flex-none text-slate-600"
                  aria-hidden="true"
                />
                <span>
                  <strong className="font-semibold text-gray-900">
                    Out of the box UI Library:
                  </strong>{" "}
                  We integrated the popular [shadcn](https://shadcn.com/)
                  library into the app so you get a customizable UI library
                  baked in.
                </span>
              </li>
              <li className="flex gap-x-3">
                <WrenchScrewdriverIcon
                  className="mt-1 h-5 w-5 flex-none text-slate-600"
                  aria-hidden="true"
                />
                <span>
                  <strong className="font-semibold text-gray-900">
                    Self hosting:
                  </strong>{" "}
                  Privacy is core to Robert&apos;s App. Delete your data when
                  you want to.
                </span>
              </li>
            </ul>
          </div>

          <div className="lg:order-5 max-w-xl text-base leading-7 text-gray-700 lg:col-span-7 space-y-8">
            <p>
              With the Privacy Stack, you can bootstrap a privacy-first
              prototype in hours or days, instead of weeks or months.
            </p>
            <p className="mt-6">
              We would love to hear from you with feedback on this stack,
              stories about how you&apos;ve used it, changes you&apos;d like to
              see or make, or projects you&apos;d like to do with us. Drop us a
              line at{" "}
              <a className="underline" href="mailto: hello@bocoup.com">
                hello@bocoup.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>
      <NavigationSiteFooter />
    </div>
  );
}
