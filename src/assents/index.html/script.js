// Função para preencher o endereço completo apartir de um CEP válido digitado.
// Foi utilizada a API 'Via-CEP'

function buscarEndereco() {
    const cep = document.getElementById('cep').value.replace(/\D/g, '');

    // IF adicionado para não exibir o alerta de erro, caso o usuário apague o CEP previamente digitado
    if (cep === "") {
        document.getElementById('endereco').value = "";
        document.getElementById('bairro').value = "";
        document.getElementById('cidade').value = "";
        document.getElementById('estado').value = "";
    } else if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => {
                if (!response.ok) { 
                    throw new Error('Erro na requisição. Verifique sua conexão com a internet.'); // Verifica a resposta do HTTP está correta (status 200-209)
                }
                return response.json();
            })
            .then(data => { 
                if (data.erro) {
                    alert('CEP não encontrado, verifique se foi digitado corretamente!'); // Avisa caso haja algum erro de digitação no CEP
                } else {
                    document.getElementById('endereco').value = data.logradouro;
                    document.getElementById('bairro').value = data.bairro;
                    document.getElementById('cidade').value = data.localidade;
                    document.getElementById('estado').value = data.uf;

                    // Verifica se os campos de bairro e endereço foram preenchido
                    // Se não forem, remove o atributo 'ready only' para o usuário preencher 
                    if (data.bairro === "" || data.logradouro === "") {
                        document.getElementById('endereco').removeAttribute('readonly');
                        document.getElementById('bairro').removeAttribute('readonly');
                    }
                }
            })
            .catch(error => { //Caso o servidor da API ViaCEP caia
                console.error('Erro ao buscar CEP:', error);
                alert('Ocorreu um erro ao buscar o CEP. Por favor, tente novamente.');
            });

    } else {
        alert('CEP inválido'); //Caso o CEP NÃO seja vazio e possuir menos que 8 caracteres numericos
    }
}
// Função para calcular o valor total e ser preenchido automaticamente sem possibilitar edição do usuário
// (Produto - 1)

let timeoutId; // Variável para armazenar o ID do timeout

function calcularValorTotal() {
    clearTimeout(timeoutId); // Limpa o timeout anterior, se houver

    timeoutId = setTimeout(() => {
        const quantidadeEmEstoque = document.getElementById('estoque').value;
        const valorUnitario = document.getElementById('valor-unidade').value;
        const valorTotalField = document.getElementById('valor-total');

        // Se ambos os campos estiverem vazios, limpar o valor total
        if (!quantidadeEmEstoque && !valorUnitario) {
            valorTotalField.value = '';
            valorTotalField.readOnly = true;
            return;
        }

        // If adicionado para verificar se os valores inseridos são númericos ou não
        if (isNaN(quantidadeEmEstoque) || isNaN(valorUnitario)) {
            valorTotalField.value = 'Erro ao calcular, insira valores validos'; // Exibe mensagem de erro
            valorTotalField.readOnly = true;
            return;
        }

        // Constante que recebe o valor da multiplicacao entre os campos qntd estoque e valor unitario
        const valorTotal = (parseFloat(quantidadeEmEstoque) * parseFloat(valorUnitario)).toFixed(2);

        // Recebe o valor da constante anterior e preenche o campo, bloqueando edição
        valorTotalField.value = valorTotal;
        valorTotalField.readOnly = true;
    }, 300); // Tento de excução da função, após 0.3 ms de inatividade do usuário
}
// Função para adicionar ouvintes de eventos
function adicionarOuvintesDeEventos() {
    const campos = ['estoque', 'valor-unidade'];
    campos.forEach(campo => {
        document.getElementById(campo).addEventListener('input', calcularValorTotal);
    });
}

// Função para calcular o valor total e ser preenchido automaticamente sem possibilitar edição do usuário
// (Produto - 2)
// Possui as mesmas propriedades da função anterior, por isso não estará devidamente comentada.
let timeoutId1; 
function calcularValorTotal1() {
    clearTimeout(timeoutId1);

    timeoutId = setTimeout(() => {
        const quantidadeEmEstoque1 = document.getElementById('estoque1').value;
        const valorUnitario1 = document.getElementById('valor-unidade1').value;
        const valorTotalField1 = document.getElementById('valor-total1');

        if (!quantidadeEmEstoque1 && !valorUnitario1) {
            valorTotalField1.value = ''; 
            valorTotalField1.readOnly = true;
            return;
        }

        if (isNaN(quantidadeEmEstoque1) || isNaN(valorUnitario1)) {
            valorTotalField1.value = 'Erro ao calcular';
            valorTotalField1.readOnly = true;
            return;
        }

        const valorTotal = (parseFloat(quantidadeEmEstoque1) * parseFloat(valorUnitario1)).toFixed(2);

       
        valorTotalField1.value = valorTotal;
        valorTotalField1.readOnly = true;
    }, 300);
}

