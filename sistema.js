const form = document.getElementById('pedidoForm');
const lista = document.getElementById('listaPedidos');

// Função para carregar pedidos do localStorage
function carregarPedidos() {
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
    detalhesDiv.textContent = `Pedido: ${pedido.nomePedido}, Valor: R$ ${pedido.valor}, Pagamento: ${pedido.formaPagamento}, Troco: ${pedido.troco}, Status: ${pedido.statusPedido}.`;

    const btnAlterarStatus = document.createElement('button');
    btnAlterarStatus.textContent = 'Alterar Status';
    btnAlterarStatus.onclick = () => {
        pedido.statusPedido = pedido.statusPedido === 'Cozinha' ? 'Entrega' : 'Cozinha';
        detalhesDiv.textContent = `Pedido: ${pedido.nomePedido}, Valor: R$ ${pedido.valor}, Pagamento: ${pedido.formaPagamento}, Troco: ${pedido.troco}, Status: ${pedido.statusPedido}.`;
    };

    btnVerMais.onclick = () => {
        detalhesDiv.style.display = detalhesDiv.style.display === 'none' ? 'block' : 'none';
        if (detalhesDiv.style.display === 'block') {
            detalhesDiv.appendChild(btnAlterarStatus);
        } else {
            detalhesDiv.removeChild(btnAlterarStatus);
        }
    };

    const btnRemover = document.createElement('button');
    btnRemover.textContent = 'Remover';
    btnRemover.onclick = () => {
        lista.removeChild(li);
        removerPedido(pedido.nomeCliente); // Remover do localStorage
    };

    li.appendChild(btnVerMais);
    li.appendChild(btnRemover);
    lista.appendChild(li);
    lista.appendChild(detalhesDiv);
    detalhesDiv.style.display = 'none'; // Começa oculto
}

// Função para remover pedido do localStorage
function removerPedido(nomeCliente) {
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    const novosPedidos = pedidos.filter(pedido => pedido.nomeCliente !== nomeCliente);
    localStorage.setItem('pedidos', JSON.stringify(novosPedidos));
}

// Evento para adicionar pedido
form.addEventListener('submit', function(event) {
    event.preventDefault();
    const nomeCliente = document.getElementById('nomeCliente').value;
    const nomePedido = document.getElementById('nomePedido').value;
    const valor = document.getElementById('valor').value;
    const formaPagamento = document.getElementById('Forma').value;
    const troco = document.getElementById('Troco').value;
    const statusPedido = document.getElementById('statusPedido').value;

    const novoPedido = {
        nomeCliente,
        nomePedido,
        valor,
        formaPagamento,
        troco,
        statusPedido
    };

    // Adicionar pedido à lista e ao localStorage
    adicionarPedido(novoPedido);
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    pedidos.push(novoPedido);
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    
    form.reset();
});

// Carregar pedidos ao iniciar a página
carregarPedidos();
