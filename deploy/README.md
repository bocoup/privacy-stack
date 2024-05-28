# DIY Deploy

This project includes ansible scripts for locking down and provisioning a node.js server, and deploying something you can `npm start` to that server. That server can be bare metal, or a Virtual Private Server (VPS). These scripts make it so you never have to shell into your server by hand.

## Create or cat ssh keys

If you already have an ssh key pair, `cat ~/.ssh/id_rsa.pub` or `~/.ssh/id_ed25519.pub` depending on how long ago you did this for the first time.

If you don't have a key pair yet, then generate one:

```sh
ssh-keygen -t ed25519 -C "you@example.com"
```

Hit enter three times to save the key pair in the default location and not use a passphrase.

## Get a server

## Install Ansible

Next let's install `ansible`:

### On a mac

[Install homebrew](https://docs.brew.sh/Installation) and then:

```sh
brew update && brew install ansible
```

### On Linux

```sh
sudo apt-add-repository ppa:ansible/ansible && sudo apt update && sudo apt install ansible
```

### On Windows

Follow the [Ansible Windows Installation Instructions](https://docs.ansible.com/ansible/latest/os_guide/windows_setup.html)

## Provision a new server

If you don't have one yet, try a droplet on [digital ocean](https://digitalocean.com/). Something with 1gb of memory should be enough to start you off. Point a domain at that droplet, and replace `privacy-stack-template.com` with that domain in the following instructions. An IP address will work as well.

### Copy or submodule this project into your existing node app

```sh
cd /path/to/myproject && git submodule add https://github.com/bocoup/deploy.git && git submodule init
```

### Copy an update inventory.example.yml

These ansible playbooks uses the variables in an inventory to know what server to deploy to, what domain to use, what version of node to install, and if you have a root ssh password, what password to use.

First copy the example inventory file:

```sh
cp deploy/inventory.example.yml inventory.yml
```

Then change the values in that file to match your project:

```yml
# Our production server.
# Copy this whole block if you'd like to add a staging server
Production:
  # The IP address of your server.
  # Add a second one if you'd like to deploy twice.
  # You can add as many as you want.
  hosts: an.ip.add.ress
  vars:
    # Used for your app's domain name
    domain: example.com
    # Used for your certbot email, note you'll be agreeing to the ToS.
    email: you@example.com
    # Pick your node version
    nodejs_version: 20
    # If you have an SSH key on your server for the root user, you don't need this.
    ansible_ssh_pass: "secret"
    # List of files and folders to copy to the server on deploy.
    # Change this to be the files your node app needs to run.
    # Example set up for a remix.run indie stack app.
    deploy_files:
      - src: ../prisma/migrations
        dest: /home/{{ domain }}/prisma/
      - src: ../prisma/schema.prisma
        dest: /home/{{ domain }}/prisma/schema.prisma
      - src: ../build/
        dest: /home/{{ domain }}/build
      - src: ../public/
        dest: /home/{{ domain }}/public
      - src: ../.env
        dest: /home/{{ domain }}/
      - src: ../.npmrc
        dest: /home/{{ domain }}/
      - src: ../package.json
        dest: /home/{{ domain }}/
      - src: ../package-lock.json
        dest: /home/{{ domain }}/
      - src: ../LICENSE.md
        dest: /home/{{ domain }}/
      - src: ../README.md
        dest: /home/{{ domain }}/
```

Now you're ready to use ansible in your project.
