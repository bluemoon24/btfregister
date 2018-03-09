<?php
class mailer
{
  private $to;
  private $id;
  private $logger;

  public function __construct($to, $id, $logger) {
    $this->to = $to;
    $this->id = $id;
    $this->logger = $logger;
    // $this->logger->addInfo("mailer created", [$to, $id]);
  }

  public function sendHtmlMail($tag) {
    $this->logger->addInfo("sendHtmlMail", [$tag]);
    $subject =  'Tango Festival Bonn Registration Service';
    $message = str_replace("<id>", "$this->id", file_get_contents("./$tag.txt"));
    // $this->logger->addInfo("Message", [$message]);

    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-type: text/html; charset=utf-8';
    $headers[] = 'From: info@tangofestival-bonn.de';
    $headers[] = 'Reply-To: info@tangofestival-bonn.de';
    $headers[] = 'X-Mailer: PHP/' . phpversion();

    // $this->logger->addInfo("Mail prepared", [$this->to, $subject, $headers]);
    // try {
      $sent = mail($this->to, $subject, $message, implode("\r\n", $headers));
      $this->logger->addInfo("Mail sent", [$sent, $this->to, $this->id]);
      return $sent;
    // } catch(Exception $e) {
    //   $this->logger->addInfo("Mailer error", [$e]);
    //   return false;
    // }
  }
}
?>
