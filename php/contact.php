<?php
header('Content-Type: application/json; charset=utf-8');

// Дозволяємо CORS для AJAX запитів
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Метод не дозволений']);
    exit;
}

// Отримуємо дані з форми
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';
$privacy = isset($_POST['privacy']) ? $_POST['privacy'] : '';

// Валідація даних
$errors = [];

if (empty($name) || strlen($name) < 2) {
    $errors[] = 'Введіть ваше ім\'я (мінімум 2 символи)';
}

if (empty($phone) || !preg_match('/^[\+]?[0-9\(\)\-\s]{10,}$/', $phone)) {
    $errors[] = 'Введіть коректний номер телефону';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Введіть коректну email адресу';
}

if (empty($message) || strlen($message) < 10) {
    $errors[] = 'Повідомлення має містити мінімум 10 символів';
}

if (!$privacy) {
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

// Підготовка даних для збереження
$contact_data = [
    'id' => uniqid(),
    'name' => $name,
    'phone' => $phone,
    'email' => $email,
    'message' => $message,
    'created_at' => date('Y-m-d H:i:s'),
    'status' => 'new',
    'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
];

// Файл для збереження звернень
$data_file = 'data/contacts.json';

// Створюємо директорію якщо її немає
if (!file_exists('data')) {
    mkdir('data', 0755, true);
}

// Читаємо існуючі звернення
$existing_data = [];
if (file_exists($data_file)) {
    $existing_data = json_decode(file_get_contents($data_file), true) ?: [];
}

// Додаємо нові дані
$existing_data[] = $contact_data;

// Зберігаємо дані
if (file_put_contents($data_file, json_encode($existing_data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
    
    // Відправка email клієнту
    $client_to = $email;
    $client_subject = 'Дякуємо за звернення до Nissan';
    $client_message = "
Шановний(а) $name!

Дякуємо за ваше звернення до автосалону Nissan.

Ваше повідомлення:
\"$message\"

Ми отримали ваш запит і наш менеджер зв'яжеться з вами найближчим часом за телефоном $phone або email $email.

Середній час відповіді: до 2 годин у робочі дні.

З повагою,
Команда Nissan
Телефон: +38 (050) 123-45-67
Email: info@nissan.ua

---
Дата звернення: " . date('d.m.Y H:i');

    // Відправка email адміністратору
    $admin_to = 'info@nissan.ua';
    $admin_subject = 'Нове звернення з сайту Nissan';
    $admin_message = "
НОВЕ ЗВЕРНЕННЯ З САЙТУ

Ім'я: $name
Телефон: $phone
Email: $email

Повідомлення:
$message

---
Додаткові дані:
IP адреса: " . ($contact_data['ip'] ?? 'невідома') . "
Браузер: " . substr(($contact_data['user_agent'] ?? 'невідомий'), 0, 100) . "
Дата: " . date('d.m.Y H:i:s') . "

---
Для відповіді клієнту використовуйте:
Телефон: $phone
Email: $email
";

    $headers = "From: Nissan <noreply@nissan.ua>\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    // В реальному проекті налаштуйте SMTP
    $client_mail_sent = @mail($client_to, $client_subject, $client_message, $headers);
    $admin_mail_sent = @mail($admin_to, $admin_subject, $admin_message, $headers);
    
    echo json_encode([
        'success' => true,
        'message' => 'Дякуємо за ваше звернення! Ми зв\'яжемося з вами найближчим часом.',
        'data' => [
            'id' => $contact_data['id'],
            'created_at' => $contact_data['created_at']
        ]
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Помилка збереження даних. Спробуйте ще раз.'
    ]);
}
?> 