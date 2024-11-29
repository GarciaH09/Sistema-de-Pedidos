const form = document.getElementById('pedidoForm');
const lista = document.getElementById('listaPedidos');
const socket = new WebSocket('ws://localhost:8080'); // URL do servidor WebSocket
const update_interval  = 25000; // 25 segundos

// Função para carregar pedidos do localStorage
function carregarPedidos() {
    lista.innerHTML = ''; // Limpar a lista antes de recarregar
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    pedidos.forEach(pedido => adicionarPedido(pedido));
}

// Função para adicionar um pedido à lista
function adicionarPedido(pedido) {
    const li = document.createElement('li');
    li.classList.add('pedido');
    li.textContent = pedido.nomeCliente;

    const btnVerMais = document.createElement('button');
    btnVerMais.textContent = 'Ver Mais';
    
    const detalhesDiv = document.createElement('div');
    detalhesDiv.classList.add('detalhes');
    detalhesDiv.textContent = formatarDetalhesPedido(pedido);
    
    const btnAlterarStatus = criarBotaoAlterarStatus(pedido, detalhesDiv);
    const btnRemover = criarBotaoRemover(pedido.nomeCliente, li);

    btnVerMais.onclick = () => {
        detalhesDiv.style.display = detalhesDiv.style.display === 'none' ? 'block' : 'none';
        if (detalhesDiv.style.display === 'block') {
            detalhesDiv.appendChild(btnAlterarStatus);
        } else {
            detalhesDiv.removeChild(btnAlterarStatus);
        }
    };

    li.appendChild(btnVerMais);
    li.appendChild(btnRemover);
    lista.appendChild(li);
    lista.appendChild(detalhesDiv);
    detalhesDiv.style.display = 'none'; // Começa oculto
}

// Formatação dos detalhes do pedido
function formatarDetalhesPedido(pedido) {
    return `Pedido: ${pedido.nomePedido}, Valor: R$ ${pedido.valor}, Pagamento: ${pedido.formaPagamento}, Troco: ${pedido.troco}, Endreço ${pedido.endereco},Status: ${pedido.statusPedido}.`;
}

// Função para criar o botão de alterar status
function criarBotaoAlterarStatus(pedido, detalhesDiv) {
    const btn = document.createElement('button');
    btn.textContent = 'Alterar Status';
    btn.onclick = () => {
        pedido.statusPedido = pedido.statusPedido === 'Cozinha' ? 'Entrega' : 'Cozinha';
        detalhesDiv.textContent = formatarDetalhesPedido(pedido);
        enviarAtualizacaoParaServidor(pedido); // Enviar a atualização via WebSocket
    };
    return btn;
}

// Função para criar o botão de remover pedido
function criarBotaoRemover(nomeCliente, li) {
    const btn = document.createElement('button');
    btn.textContent = 'Remover';
    btn.onclick = () => {
        lista.removeChild(li);
        removerPedido(nomeCliente); // Remover do localStorage
        enviarRemocaoParaServidor(nomeCliente); // Notificar o servidor sobre a remoção
    };
    return btn;
}

// Função para remover pedido do localStorage
function removerPedido(nomeCliente) {
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    const novosPedidos = pedidos.filter(pedido => pedido.nomeCliente !== nomeCliente);
    localStorage.setItem('pedidos', JSON.stringify(novosPedidos));
}

// Enviar atualização para o servidor via WebSocket
function enviarAtualizacaoParaServidor(pedido) {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ action: 'update', pedido }));
    }
}

// Enviar remoção para o servidor via WebSocket
function enviarRemocaoParaServidor(nomeCliente) {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ action: 'remove', nomeCliente }));
    }
}

// Evento para adicionar pedido
form.addEventListener('submit', function(event) {
    event.preventDefault();

    const nomeCliente = document.getElementById('nomeCliente').value.trim();
    const nomePedido = document.getElementById('nomePedido').value.trim();
    const valor = document.getElementById('valor').value.trim();
    const formaPagamento = document.getElementById('Forma').value;
    const troco = document.getElementById('Troco').value.trim();
    const statusPedido = document.getElementById('statusPedido').value;

    // Validação de entrada
    if (!nomeCliente || !nomePedido || !valor || isNaN(valor)) {
        alert('Por favor, preencha todos os campos corretamente.');
        return;
    }

    const novoPedido = {
        id: Date.now(), // Usar ID único
        nomeCliente,
        nomePedido,
        valor: parseFloat(valor).toFixed(2), // Garantir que valor é um número
        formaPagamento,
        troco,
        statusPedido
    };

    // Adicionar pedido à lista e ao localStorage
    adicionarPedido(novoPedido);
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    pedidos.push(novoPedido);
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    
    enviarAtualizacaoParaServidor(novoPedido); // Enviar o novo pedido via WebSocket

    form.reset();
});

// Configuração do WebSocket
socket.onopen = () => {
    console.log('Conexão com o servidor WebSocket estabelecida.');
};

// Atualizar pedidos a cada 25 segundos
const UPDATE_INTERVAL = 25000;
setInterval(carregarPedidos, UPDATE_INTERVAL);

// Carregar pedidos ao iniciar a página
carregarPedidos();
