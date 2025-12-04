<?php
header('Content-Type: application/json');
include "conexion.php"; // archivo de conexión que crearemos luego

// --- Recibir datos ---
$tipo      = $_POST['tipo'] ?? '';
$nombre    = $_POST['nombre'] ?? '';
$dni       = $_POST['dni'] ?? '';
$email     = $_POST['email'] ?? '';
$telefono  = $_POST['telefono'] ?? '';
$asunto    = $_POST['asunto'] ?? '';
$fecha     = $_POST['fecha'] ?? '';
$hora      = $_POST['hora'] ?? '';
$distrito  = $_POST['distrito'] ?? null;
$zona      = $_POST['zona'] ?? null;

// --- Validación básica ---
if (empty($tipo) || empty($nombre) || empty($dni) || empty($email) ||
    empty($telefono) || empty($asunto) || empty($fecha) || empty($hora)) {
    
    echo json_encode(["status" => "error", "message" => "Faltan datos obligatorios"]);
    exit;
}

// --- Verificar si fecha + hora ya están ocupados ---
$query = "SELECT id FROM citas WHERE fecha = ? AND hora = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("ss", $fecha, $hora);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo json_encode(["status" => "ocupado", "message" => "El horario ya está reservado"]);
    exit;
}

// --- Insertar nueva cita ---
$insert = "INSERT INTO citas (tipo, nombre, dni, email, telefono, asunto, fecha, hora, distrito, zona)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt2 = $conn->prepare($insert);
$stmt2->bind_param("ssssssssss", $tipo, $nombre, $dni, $email, $telefono, $asunto, $fecha, $hora, $distrito, $zona);

if ($stmt2->execute()) {
    echo json_encode(["status" => "success", "id" => $stmt2->insert_id]);
} else {
    echo json_encode(["status" => "error", "message" => "No se pudo guardar la cita"]);
}
