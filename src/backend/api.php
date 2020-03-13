<?php
session_start();

define('SERVER_KEY', 'AAAAYgzPwvc:APA91bE0iYHclpU-3c_fq_a8Tdu-Z04_WiOOY-r9NN71Mva5EhWjrfBhb2eVAsRevvJbOyiLo3JV-VD1YPY_oVXGxgwB8UpR9tkmCUwQp5SExswo2MB3DTNg9cZSO-P2_WMJBVOqYZtc');
define('SENDER_ID', '421121737463');
define('SPEED_LIMIT', 30);
define('ZONE_ALERT_MIN_INTERVAL', 5); //นาที
define('ZONE_ALERT_DISTANCE', 1000); //เมตร
define('LAST_SPEED_ALERT_TIME', 'last_speed_alert_time');
define('LAST_ZONE_ALERT_TIME', 'last_zone_alert_time');

require_once 'global.php';
require_once 'district_data.php';
require_once 'vendor/autoload.php';

error_reporting(E_ERROR | E_PARSE);
header('Content-type: application/json; charset=utf-8');
//header('Content-type: text/html; charset=utf-8');

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

use GuzzleHttp\Client;

//Something to write to txt log
/*$log = "User: " . $_SERVER['REMOTE_ADDR'] . ' - ' . date("F j, Y, g:i a") . PHP_EOL .
    "Action: " . $action . PHP_EOL .
    "-------------------------" . PHP_EOL;*/
//Save string to log, use FILE_APPEND to append.
//file_put_contents('./log/log_' . date("j.n.Y") . '.txt', $log, FILE_APPEND);

switch ($action) {
    case 'add_user_tracking':
        doAddUserTracking();
        break;
    case 'test_fcm':
        doTestFcm();
        break;
    case 'test_api':
        doTestApi();
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

    $currentLat = doubleval($latitude);
    $currentLng = doubleval($longitude);
    $currentTimestamp = $clientTimestamp + 0;

    $distanceMeters = 0;
    $elapsedTimeSeconds = 0;
    $speed = 0;
    $alertSpeed = 0;
    $overLimit = 0;

    $sql = "SELECT * 
            FROM user_tracking 
            WHERE device_token = '$deviceToken' 
            ORDER BY id DESC";
            //AND (created_at BETWEEN (DATE_SUB(NOW(), INTERVAL 10 MINUTE)) AND NOW())

    if ($result = $db->query($sql)) {
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $lastId = (int)$row['id'];
            $lastLatitude = doubleval($row['latitude']);
            $lastLongitude = doubleval($row['longitude']);
            $lastTimestamp = $row['client_timestamp'] + 0;
            $lastAlertSpeed = (int)$row['alert_speed'];
            $lastOverLimit = (int)$row['over_limit'];

            $distanceMeters = floor(getDistance($lastLatitude, $lastLongitude, $currentLat, $currentLng, 'M'));
            $elapsedTimeSeconds = floor(($currentTimestamp - $lastTimestamp) / 1000);
            if ($elapsedTimeSeconds < 5) {
                $response[KEY_ERROR_CODE] = ERROR_CODE_SUCCESS;
                $response[KEY_ERROR_MESSAGE] = 'ignore ข้อมูล เนื่องจากเวลาน้อยกว่า 5 วินาที';
                $response[KEY_ERROR_MESSAGE_MORE] = '';
                return;
            }

            $speed = floor(($distanceMeters * 3.6) / $elapsedTimeSeconds); // ความเร็ว ไม่สนใจทศนิยม
            if ($speed > SPEED_LIMIT) {
                $overLimit = 1;

                if ($lastAlertSpeed === 0 && $lastOverLimit === 1) {
                    if (sendNotification(
                        $deviceToken,
                        'คุณขับรถเร็วเกินไป!',
                        "คุณกำลังขับรถที่ความเร็ว {$speed} กม./ชม."
                    )) {
                        $alertSpeed = 1;
                    }
                }
            }
        }
    }

    $checkZoneResult = checkEnterZone($currentLat, $currentLng);
    $enterZone = $checkZoneResult['enterZone'];
    $zoneName = $checkZoneResult['zoneName'];
    $zoneCategory = $checkZoneResult['zoneCategory'];
    $distanceZone = $checkZoneResult['distanceZone'];
    $alertZone = 0;

    if ($enterZone === 1) {
        //เพิ่ม logic ให้แจ้งเตือนหลังจากแจ้งเตือนครั้งก่อน 5 นาที หรือมากกว่านั้น
        $lastZoneAlertTime = $_SESSION[LAST_ZONE_ALERT_TIME];
        if (isset($lastZoneAlertTime)) {
            $timeDiff = time() - $lastZoneAlertTime;
        } else {
            $timeDiff = 0;
        }

        if ($timeDiff < ZONE_ALERT_MIN_INTERVAL * 60) {
            $title = 'คุณกำลังเข้าสู่พื้นที่ที่มี';
            $msg = '';
            switch ($zoneCategory) {
                case 2:
                    $title .= 'จุดเสี่ยงบนถนน';
                    $msg .= 'จุดเสี่ยงบนถนนอยู่ในพื้นที่ของ';
                    break;
                case 11:
                    $title .= 'โรคระบาด';
                    $msg .= 'โรคระบาดอยู่ในพื้นที่ของ';
                    break;
            }

            $zoneNamePart = explode(' ', $zoneName);
            $msg .= " ต.{$zoneNamePart[0]} อ.{$zoneNamePart[1]} จ.{$zoneNamePart[2]}";

            if (sendNotification(
                $deviceToken,
                $title,
                $msg
            )) {
                $alertZone = 1;
                $_SESSION[LAST_ZONE_ALERT_TIME] = time();
            }
        }
    }

    $sqlInsert = "INSERT INTO user_tracking (device_token, latitude, longitude, distance, elapsed_time, speed, over_limit, alert_speed, enter_zone, zone_name, alert_zone, client_timestamp)
            VALUES ('$deviceToken', $latitude, $longitude, $distanceMeters, $elapsedTimeSeconds, $speed, $overLimit, $alertSpeed, $enterZone, '$zoneName', $alertZone, $clientTimestamp)";
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

