<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require 'vendor/autoload.php';
require 'classes/regMapper.php';
require 'classes/mailer.php';

$config = [
    'settings' => [
        'displayErrorDetails' => true,
        'db' => [
          'host' => 'db712490032.db.1and1.com',
          'user' => 'dbo712490032',
          'pass' => 'DgK-5Sm-9xx-wzK',
          'dbname' => 'db712490032'
        ],
    ],
];
// mSQL port: 3306
// this is an upload test

$app = new \Slim\App($config);

$container = $app->getContainer();

$container['db'] = function ($c) {
    $db = $c['settings']['db'];
    $pdo = new PDO('mysql:host=' . $db['host'] . ';dbname=' . $db['dbname'],
        $db['user'], $db['pass']);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->setAttribute(PDO::MYSQL_ATTR_INIT_COMMAND, "SET NAMES utf8");
    return $pdo;
};

$container['logger'] = function($c) {
    $logger = new \Monolog\Logger('my_logger');
    $file_handler = new \Monolog\Handler\StreamHandler('app.log');
    $logger->pushHandler($file_handler);
    return $logger;
};

// enable CORS (cf. https://www.slimframework.com/docs/v3/cookbook/enable-cors.html)
$app->options('/{routes:.+}', function ($request, $response, $args) {
    return $response;
});

$app->add(function ($req, $res, $next) {
    $response = $next($req, $res);
    return $response
            ->withHeader('Access-Control-Allow-Origin', '*')
            ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
});

// CORS preflight header //
// $app->options('/location[/{token}]', function ($request, $response, $args) {
//   $this->logger->addInfo("location preflight request:", $request, "args:", $args);
//   return $response
//     ->withAddedHeader('Access-Control-Allow-Origin', '*')
//     ->withAddedHeader('Access-Control-Allow-Headers', 'Content-Type');
// });
//
// //get record by id
// $app->get('/locations', function ($request, $response, $args) {
//   $token = $args['token'];
//   $mapper = new regMapper($this->db, $this->logger);
//   try {
//     $rec = $mapper->getLocations();
//   } catch(PDOException $ex) {
//     $this->logger->addInfo("Error", [$ex]);
//   }
//   // $uid = password_hash("Bandonegroinfo@bandonegro.comblabla", PASSWORD_DEFAULT);
//     return $response->withStatus(200)
//           ->withAddedHeader('Access-Control-Allow-Origin', '*')
//           ->withAddedHeader('Content-Type', 'application/json; charset=utf-8')
//           ->write(json_encode($rec));
// });

// insert eventinfo record
$app->post('/eventinfo/update', function ($request, $response, $args) {
  $this->logger->addInfo("eentinfo update", $args);
  // if (array_key_exists('locid', $args)) {
  //   $token = $args['locid'];
  // } else {
  //   $token = null;
  // }
  $parsedBody = $request->getParsedBody();
  $rec = $parsedBody["body"];
  $this->logger->addInfo("parsedLocationBody", [$parsedBody]);
  $mapper = new regMapper($this->db, $this->logger);
  try {
    $id = $mapper->insertEventinfo($rec);
    $status = 200;
  } catch(PDOException $ex) {
    $this->logger->addInfo("Error", [$ex]);
    $id = null;
    $status = 503;
    $msg = 'Error: Insert/Update of eventinfo failed';
  }
  $this->logger->addInfo("Location inserted/updated", [$id]);
  return $response->withStatus($status)
      ->withAddedHeader('Access-Control-Allow-Origin', '*')
      ->withAddedHeader('Content-Type', 'application/json; charset=utf-8')
      ->write(json_encode($id));
});


// insert location record
$app->post('/location/update', function ($request, $response, $args) {
  $this->logger->addInfo("location update", $args);
  // if (array_key_exists('locid', $args)) {
  //   $token = $args['locid'];
  // } else {
  //   $token = null;
  // }
  $parsedBody = $request->getParsedBody();
  $rec = $parsedBody["body"];
  $this->logger->addInfo("parsedLocationBody", [$parsedBody]);
  $mapper = new regMapper($this->db, $this->logger);
  try {
    $id = $mapper->insertLocation($rec);
    $status = 200;
  } catch(PDOException $ex) {
    $this->logger->addInfo("Error", [$ex]);
    $id = null;
    $status = 503;
    $msg = 'Error: Insert/Update of location failed';
  }
  $this->logger->addInfo("Location inserted/updated", [$id]);
  return $response->withStatus($status)
      ->withAddedHeader('Access-Control-Allow-Origin', '*')
      ->withAddedHeader('Content-Type', 'application/json; charset=utf-8')
      ->write(json_encode($id));
});

// insert or update person
$app->post('/person/update', function ($request, $response, $args) {
  $this->logger->addInfo("person update", $args);
  $parsedBody = $request->getParsedBody();
  $rec = $parsedBody["body"];
  $this->logger->addInfo("parsedLocationBody", [$parsedBody]);
  $mapper = new regMapper($this->db, $this->logger);
  try {
    $id = $mapper->insertPersonData($rec);
    $status = 200;
  } catch(PDOException $ex) {
    $this->logger->addInfo("Error", [$ex]);
    $id = null;
    $status = 503;
    $msg = 'Error: Insert/Update of person failed';
  }
  $this->logger->addInfo("Person inserted/updated", [$id]);
  return $response->withStatus($status)
      ->withAddedHeader('Access-Control-Allow-Origin', '*')
      ->withAddedHeader('Content-Type', 'application/json; charset=utf-8')
      ->write(json_encode($id));
});


