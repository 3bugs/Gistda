<?php
require_once 'global.php';
require_once 'vendor/autoload.php';

error_reporting(E_ERROR | E_PARSE);
//header('Content-type: application/json; charset=utf-8');
header('Content-type: text/html; charset=utf-8');

header('Expires: Sun, 01 Jan 2014 00:00:00 GMT');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Cache-Control: post-check=0, pre-check=0', FALSE);
header('Pragma: no-cache');

$response = array();

$request = explode('/', trim($_SERVER['PATH_INFO'], '/'));
$action = strtolower(array_shift($request));
$id = array_shift($request);

require_once 'db_config.php';
$db = new mysqli(DB_SERVER, DB_USER, DB_PASSWORD, DB_DATABASE);

if ($db->connect_errno) {
    $response[KEY_ERROR_CODE] = ERROR_CODE_ERROR;
    $response[KEY_ERROR_MESSAGE] = 'เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล';
    $response[KEY_ERROR_MESSAGE_MORE] = $db->connect_error;
    echo json_encode($response);
    exit();
}
$db->set_charset("utf8");

//sleep(1); //todo:

//Something to write to txt log
$log = "User: " . $_SERVER['REMOTE_ADDR'] . ' - ' . date("F j, Y, g:i a") . PHP_EOL .
    "Action: " . $action . PHP_EOL .
    "-------------------------" . PHP_EOL;
//Save string to log, use FILE_APPEND to append.
file_put_contents('./log/log_' . date("j.n.Y") . '.txt', $log, FILE_APPEND);

switch ($action) {
    case 'add_user_tracking':
        doAddUserTracking();
        break;
    case 'test_fcm':
        doTestFcm();
        break;
    default:
        $response[KEY_ERROR_CODE] = ERROR_CODE_ERROR;
        $response[KEY_ERROR_MESSAGE] = 'No action specified or invalid action.';
        $response[KEY_ERROR_MESSAGE_MORE] = '';
        break;
}

$db->close();
echo json_encode($response);
exit();

function doAddUserTracking()
{
    global $db, $response;

    $data = json_decode(file_get_contents('php://input'), true);

    $deviceToken = $data[0]['device_token'];
    $latitude = $data[0]['latitude'];
    $longitude = $data[0]['longitude'];
    $clientTimestamp = $data[0]['client_timestamp'];
    $speed = 0;

    $sql = "SELECT latitude, longitude, client_timestamp 
            FROM user_tracking 
            WHERE device_token = '$deviceToken' 
            ORDER BY id DESC";
    if ($result = $db->query($sql)) {
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $lastLat = doubleval($row['latitude']);
            $lastLng = doubleval($row['longitude']);
            $lastTimestamp = $row['client_timestamp'] + 0;

            $currentLat = doubleval($latitude);
            $currentLng = doubleval($longitude);
            $currentTimestamp = $clientTimestamp + 0;

            $distanceMeters = getDistance($lastLat, $lastLng, $currentLat, $currentLng, 'M');
            $elapsedTimeInSeconds = ($currentTimestamp - $lastTimestamp) / 1000;
            $speed = (($distanceMeters * 3.6) / $elapsedTimeInSeconds);
        }
    }

    $sqlInsert = "INSERT INTO user_tracking (device_token, latitude, longitude, speed, client_timestamp)
            VALUES ('$deviceToken', $latitude, $longitude, $speed, $clientTimestamp)";
    if ($db->query($sqlInsert)) {
        $response[KEY_ERROR_CODE] = ERROR_CODE_SUCCESS;
        $response[KEY_ERROR_MESSAGE] = 'บันทึกข้อมูลสำเร็จ';
        $response[KEY_ERROR_MESSAGE_MORE] = '';
    } else {
        $response[KEY_ERROR_CODE] = ERROR_CODE_ERROR;
        $response[KEY_ERROR_MESSAGE] = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';
        $errMessage = $db->error;
        $response[KEY_ERROR_MESSAGE_MORE] = "$errMessage\nSQL: $sqlInsert";
    }
}