function sendNotification($deviceToken, $title, $msg)
{
    try {
        // Instantiate the client with the project api_token and sender_id.
        $client = new \Fcm\FcmClient(SERVER_KEY, SENDER_ID);

        // Instantiate the push notification request object.
        $notification = new \Fcm\Push\Notification();

        // Enhance the notification object with our custom options.
        $notification
            ->addRecipient($deviceToken)
            ->setTitle($title)
            ->setBody($msg)
            ->addData('key', 'value');

        // Send the notification to the Firebase servers for further handling.
        $client->send($notification);

        return true;
    } catch (Exception $e) {
        return false;
    }
}

function doTestFcm()
{
    global $db, $response;

    ini_set('display_errors', 1);

    $deviceId = 'c_6oDfHC5vI:APA91bH4hLmzRDulK9ZQSdpHeAQ6WFrRNoVtmb-FP50WUFHSfgZu2BlTjx67osK5MlyzaHFOuBczdIFuG58Re80dt9obvc61aBoj8DqP_9Jai0t2jUMp8EzjiB_Tp58OJXIxprn6E7pd';

    try {
        // Instantiate the client with the project api_token and sender_id.
        $client = new \Fcm\FcmClient(SERVER_KEY, SENDER_ID);

        // Instantiate the push notification request object.
        $notification = new \Fcm\Push\Notification();

        // Enhance the notification object with our custom options.
        $notification
            ->addRecipient($deviceId)
            ->setTitle('คุณขับรถเร็วเกินไป!')
            ->setBody('คุณกำลังขับรถที่ความเร็ว 5555 กม./ชม.')
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

function checkEnterZone($currentLat, $currentLng)
{
    $heatmapDataList = array_merge(getHeatmapDataFromApi(73), getHeatmapDataFromApi(35));
    $enterZone = 0;
    $zoneName = NULL;
    $zoneCategory = 0;
    $distanceZone = -1;

    foreach ($heatmapDataList as $heatmapPoint) {
        $distance = getDistance(
            $currentLat,
            $currentLng,
            $heatmapPoint['geometry']['latitude'],
            $heatmapPoint['geometry']['longitude'],
            'M'
        );
        if ($distance < ZONE_ALERT_DISTANCE) {
            $enterZone = 1;
            $zoneName = $heatmapPoint['properties']['NAME_T'];
            $zoneCategory = $heatmapPoint['properties']['CATEGORY'];
            $distanceZone = $distance;
            break;
        }
    }

    return array(
        'enterZone' => $enterZone,
        'zoneName' => $zoneName,
        'zoneCategory' => $zoneCategory,
        'distanceZone' => $distanceZone
    );
}

function doTestApi()
{
    global $response;

    // ตำบลของยโสธรที่มีข้อมูลซ้ำ - ฟ้าหยาด หนองคู เชียงเพ็ง
    $heatmapDataList = array_merge(getHeatmapDataFromApi(73), getHeatmapDataFromApi(35));

    //todo: *******************************

    $response[KEY_ERROR_CODE] = ERROR_CODE_SUCCESS;
    $response[KEY_ERROR_MESSAGE] = print_r($heatmapDataList, TRUE);
    $response[KEY_ERROR_MESSAGE_MORE] = '';
}

function getHeatmapDataFromApi($provinceCode)
{
    global $districtData;

    $client = new Client([
        'base_uri' => 'https://safesafe.ngis.go.th',
        'timeout' => 10,
    ]);

    $apiResponse = $client->request('GET', '/gapi/coords/', [
        'query' => ['province_code' => $provinceCode, 'cat_id' => '2,11']
    ]);

    $statusCode = $apiResponse->getStatusCode();
    $reason = $apiResponse->getReasonPhrase();
    if ($statusCode === 200) {
        $body = $apiResponse->getBody();
        $stringBody = (string)$body;
        $dataList = json_decode($stringBody, TRUE)['features'];

        for ($i = 0; $i < count($dataList); $i++) {
            $key = $dataList[$i]['properties']['NAME_T'];

            // lookup lat, lng จากไฟล์ district_data.php
            $lat = $districtData[$key]['latitude'];
            $lng = $districtData[$key]['longitude'];

            $dataList[$i]['geometry']['latitude'] = $lat;
            $dataList[$i]['geometry']['longitude'] = $lng;
        }

        /*foreach ($dataList as $item) {
            //$test .= $item['properties']['NAME_T'] .  PHP_EOL;
            $key = $item['properties']['NAME_T'];

            // lookup lat, lng จากไฟล์ district_data.php
            $lat = $districtData[$key]['latitude'];
            $lng = $districtData[$key]['longitude'];

            $item['geometry']['latitude'] = $lat;
            $item['geometry']['longitude'] = $lng;
        }*/

        return $dataList;

        //$districtData = json_decode(DISTRICT_DATA, TRUE);
        //$test = $districtData[0][0]['properties']['NAME_T'];

        /*$districtList = array();
        for ($province = 0; $province < count($districtData); $province++) {
            for ($i = 0; $i < count($districtData[$province]); $i++) {
                $subDistrictName = $districtData[$province][$i]['properties']['TAMBON_T'];
                $districtName = $districtData[$province][$i]['properties']['AMPHOE_T'];
                $provinceName = $districtData[$province][$i]['properties']['CHANGWAT_T'];

                $key = "$subDistrictName $districtName $provinceName";
                $coord = array();
                $coord['latitude'] = $districtData[$province][$i]['geometry']['coordinates'][1];
                $coord['longitude'] = $districtData[$province][$i]['geometry']['coordinates'][0];
                $districtList[$key] = $coord;
            }
        }*/

        /*$test = '';
        foreach ($districtData as $key => $value) {
            //$test .= $key . '[' . $value['latitude'] . ',' . $value['longitude'] . ']' . PHP_EOL;
        }*/

        /*$response[KEY_ERROR_CODE] = ERROR_CODE_SUCCESS;
        $response[KEY_ERROR_MESSAGE] = '';
        $response[KEY_ERROR_MESSAGE_MORE] = '';*/
    } else {
        return array();

        /*$response[KEY_ERROR_CODE] = ERROR_CODE_ERROR;
        $response[KEY_ERROR_MESSAGE] = "HTTP Error [Code {$statusCode}: {$reason}]";
        $response[KEY_ERROR_MESSAGE_MORE] = '';*/
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
