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
