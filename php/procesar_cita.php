<?php
header('Content-Type: application/json');

$datos = $_POST;

ob_start();
$_POST = $datos; 
include "guardarCita.php";
$respuestaGuardar = ob_get_clean();


$res = json_decode($respuestaGuardar, true);


if ($res["status"] !== "success") {
    echo json_encode($res);
    exit;
}

ob_start();
$_POST = $datos;
include "enviarCorreo.php";
$respuestaCorreo = ob_get_clean();

$resCorreo = json_decode($respuestaCorreo, true);

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
