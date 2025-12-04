<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';

// --- Recibir datos del formulario ---
$tipo      = $_POST['tipo'] ?? '';
$nombre    = $_POST['nombre'] ?? '';
$dni       = $_POST['dni'] ?? '';
$email     = $_POST['email'] ?? '';
$telefono  = $_POST['telefono'] ?? '';
$asunto    = $_POST['asunto'] ?? '';
$fecha     = $_POST['fecha'] ?? '';
$hora      = $_POST['hora'] ?? '';
$distrito  = $_POST['distrito'] ?? '';
$zona      = $_POST['zona'] ?? '';

// --- Preparar contenido del correo ---
$mensaje = '
<div style="max-width:600px; margin:0 auto; padding:20px; 
            border:1px solid #e0e0e0; border-radius:10px; 
            background:#fafafa; font-family:Arial, sans-serif;">

    <h2 style="text-align:center; color:#333; margin-bottom:20px;">
        Nueva cita agendada - ' . strtoupper($tipo) . '
    </h2>

    <p style="font-size:14px; color:#555;">
        <strong style="color:#000;">Nombre:</strong> '. $nombre .'<br>
        <strong style="color:#000;">DNI:</strong> '. $dni .'<br>
        <strong style="color:#000;">Correo:</strong> '. $email .'<br>
        <strong style="color:#000;">Teléfono:</strong> '. $telefono .'<br>
        <strong style="color:#000;">Asunto:</strong> '. $asunto .'<br>
    </p>

    <hr style="border:0; border-top:1px solid #ddd; margin:20px 0;">

    <p style="font-size:14px; color:#555;">
        <strong style="color:#000;">Fecha:</strong> '. $fecha .'<br>
        <strong style="color:#000;">Hora:</strong> '. $hora .'<br>
        <strong style="color:#000;">Distrito / Zona:</strong> '. ($tipo === "presencial" ? $distrito : $zona) .'
    </p>

    <div style="margin-top:30px; text-align:center; font-size:12px; color:#777;">
        Sistema automático de citas • No responder este correo
    </div>
</div>
';


// --- Configurar correo ---
$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com'; 
    $mail->SMTPAuth   = true;
    $mail->Username   = 'josejonathaneleuteriolinan@gmail.com';
    $mail->Password   = 'ffhnouoptwxrtrjh'; 
    $mail->SMTPSecure = 'ssl';
    $mail->Port       = 465;

    $mail->setFrom('josejonathaneleuteriolinan@gmail.com', 'Sistema de Citas');
    $mail->addAddress('josejonathaneleuteriolinan@gmail.com');

    $mail->isHTML(true);
    $mail->Subject = "Nueva cita agendada - $tipo";
    $mail->Body    = $mensaje;

    $mail->send();
    echo json_encode(["status" => "success"]);

} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $mail->ErrorInfo]);
}
