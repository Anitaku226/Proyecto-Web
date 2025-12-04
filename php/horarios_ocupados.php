<?php
header("Content-Type: application/json");
require "conexion.php";

$fecha = $_GET["fecha"] ?? "";
$tipo = $_GET["tipo"] ?? "";

if ($fecha === "" || $tipo === "") {
    echo json_encode([]);
    exit;
}

$stmt = $conn->prepare("SELECT hora FROM citas WHERE fecha = ? AND tipo = ?");
$stmt->bind_param("ss", $fecha, $tipo);
$stmt->execute();
$result = $stmt->get_result();

$horas = [];
while ($row = $result->fetch_assoc()) {

    // Normalizar formato: "08:00:00" → "08:00"
    $hora = substr($row["hora"], 0, 5);
    $horas[] = $hora;
}

echo json_encode($horas);
