<?php
/**
 * Обробка форми підписки на розсилку новин
 */

// Встановлення заголовків
header('Content-Type: application/json; charset=utf-8');

// Дозволяємо CORS для AJAX запитів
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Перевірка методу запиту
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Метод не дозволений']);
    exit;
}

// Отримуємо дані з форми
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$privacy = isset($_POST['privacy']) ? $_POST['privacy'] : '';

// Валідація email
$errors = [];

if (empty($email)) {
    $errors[] = 'Введіть email адресу';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Введіть коректну email адресу';
}

// Перевіряємо згоду з політикою конфіденційності (якщо є)
if (!empty($privacy) && !$privacy) {
    $errors[] = 'Необхідно погодитися з політикою конфіденційності';
}

// Якщо є помилки, повертаємо їх
if (!empty($errors)) {
    echo json_encode([
        'success' => false,
        'message' => 'Помилки валідації',
        'errors' => $errors
    ]);
    exit;
}

// Файл для збереження підписок
$data_file = 'data/subscribers.json';

// Створюємо директорію якщо її немає
if (!file_exists('data')) {
    mkdir('data', 0755, true);
}

// Читаємо існуючі підписки
$existing_data = [];
if (file_exists($data_file)) {
    $existing_data = json_decode(file_get_contents($data_file), true) ?: [];
}

// Перевіряємо чи вже є така email адреса
foreach ($existing_data as $subscriber) {
    if ($subscriber['email'] === $email) {
        echo json_encode([
            'success' => false,
            'message' => 'Ця email адреса вже підписана на розсилку'
        ]);
        exit;
    }
}

// Підготовка даних для збереження
$subscriber_data = [
    'id' => uniqid(),
    'email' => $email,
    'subscribed_at' => date('Y-m-d H:i:s'),
    'status' => 'active',
    'source' => $_SERVER['HTTP_REFERER'] ?? 'unknown'
];

// Додаємо нові дані
$existing_data[] = $subscriber_data;

// Зберігаємо дані
if (file_put_contents($data_file, json_encode($existing_data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
    
    // Відправка привітального email
    $to = $email;
    $subject = 'Підписка на новини Nissan підтверджена';
    $message = "
Дякуємо за підписку на новини Nissan!

Тепер ви будете першими дізнаватися про:
- Нові моделі автомобілів
- Спеціальні пропозиції та знижки
- Новини компанії та події
- Ексклюзивні пропозиції для підписників

З повагою,
Команда Nissan

---
Якщо ви хочете відписатися від розсилки, зв'яжіться з нами: info@nissan.ua
";

    $headers = "From: Nissan <noreply@nissan.ua>\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    // Відправка повідомлення адміністратору
    $admin_subject = 'Нова підписка на новини Nissan';
    $admin_message = "Нова підписка на розсилку:

Email: $email
Дата: " . date('d.m.Y H:i') . "
Джерело: " . ($subscriber_data['source'] ?? 'Невідоме');

    // В реальному проекті налаштуйте SMTP
    @mail($to, $subject, $message, $headers);
    @mail('info@nissan.ua', $admin_subject, $admin_message, $headers);
    
    echo json_encode([
        'success' => true,
        'message' => 'Дякуємо! Ви успішно підписалися на новини Nissan. Перевірте вашу email скриньку.',
        'data' => [
            'email' => $email,
            'subscribed_at' => $subscriber_data['subscribed_at']
        ]
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Помилка збереження даних. Спробуйте ще раз.'
    ]);
}
?> 