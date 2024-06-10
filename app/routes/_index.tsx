import {
  AdjustmentsVerticalIcon,
  BeakerIcon,
  CheckBadgeIcon,
  CircleStackIcon,
  CloudArrowUpIcon,
  CodeBracketIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon,
  ServerStackIcon,
  UserGroupIcon,
  LockClosedIcon,
  DocumentTextIcon,
} from "@heroicons/react/20/solid";
import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

import BrowserMockup from "~/components/browser-mockup";
import { NavigationSite, NavigationSiteFooter } from "~/components/navigation";
import PhoneMockup from "~/components/phone-mockup";
import { Button } from "~/components/ui/button";
import { useOptionalUser } from "~/utils";

export const meta: MetaFunction = () => [{ title: "Privacy Stack" }];

export default function Index() {
  const user = useOptionalUser();

  return (
    <div className="">
      <NavigationSite />
      <div className="mx-auto max-w-6xl px-6 py-6 sm:py-8 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:pt-24 lg:pb-10">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
          <h1 className="max-w-lg text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Privacy Stack
          </h1>
          <p className="text-lg leading-8 text-gray-600 my-10">
            The Privacy Stack is an open source web app with consent-centered
            privacy design and accessible components. You get self-serve GDPR
            and CCPA user flows out of the box with easy data access and
            deletion, and undo-signup. We also packed in a lot of other goodies,
            like user profiles, file uploads, and a UI library with lots of
            patterns to choose from. The Privacy Stack comes with a demo notes
            app, which you can try out here:
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
      <NavigationSiteFooter />
    </div>
  );
}

