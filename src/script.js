// Event Review System - Minimal Version
console.log("Sistema de Revisão de Eventos iniciado");

// Variável global para eventos atuais
let eventosAtuais = [];
// Lista de eventos aprovados
let eventosAprovados = [];

// Função para carregar eventos
async function carregarEventos() {
    console.log("Iniciando carregamento de eventos...");
    
    try {
        const response = await fetch('/api/get_pending_events.php');
        console.log("Resposta HTTP:", response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Dados recebidos:", data);
        
        eventosAtuais = data.events || [];
        // Mostrar eventos na página
        mostrarEventos(eventosAtuais);
        
    } catch (error) {
        console.error("Erro ao carregar eventos:", error);
        document.getElementById('eventCardsContainer').innerHTML = 
            '<p>Erro ao carregar eventos: ' + error.message + '</p>';
    }
}

// Função para mostrar eventos na página
function mostrarEventos(eventos) {
    const container = document.getElementById('eventCardsContainer');
    
    if (!eventos || eventos.length === 0) {
        container.innerHTML = '<p>Nenhum evento pendente encontrado.</p>';
        return;
    }
    
    container.innerHTML = '';
    
    eventos.forEach(evento => {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.innerHTML = `
            <div class="card-field">
                <label class="field-label"><strong>ID:</strong></label>
                <span class="field-value">${evento.id}</span>
            </div>
            <div class="card-field">
                <label class="field-label"><strong>Local:</strong></label>
                <input type="text" class="field-value editable" data-field="local" value="${evento.local || ''}">
            </div>
            <div class="card-field">
                <label class="field-label"><strong>Endereço:</strong></label>
                <input type="text" class="field-value editable" data-field="endereco" value="${evento.endereco || ''}">
            </div>
            <div class="card-field">
                <label class="field-label"><strong>Bairro:</strong></label>
                <input type="text" class="field-value editable" data-field="bairro" value="${evento.bairro || ''}">
            </div>
            <div class="card-field">
                <label class="field-label"><strong>Link:</strong></label>
                <input type="url" class="field-value editable" data-field="link" value="${evento.link || ''}">
            </div>
            <div class="card-field">
                <label class="field-label"><strong>Data:</strong></label>
                <input type="date" class="field-value editable" data-field="dia" value="${evento.dia || ''}">
            </div>
            <div class="card-field">
                <label class="field-label"><strong>Hora:</strong></label>
                <input type="time" class="field-value editable" data-field="hora" value="${evento.hora || ''}">
            </div>
            <div class="card-field">
                <label class="field-label"><strong>Gênero:</strong></label>
                <input type="text" class="field-value editable" data-field="genero" value="${evento.genero || ''}">
            </div>
            <div class="card-field">
                <label class="field-label"><strong>Detalhes:</strong></label>
                <textarea class="field-value editable" data-field="detalhes">${evento.detalhes || ''}</textarea>
            </div>
            <div class="card-field">
                <label class="field-label"><strong>Artista:</strong></label>
                <input type="text" class="field-value editable" data-field="artista" value="${evento.artista || ''}">
            </div>
            <div class="card-field">
                <label class="field-label"><strong>Entrada:</strong></label>
                <input type="text" class="field-value editable" data-field="entrada" value="${evento.entrada || ''}">
            </div>
            <div class="card-actions">
                <button class="btn-json" data-id="${evento.id}">Ver JSON</button>
                <button class="btn-approve" data-id="${evento.id}">Aprovar</button>
                <button class="btn-reject" data-id="${evento.id}">Rejeitar</button>
            </div>
        `;
        container.appendChild(card);
    });

    // Adicionar event listeners aos botões
    document.querySelectorAll('.btn-json').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const eventId = e.target.dataset.id;
            const evento = eventos.find(ev => ev.id == eventId);
            mostrarJsonModal(evento.raw_json);
        });
    });
    // Adicionar listeners para marcar modificações
    document.querySelectorAll('.field-value.editable').forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.classList.add('modified');
        });
    });
    document.querySelectorAll('.btn-approve').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const eventId = e.target.dataset.id;
            aprovarEvento(eventId);
        });
    });

    document.querySelectorAll('.btn-reject').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const eventId = e.target.dataset.id;
            rejeitarEvento(eventId);
        });
    });
}

// Função para mostrar modal com JSON
function mostrarJsonModal(rawJson) {
    const modal = document.getElementById('jsonModal');
    const content = document.getElementById('jsonContent');
    content.textContent = JSON.stringify(JSON.parse(rawJson), null, 2);
    modal.classList.remove('hidden');
    
    // Fechar modal
    document.querySelector('.close').addEventListener('click', () => {
        modal.classList.add('hidden');
    });
}

// Função para aprovar evento
function aprovarEvento(eventId) {
    const card = document.querySelector(`.btn-approve[data-id="${eventId}"]`).closest('.event-card');
    const editedEvent = { id: eventId };
    
    // Coletar valores dos campos editáveis
    card.querySelectorAll('.field-value.editable').forEach(input => {
        const field = input.dataset.field;
        editedEvent[field] = input.value;
    });
    
    if (!eventosAprovados.find(ev => ev.id == eventId)) {
        eventosAprovados.push(editedEvent);
        card.classList.add('approved');
    }
}

// Função para rejeitar evento
async function rejeitarEvento(eventId) {
    if (confirm('Tem certeza que deseja rejeitar este evento?')) {
        try {
            const response = await fetch('/api/reject_event.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: eventId })
            });
            const data = await response.json();
            if (data.status === 'success') {
                alert('Evento rejeitado com sucesso');
                carregarEventos(); // Recarregar lista
            } else {
                alert('Erro: ' + data.message);
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao rejeitar evento');
        }
    }
}

// Função para publicar todos aprovados
async function publicarTodosAprovados() {
    if (eventosAprovados.length === 0) {
        alert('Nenhum evento aprovado para publicar');
        return;
    }
    if (confirm(`Publicar ${eventosAprovados.length} eventos?`)) {
        try {
            const response = await fetch('/api/publish_events.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ events: eventosAprovados })
            });
            const data = await response.json();
            if (data.status === 'success') {
                alert(data.message);
                eventosAprovados = []; // Limpar lista
                carregarEventos(); // Recarregar
            } else {
                alert('Erro: ' + data.message);
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao publicar eventos');
        }
    }
}

// Iniciar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM carregado, iniciando sistema...");
    carregarEventos();

    // Event listener para publicar todos
    document.getElementById('publishAllBtn').addEventListener('click', publicarTodosAprovados);
});