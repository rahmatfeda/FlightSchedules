# FlightSchedules
Sample node.js application

source : https://github.com/legolazfire/FlightScheduler

get flight info:

https://${hostname}/flights/18


Pipeline process:

1. Checkout Master branch of Git Repo
2. Docker Build
3. Docker test
  a. run docker
  b. test docker to check if it gets the flight info
4. ask for approval to push the docker to container registry
5. run helm test : to plan the helm installation and upgrade and also if all the required aguments are passed
5. deploy the helm package

