Konfident [![Build Status](https://travis-ci.org/Voles/konfident.svg?branch=master)](https://travis-ci.org/Voles/konfident)
===========================================================================================================================

> Confident - feeling or showing confidence in oneself or one's abilities or qualities; "having full trust"

####Goal

To create a web application which increases confidence about UI changes, before releasing a new version of an application.
Konfident allows users to compare two versions of applications by providing easy-to-use image comparison tools.

####Prerequisites

* [Node Package Manager](https://npmjs.org/) (NPM)
* [Git](http://git-scm.com/)

*Note: [installation instructions for NodeJS on Ubuntu](http://stackoverflow.com/questions/16302436/install-nodejs-on-ubuntu-12-10/16303380#16303380)*

####Dependencies

* [Gulp](http://gulpjs.com/)
* [Bower](http://bower.io/)

## Environment setup
####1. Install Gulp and Bower

    $ sudo npm install -g gulp bower

####2. Install project dependencies
Run the commands below in the project root directory.

    $ npm install
    $ bower install

## Build instructions
To run the application server, run `$ node server.js` inside the project directory.
Navigate to `http://localhost:8008/webapp` for the application.

To run the tests, run `$ gulp test` inside the project directory.

To validate the JS code, run `$ gulp jshint` inside the project directory.

####Building on the shoulders of giants

- [JSHint configuration via Airbnb](https://github.com/airbnb/javascript)
- [Image comparison slider via demosthenes.info](http://demosthenes.info/blog/819/A-Before-And-After-Image-Comparison-Slide-Control-in-HTML5)
- [Comparison algorithm via Resemble.js](http://huddle.github.io/Resemble.js/)
