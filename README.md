# Eventify

[Eventify]([https://eventify-demo.herokuapp.com/])(https://eventify-demo.herokuapp.com/) is a event management tool with payment integration and admin tools.

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) installed.
Also create the .env file and add environment variables as mentioned below.

```sh
git clone git@github.com:devansh016/Eventify.git
npm install
npm run dev
```

## Environment Variable Required

```sh
MONGO_URL = "" 
```

Your app should now be running on [localhost](http://localhost/) at port 80.

## Make Your First Contribution

1. Fork this repository, **star this repository** , and clone it onto your machine.
   ```
   git clone https://github.com/<my_account>/Eventify.git
   ```
1. Create a new branch and switch to it.

   ```
   cd Eventify
   git checkout -b <new_branch_name>
   ```
   
1. Push the commit to GitHub.

   ```
   git push origin <new_branch_name>
   ```

1. Make a pull request on GitHub.

## User Interface

### Light Mode

![Eventify Home ](/public/assets/images/eventify_home.png "Eventify Home")

## Docker

### Setup

* Install dependencies
    * [docker-compose](https://docs.docker.com/compose/install/)
    * [justfile](https://just.systems/man/en/)

### Usage

* Test containers locally
  * Fill out the `.env` file per its `.env.example`
  * Uncomment out `docker-compose.yml` sections with `# local mongodb` headings or comments
  * Comment out the `# mongodb atlas` line for a local Mongo DB
  * Assuming that the containers are running, navigate to http://localhost:8000/ to use the website
* Docker commands
    ```bash
    # clean build (remove `--no-cache` for speed)
    docker-compose build --no-cache

    # start container
    docker-compose up -d

    # stop container
    docker-compose stop

    # destroy container and network
    docker-compose down --remove-orphans
    ```
* justfile runner commands
    ```bash
    # help
    just

    # build image locally (no-cache)
    just build-clean

    # build image locally
    just build

    # start container
    just start

    # ssh
    just exec

    # stop container
    just stop

    # stop container, remove container and network
    just down
    ```

## Heroku

* Heroku commands
```bash
# autocomplete + login
heroku autocomplete --refresh-cache

# upload container (heroku.yml)
heroku update beta
heroku plugins:install @heroku-cli/plugin-manifest
export HEROKU_APP=eventify
heroku create $HEROKU_APP --manifest
git remote set-url origin https://git.heroku.com/${HEROKU_APP}.git
git add .
git commit -m "Init"
git push heroku <branchname>:main

# upload .env vars
cat .env | tr '\n' ' ' | xargs heroku config:set

# watch logs (build, server activity)
heroku logs --tail

# control remote builds (e.g., CI)
heroku plugins:install heroku-builds
heroku builds

# cancel latest build
heroku builds:cancel

# run hosted container locally
heroku run bash

# pull image
docker pull registry.heroku.com/${HEROKU_APP}/web

# run image locally
docker run --rm -it --env-file .env -p ${PORT}:${PORT} registry.heroku.com/${HEROKU_APP}/web bash

# open web app
heroku open
```
