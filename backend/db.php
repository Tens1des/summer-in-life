<?php
require_once __DIR__ . '/config.php';

function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $dsn = sprintf(
        'mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4',
        DB_HOST,
        DB_PORT,
        DB_NAME
    );

    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    ensure_schema($pdo);
    return $pdo;
}

function ensure_schema(PDO $pdo): void
{
    static $done = false;
    if ($done) {
        return;
    }

    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS stories (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            lat DECIMAL(10,7) NOT NULL,
            lng DECIMAL(10,7) NOT NULL,
            comment VARCHAR(300) NOT NULL,
            place VARCHAR(160) NULL DEFAULT NULL,
            allow_ads TINYINT(1) NOT NULL DEFAULT 0,
            status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            reviewed_at TIMESTAMP NULL DEFAULT NULL,
            PRIMARY KEY (id),
            INDEX idx_stories_status_created (status, created_at),
            INDEX idx_stories_coords (lat, lng)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );

    // Миграция таблиц, созданных до появления полей place / allow_ads.
    $columns = array_column($pdo->query('SHOW COLUMNS FROM stories')->fetchAll(), 'Field');
    if (!in_array('place', $columns, true)) {
        $pdo->exec('ALTER TABLE stories ADD COLUMN place VARCHAR(160) NULL DEFAULT NULL AFTER comment');
    }
    if (!in_array('allow_ads', $columns, true)) {
        $pdo->exec('ALTER TABLE stories ADD COLUMN allow_ads TINYINT(1) NOT NULL DEFAULT 0 AFTER place');
    }

    $done = true;
}
