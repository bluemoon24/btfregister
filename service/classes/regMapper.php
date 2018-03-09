<?php
class regMapper
  {
    // property declaration
    private $pdo;
    private $logger;

    public function __construct($db, $logger) {
      $this->pdo = $db;
      $this->logger = $logger;
      $this->pdo->exec("set names utf8");
    }

    private function generateId () {
      return rand(10000, 99999);
    }

    // method declaration
    public function searchId($token) {
      $sql = "SELECT count(*) as c, id FROM festivalvip WHERE name like \"$token\" or email like \"$token\" LIMIT 2";
      $qresult =  $this->pdo->query($sql);
      $r = $qresult->fetch();
      $this->logger->addInfo("name/email lookup", [$r, $token, $sql]);
      if ($r['c'] == 1) {
        $id = $r['id'];
      } else {
        $id = null;
      }
      return $id;
    }

    public function getIds() {
      $qresult = $this->pdo->query("SELECT id, name FROM festivalvip LIMIT 100");
      return $qresult->fetchAll();
    }

    public function getLocations() {
      $qresult = $this->pdo->query("SELECT * FROM festivalloc LIMIT 100");
      return $qresult->fetchAll();
    }

    public function getEventinfo() {
      $qresult = $this->pdo->query("SELECT * FROM festivaltimes LIMIT 200");
      return $qresult->fetchAll();
    }

    public function getRecord($id) {
      $sql = 'SELECT * FROM `festivalvip` WHERE id = ' . $id;
      $sth = $this->pdo->query($sql);
      $r = $sth->fetch();
      // $this->logger->addInfo("regMapper", ['sql', $sql, json_encode($r)]);
      return $r;
    }

    public function insertRecord($id, $rec) {
      // $this->logger->addInfo("regMapper insert", [$id, $rec]);
      $assignments = array();
      if ($id == null) {
        $id = $this->generateId();
        $ids = $this->getIds();
        while (in_array($id, $ids)) $id = $this->generateId();
      }
      $rec['id'] = $id;
      foreach ($rec as $key => $value) {
        array_push($assignments, "$key = '$value'");
      }
      $assignment_list = join(',', $assignments);
      $sql = "INSERT INTO festivalvip SET $assignment_list ON DUPLICATE KEY UPDATE $assignment_list";
      // $this->logger->addInfo("regMapper insert", [$sql]);
      $this->pdo->exec($sql);
      return $id;
    }

    public function insertLocation($rec) {
      $this->logger->addInfo("regMapper location insert", [$rec]);
      $assignments = array();
      foreach ($rec as $key => $value) {
        array_push($assignments, "$key = '$value'");
      }
      $assignment_list = join(',', $assignments);
      $sql = "INSERT INTO festivalloc SET $assignment_list ON DUPLICATE KEY UPDATE $assignment_list";
      $this->logger->addInfo("regMapper location insert", [$sql]);
      $this->pdo->exec($sql);
      return $rec->id;
    }

    public function insertEventinfo($rec) {
      $this->logger->addInfo("regMapper Eventinfo insert", [$rec]);
      $assignments = array();
      foreach ($rec as $key => $value) {
        array_push($assignments, "$key = '$value'");
      }
      $assignment_list = join(',', $assignments);
      $sql = "INSERT INTO festivaltimes SET $assignment_list ON DUPLICATE KEY UPDATE $assignment_list";
      $this->logger->addInfo("regMapper Eventinfo insert", [$sql]);
      $this->pdo->exec($sql);
      return $rec->id;
    }
  }
?>
