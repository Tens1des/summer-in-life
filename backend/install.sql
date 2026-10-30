CREATE TABLE IF NOT EXISTS stories (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    lat DECIMAL(10,7) NOT NULL,
    lng DECIMAL(10,7) NOT NULL,
    comment VARCHAR(300) NOT NULL,
    place VARCHAR(160) NULL DEFAULT NULL,
    allow_ads TINYINT(1) NOT NULL DEFAULT 0,
    consent_pd TINYINT(1) NOT NULL DEFAULT 0,
    author_name VARCHAR(80) NULL DEFAULT NULL,
    phone VARCHAR(24) NULL DEFAULT NULL,
    email VARCHAR(120) NULL DEFAULT NULL,
    status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    INDEX idx_stories_status_created (status, created_at),
    INDEX idx_stories_coords (lat, lng)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
