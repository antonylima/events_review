<?php
header('Content-Type: application/json');
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Método não permitido']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['id'])) {
    echo json_encode(['status' => 'error', 'message' => 'ID do evento não fornecido']);
    exit;
}

$eventId = $input['id'];

try {
    $stmt = $pdo->prepare("UPDATE events_raw SET status = 'REJECTED', reviewed_at = NOW(), review_user = ? WHERE id = ?");
    $stmt->execute(['admin', $eventId]); // In a real app, get current user
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Evento rejeitado com sucesso'
    ]);
} catch(Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>