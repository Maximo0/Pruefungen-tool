# Pocketbase
This is a modified version of the [Pocketbase](https://pocketbase.io/) database.

It has all the different collections for this project pre setup. Additionally it has some users setup.

## Dashboard Users
**Admin dashboard**\
username: admin@pocketbase.de\
password: pocketbase_admin

## Frontend Users

**Editor user**\
username: editor\
password: demo00/.

**Guest user**\
username: demo00\
password: demo00/.


## Extra note
When using this project later, change the users credentials and or create new ones.


# Instalation


## Docker
create a docker image using the Dockerfile.\
```docker build -t pocketbase .```

Run the docker Image on the specified port.\
```docker run --name Pocketbase -p 8080:8080 pocketbase```