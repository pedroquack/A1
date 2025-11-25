let tarefas = [];

const formTarefa = document.getElementById('form-tarefa');

const inputIdTarefa = document.getElementById('input-id-tarefa');
const inputTitulo = document.getElementById('input-titulo');
const inputDescricao = document.getElementById('input-descricao');
const inputData = document.getElementById('input-data');

const botaoForm = document.getElementById('botao-form');

formTarefa.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const idTarefa = formData.get('id-tarefa');
    const titulo = formData.get('titulo');
    const descricao = formData.get('descricao');
    const data = formData.get('data');


    if (titulo.length > 30) {
        alert("O titulo da tarefa pode ter no máximo 50 caractéres");
        return;
    }
    if (descricao.length > 100) {
        alert("A descricao da tarefa pode ter no máximo 100 caractéres");
        return;
    }

    //Se o formulário não tem um id de tarefa, cria uma tarefa nova, se não, atualiza a tarefa que possui o id
    if (!idTarefa) {
        const tarefaNova = {
            id: tarefas.length ? tarefas[tarefas.length - 1].id + 1 : 0,
            concluido: false,
            titulo: titulo,
            descricao: descricao,
            data: data
        }
        tarefas.push(tarefaNova)
    } else {
        index = tarefas.findIndex(t => t.id == idTarefa);
        tarefas[index].titulo = titulo;
        tarefas[index].descricao = descricao;
        tarefas[index].data = data;

        botaoForm.textContent = "Adicionar";
    }

    formTarefa.reset();
    armazenarTarefas();
    carregarTarefas();
})

function armazenarTarefas() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function carregarTarefas() {
    let body = document.getElementById('tabela-body');
    body.innerHTML = ''
    tarefas.forEach(tarefa => {
        const concluida = tarefa.concluido ? 'checked' : '';
        const novaLinha = `
        <tr id="${tarefa.id}">
            <td class="td-checkbox"><input type="checkbox" onchange="checkTarefa(event)" name="checkbox" id="checkbox-${tarefa.id}" ${concluida}></td>
            <td>${tarefa.titulo}</td>
            <td>${tarefa.descricao}</td>
            <td>${tarefa.data}</td>
            <td><button class="editar" onclick="editarTarefa(event)"><span class="material-symbols-outlined">edit</span></button></td>
            <td><button class="deletar" onclick="excluirTarefa(event)"><span class="material-symbols-outlined">delete</span></button></td>
        </tr>
    `
        body.innerHTML += novaLinha;
    })
}

function checkTarefa(event) {
    index = tarefas.findIndex(t => t.id == event.target.parentNode.parentNode.id);
    if (index != -1) {
        console.log(event.target.checked);
        tarefas[index].concluido = event.target.checked;
    }

    armazenarTarefas();
}

function editarTarefa(event) {
    tarefa = tarefas.find(t => t.id == event.target.parentNode.parentNode.id);

    if (!tarefa) {
        return;
    }

    botaoForm.textContent = "Editar"

    inputIdTarefa.value = tarefa.id;
    inputTitulo.value = tarefa.titulo;
    inputDescricao.value = tarefa.descricao;
    inputData.value = tarefa.data;
}

function excluirTarefa(event) {
    const index = tarefas.findIndex(t => t.id == event.target.parentNode.parentNode.id);
    if (index != -1) {
        tarefas.splice(index, 1);
        armazenarTarefas();
        carregarTarefas();
    }
}

window.onload = function () {
    const tarefasStorage = localStorage.getItem('tarefas');
    tarefas = JSON.parse(tarefasStorage);
    carregarTarefas();
}