// insert or update record
$app->post('/update[/{token}]', function ($request, $response, $args) {
  $this->logger->addInfo("update", $args);
  if (array_key_exists('token', $args)) {
    $token = $args['token'];
  } else {
    $token = null;
  }
  $parsedBody = $request->getParsedBody();
  $rec = $parsedBody["body"];
  $this->logger->addInfo("parsedBody", [json_encode($rec)]);
  $mapper = new regMapper($this->db, $this->logger);
  try {
    $id = $mapper->insertRecord($token, $rec);
    $status = 200;
  } catch(PDOException $ex) {
    $this->logger->addInfo("Error", [$ex]);
    $id = null;
    $status = 503;
    $msg = 'Error: Insert/Update failed';
  }
  $this->logger->addInfo("hello inserted", [$id]);
  return $response->withStatus($status)
      ->withAddedHeader('Access-Control-Allow-Origin', '*')
      ->withAddedHeader('Content-Type', 'application/json; charset=utf-8')
      ->write(json_encode($id));
});

// CORS preflight header //
// $app->options('/update[/{token}]', function ($request, $response, $args) {
//   $this->logger->addInfo("user update preflight", $args);
//   return $response
//     ->withAddedHeader('Access-Control-Allow-Origin', '*')
//     ->withAddedHeader('Access-Control-Allow-Headers', 'Content-Type');
// });

//get record by id
$app->get('/hello/{token}', function ($request, $response, $args) {
  $token = $args['token'];
  $mapper = new regMapper($this->db, $this->logger);
  try {
    $rec = $mapper->getRecord($token);
  } catch(PDOException $ex) {
    $this->logger->addInfo("Error", [$ex]);
  }
  // $uid = password_hash("Bandonegroinfo@bandonegro.comblabla", PASSWORD_DEFAULT);
    return $response->withStatus(200)
          ->withAddedHeader('Access-Control-Allow-Origin', '*')
          ->withAddedHeader('Content-Type', 'application/json; charset=utf-8')
          ->write(json_encode($rec));
});

//get eventinfo
$app->get('/eventinfo', function ($request, $response, $args) {
  $mapper = new regMapper($this->db, $this->logger);
  try {
    $rec = $mapper->getEventinfo();
  } catch(PDOException $ex) {
    $this->logger->addInfo("Error", [$ex]);
  }
    return $response->withStatus(200)
          ->withAddedHeader('Access-Control-Allow-Origin', '*')
          ->withAddedHeader('Content-Type', 'application/json; charset=utf-8')
          ->write(json_encode($rec));
});

//get locations
$app->get('/locations', function ($request, $response, $args) {
  $mapper = new regMapper($this->db, $this->logger);
  try {
    $rec = $mapper->getLocations();
  } catch(PDOException $ex) {
    $this->logger->addInfo("Error", [$ex]);
  }
    return $response->withStatus(200)
          ->withAddedHeader('Access-Control-Allow-Origin', '*')
          ->withAddedHeader('Content-Type', 'application/json; charset=utf-8')
          ->write(json_encode($rec));
});

//get list of ids
$app->post('/{magictoken}', function ($request, $response, $args) {
  $token = $args['magictoken'];
  if ($token != '2e104a89-5a16-4a50-a8b0-7442f43b7633') return null;
  $mapper = new regMapper($this->db, $this->logger);
  try {
    $rec = $mapper->getIds();
  } catch(PDOException $ex) {
    $this->logger->addInfo("Error", [$ex]);
  }
  $result->uids = $rec;
  try {
    $rec = $mapper->getLocations();
  } catch(PDOException $ex) {
    $this->logger->addInfo("Error", [$ex]);
  }
  $result->locations = $rec;

  try {
    $rec = $mapper->getPersons();
  } catch(PDOException $ex) {
    $this->logger->addInfo("Error", [$ex]);
  }
  $result->persons = $rec;

  // $uid = password_hash("Bandonegroinfo@bandonegro.comblabla", PASSWORD_DEFAULT);
    return $response->withStatus(200)
          ->withAddedHeader('Access-Control-Allow-Origin', '*')
          ->withAddedHeader('Content-Type', 'application/json; charset=utf-8')
          ->write(json_encode($result));
});

$app->get('/resend/{token}', function ($request, $response, $args) {
  $token = $args['token'];
  $this->logger->addInfo("Resend", [$token]);
  $mapper = new regMapper($this->db, $this->logger);
  try {
    $id = $mapper->searchId($token);
  } catch(PDOException $ex) {
    $this->logger->addInfo("Error", [$ex]);
  }
  $ret = $id != null;

  $this->logger->addInfo("Found", [$ret]);

  if ($ret) {
    try {
      $rec = $mapper->getRecord($id);
    } catch(PDOException $ex) {
      $this->logger->addInfo("Error", [$ex]);
    }

    $to = 'lothar@b-welcome.de';
    $rto = $rec['email'];
    $mailer = new mailer($to, $id, $this->logger);
    $ret = $mailer->sendHtmlMail('rsend');
  }
  $this->logger->addInfo("Will return", [json_encode($ret)]);

  return $response->withStatus(200)
          ->withAddedHeader('Access-Control-Allow-Origin', '*')
          ->withAddedHeader('Content-Type', 'application/json; charset=utf-8')
          ->write(json_encode($ret));

});

// CORS enablement
// Catch-all route to serve a 404 Not Found page if none of the routes match
// NOTE: make sure this route is defined last
$app->map(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], '/{routes:.+}', function($req, $res) {
    $handler = $this->notFoundHandler; // handle using the default Slim page not found handler
    return $handler($req, $res);
});

$app->run();
