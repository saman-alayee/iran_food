<?php
declare(strict_types=1);
header('Content-Type: text/plain; charset=utf-8');

if (!isset($_GET['key']) || $_GET['key'] !== 'if-setup-7k2m') {
    http_response_code(403);
    exit('forbidden');
}

$home = getenv('HOME') ?: '/home/zjdekntt';
$envPath = "$home/iran_food/backend/.env";
if (!is_readable($envPath)) {
    exit("missing env: $envPath\n");
}

$env = [];
foreach (file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
    $line = trim($line);
    if ($line === '' || $line[0] === '#') {
        continue;
    }
    [$k, $v] = array_pad(explode('=', $line, 2), 2, '');
    $env[trim($k)] = trim($v, " \t\"'");
}

$host = $env['MYSQL_HOST'] ?? '127.0.0.1';
$user = $env['MYSQL_USER'] ?? '';
$pass = $env['MYSQL_PASSWORD'] ?? '';
$db = $env['MYSQL_DATABASE'] ?? '';

$mysqli = @new mysqli($host, $user, $pass, $db);
if ($mysqli->connect_errno) {
    exit('connect error: ' . $mysqli->connect_error . "\n");
}

echo "mysql: ok\n";

$res = $mysqli->query('SHOW TABLES');
echo "tables:\n";
while ($r = $res->fetch_row()) {
    echo ' - ' . $r[0] . "\n";
}

$res = $mysqli->query('SHOW COLUMNS FROM site_content');
if (!$res) {
    exit('site_content missing: ' . $mysqli->error . "\n");
}
echo "site_content columns:\n";
while ($r = $res->fetch_assoc()) {
    echo ' - ' . $r['Field'] . ' ' . $r['Type'] . "\n";
}

$res = $mysqli->query('SELECT * FROM site_content LIMIT 5');
if ($res) {
    echo "sample rows:\n";
    while ($r = $res->fetch_assoc()) {
        echo json_encode($r, JSON_UNESCAPED_UNICODE) . "\n";
    }
}
