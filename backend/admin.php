<?php
require_once __DIR__ . '/db.php';

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

function h(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function csrf_token(): string
{
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(24));
    }
    return $_SESSION['csrf_token'];
}

function is_logged_in(): bool
{
    return !empty($_SESSION['moderator_logged_in']);
}

$error = '';

if (isset($_GET['logout'])) {
    $_SESSION = [];
    session_destroy();
    header('Location: admin.php');
    exit;
}

if (!is_logged_in() && $_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login_password'])) {
    if (ADMIN_PASSWORD === 'CHANGE_ME_ADMIN_PASSWORD') {
        $error = 'Сначала задайте ADMIN_PASSWORD в config.php.';
    } else {
        $password = (string)$_POST['login_password'];
        if (hash_equals((string)ADMIN_PASSWORD, $password)) {
            session_regenerate_id(true);
            $_SESSION['moderator_logged_in'] = true;
            csrf_token();
            header('Location: admin.php');
            exit;
        }
        $error = 'Неверный пароль.';
    }
}

if (!is_logged_in()) {
    $passwordNotConfigured = ADMIN_PASSWORD === 'CHANGE_ME_ADMIN_PASSWORD';
    ?>
    <!doctype html>
    <html lang="ru">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Модерация — Лучшее лето в жизни</title>
        <style>
            body{margin:0;background:#f5f3ed;color:#171713;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
            .wrap{min-height:100vh;display:grid;place-items:center;padding:24px}.card{width:min(420px,100%);background:#fffefa;border-radius:22px;padding:28px;box-shadow:0 20px 60px rgba(38,42,31,.14)}h1{margin:0 0 8px;font-family:Georgia,"Times New Roman",serif;font-size:32px}.muted{color:#686a63;line-height:1.45}.field{margin-top:18px}label{display:block;font-size:13px;font-weight:700;margin-bottom:7px}input{width:100%;box-sizing:border-box;padding:13px 14px;border:1px solid #d6d5cd;border-radius:12px;font-size:16px}button{width:100%;margin-top:14px;border:0;border-radius:999px;padding:13px 18px;background:#14745d;color:#fff;font-weight:800;cursor:pointer}.error{margin-top:12px;color:#9b2c21;background:#fff0ee;border-radius:10px;padding:10px 12px;font-size:13px}
        </style>
    </head>
    <body><div class="wrap"><form class="card" method="post"><h1>Премодерация</h1><div class="muted">Войдите, чтобы одобрять или отклонять истории перед публикацией на карте.</div><?php if ($passwordNotConfigured): ?><div class="error">Сначала задайте ADMIN_PASSWORD в config.php.</div><?php endif; ?><div class="field"><label for="password">Пароль модератора</label><input id="password" type="password" name="login_password" required autofocus <?= $passwordNotConfigured ? 'disabled' : '' ?>></div><?php if ($error): ?><div class="error"><?= h($error) ?></div><?php endif; ?><button type="submit" <?= $passwordNotConfigured ? 'disabled' : '' ?>>Войти</button></form></div></body></html>
    <?php
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['story_id'], $_POST['action'])) {
    if (!hash_equals((string)($_SESSION['csrf_token'] ?? ''), (string)($_POST['csrf_token'] ?? ''))) {
        http_response_code(403);
        exit('CSRF validation failed');
    }

    $storyId = filter_var($_POST['story_id'], FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
    $action = (string)$_POST['action'];
    $status = $action === 'approve' ? 'approved' : ($action === 'reject' ? 'rejected' : null);

    if ($storyId && $status) {
        $stmt = db()->prepare(
            "UPDATE stories
             SET status = :status, reviewed_at = CURRENT_TIMESTAMP
             WHERE id = :id AND status = 'pending'"
        );
        $stmt->execute([':status' => $status, ':id' => $storyId]);
    }

    header('Location: admin.php');
    exit;
}

$pdo = db();
$pending = $pdo->query(
    "SELECT id, lat, lng, comment, place, allow_ads, author_name, phone, email, created_at
     FROM stories
     WHERE status = 'pending'
     ORDER BY created_at ASC"
)->fetchAll();

$counts = ['pending' => 0, 'approved' => 0, 'rejected' => 0];
foreach ($pdo->query("SELECT status, COUNT(*) AS cnt FROM stories GROUP BY status")->fetchAll() as $row) {
    $counts[$row['status']] = (int)$row['cnt'];
}

$csrf = csrf_token();
?>
<!doctype html>
<html lang="ru">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Модерация — Лучшее лето в жизни</title>
    <style>
        :root{--paper:#f5f3ed;--ink:#171713;--green:#14745d;--green-dark:#0d5b48;--red:#a43b31;--muted:#686a63;--line:#dfddd4}
        *{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.page{width:min(1100px,calc(100% - 32px));margin:28px auto 60px}.top{display:flex;gap:16px;align-items:flex-end;justify-content:space-between;flex-wrap:wrap}.eyebrow{color:var(--green);font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}h1{margin:5px 0 0;font-family:Georgia,"Times New Roman",serif;font-size:clamp(30px,4vw,48px);line-height:1}.logout{color:var(--green-dark);font-weight:700;text-decoration:none}.stats{display:flex;gap:10px;flex-wrap:wrap;margin:22px 0}.stat{background:#fffefa;border:1px solid var(--line);border-radius:999px;padding:9px 13px;font-size:13px}.stat b{margin-left:4px}.empty{margin-top:20px;background:#fffefa;border:1px solid var(--line);border-radius:18px;padding:24px;color:var(--muted)}.list{display:grid;gap:14px}.story{background:#fffefa;border:1px solid var(--line);border-radius:18px;padding:20px;box-shadow:0 8px 24px rgba(38,42,31,.06)}.meta{display:flex;gap:10px;flex-wrap:wrap;color:#777970;font-size:12px}.text{margin:13px 0 17px;font-size:17px;line-height:1.5;white-space:pre-wrap}.actions{display:flex;gap:9px;flex-wrap:wrap}.btn{border:0;border-radius:999px;padding:10px 15px;font-weight:800;cursor:pointer}.approve{background:var(--green);color:white}.approve:hover{background:var(--green-dark)}.reject{background:#f3e4e1;color:var(--red)}.coords{font-variant-numeric:tabular-nums}.maplink{color:var(--green-dark);text-decoration:none;font-weight:700}.contact{margin-top:8px;color:#454740;font-size:13px}
    </style>
</head>
<body>
<main class="page">
    <div class="top">
        <div><div class="eyebrow">Лучшее лето в жизни</div><h1>Премодерация историй</h1></div>
        <a class="logout" href="admin.php?logout=1">Выйти</a>
    </div>

    <div class="stats">
        <div class="stat">На проверке <b><?= $counts['pending'] ?></b></div>
        <div class="stat">Опубликовано <b><?= $counts['approved'] ?></b></div>
        <div class="stat">Отклонено <b><?= $counts['rejected'] ?></b></div>
    </div>

    <?php if (!$pending): ?>
        <div class="empty">Сейчас нет историй, ожидающих проверки.</div>
    <?php else: ?>
        <section class="list">
            <?php foreach ($pending as $story): ?>
                <article class="story">
                    <div class="meta">
                        <span>#<?= (int)$story['id'] ?></span>
                        <span><?= h((string)$story['created_at']) ?></span>
                        <?php if (!empty($story['place'])): ?><span><?= h((string)$story['place']) ?></span><?php endif; ?>
                        <span class="coords"><?= h((string)$story['lat']) ?>, <?= h((string)$story['lng']) ?></span>
                        <span><?= !empty($story['allow_ads']) ? 'Участие в конкурсе: да' : 'Участие в конкурсе: нет' ?></span>
                        <a class="maplink" href="https://www.openstreetmap.org/?mlat=<?= rawurlencode((string)$story['lat']) ?>&mlon=<?= rawurlencode((string)$story['lng']) ?>#map=15/<?= rawurlencode((string)$story['lat']) ?>/<?= rawurlencode((string)$story['lng']) ?>" target="_blank" rel="noopener">Открыть точку на карте</a>
                    </div>
                    <div class="meta contact">
                        <span><b>Имя:</b> <?= h((string)($story['author_name'] ?? '—')) ?></span>
                        <span><b>Телефон:</b> <?php if (!empty($story['phone'])): ?><a class="maplink" href="tel:<?= h(preg_replace('/[^\d+]/', '', (string)$story['phone'])) ?>"><?= h((string)$story['phone']) ?></a><?php else: ?>—<?php endif; ?></span>
                        <span><b>E-mail:</b> <?php if (!empty($story['email'])): ?><a class="maplink" href="mailto:<?= h((string)$story['email']) ?>"><?= h((string)$story['email']) ?></a><?php else: ?>—<?php endif; ?></span>
                    </div>
                    <div class="text"><?= nl2br(h((string)$story['comment'])) ?></div>
                    <form class="actions" method="post">
                        <input type="hidden" name="csrf_token" value="<?= h($csrf) ?>">
                        <input type="hidden" name="story_id" value="<?= (int)$story['id'] ?>">
                        <button class="btn approve" name="action" value="approve" type="submit">Опубликовать</button>
                        <button class="btn reject" name="action" value="reject" type="submit">Отклонить</button>
                    </form>
                </article>
            <?php endforeach; ?>
        </section>
    <?php endif; ?>
</main>
</body>
</html>
