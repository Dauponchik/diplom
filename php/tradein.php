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

function validateYear($year) {
    $currentYear = (int)date('Y');
    return is_numeric($year) && $year >= 1950 && $year <= $currentYear;
}

function validateMileage($mileage) {
    return is_numeric($mileage) && $mileage >= 0 && $mileage <= 2000000; // до 2 млн км
}

// Отримуємо дані форми
$ownerName = validateInput($_POST['owner-name'] ?? '');
$ownerPhone = validateInput($_POST['owner-phone'] ?? '');
$carBrand = validateInput($_POST['car-brand'] ?? '');
$carModel = validateInput($_POST['car-model'] ?? '');
$carYear = validateInput($_POST['car-year'] ?? '');
$carMileage = validateInput($_POST['car-mileage'] ?? '');
$carEngine = validateInput($_POST['car-engine'] ?? '');
$carFuel = validateInput($_POST['car-fuel'] ?? '');
$carCondition = validateInput($_POST['car-condition'] ?? '');
$carDescription = validateInput($_POST['car-description'] ?? '');
$privacy = isset($_POST['privacy']);

// Валідація
$errors = [];

if (empty($ownerName) || strlen($ownerName) < 2) {
    $errors[] = 'Введіть ваше ім\'я (мінімум 2 символи)';
}

if (empty($ownerPhone) || !validatePhone($ownerPhone)) {
    $errors[] = 'Введіть коректний номер телефону';
}

if (empty($carBrand)) {
    $errors[] = 'Введіть марку автомобіля';
}

if (empty($carModel)) {
    $errors[] = 'Введіть модель автомобіля';
}

if (empty($carYear) || !validateYear($carYear)) {
    $errors[] = 'Введіть коректний рік випуску (1950-' . date('Y') . ')';
}

if (empty($carMileage) || !validateMileage($carMileage)) {
    $errors[] = 'Введіть коректний пробіг';
}

if (empty($carEngine)) {
    $errors[] = 'Введіть об\'єм двигуна';
}

if (empty($carFuel)) {
    $errors[] = 'Оберіть тип палива';
}

if (empty($carCondition)) {
    $errors[] = 'Оберіть технічний стан автомобіля';
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
$tradeinRecord = [
    'id' => uniqid('tradein_', true),
    'owner_name' => $ownerName,
    'owner_phone' => $ownerPhone,
    'car_brand' => $carBrand,
    'car_model' => $carModel,
    'car_year' => (int)$carYear,
    'car_mileage' => (int)$carMileage,
    'car_engine' => $carEngine,
    'car_fuel' => $carFuel,
    'car_condition' => $carCondition,
    'car_description' => $carDescription,
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
$filename = $dataDir . '/tradein_records.json';
$records = [];

if (file_exists($filename)) {
    $content = file_get_contents($filename);
    $records = json_decode($content, true) ?: [];
}

$records[] = $tradeinRecord;

if (file_put_contents($filename, json_encode($records, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
    
    // Підготовка даних для email
    $fuelTypes = [
        'petrol' => 'Бензин',
        'diesel' => 'Дизель',
        'gas' => 'Газ/Бензин',
        'hybrid' => 'Гібрид',
        'electric' => 'Електро'
    ];
    
    $conditions = [
        'excellent' => 'Відмінний',
        'good' => 'Добрий',
        'average' => 'Середній',
        'needs-repair' => 'Потребує ремонту'
    ];
    
    $fuelTypeName = $fuelTypes[$carFuel] ?? $carFuel;
    $conditionName = $conditions[$carCondition] ?? $carCondition;
    
    $emailSubject = "Нова заявка Trade-in - {$carBrand} {$carModel}";
    $emailBody = "
Нова заявка на оцінку автомобіля для Trade-in:

Власник: {$ownerName}
Телефон: {$ownerPhone}

Автомобіль:
Марка: {$carBrand}
Модель: {$carModel}
Рік випуску: {$carYear}
Пробіг: " . number_format($carMileage, 0, ',', ' ') . " км
Двигун: {$carEngine}
Паливо: {$fuelTypeName}
Стан: {$conditionName}

Додаткова інформація: {$carDescription}

Дата подачі заявки: " . date('d.m.Y H:i');

    // Тут можна додати відправку email через mail() або SMTP
    // mail('tradein@nissan.ua', $emailSubject, $emailBody);
    
    echo json_encode([
        'success' => true,
        'message' => "Дякуємо за вашу заявку!\n\nІнформація про ваш {$carBrand} {$carModel} {$carYear} року отримана.\n\nНаш експерт проведе оцінку та зв'яжеться з вами протягом 24 годин з попередньою вартістю.",
        'data' => [
            'id' => $tradeinRecord['id'],
            'car' => "{$carBrand} {$carModel} {$carYear}",
            'condition' => $conditionName
        ]
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Помилка збереження даних. Спробуйте ще раз.'
    ]);
}
?> 