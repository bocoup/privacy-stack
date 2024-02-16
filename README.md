# privacy-stack-template

This is stack is based on the [Remix Indie Stack](https://github.com/remix-run/indie-stack), with a additions the center data privacy, add some UI components for buttons and pills, and create a mobile design using headless ui and tailwind. Read more about [Remix Stacks](https://remix.run/stacks) to get started.

Or run `npx create-remix@latest --template https://github.com/bocoup/privacy-stack.git`

## What's in the stack

- Production-ready [SQLite Database](https://sqlite.org)
- [GitHub Actions](https://github.com/features/actions) for linting, typechecking, and smoke testing on merge to production and staging environments
- Email/Password Authentication with [cookie-based sessions](https://remix.run/utils/sessions#md-createcookiesessionstorage)
- Transactional emails, including forgot password and delete my data, with [Sendgrid](https://sendgrid.com/)
- [GDPR](https://gdpr.eu/what-is-gdpr/) and [CCPA](https://www.oag.ca.gov/privacy/ccpa) compliance with do not sell, data access, and data deletion flows
  - Default do not sell on signup
  - See what data is stored about me
  - Delete most of my data
  - Delete all of my data
  - Undo sign up
- Instructions for setting up a long-running node server with [Nginx](https://nginx.org/en/) proxy server, [UFW](https://help.ubuntu.com/community/UFW) firewall, [Certbot](https://certbot.eff.org/) for SSL, and [systemd](https://en.wikipedia.org/wiki/Systemd) for node daemonization
- Deploy script with [rsync](https://en.wikipedia.org/wiki/Rsync)
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

### Deployment

Ask your administrator to put your public key on the server and then you can:

- Deploy

  ```sh
  npm run deploy
  ```

### Set up the server from scratch

Deploy this project to a server. Try a droplet on [digital ocean](https://digitalocean.com/). Something with 1gb of memory should be enough to start you off. Point a domain at that droplet, and replace `privacy-stack-template.com` with that domain in the following instructions. An IP address will work as well.

- [Connecting](#connecting)
- [Install Printer Dependancies](#install-printer-dependancies)
- [Install and enable ufw](#once-youre-in-add-a-new-user)
- [install nginx, and enable in firewall](#install-nginx-and-enable-in-firewall)
- [configure nginx](#configure-nginx)
- [install certbot and setup ssl](#install-certbot-and-setup-ssl)
- [install node](#install-node)
- [create destination](#create-destination)
- [deploy project](#deploy-project)
- [Install dependancies and start](#install-dependancies-and-start)
- [Daemonize and start](#daemonize-and-start)

#### Connecting:

- `ssh privacy-stack-template.com`

#### Install and enable ufw:

- `sudo apt update`
- `sudo apt install ufw`
- `sudo ufw allow OpenSSH`
- `sudo ufw enable`

#### install nginx, and enable in firewall

- `sudo apt remove apache2`
- `sudo apt install nginx`
- `sudo ufw allow 'Nginx Full'`
- `sudo ufw status`

#### configure nginx

- `sudo apt install vim`
- `sudo vim /etc/nginx/sites-available/privacy-stack-template.com`

and add this config to your nginx.

```
server {
    listen 80;
    listen [::]:80;
    server_name privacy-stack-template.com;
    access_log /var/log/nginx/privacy-stack-template.com.log;
    error_log  /var/log/nginx/privacy-stack-template.com-error.log error;

    location / {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Host $http_host;
        proxy_pass http://127.0.0.1:3000;
        proxy_redirect off;
        client_max_body_size 10M;
    }
}
```

- `sudo ln -s /etc/nginx/sites-available/privacy-stack-template.com /etc/nginx/sites-enabled`

#### install certbot and setup ssl

- `sudo apt install python3-certbot-nginx`
- `sudo certbot --nginx -d privacy-stack-template.com`
- `sudo systemctl restart nginx`
- `sudo systemctl enable nginx`

#### install node

- `sudo apt-get install -y ca-certificates curl gnupg`
- `sudo mkdir -p /etc/apt/keyrings`
- `curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg`
- `sudo apt-get update`
- `sudo apt-get install nodejs -y`
- `sudo apt-get install npm`
- `node --version`

#### Daemonize and start

- `sudo vim /lib/systemd/system/privacy-stack-template.service` and paste in

```
[Unit]
Description=privacy-stack-template
Documentation=https://github.com/bocoup/privacy-stack-template
After=network.target

[Service]
Environment=NODE_ENV=production
Type=simple
User=root
WorkingDirectory=/home/privacy-stack-template.com
ExecStart=/usr/bin/npm start
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

#### deploy project

- `sudo mkdir /home/privacy-stack-template.com`

##### back on your local machine:

- `npm run deploy`

#### Install dependancies and migrate database

back on the remote server

- `cd /home/privacy-stack-template.com`
- `npm install`
- `npx prisma generate && npx prisma db push && npx prisma db seed`

#### start

- `sudo systemctl daemon-reload`
- `sudo systemctl enable --now privacy-stack-template`
- `sudo systemctl start privacy-stack-template`
