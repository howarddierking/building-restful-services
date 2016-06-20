#!/usr/bin/env bash

/resources/wait-for-it.sh db:28015 -- rethinkdb-import -f /resources/bugs.json --table restbugs.bugs -c db:28015
/resources/wait-for-it.sh db:28015 -- rethinkdb-import -f /resources/users.json --table restbugs.users -c db:28015
