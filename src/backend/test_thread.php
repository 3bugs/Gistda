<?php
class SendMailThread extends Thread {
    public function __construct($data) {
        $this->data = $data;
    }

    // โค้ดส่วนนี้จะทำใน thread ใหม่
    public function run() {
        // อ่าน $this->data มาใช้งาน เช่น
        // $this->data['recipient']
        // $this->data['mail_content']
        // แล้วทำการส่งเมล
    }
}

$param = array(
    'recipient' => 'promlert@gmail.com',
    'main_content' => 'bla bla bla',
    'foo' => 'bar'
);
$worker = new SendMailThread($param);
$worker->start();

// ส่งผลลัพธ์กลับไปยัง client (โดยไม่รอ thread ทำงานจบ)
echo 'ทดสอบ Thread';
