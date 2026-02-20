<?php
header('Content-Type: application/json');
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Método não permitido']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!is_array($input)) {
    echo json_encode(['status' => 'error', 'message' => 'Dados dos eventos não fornecidos ou formato inválido']);
    exit;
}

try {
    $publishedCount = 0;
    
    foreach ($input as $event) {
        // Insert into production table
        $insertStmt = $pdo->prepare("
            INSERT INTO events (local, endereco, bairro, link, dia, hora, genero, detalhes, artista, entrada) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $insertStmt->execute([
            $event['local'] ?? '',
            $event['endereco'] ?? '',
            $event['bairro'] ?? '',
            $event['link'] ?? '',
            $event['dia'] ?? null,
            $event['hora'] ?? null,
            $event['genero'] ?? '',
            $event['detalhes'] ?? '',
            $event['artista'] ?? '',
            $event['entrada'] ?? ''
        ]);
        
        // Update raw table
        $updateStmt = $pdo->prepare("
            UPDATE events_raw 
            SET status = 'REVIEWED', processed_at = NOW(), reviewed_at = NOW(), review_user = ? 
            WHERE id = ?
        ");
        $updateStmt->execute(['admin', $event['id']]); // In a real app, get current user
        
        $publishedCount++;
    }
    
    echo json_encode([
        'status' => 'success',
        'published_count' => $publishedCount,
        'message' => "$publishedCount eventos publicados com sucesso"
    ]);
} catch(Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>