function adicionarOuvintesDeEventos1() {
    const campos = ['estoque1', 'valor-unidade1'];
    campos.forEach(campo => {
        document.getElementById(campo).addEventListener('input', calcularValorTotal1);
    });
}

document.addEventListener('DOMContentLoaded', adicionarOuvintesDeEventos1);
 

// Função para adicionar e/ou remover produto
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar e esconder modal
        document.getElementById('btn-adicionar-produto').onclick = function() {
        document.getElementById('modal-produto').style.display = 'block';
    };

    document.querySelector('.close').onclick = function() {
        document.getElementById('modal-produto').style.display = 'none';
    };

    // Salvar produto
    document.getElementById('btn-salvar').onclick = function() {
        const produto = document.getElementById('produto').value;
        const undMedida = document.getElementById('und-medida').value;
        const estoque = parseFloat(document.getElementById('estoque').value);
        const valorUnidade = parseFloat(document.getElementById('valor-unidade').value);
        const valorTotal = (estoque * valorUnidade).toFixed(2);

        if (produto && undMedida && !isNaN(estoque) && !isNaN(valorUnidade)) {
            // Adicionar o novo produto 
            const tabelaProdutos = document.getElementById('tabela-produtos');
            const newRow = document.createElement('div');
            newRow.classList.add('row');
            newRow.innerHTML = `
                <div class="col-md-1 product-icon thrash-icon">
                    <img src="img/flaticon-trash.png" class="trash-icon" alt="Lixeira">
                </div>
                <div class="col-md-11">
                    <div class="conteiner product">
                        <div class="panel-heading">Produto - ${produto}</div>
                        <form>
                            <div class="row">
                                <div class="col-md-2 product-icon product">
                                    <img src="img/flaticon-product.png" class="pacote" alt="pacote-imagem">
                                </div>
                                <div class="col-md-10">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <h4 class="form-label-text">Produto</h4>
                                            <input type="text" name="produto" value="${produto}" class="form-control" readonly>
                                        </div>
                                    </div>
                                    <div class="form-row">
                                        <label class="form-group col-md-3">
                                            <h4 class="form-label-text">UND. Medida</h4>
                                            <input type="text" name="und-medida" value="${undMedida}" class="form-control" readonly>
                                        </label>
                                        <label class="form-group col-md-3">
                                            <h4 class="form-label-text">QTD em Estoque</h4>
                                            <input type="text" name="estoque" value="${estoque}" class="form-control" readonly>
                                        </label>
                                        <label class="form-group col-md-3">
                                            <h4 class="form-label-text">Valor Unitário</h4>
                                            <input type="text" name="valor-unidade" value="${valorUnidade.toFixed(2)}" class="form-control" readonly>
                                        </label>
                                        <label class="form-group col-md-3">
                                            <h4 class="form-label-text">Valor Total</h4>
                                            <input type="text" name="valor-total" value="${valorTotal}" class="form-control" readonly>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            `;

            tabelaProdutos.prepend(newRow);
            document.getElementById('modal-produto').style.display = 'none';

            // Limpar os campos do formulário do modal
            document.getElementById('produto').value = '';
            document.getElementById('und-medida').value = '';
            document.getElementById('estoque').value = '';
            document.getElementById('valor-unidade').value = '';

    
            document.getElementById('form-produto').reset();
        } else {
            alert('Por favor, preencha todos os campos obrigatórios.');
        }
    };

    // Excluir produto
    document.getElementById('tabela-produtos').addEventListener('click', function(event) {
        if (event.target.classList.contains('trash-icon')) {
            event.target.closest('.row').remove();
        }
    });
});


