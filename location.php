<?php
header("Access-Control-Allow-Origin: http://localhost:5500"); // ✅ Matches frontend port
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With");
header("Content-Type: application/json");

// Safely check if REQUEST_METHOD is defined before using it
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "flight_locations";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["error" => "❌ Database connection failed: " . $conn->connect_error]));
}

// Fetch locations
$sql = "SELECT country FROM locations";
$result = $conn->query($sql);

if (!$result) {
    die(json_encode(["error" => "❌ SQL query failed: " . $conn->error]));
}

// Fetch locations
$locations = [];
while ($row = $result->fetch_assoc()) {
    $locations[] = $row['country'];
}

// Ensure valid JSON output
echo json_encode(["locations" => $locations ?: ["error" => "No locations found"]]);

$conn->close();
?>