# afeefa-backend-ui

The afeefa-backend-ui is the interface presented to our editors to manage the entries displayed on [afeefa.de](https://afeefa.de). Users are able to add, remove and edit entries as well as gather an overview of the present data.
The Ember based webapp communicates with the [afeefa-backend-api](https://github.com/AfeefaDe/afeefa-backend-api) to persist entries. Therefor we are using the [JSON API](http://jsonapi.org/) specifications.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://ember-cli.com/)

## Installation

* `git clone <repository-url>` this repository
* change into the new directory
* `npm install`
* `bower install`

## Running / Development

* `ember server`
* use `--proxy` option to specify API host
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Building

* `ember build` (development)
* `ember build --environment production` (production)

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](http://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