// Função para adicionar, vizualizar e remover um anexo
document.addEventListener('DOMContentLoaded', () => {
    const anexos = new Map(); // Armazena os documentos na memória

    // Adiciona um documento
    function adicionarAnexoNaTabela(nomeDoArquivo) {
        const formRow = document.createElement('div');
        formRow.className = 'form-row';
        formRow.innerHTML = `
            <label>
                <a href="#" class="btn-visualizar" data-nome="${nomeDoArquivo}" title="Visualizar Documento">
                    <img src="img/fluigicon-eye-open.png" alt="Visualizar" class="acao">
                </a>
                <a href="#" class="btn-excluir" data-nome="${nomeDoArquivo}" title="Excluir Documento">
                    <img src="img/flaticon-trash.png" alt="Excluir" class="acao">
                </a>
                <span class="documento">${nomeDoArquivo}</span>
            </label>
        `;
        document.getElementById('tabela-anexos').appendChild(formRow);

        formRow.querySelector('.btn-visualizar').addEventListener('click', (e) => {
            e.preventDefault();
            visualizarAnexo(e.target.closest('a').getAttribute('data-nome'));
        });

        formRow.querySelector('.btn-excluir').addEventListener('click', (e) => {
            e.preventDefault();
            excluirAnexo(e.target.closest('a').getAttribute('data-nome'));
            formRow.remove(); 
        });
    }

    // Função para visualizar um documento
    function visualizarAnexo(nomeDoArquivo) {
        const blob = anexos.get(nomeDoArquivo);
        if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = nomeDoArquivo;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url); 
        } else {
            alert('Erro ao visualizar o documento.');
        }
    }

    // Função para excluir um documento
    function excluirAnexo(nomeDoArquivo) {
        anexos.delete(nomeDoArquivo); 
        sessionStorage.removeItem(nomeDoArquivo); 
    }

    document.getElementById('btn-incluir-anexo').addEventListener('click', () => {
        const inputFile = document.createElement('input');
        inputFile.type = 'file';
        inputFile.accept = '*/*';
        inputFile.style.display = 'none';

        document.body.appendChild(inputFile);

        inputFile.addEventListener('change', () => {
            const file = inputFile.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const blob = new Blob([event.target.result], { type: file.type });
                    anexos.set(file.name, blob); 
                    sessionStorage.setItem(file.name, URL.createObjectURL(blob));

                    adicionarAnexoNaTabela(file.name); 
                };
                reader.readAsArrayBuffer(file);
            }
            document.body.removeChild(inputFile)
        });

        inputFile.click();

        function gerarJSONDosAnexos() {
            const dadosAnexos = {}; 
    
            for (let i = 0; i < sessionStorage.length; i++) {
                const chave = sessionStorage.key(i);
                if (chave && anexos.has(chave)) { 
                    dadosAnexos[chave] = sessionStorage.getItem(chave); 
                }
            }
    
            return JSON.stringify(dadosAnexos);
        }
    
    });

});

// Função para salvar os dados do forncedor em um arquivo JSON
function abrirModal() {
    document.getElementById("modal-loading").style.display = "block";
}

function fecharModal() {
    document.getElementById("modal-loading").style.display = "none";
}

// Função para verificar o preenchimento dos campos obrigatorios
function validarCampos() {
    const campos = [
        document.getElementById("razaosocial").value,
        document.getElementById("cnpj").value,
        document.getElementById("fname").value,
        document.getElementById("endereco").value,
        document.getElementById("cnome").value,
        document.getElementById("telefone").value,
        document.getElementById("email").value
    ];
    return campos.every(campo => campo.trim() !== '');
}

function salvarDados() {
    if (validarCampos()) {
        abrirModal();

        setTimeout(() => {
            const dadosUsuario = {
                razaoSocial: document.getElementById("razaosocial").value,
                nomeFantasia: document.getElementById("fname").value,
                cnpj: document.getElementById("cnpj").value,
                inscricaoEstadual: document.getElementById("iestadual").value,
                inscricaoMunicipal: document.getElementById("imunicipal").value,
                endereco: document.getElementById("endereco").value,
                nomeContato: document.getElementById("cnome").value,
                telefoneContato: document.getElementById("telefone").value,
                emailContato: document.getElementById("email").value,
            };

            const json = JSON.stringify(dadosUsuario, null, 2); 
            const blob = new Blob([json], { type: "application/json" });

            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "dados_usuario.json";

            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);

            fecharModal();
        }, 2000); 
    } else {
        alert("Por favor, preencha todos os campos obrigatórios.");
    }
}