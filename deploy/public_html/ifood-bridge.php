<?php
/**
 * Internal target for /ifood-api/* rewrites — forwards to Node (api.iranfoodd.ir vhost).
 */
declare(strict_types=1);

$backendBase = 'https://127.0.0.1';

$subPath = isset($_GET['path']) ? (string) $_GET['path'] : '';
$subPath = ltrim($subPath, '/');
$target = rtrim($backendBase, '/') . '/api';
if ($subPath !== '') {
    $target .= '/' . $subPath;
}

$extraQuery = $_SERVER['QUERY_STRING'] ?? '';
if ($extraQuery !== '') {
    parse_str($extraQuery, $params);
    unset($params['path']);
    if ($params) {
        $target .= '?' . http_build_query($params);
    }
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

$forwardHeaders = ['Host: api.iranfoodd.ir'];
if (function_exists('getallheaders')) {
    foreach (getallheaders() as $name => $value) {
        $lower = strtolower($name);
        if ($lower === 'host' || $lower === 'content-length') {
            continue;
        }
        $forwardHeaders[] = $name . ': ' . $value;
    }
}

$ch = curl_init($target);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 120);
curl_setopt($ch, CURLOPT_HTTPHEADER, $forwardHeaders);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);

if (in_array($method, ['POST', 'PUT', 'PATCH'], true)) {
    $contentType = $_SERVER['CONTENT_TYPE'] ?? $_SERVER['HTTP_CONTENT_TYPE'] ?? '';
    if (stripos($contentType, 'multipart/form-data') !== false && !empty($_FILES)) {
        $post = $_POST;
        foreach ($_FILES as $key => $file) {
            if (!is_array($file) || ($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
                continue;
            }
            $post[$key] = new CURLFile(
                $file['tmp_name'],
                $file['type'] ?: 'application/octet-stream',
                $file['name'] ?: 'upload.bin'
            );
        }
        curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
    } elseif ($raw = file_get_contents('php://input')) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, $raw);
    }
}

$response = curl_exec($ch);
if ($response === false) {
    http_response_code(502);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['success' => false, 'message' => 'Backend unavailable']);
    curl_close($ch);
    exit;
}

$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
curl_close($ch);

$rawHeaders = substr($response, 0, $headerSize);
$body = substr($response, $headerSize);

http_response_code($status);

foreach (explode("\r\n", $rawHeaders) as $line) {
    if ($line === '' || stripos($line, 'HTTP/') === 0) {
        continue;
    }
    $colon = strpos($line, ':');
    if ($colon === false) {
        continue;
    }
    $name = trim(substr($line, 0, $colon));
    $value = trim(substr($line, $colon + 1));
    $lower = strtolower($name);
    if (in_array($lower, ['transfer-encoding', 'connection', 'content-length'], true)) {
        continue;
    }
    header($name . ': ' . $value, $lower !== 'set-cookie');
}

echo $body;
