var MAX_DB = 20
  , DB_NAME = "test_replicator"
  , HOST = "localhost"
  , PORT = 5984
  , http = require("http")
  , deleteFirst // se true, cancella invece di creare i db
  , doRpl
  , doCreation

try {
  MAX_DB = parseInt(process.argv[2]);
	if (typeof MAX_DB != "number") {
		throw new Error("NUMDB must be a number");
	}

	switch (process.argv[3]) {
	case "delete":
		deleteFirst = true;
		break;
	case "replication":
		doRpl = true;
		break;
	case "create":
		doCreation = true;
		break;
	default:
		throw new Error("Wrong params");
	}
	// db name
	if (process.argv[4]) {
		DB_NAME = process.argv[4];
	}
	// host
	if (process.argv[5]) {
		HOST = process.argv[4];
	}
	// port
	if (process.argv[6]) {
		PORT = process.argv[5];
	}
} catch(e) {
	printHelp(e.message);
}

function printHelp(msg) {
	console.info("** Daniele Brugnara - praim.com **");
	if (msg) {
		console.error("Error occured: " + msg);
	}
	console.info("Usage: node start.js NUMDB command [DBNAME [, HOST [, PORT]]]");
	console.info("where command is one of:");
	console.info("\tdelete, create or replication");
	console.info("\tDBNAME defaults to test_replicator_100xx (where x is incremental)");
	console.info("\tHOST and PORT defaults to localhost and 5984");
	console.warn("NUMDB will affect replication with this complexity: (N!/(N-2)!) or simply (N*(N-1))");
	process.exit(1);
}

http.globalAgent.maxSockets = 100000;

function getDbName(i) {
	return DB_NAME + "_" + (10000 + i);
}

var onResponse = function(res) {
	res.setEncoding("utf8");
	res.on("data", function(data) {
		var json = JSON.parse(data);
		if (!json.ok) {
			console.error("Failed. " + data);
		} else {
			console.log(deleteFirst ? "Deleted" : "Created");
		}
	});
};

function doRequest(index) {
	// creo db
	var options = {
		host : HOST,
		port : PORT,
		method : deleteFirst ? "DELETE" : "PUT",
		path : "/" + getDbName(index)
	};
	var req = http.request(options, onResponse);
	req.on("error", function(e) {
		console.error("problem with request: " + e.message);
	});
	req.end();
}

function onReplResponse(res) {
	res.setEncoding("utf8");
	res.on("data", function(data) {
		var json = JSON.parse(data);
		console.log(data);
	});
}

function doReplication(i, j) {
	var options = {
		host : HOST,
		port : PORT,
		method : "POST",
		path : "/_replicate",
		headers: {"Content-Type" : "application/json"}		
	};
	var req = http.request(options, onReplResponse);
	var dt = {
		source: getDbName(i),
		target: getDbName(j),
		continuous: true
	};
	req.on("error", function(e) {
		console.error(e.message);
	});
	req.write(JSON.stringify(dt));
	req.end();
}

if (doCreation || deleteFirst) {
	for (var i=0;i<MAX_DB;i++) {
		doRequest(i);
	}
}

if (doRpl) {
	for (var i=0;i<MAX_DB-1;i++) {
		for (var j=i+1;j<MAX_DB;j++) {
			doReplication(i, j);
			doReplication(j, i);
		}
	}
}
