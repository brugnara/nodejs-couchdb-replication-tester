nodejs-couchdb-replication-tester
=================================

This tool helps the user creating N databases and replications for testing couchdb.

Creation
========

Create 10 databases on localhost:5984

node start.js 10 create

Create 20 databases (test_XXX) on http://test.iriscouch.com:555

node start.js 20 create test http://test.iriscouch.com 555

Replication
===========

node start.js 10 replication

or, for second example seen before:

node start.js 20 replication test https://test.iriscouch.com 555

Socket limits based on SO
=========================

You will need to let your SO open more sockets and "ulimit -n X" may help (where X is at least (N*(N-1)))

Warning
=======

Replication of 30 or more dbs, will cause process beam.smp (couchdb) to a huge work. If you receive E*** errors, killall beam.smp && couchdb -b will resolve. Try next time with a lower DB.
Please remember to do "ulimit -n XXX" (where XXX = N*(N-1)) as root.
