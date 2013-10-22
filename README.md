# RadarServer #

API server for Radar iOS App. Node.js, Express.js working with MongoDB and Mongoose


## Radar Server ##
The backend for [Radar](https://github.com/meamstack/RadarServer). 

![screenshot](http://farm8.staticflickr.com/7375/10426054384_a9839c6cc7_o.png)

## Tech Stack ##
* Node.js / Express - core server
* MongoDB / Mongoose - database

Radar utilises the asyncronous non-blocking features of JavaScript and Node.js for the core of the server. User and event information are stored on a Mongo database.

## Testing ##
[ this section tbd ]
* Mocha / Chai
* [Travis CI](https://travis-ci.org/guymorita/oaktree)
* Coveralls

Testing is done through the Mocha Chai testing suite, and is automated through Grunt.js. It gets test coverage with Travis-CI/Coveralls.

## Dependencies ##
* Node.js
* Express 3.x
* Mongo DB
* Mongoose
* Async
* passport
* passport-facebook