function doTestFcm()
{
    global $db, $response;

    ini_set('display_errors', 1);

    $serverKey = 'AAAAYgzPwvc:APA91bE0iYHclpU-3c_fq_a8Tdu-Z04_WiOOY-r9NN71Mva5EhWjrfBhb2eVAsRevvJbOyiLo3JV-VD1YPY_oVXGxgwB8UpR9tkmCUwQp5SExswo2MB3DTNg9cZSO-P2_WMJBVOqYZtc';
    $senderId = '421121737463';
    $deviceId = 'fCzXvOMVGXM:APA91bG3XvEwxpUL1_W5Q3V51GToLSl5juhcu5ye2FQ42GqaopkUufTGC6dVTznEplgdPN6z-vT8nGswlukcxLYICuHriDZJ1j6OJU8jbESWb4fvu5yTNBkS3yA1Goo0FbGSejiIvwej';

    try {
        // Instantiate the client with the project api_token and sender_id.
        $client = new \Fcm\FcmClient($serverKey, $senderId);

        // Instantiate the push notification request object.
        $notification = new \Fcm\Push\Notification();

        // Enhance the notification object with our custom options.
        $notification
            ->addRecipient($deviceId)
            ->setTitle('Hello from php-fcm!')
            ->setBody('Notification body')
            ->addData('key', 'value');

        // Send the notification to the Firebase servers for further handling.
        $client->send($notification);

        $response[KEY_ERROR_CODE] = ERROR_CODE_SUCCESS;
        $response[KEY_ERROR_MESSAGE] = 'ส่ง FCM แล้ว';
        $response[KEY_ERROR_MESSAGE_MORE] = '';
    } catch (Exception $e) {
        $response[KEY_ERROR_CODE] = ERROR_CODE_ERROR;
        $response[KEY_ERROR_MESSAGE] = 'Error sending FCM: ' . $e->getMessage();
        $response[KEY_ERROR_MESSAGE_MORE] = '';
    }
}

/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
/*::                                                                         :*/
/*::  This routine calculates the distance between two points (given the     :*/
/*::  latitude/longitude of those points). It is being used to calculate     :*/
/*::  the distance between two locations using GeoDataSource(TM) Products    :*/
/*::                                                                         :*/
/*::  Definitions:                                                           :*/
/*::    South latitudes are negative, east longitudes are positive           :*/
/*::                                                                         :*/
/*::  Passed to function:                                                    :*/
/*::    lat1, lon1 = Latitude and Longitude of point 1 (in decimal degrees)  :*/
/*::    lat2, lon2 = Latitude and Longitude of point 2 (in decimal degrees)  :*/
/*::    unit = the unit you desire for results                               :*/
/*::           where: 'M' is statute miles (default)                         :*/
/*::                  'K' is kilometers                                      :*/
/*::                  'N' is nautical miles                                  :*/
/*::  Worldwide cities and other features databases with latitude longitude  :*/
/*::  are available at https://www.geodatasource.com                          :*/
/*::                                                                         :*/
/*::  For enquiries, please contact sales@geodatasource.com                  :*/
/*::                                                                         :*/
/*::  Official Web site: https://www.geodatasource.com                        :*/
/*::                                                                         :*/
/*::         GeoDataSource.com (C) All Rights Reserved 2018                  :*/
/*::                                                                         :*/
/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
function getDistance($lat1, $lon1, $lat2, $lon2, $unit)
{
    if (($lat1 == $lat2) && ($lon1 == $lon2)) {
        return 0;
    } else {
        $theta = $lon1 - $lon2;
        $dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta));
        $dist = acos($dist);
        $dist = rad2deg($dist);
        $miles = $dist * 60 * 1.1515;
        $unit = strtoupper($unit);

        if ($unit == "K") {
            return ($miles * 1.609344);
        } else if ($unit == "M") {
            return ($miles * 1609.344);
        } else if ($unit == "N") {
            return ($miles * 0.8684);
        } else {
            return $miles;
        }
    }
}
