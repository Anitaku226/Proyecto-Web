<?php
header('Content-Type: application/json');

// --- 1. Recibir los datos enviados por AJAX ---
$datos = $_POST;

// --- 2. Llamar a guardarCita.php (validación + guardar en BD) ---
ob_start();
$_POST = $datos; 
include "guardarCita.php";
$respuestaGuardar = ob_get_clean();

// Convertir a array
$res = json_decode($respuestaGuardar, true);

// Si el horario está ocupado o fallo al guardar, devolver error
if ($res["status"] !== "success") {
    echo json_encode($res);
    exit;
}

// --- 3. Si se guardó correctamente, mandar correo ---
ob_start();
$_POST = $datos;
include "enviarCorreo.php";
$respuestaCorreo = ob_get_clean();

// Decodificar el JSON del enviarCorreo
$resCorreo = json_decode($respuestaCorreo, true);

// --- 4. Respuesta final al front ---
if ($resCorreo["status"] === "success") {
    echo json_encode([
        "status" => "success",
        "message" => "Cita agendada y correo enviado correctamente"
    ]);
} else {
    echo json_encode([
        "status" => "warning",
        "message" => "Cita guardada, pero no se pudo enviar el correo",
        "correo_error" => $resCorreo["message"]
    ]);
}
?>
