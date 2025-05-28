<?php
header("Content-Type: application/json");
$conn = new mysqli("localhost", "root", "LOVEme143", "flight_bookings", 4306);

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed"]));
}

$result = $conn->query("SELECT * FROM bookings ORDER BY id DESC LIMIT 1"); // Fetch latest booking

$bookings = [];
while ($row = $result->fetch_assoc()) {
    $bookings[] = $row;
}

echo json_encode($bookings);
$conn->close();
?>