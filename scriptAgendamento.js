
document.addEventListener('DOMContentLoaded', function() {
    // Configurar data mínima como hoje
    const dataInput = document.getElementById('data');
    const hoje = new Date().toISOString().split('T')[0];
    dataInput.min = hoje;
    
    // Seleção de serviços
    const servicoOptions = document.querySelectorAll('.servico-option');
    const servicoInput = document.getElementById('servico');
    const precoServicoInput = document.getElementById('preco-servico');
    
    servicoOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remover seleção anterior
            servicoOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Adicionar seleção atual
            this.classList.add('selected');
            
            // Atualizar inputs hidden
            servicoInput.value = this.getAttribute('data-servico');
            precoServicoInput.value = this.getAttribute('data-preco');
            
            // Habilitar botão de confirmação se todos os campos obrigatórios estiverem preenchidos
            verificarCampos();
        });
    });
    
    // Gerar horários disponíveis
    function gerarHorarios() {
        const horariosContainer = document.getElementById('horarios-container');
        horariosContainer.innerHTML = '';
        
        const horarios = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
        
        horarios.forEach(horario => {
            const horarioOption = document.createElement('div');
            horarioOption.className = 'horario-option';
            horarioOption.textContent = horario;
            
            // Simular alguns horários indisponíveis
            if (Math.random() < 0.3) {
                horarioOption.classList.add('disabled');
            } else {
                horarioOption.addEventListener('click', function() {
                    // Remover seleção anterior
                    document.querySelectorAll('.horario-option:not(.disabled)').forEach(opt => {
                        opt.classList.remove('selected');
                    });
                    
                    // Adicionar seleção atual
                    this.classList.add('selected');
                    
                    // Atualizar input hidden
                    document.getElementById('horario').value = horario;
                    
                    // Habilitar botão de confirmação se todos os campos obrigatórios estiverem preenchidos
                    verificarCampos();
                });
            }
            
            horariosContainer.appendChild(horarioOption);
        });
    }
    
    // Gerar horários quando a página carregar
    gerarHorarios();
    
    // Gerar novos horários quando a data for alterada
    dataInput.addEventListener('change', function() {
        gerarHorarios();
        document.getElementById('horario').value = '';
        verificarCampos();
    });
    
    // Verificar se todos os campos obrigatórios estão preenchidos
    function verificarCampos() {
        const servicoSelecionado = servicoInput.value !== '';
        const dataSelecionada = dataInput.value !== '';
        const horarioSelecionado = document.getElementById('horario').value !== '';
        const nomePreenchido = document.getElementById('nome').value !== '';
        const telefonePreenchido = document.getElementById('telefone').value !== '';
        const emailPreenchido = document.getElementById('email').value !== '';
        
        const todosPreenchidos = servicoSelecionado && dataSelecionada && horarioSelecionado && 
                                nomePreenchido && telefonePreenchido && emailPreenchido;
        
        document.getElementById('btn-confirmar').disabled = !todosPreenchidos;
    }
    
    // Adicionar event listeners para campos de texto
    document.getElementById('nome').addEventListener('input', verificarCampos);
    document.getElementById('telefone').addEventListener('input', verificarCampos);
    document.getElementById('email').addEventListener('input', verificarCampos);
    
    // Processar formulário de agendamento
    document.getElementById('form-agendamento').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obter valores do formulário
        const servico = servicoInput.value;
        const data = dataInput.value;
        const horario = document.getElementById('horario').value;
        const nome = document.getElementById('nome').value;
        const telefone = document.getElementById('telefone').value;
        const email = document.getElementById('email').value;
        const observacoes = document.getElementById('observacoes').value;
        const preco = precoServicoInput.value;
        
        // Formatar data para exibição
        const dataObj = new Date(data);
        const dataFormatada = dataObj.toLocaleDateString('pt-BR');
        
        // Formatar preço para exibição
        const precoFormatado = `R$ ${parseFloat(preco).toFixed(2).replace('.', ',')}`;
        
        // Atualizar resumo
        document.getElementById('resumo-servico').textContent = document.querySelector('.servico-option.selected h4').textContent;
        document.getElementById('resumo-data').textContent = dataFormatada;
        document.getElementById('resumo-horario').textContent = horario;
        document.getElementById('resumo-valor').textContent = precoFormatado;
        
        // Esconder formulário e mostrar confirmação
        document.getElementById('form-agendamento').style.display = 'none';
        document.getElementById('confirmacao').style.display = 'block';
        
        // Aqui você normalmente enviaria os dados para um servidor
        console.log('Agendamento enviado:', {
            servico, data, horario, nome, telefone, email, observacoes, preco
        });
    });
    
    // Formatação do telefone
    document.getElementById('telefone').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 11) {
            value = value.substring(0, 11);
        }
        
        if (value.length <= 10) {
            value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else {
            value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
        }
        
        e.target.value = value;
    });

        // Fallback para caso as imagens não carreguem
    document.addEventListener('DOMContentLoaded', function() {
        const servicoImgs = document.querySelectorAll('.servico-img');
        
        servicoImgs.forEach(img => {
            // Verificar se a imagem carregou corretamente
            const backgroundImage = window.getComputedStyle(img).backgroundImage;
            const imageUrl = backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
            
            // Criar uma imagem para testar o carregamento
            const testImage = new Image();
            testImage.onerror = function() {
                // Se a imagem não carregar, aplicar fallback
                img.classList.add('fallback');
                
                // Adicionar ícone correspondente
                const serviceType = Array.from(img.classList).find(cls => 
                    cls !== 'servico-img' && cls !== 'fallback'
                );
                
                let iconClass = 'fas fa-question';
                switch(serviceType) {
                    case 'alongamento':
                        iconClass = 'fas fa-hand-sparkles';
                        break;
                    case 'manutencao':
                        iconClass = 'fas fa-tools';
                        break;
                    case 'fibra':
                        iconClass = 'fas fa-feather-alt';
                        break;
                    case 'banho-gel':
                        iconClass = 'fas fa-bath';
                        break;
                    case 'spa':
                        iconClass = 'fas fa-spa';
                        break;
                    case 'design':
                        iconClass = 'fas fa-palette';
                        break;
                }
                
                img.innerHTML = `<i class="${iconClass}"></i>`;
            };
            
            testImage.src = imageUrl;
        });
    });
});
