<?php
header('Content-Type: application/json');
require_once 'config.php';

try {
    $stmt = $pdo->prepare("SELECT * FROM events_raw WHERE status = 'PENDING' ORDER BY created_at DESC LIMIT 5");
    $stmt->execute();
    $events = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Log para debug
    error_log("Eventos encontrados: " . count($events));
    
    echo json_encode([
        'status' => 'success',
        'events' => $events
    ]);
} catch(Exception $e) {
    error_log("Erro: " . $e->getMessage());
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>