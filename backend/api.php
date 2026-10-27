<?php
require_once __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function response_json(array $payload, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $stmt = db()->query(
            "SELECT id, lat, lng, comment, place, created_at
             FROM stories
             WHERE status = 'approved'
             ORDER BY created_at ASC"
        );

        $markers = array_map(static function (array $row): array {
            return [
                'id' => (string)$row['id'],
                'lat' => (float)$row['lat'],
                'lng' => (float)$row['lng'],
                'comment' => $row['comment'],
                'place' => $row['place'],
                'created_at' => $row['created_at'],
            ];
        }, $stmt->fetchAll());

        response_json(['ok' => true, 'markers' => $markers]);
    }

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        response_json(['ok' => false, 'error' => 'Метод не поддерживается.'], 405);
    }

    $input = json_decode(file_get_contents('php://input') ?: '{}', true);
    if (!is_array($input)) {
        response_json(['ok' => false, 'error' => 'Некорректный JSON.'], 400);
    }

    $comment = trim((string)($input['comment'] ?? ''));
    $lng = filter_var($input['lng'] ?? null, FILTER_VALIDATE_FLOAT);
    $lat = filter_var($input['lat'] ?? null, FILTER_VALIDATE_FLOAT);
    $allowAds = !empty($input['allow_ads']) ? 1 : 0;
    $place = trim(preg_replace('/\s+/u', ' ', (string)($input['place'] ?? '')) ?? '');
    $place = function_exists('mb_substr') ? mb_substr($place, 0, 160, 'UTF-8') : substr($place, 0, 160);

    $cut = static function (string $value, int $max): string {
        $value = trim(preg_replace('/\s+/u', ' ', $value) ?? '');
        return function_exists('mb_substr') ? mb_substr($value, 0, $max, 'UTF-8') : substr($value, 0, $max);
    };
    $name = $cut((string)($input['name'] ?? ''), 80);
    $phone = $cut((string)($input['phone'] ?? ''), 24);
    $email = $cut((string)($input['email'] ?? ''), 120);
    $phoneDigits = preg_replace('/\D/', '', $phone) ?? '';

    if ((function_exists('mb_strlen') ? mb_strlen($name, 'UTF-8') : strlen($name)) < 2) {
        response_json(['ok' => false, 'error' => 'Укажите имя.'], 422);
    }
    if (!preg_match('/^[\d\s()+-]+$/', $phone) || strlen($phoneDigits) < 10 || strlen($phoneDigits) > 15) {
        response_json(['ok' => false, 'error' => 'Укажите корректный телефон.'], 422);
    }
    if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
        response_json(['ok' => false, 'error' => 'Укажите корректный e-mail.'], 422);
    }

    if (empty($input['agree_rules'])) {
        response_json(['ok' => false, 'error' => 'Без согласия с правилами отправить не получится.'], 422);
    }

    if ($comment === '') {
        response_json(['ok' => false, 'error' => 'Напишите короткое воспоминание.'], 422);
    }

    $length = function_exists('mb_strlen') ? mb_strlen($comment, 'UTF-8') : strlen($comment);
    if ($length > 300) {
        response_json(['ok' => false, 'error' => 'Комментарий должен быть не длиннее 300 символов.'], 422);
    }

    if ($lng === false || $lat === false || $lng < -180 || $lng > 180 || $lat < -90 || $lat > 90) {
        response_json(['ok' => false, 'error' => 'Некорректные координаты.'], 422);
    }

    $stmt = db()->prepare(
        "INSERT INTO stories (lat, lng, comment, place, allow_ads, author_name, phone, email, status)
         VALUES (:lat, :lng, :comment, :place, :allow_ads, :author_name, :phone, :email, 'pending')"
    );
    $stmt->execute([
        ':lat' => round((float)$lat, 7),
        ':lng' => round((float)$lng, 7),
        ':comment' => $comment,
        ':place' => $place !== '' ? $place : null,
        ':allow_ads' => $allowAds,
        ':author_name' => $name,
        ':phone' => $phone,
        ':email' => $email,
    ]);

    response_json([
        'ok' => true,
        'id' => (string)db()->lastInsertId(),
        'status' => 'pending',
        'message' => 'Спасибо! Она появится на карте после проверки. Авторы самых интересных воспоминаний смогут принять участие в конкурсе и выиграть памятные подарки.'
    ], 201);
} catch (PDOException $e) {
    error_log('Database error: ' . $e->getMessage());
    response_json([
        'ok' => false,
        'error' => 'Сервис временно недоступен. Проверьте подключение к базе данных.'
    ], 500);
} catch (Throwable $e) {
    error_log('API error: ' . $e->getMessage());
    response_json(['ok' => false, 'error' => 'Не удалось обработать запрос.'], 500);
}
