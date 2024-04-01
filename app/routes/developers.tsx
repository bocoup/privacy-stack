import type { MetaFunction } from "@remix-run/node";

import {
  NavigationSite,
  NavigationSiteFooter,
} from "~/components/navigation-site";

export const meta: MetaFunction = () => [{ title: "About Roberts App" }];

export default function About() {
  return (
    <div>
      <NavigationSite />
      <div className="mx-auto max-w-2xl px-6 lg:px-8 py-10 lg:py-24 space-y-8">
        <div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Developers
          </h1>
          <p className="mt-6 text-xl leading-8">
            The Bocoup Privacy Stack is a{" "}
            <a href="https://remix.run" className="underline">
              remix.run
            </a>{" "}
            app derived from the{" "}
            <a
              href="https://github.com/remix-run/indie-stack"
              className="underline"
            >
              remix indie stack
            </a>
            . We took the indie stack, added some of privacy UX, transactional
            emails, file upload, and ansible playbooks for self hosting. Read
            more about{" "}
            <a
              href="https://bocoup.com/blog/remix-is-awesome"
              className="underline"
            >
              why we love remix
            </a>
            .
          </p>
        </div>
        <div className="space-y-6 text-gray-700">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Quickstart
            </h2>

            <p>
              With node and NPM installed, you can install the template with{" "}
              <pre className="inline bg-slate-50 rounded-md border px-1">
                create-remix
              </pre>
              :
            </p>
            <pre className="p-2 my-4 border rounded-md bg-slate-50">
              npx create-remix@latest --template remix-run/examples/
            </pre>
            <p>
              That&apos;s it! We recommend{" "}
              <a href="https://github.com/nvm-sh/nvm" className="underline">
                nvm
              </a>{" "}
              for installing and managing node versions.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Relevant code
            </h2>
            <div>
              <h3 className="text-lg font-medium">Do Not Sell</h3>
              <p>
                Do not sell is a boolean on the user, which is default checked
                on sign up.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">Data access and Deletion</h3>
              <p>
                Data access and deletion are implemented as a page in the
                settings area, and allow for deletion of all notes created by
                the user as well as full account deletion. As you build on top
                of this template, make sure to continue adding the data you
                store on users to the data access and deletion page so that the
                feature stays current.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">Deployment</h3>
              <p>
                This stack deploys to a self managed VPS and comes with a set of
                comprehensive ansible playbooks for locking down, provisioning,
                and deploying your app. You can be up and running in 10 minutes.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">UI Library</h3>
              <p>
                We have integrated shadcn, and installed the components we
                needed in this boilerplate. Add more components with the
                follwoing command:
                <pre className="p-2 my-4 border rounded-md bg-slate-50">
                  npx shadcn-ui@latest add [component]
                </pre>
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">Transactional emails</h3>
              <p>
                We use sendgrid for transactional emails. We would love to
                include our own mail server, but then no one would get our
                emails. Add a sendgrid API key to the .env file and things will
                start working. You can send emails with the{" "}
                <pre className="inline bg-slate-50 rounded-md border px-1">
                  sendMail
                </pre>{" "}
                function, a thin wrapper around the sendgrid api node bindings
                that passes in your API key.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">File upload</h3>
              <p>
                We included an image upload components that handles image
                previewing, along with boilerplate image uploading code in the
                actions of the note edit and profile pages. The uploads go
                straight to your server. That&apos;s it.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">Github actions</h3>
              <p>
                We run eslint, typechecking and e2e cypress tests on push to
                main and dev, just like the remix indie stack. We removed
                deployment, and ansible deployment from a github action is on
                our roadmap. PRs welcome.
              </p>
            </div>
          </div>
        </div>
      </div>
      <NavigationSiteFooter />
    </div>
  );
}
