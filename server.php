<?php
// Servidor simples para servir arquivos estáticos
if ($_SERVER['REQUEST_URI'] == '/') {
    readfile('src/index.html');
} elseif (preg_match('/\.(?:css|js|png|jpg|jpeg|gif|ico)$/', $_SERVER['REQUEST_URI'])) {
    $file = 'src' . $_SERVER['REQUEST_URI'];
    if (file_exists($file)) {
        $extension = pathinfo($file, PATHINFO_EXTENSION);
        $mime_types = [
            'css' => 'text/css',
            'js' => 'application/javascript',
            'png' => 'image/png',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'gif' => 'image/gif',
            'ico' => 'image/x-icon'
        ];
        
        if (isset($mime_types[$extension])) {
            header('Content-Type: ' . $mime_types[$extension]);
        }
        readfile($file);
    } else {
        http_response_code(404);
        echo "Arquivo não encontrado";
    }
} else {
    http_response_code(404);
    echo "Página não encontrada";
}
?>