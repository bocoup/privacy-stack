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
  WindowIcon,
} from "@heroicons/react/20/solid";
import type { MetaFunction } from "@remix-run/node";

import BrowserMockup from "~/components/browser-mockup";
import {
  NavigationSite,
  NavigationSiteFooter,
} from "~/components/navigation-site";
import { cn } from "~/utils";

export const meta: MetaFunction = () => [
  { title: "Learn How To Use Roberts App" },
];

export default function Index() {
  return (
    <div>
      <NavigationSite />
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-10 lg:py-24">
        <div className="text-center py-24 sm:py-32">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Privacy Stack Features
          </h2>
          <p className="max-w-4xl mx-auto mt-6 text-lg leading-8 text-gray-600">
            We packed the Privacy Stack with lots of goodies to get you started
            fast, but that is not a replacement for talking to the people most
            impacted by the software you are building. You should follow the{" "}
            <a className="underline" href="https://designjustice.org">
              Design Justice Principles
            </a>{" "}
            and hire people who will be most impacted by your software to help
            you design it.
          </p>
        </div>

        <ol className="space-y-20 lg:space-y-52 py-10">
          {features.map((feature, i) => (
            <li
              key={i}
              className={cn(
                "block space-y-4 md:space-y-0 md:flex gap-10",
                i % 2 == 0 ? "" : "flex-row-reverse",
              )}
            >
              <div className="md:w-1/2">
                <h2 className="inline font-semibold text-gray-900">
                  {feature.name}
                </h2>
                <p
                  dangerouslySetInnerHTML={{ __html: feature.description }}
                ></p>
              </div>
              {feature.screenshot}
            </li>
          ))}
        </ol>
        <NavigationSiteFooter />
      </div>
    </div>
  );
}

export const features = [
  {
    name: "GDPR and CCPA compliance",
    description: `<a class="underline" href="https://gdpr.eu/what-is-gdpr/">GDPR</a> and <a class="underline" href="https://www.oag.ca.gov/privacy/ccpa">CCPA</a> compliance with do not sell, data access, and data deletion flows, including: Default do not sell on signup, data access, data deletion, and undo sign up.
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
    description: `Automatic emails using <a class="underline" href="https://sendgrid.com/">Sendgrid</a> with secure tokens for: welcome  and forgot password.`,
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
    name: "Autocomplete search",
    description: `Type ahead search UI using <a href="https://www.fusejs.io/" class="underline">fuse.js</a> to help find your notes with client-side filtering.`,
    screenshot: (
      <img
        src="/site/email.png"
        alt="screenshot of welcome email"
        className="md:w-1/2 mt-4 md:-mt-4"
      />
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
    name: "Marketing Site",
    description: `You are on it! This site comes with the privacy stack, so you can focus on the content.`,
    screenshot: (
      <BrowserMockup className="md:w-1/2">
        <img src="/site/marketing-site.png" alt="screenshot of home page" />
      </BrowserMockup>
    ),
    icon: <WindowIcon className="w-4" />,
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