const features = [
  {
    name: "GDPR and CCPA user flows",
    description: `<a class="underline" href="https://gdpr.eu/what-is-gdpr/">GDPR</a> and <a class="underline" href="https://www.oag.ca.gov/privacy/ccpa">CCPA</a> self-serve user flows with do not sell, data access, and data deletion flows, including: Default do not sell on signup, data access, data deletion, and undo sign up.
          `,
    screenshot: (
      <BrowserMockup className="md:w-1/2">
        <img
          src="/site/data-desktop.png"
          alt="screenshot of data settings page"
        />
      </BrowserMockup>
    ),
    icon: <CheckBadgeIcon className="w-4" />,
  },

  {
    name: "Self Hosted Deployments",
    description: `Automated provisioning and deployments to a DIY VPS with Ansible: long-running node server with <a class="underline" href="https://nginx.org/en/">Nginx</a> proxy server, <a class="underline" href="https://help.ubuntu.com/community/UFW">UFW</a> firewall, <a class="underline" href="https://certbot.eff.org/">Certbot</a> for SSL, and <a class="underline" href="https://en.wikipedia.org/wiki/Systemd">systemd</a> for node daemonization`,
    screenshot: (
      <img
        src="/site/deployment.png"
        alt="screenshot of a terminal window with the command npm run deploy typed in"
        className="md:w-1/2 mt-4 md:-mt-4"
      />
    ),
    icon: <ServerStackIcon className="w-4" />,
  },
  {
    name: "File upload",
    description: `Upload files directly to your own server with zero configuration. No services needed, just the filesystem on the DIY server, and Remix.run's built in file upload handlers.`,
    screenshot: (
      <BrowserMockup className="md:w-1/2">
        <img
          src="/site/edit-note.png"
          alt="screenshot of the profile settings page"
        />
      </BrowserMockup>
    ),
    icon: <CloudArrowUpIcon className="w-4" />,
  },
  {
    name: "Transactional emails",
    description: `Automatic emails using <a class="underline" href="https://sendgrid.com/">Sendgrid</a> with secure tokens for welcome  and forgot password. We're actively looking for a privacy-first replacement. Get in touch if you know of one.`,
    screenshot: (
      <img
        src="/site/email.png"
        alt="screenshot of welcome email"
        className="md:w-1/2 mt-4 md:-mt-4"
      />
    ),
    icon: <EnvelopeIcon className="w-4" />,
  },
  {
    name: "Light weight CMS",
    description: `Local content management built into the database with a <a href="https://templates.tiptap.dev/">tiptap</a> editing experience.`,
    screenshot: (
      <BrowserMockup className="md:w-1/2">
        <img
          src="/site/edit-page.png"
          alt="screenshot of the page editing experience"
        />
      </BrowserMockup>
    ),
    icon: <DocumentTextIcon className="w-4" />,
  },
  {
    name: "Autocomplete search",
    description: `Type ahead search UI using <a href="https://www.fusejs.io/" class="underline">fuse.js</a> to help find your notes with client-side filtering.`,
    screenshot: (
      <BrowserMockup className="md:w-1/2">
        <img src="/site/search.png" alt="screenshot of welcome email" />
      </BrowserMockup>
    ),
    icon: <MagnifyingGlassIcon className="w-4" />,
  },
  {
    name: "User Profiles",
    description: `User profiles backed by email/Password authentication using <a class="underline" href="https://remix.run/utils/sessions#md-createcookiesessionstorage">cookie-based sessions</a>.`,
    screenshot: (
      <BrowserMockup className="md:w-1/2">
        <img
          src="/site/edit-profile.png"
          alt="screenshot of the profile settings page"
        />
      </BrowserMockup>
    ),
    icon: <UserGroupIcon className="w-4" />,
  },
  {
    name: "UI Library",
    description: `We integrated <a class="underline" href="https://ui.shadcn.io">ShadCN</a> so you can build your design system into the UI from there.`,
    screenshot: (
      <BrowserMockup className="md:w-1/2">
        <img
          src="/site/shadcn.png"
          alt="screenshot of the shadcn dashboard example"
        />
      </BrowserMockup>
    ),
    icon: <AdjustmentsVerticalIcon className="w-4" />,
  },
  {
    name: "Database",
    description: `This stack ships a production-ready <a class="underline" href="https://sqlite.org">SQLite Database</a> and the <a class="underline" href="https://prisma.io">Prisma ORM</a>.`,
    screenshot: (
      <img
        src="/site/sqlite.png"
        alt="screenshot of prisma studio"
        className="md:w-1/2 mt-4 md:-mt-4"
      />
    ),
    icon: <CircleStackIcon className="w-4" />,
  },

  {
    name: "Continuous Integrations",
    description: `<a class="underline" href="https://github.com/features/actions">GitHub Actions</a> for linting, typechecking, and smoke testing on merge to production and staging environments.
        `,
    screenshot: (
      <BrowserMockup className="md:w-1/2">
        <img
          src="/site/github-action.png"
          alt="screenshot of a github action result"
        />
      </BrowserMockup>
    ),
    icon: <BeakerIcon className="w-4" />,
  },
  {
    name: "Remix official template goodies",
    description: `Styling with <a class="underline" href="https://tailwindcss.com/">Tailwind</a>, types with <a class="underline" href="https://typescriptlang.org">TypeScript</a>, testing with <a class="underline" href="https://cypress.io">Cypress</a>, <a class="underline" href="https://vitest.dev">Vitest</a> and <a class="underline" href="https://testing-library.com">Testing Library</a>, formatting with <a class="underline" href="https://prettier.io">Prettier</a> , linting with <a class="underline" href="https://eslint.org">ESLint</a>, mocking with <a class="underline" href="https://mswjs.io">MSW</a>.`,
    screenshot: (
      <BrowserMockup className="md:w-1/2">
        <img src="/site/indie-stack.png" alt="screenshot of notes dashboard" />
      </BrowserMockup>
    ),
    icon: <CodeBracketIcon className="w-4" />,
  },
  {
    name: "Built with Remix.run",
    description: `Built with <a class="underline" href="https://remix.run">Remix.run</a>, the full stack web framework that follows web standards with backing from Shopify.`,
    screenshot: (
      <BrowserMockup className="md:w-1/2">
        <img src="/site/remix.png" alt="screenshot of remix.run home page" />
      </BrowserMockup>
    ),
    icon: "💿 ",
  },
];
