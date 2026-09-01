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
    exit('connect error: ' . $mysqli->connect_error . "\n");
}

function tableColumns(mysqli $mysqli, string $table): array
{
    $cols = [];
    $res = $mysqli->query("SHOW COLUMNS FROM `$table`");
    if (!$res) {
        return $cols;
    }
    while ($row = $res->fetch_assoc()) {
        $cols[] = $row['Field'];
    }
    return $cols;
}

$cols = tableColumns($mysqli, 'site_content');
if (!$cols) {
    $sql = "CREATE TABLE site_content (
        id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
        payload JSON NOT NULL,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    if (!$mysqli->query($sql)) {
        exit('create site_content failed: ' . $mysqli->error . "\n");
    }
    $cols = tableColumns($mysqli, 'site_content');
    echo "created site_content\n";
}

$hasPayload = in_array('payload', $cols, true);
$hasLegacy = in_array('content_json', $cols, true) || in_array('content_key', $cols, true);

if (!$hasPayload) {
    if (!$mysqli->query('ALTER TABLE site_content ADD COLUMN payload JSON NULL AFTER id')) {
        exit('add payload failed: ' . $mysqli->error . "\n");
    }
    echo "added payload column\n";
    $hasPayload = true;
}

if ($hasLegacy) {
    $merged = [];
    if (in_array('content_key', $cols, true) && in_array('content_json', $cols, true)) {
        $res = $mysqli->query('SELECT content_key, content_json FROM site_content');
        while ($row = $res->fetch_assoc()) {
            $key = (string) ($row['content_key'] ?? '');
            $json = $row['content_json'] ?? null;
            if ($key === '' || $json === null) {
                continue;
            }
            $decoded = json_decode((string) $json, true);
            $merged[$key] = json_last_error() === JSON_ERROR_NONE ? $decoded : $json;
        }
    } elseif (in_array('content_json', $cols, true)) {
        $res = $mysqli->query('SELECT content_json FROM site_content LIMIT 1');
        $row = $res ? $res->fetch_assoc() : null;
        if ($row && !empty($row['content_json'])) {
            $decoded = json_decode((string) $row['content_json'], true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $merged = $decoded;
            }
        }
    }

    if ($merged) {
        if (isset($merged['main']) && is_array($merged['main'])) {
            $merged = $merged['main'];
        }
        $payload = json_encode($merged, JSON_UNESCAPED_UNICODE);
        $mysqli->query('DELETE FROM site_content');
        $stmt = $mysqli->prepare('INSERT INTO site_content (id, payload) VALUES (1, ?)');
        $stmt->bind_param('s', $payload);
        $stmt->execute();
        echo 'migrated legacy content rows: ' . count($merged) . " keys\n";
    } else {
        echo "no legacy content to migrate\n";
    }

    foreach (['content_key', 'content_json', 'created_at'] as $drop) {
        if (in_array($drop, $cols, true)) {
            $mysqli->query("ALTER TABLE site_content DROP COLUMN `$drop`");
            echo "dropped $drop\n";
        }
    }
}

$res = $mysqli->query('SELECT COUNT(*) AS c FROM site_content WHERE id = 1');
$count = (int) ($res->fetch_assoc()['c'] ?? 0);
if ($count === 0) {
    $default = json_encode(new stdClass(), JSON_UNESCAPED_UNICODE);
    $stmt = $mysqli->prepare('INSERT INTO site_content (id, payload) VALUES (1, ?)');
    $stmt->bind_param('s', $default);
    $stmt->execute();
    echo "seeded empty site_content row\n";
}

$mysqli->query('ALTER TABLE site_content MODIFY payload JSON NOT NULL');
$mysqli->query('DELETE FROM site_content WHERE id <> 1');

echo "migration: done\n";
