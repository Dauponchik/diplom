<?php
/**
 * Обробка форми запису на тест-драйв
 */

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
$car_model = isset($_POST['car_model']) ? trim($_POST['car_model']) : '';
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$date = isset($_POST['date']) ? trim($_POST['date']) : '';

// Валідація даних
$errors = [];

if (empty($car_model)) {
    $errors[] = 'Оберіть модель автомобіля';
}

if (empty($name) || strlen($name) < 2) {
    $errors[] = 'Введіть коректне ім\'я (мінімум 2 символи)';
}

if (empty($phone) || !preg_match('/^[\+]?[0-9\(\)\-\s]{10,}$/', $phone)) {
    $errors[] = 'Введіть коректний номер телефону';
}

if (empty($date)) {
    $errors[] = 'Оберіть дату тест-драйву';
} else {
    $selected_date = new DateTime($date);
    $today = new DateTime();
    $max_date = new DateTime('+3 months');
    
    if ($selected_date < $today) {
        $errors[] = 'Дата не може бути в минулому';
    } elseif ($selected_date > $max_date) {
        $errors[] = 'Можна записатися максимум на 3 місяці вперед';
    }
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
$testdrive_data = [
    'id' => uniqid(),
    'car_model' => $car_model,
    'name' => $name,
    'phone' => $phone,
    'date' => $date,
    'created_at' => date('Y-m-d H:i:s'),
    'status' => 'new'
];

// Збереження в файл (в реальному проекті краще використовувати базу даних)
$data_file = 'data/testdrives.json';

// Створюємо директорію якщо її немає
if (!file_exists('data')) {
    mkdir('data', 0755, true);
}

// Читаємо існуючі дані
$existing_data = [];
if (file_exists($data_file)) {
    $existing_data = json_decode(file_get_contents($data_file), true) ?: [];
}

// Додаємо нові дані
$existing_data[] = $testdrive_data;

// Зберігаємо дані
if (file_put_contents($data_file, json_encode($existing_data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
    
    // Відправка email (опціонально)
    $to = 'info@nissan.ua';
    $subject = 'Новий запис на тест-драйв - ' . $car_model;
    $message = "
Новий запис на тест-драйв:

Модель: $car_model
Ім'я: $name  
Телефон: $phone
Дата: $date
Час подачі заявки: " . date('d.m.Y H:i');

    $headers = "From: noreply@nissan.ua\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    // В реальному проекті налаштуйте SMTP
    @mail($to, $subject, $message, $headers);
    
    echo json_encode([
        'success' => true,
        'message' => 'Дякуємо! Ваш запис на тест-драйв прийнятий. Наш менеджер зв\'яжеться з вами найближчим часом.',
        'data' => $testdrive_data
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Помилка збереження даних. Спробуйте ще раз.'
    ]);
}
?> 