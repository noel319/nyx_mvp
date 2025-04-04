# **NodeJS NYX Chiper Backend App**

## **Technologies Used**
1.  NodeJS
2.  Express
3.  MongoDB
4.  Mongoose
5.  PassportJS
6.  JWT
7.  Nodemailer

## **Prerequisites**
- Git
- Bitbucket
- NodeJS
- CLI


## **Prerequisites**
This project requires NodeJS (version 8 or later) and NPM.
[Node](http://nodejs.org/) and [NPM](https://npmjs.org/) are really easy to install.
To make sure you have them available on your machine,
try running the following command.

```sh
$ npm -v && node -v
v 10.5.0
v 20.10.0
```

## **Getting Started**
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

**BEFORE YOU INSTALL:** please read the [prerequisites](#prerequisites)

Start with cloning this repo on your local machine:

```sh
$ git clone https://@bitbucket.org/repository.git
$ cd backend
```

To install and set up the library, run:

```sh
$ node --version
$ npm install
```
## **Usage**
### Serving the app
```sh
$ npm start
```
### Running the tests

```sh
$ npm test
```

### Building a distribution version

```sh
$ npm run build
```

This task will create a distribution version of the project
inside your local `dist/` folder

## **New Update ⚠️**

We'd like to inform you of important changes to our distribution repository [nodesource/distributions](https://github.com/nodesource/distributions).

**What's New:**

- _**Package Changes:** DEB and RPM packages are now available under the `nodistro` codename. We no longer package the installer coupled to specific versions. This means you can install Node.js on almost any distro that meets the minimum requirements._
- **Installation Scripts:** Back by popular demand, the installation scripts have returned and are better than ever. See the installation instructions below for details on how to use them.
- **RPM Package Signing Key:** The key used to sign RPM packages has changed. We now sign packages using SHA256, providing better support to the community.
- **Questions and concerns:** To resolve questions and discuss concerns about this update we've opened this discussion space [New distribution&#39;s packages](https://github.com/nodesource/distributions/discussions/#123456)
