<?php
declare(strict_types=1);
header('Content-Type: text/plain; charset=utf-8');

if (!isset($_GET['key']) || $_GET['key'] !== 'if-setup-7k2m') {
    http_response_code(403);
    exit('forbidden');
}

$home = getenv('HOME') ?: '/home/zjdekntt';
$envPath = "$home/iran_food/backend/.env";
$env = [];
foreach (file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
    $line = trim($line);
    if ($line === '' || $line[0] === '#') {
        continue;
    }
    [$k, $v] = array_pad(explode('=', $line, 2), 2, '');
    $env[trim($k)] = trim($v, " \t\"'");
}

$mysqli = new mysqli(
    $env['MYSQL_HOST'] ?? '127.0.0.1',
    $env['MYSQL_USER'] ?? '',
    $env['MYSQL_PASSWORD'] ?? '',
    $env['MYSQL_DATABASE'] ?? ''
);
if ($mysqli->connect_errno) {
    exit('connect error: ' . $mysqli->error . "\n");
}

$res = $mysqli->query('SELECT payload FROM site_content WHERE id = 1 LIMIT 1');
$row = $res ? $res->fetch_assoc() : null;
if (!$row) {
    exit("no row\n");
}

$payload = json_decode((string) $row['payload'], true);
if (!is_array($payload)) {
    exit("invalid payload\n");
}

if (isset($payload['main']) && is_array($payload['main'])) {
    $payload = $payload['main'];
}

$encoded = json_encode($payload, JSON_UNESCAPED_UNICODE);
$stmt = $mysqli->prepare('UPDATE site_content SET payload = ? WHERE id = 1');
$stmt->bind_param('s', $encoded);
$stmt->execute();
echo "fixed payload keys: " . implode(', ', array_keys($payload)) . "\n";
