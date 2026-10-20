<?php
/**
 * Карта «Лучшее лето в жизни» — OpenStreetMap + MySQL + премодерация.
 *
 * Перед запуском заполните доступы к MySQL и поменяйте пароль модератора.
 */

define('OSM_TILE_URL', getenv('OSM_TILE_URL') ?: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png');

// Стартовый вид карты — Москва.
define('MAP_DEFAULT_LAT', (float)(getenv('MAP_DEFAULT_LAT') ?: 55.751244));
define('MAP_DEFAULT_LNG', (float)(getenv('MAP_DEFAULT_LNG') ?: 37.618423));
define('MAP_DEFAULT_ZOOM', (int)(getenv('MAP_DEFAULT_ZOOM') ?: 10));

// MySQL. На обычном хостинге чаще всего DB_HOST = localhost.
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_PORT', (int)(getenv('DB_PORT') ?: 3306));
define('DB_NAME', getenv('DB_NAME') ?: 'ИМЯ_БАЗЫ');
define('DB_USER', getenv('DB_USER') ?: 'ПОЛЬЗОВАТЕЛЬ_БАЗЫ');
define('DB_PASS', getenv('DB_PASS') ?: 'ПАРОЛЬ_БАЗЫ');

// Пароль входа в /admin.php. Обязательно поменяйте перед публичным запуском.
define('ADMIN_PASSWORD', getenv('ADMIN_PASSWORD') ?: 'CHANGE_ME_ADMIN_PASSWORD');
