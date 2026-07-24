<?php
declare(strict_types=1);

$backendBase = 'https://127.0.0.1';

$uri = $_SERVER['REQUEST_URI'] ?? '/';
if (!preg_match('#^/uploads/(.+)$#', $uri, $m)) {
    http_response_code(404);
    exit;
}

$target = rtrim($backendBase, '/') . '/uploads/' . $m[1];

$ch = curl_init($target);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Host: api.iranfoodd.ir']);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);

$response = curl_exec($ch);
if ($response === false) {
    http_response_code(502);
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
