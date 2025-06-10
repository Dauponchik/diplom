<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Метод не дозволений'
    ]);
    exit;
}

// Функція валідації
function validateInput($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

function validatePhone($phone) {
    return preg_match('/^[\+]?[0-9\(\)\-\s]{10,}$/', $phone);
}

function validateDate($date) {
    $dateTime = DateTime::createFromFormat('Y-m-d', $date);
    if (!$dateTime) return false;
    
    $today = new DateTime();
    $maxDate = (clone $today)->add(new DateInterval('P3M')); // +3 місяці
    
    return $dateTime > $today && $dateTime <= $maxDate;
}

// Отримуємо дані форми
$clientName = validateInput($_POST['client-name'] ?? '');
$clientPhone = validateInput($_POST['client-phone'] ?? '');
$carModel = validateInput($_POST['car-model'] ?? '');
$serviceType = validateInput($_POST['service-type'] ?? '');
$serviceDate = validateInput($_POST['service-date'] ?? '');
$serviceComment = validateInput($_POST['service-comment'] ?? '');
$privacy = isset($_POST['privacy']);

// Валідація
$errors = [];

if (empty($clientName) || strlen($clientName) < 2) {
    $errors[] = 'Введіть ваше ім\'я (мінімум 2 символи)';
}

if (empty($clientPhone) || !validatePhone($clientPhone)) {
    $errors[] = 'Введіть коректний номер телефону';
}

if (empty($carModel)) {
    $errors[] = 'Введіть марку та модель автомобіля';
}

if (empty($serviceType)) {
    $errors[] = 'Оберіть тип сервісу';
}

if (empty($serviceDate) || !validateDate($serviceDate)) {
    $errors[] = 'Оберіть коректну дату (не раніше завтра і не пізніше 3 місяців)';
}

if (!$privacy) {
    $errors[] = 'Необхідно погодитися з політикою конфіденційності';
}

if (!empty($errors)) {
    echo json_encode([
        'success' => false,
        'message' => 'Помилки валідації',
        'errors' => $errors
    ]);
    exit;
}

// Підготовка даних для збереження
$serviceRecord = [
    'id' => uniqid('service_', true),
    'client_name' => $clientName,
    'client_phone' => $clientPhone,
    'car_model' => $carModel,
    'service_type' => $serviceType,
    'service_date' => $serviceDate,
    'service_comment' => $serviceComment,
    'created_at' => date('Y-m-d H:i:s'),
    'ip_address' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
];

// Створюємо директорію якщо її немає
$dataDir = __DIR__ . '/data';
if (!file_exists($dataDir)) {
    mkdir($dataDir, 0755, true);
}

// Зберігаємо дані
$filename = $dataDir . '/service_records.json';
$records = [];

if (file_exists($filename)) {
    $content = file_get_contents($filename);
    $records = json_decode($content, true) ?: [];
}

$records[] = $serviceRecord;

if (file_put_contents($filename, json_encode($records, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
    
    // Відправка email (базова реалізація)
    $serviceTypes = [
        'maintenance' => 'Планове ТО',
        'repair' => 'Ремонт',
        'diagnostics' => 'Діагностика',
        'tire' => 'Шиномонтаж',
        'body' => 'Кузовні роботи',
        'other' => 'Інше'
    ];
    
    $serviceTypeName = $serviceTypes[$serviceType] ?? $serviceType;
    
    $emailSubject = "Новий запис на сервіс - {$serviceTypeName}";
    $emailBody = "
Новий запис на сервісне обслуговування:

Клієнт: {$clientName}
Телефон: {$clientPhone}
Автомобіль: {$carModel}
Тип сервісу: {$serviceTypeName}
Дата: {$serviceDate}
Коментар: {$serviceComment}

Дата подачі заявки: " . date('d.m.Y H:i');

    // Тут можна додати відправку email через mail() або SMTP
    // mail('service@nissan.ua', $emailSubject, $emailBody);
    
    echo json_encode([
        'success' => true,
        'message' => "Дякуємо за звернення!\n\nВаш запис на {$serviceTypeName} на {$serviceDate} прийнято.\n\nНаш менеджер зв'яжеться з вами найближчим часом для підтвердження.",
        'data' => [
            'id' => $serviceRecord['id'],
            'service_type' => $serviceTypeName,
            'date' => $serviceDate
        ]
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Помилка збереження даних. Спробуйте ще раз.'
    ]);
}
?> 