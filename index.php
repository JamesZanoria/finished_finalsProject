<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);
header("Content-Type: application/json"); // Ensure output is always JSON

$conn = new mysqli("localhost", "root", "LOVEme143", "flight_bookings", 4306);


if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed"]));
}

$data["passenger_name"] = $data["passenger_name"] ?? "";

// Log incoming data for debugging
$logFile = "error.log";
$data = json_decode(file_get_contents("php://input"), true);
file_put_contents("debug.log", json_encode($data) . PHP_EOL, FILE_APPEND);

// Ensure all required fields exist
if (!isset($data["departure"], $data["destination"], $data["departureDate"], $data["returnDate"], $data["flightCode"])) {
    die(json_encode(["status" => "error", "message" => "Missing required fields", "received_data" => $data]));
}

// ✅ Fix: Properly handle `departureDate` formatting
$departureDateString = $data['departureDate'];
$returnDateString = $data['returnDate'];

// Convert the date string to 'YYYY-MM-DD'
$departureDate = DateTime::createFromFormat('d M Y', $departureDateString);
$returnDate = DateTime::createFromFormat('d M Y', $returnDateString);

// Ensure valid conversion
if (!$departureDate || !$returnDate) {
    die(json_encode(["status" => "error", "message" => "Invalid date format"]));
}

$formattedDepartureDate = $departureDate->format('Y-m-d');
$formattedReturnDate = $returnDate->format('Y-m-d');

// ✅ Fix: Properly bind converted date values
$stmt = $conn->prepare("INSERT INTO stored_bookings (departure, destination, departure_date, return_date, flight_code) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $data["departure"], $data["destination"], $formattedDepartureDate, $formattedReturnDate, $data["flightCode"]);

// Execute SQL statement and handle errors
if (!$stmt->execute()) {
    file_put_contents($logFile, "SQL Error: " . $stmt->error . PHP_EOL, FILE_APPEND);
    echo json_encode([
        "status" => "error",
        "message" => "Error storing booking",
        "sql_error" => $stmt->error
    ]);
} else {
    echo json_encode(["status" => "success", "message" => "Booking stored successfully"]);
}

$stmt->close();
$conn->close();
?>