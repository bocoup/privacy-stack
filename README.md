# privacy-stack-template

This is stack is based on the [Remix Indie Stack](https://github.com/remix-run/indie-stack), with additions that center data privacy, and add a custom responsive UI with [shadcn](https://ui.shadcn.com/blocks). This stack depends on a file system for sqlite and file upload, and on node for crypto functions. Read more about [Remix Stacks](https://remix.run/stacks) to get started.

Or run `npx create-remix@latest --template https://github.com/bocoup/privacy-stack.git`

## What's in the stack

- Production-ready [SQLite Database](https://sqlite.org)
- [GitHub Actions](https://github.com/features/actions) for linting, typechecking, and smoke testing on merge to production and staging environments
- Email/Password Authentication with [cookie-based sessions](https://remix.run/utils/sessions#md-createcookiesessionstorage)
- Transactional emails with secure tokens, including forgot password and delete my data, with [Sendgrid](https://sendgrid.com/)
- [GDPR](https://gdpr.eu/what-is-gdpr/) and [CCPA](https://www.oag.ca.gov/privacy/ccpa) compliance with do not sell, data access, and data deletion flows
  - Default do not sell on signup
  - See what data is stored about me
  - Delete most of my data
  - Delete all of my data
  - Undo sign up
- Automated provisioning and deployments to a DIY VPS with Ansible: long-running node server with [Nginx](https://nginx.org/en/) proxy server, [UFW](https://help.ubuntu.com/community/UFW) firewall, [Certbot](https://certbot.eff.org/) for SSL, and [systemd](https://en.wikipedia.org/wiki/Systemd) for node daemonization
- Database ORM with [Prisma](https://prisma.io)
- Styling with [Tailwind](https://tailwindcss.com/)
- End-to-end testing with [Cypress](https://cypress.io)
- Local third party request mocking with [MSW](https://mswjs.io)
- Unit testing with [Vitest](https://vitest.dev) and [Testing Library](https://testing-library.com)
- Code formatting with [Prettier](https://prettier.io)
- Linting with [ESLint](https://eslint.org)
- Static Types with [TypeScript](https://typescriptlang.org)

## Development

- Start dev server:

  ```sh
  npm run dev
  ```

This starts your app in development mode, rebuilding assets on file changes.

The database seed script creates a new user with some data you can use to get started:

- Email: `boaz@bocoup.com`
- Password: `letmeinplease`

## GitHub Actions

We use GitHub Actions for continuous integration and deployment. Anything that gets into the `main` branch will be deployed to production after running tests/build/etc. Anything in the `dev` branch will be deployed to staging.

## Testing

### Cypress

We use Cypress for our End-to-End tests in this project. You'll find those in the `cypress` directory. As you make changes, add to an existing file or create a new file in the `cypress/e2e` directory to test your changes.

We use [`@testing-library/cypress`](https://testing-library.com/cypress) for selecting elements on the page semantically.

To run these tests in development, run `npm run test:e2e:dev` which will start the dev server for the app as well as the Cypress client. Make sure the database is running in docker as described above.

We have a utility for testing authenticated features without having to go through the login flow:

```ts
cy.login();
// you are now logged in as a new user
```

We also have a utility to auto-delete the user at the end of your test. Just make sure to add this in each test file:

```ts
afterEach(() => {
  cy.cleanupUser();
});
```

That way, we can keep your local db clean and keep your tests isolated from one another.

### Vitest

For lower level tests of utilities and individual components, we use `vitest`. We have DOM-specific assertion helpers via [`@testing-library/jest-dom`](https://testing-library.com/jest-dom).

### Type Checking

This project uses TypeScript. It's recommended to get TypeScript set up for your editor to get a really great in-editor experience with type checking and auto-complete. To run type checking across the whole project, run `npm run typecheck`.

### Linting

This project uses ESLint for linting. That is configured in `.eslintrc.js`.

### Formatting

We use [Prettier](https://prettier.io/) for auto-formatting in this project. It's recommended to install an editor plugin (like the [VSCode Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)) to get auto-formatting on save. There's also a `npm run format` script you can run to format all files in the project.

## Deployment

This project includes a diy deployment workflow from the [bocoup/deploy](https://github.com/bocoup/deploy) repo. Follow the instructions in this repo's copy of `deploy/README.md`. It will guide you through the process of:

1. Creating or catting your SSH keys
2. Getting a server
3. Installing Ansible locally on your computer

Once you follow those steps, you can switch back here. You'll need to do four more things:

4. Update `inventory.yml` in the root of this repository with values that match your server.
5. Lock down the server

```sh
npm run lockdown
```

6. Provision the server

```sh
npm run provision
```

7. Deploy the project

```sh
npm run deploy
```

Once you've completed this step, you can run `npm run deploy` anytime you'd like to deploy

## GitHub Actions

We use GitHub Actions for continuous integration and deployment. Anything that gets into the main branch will be deployed to production after running tests/build/etc.
