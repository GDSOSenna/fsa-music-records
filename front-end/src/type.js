const tbody = document.querySelector('tbody')
const addForm = document.querySelector('.data')
const inputName = document.querySelector('.name-input')
const inputDescription = document.querySelector('.description-input')

// Busca rota
const fetchTypes = async () => {
    const types = await fetch('http://localhost:4000/type')
    const response = await types.json()
    return response
}


const addType = async (event) => {
    event.preventDefault()

    const type = {
        name: inputName.value,
        description: inputDescription.value,
    }
    
    await fetch('http://localhost:4000/type', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(type)
    })
    loadType()

    inputName.value = ''
    inputDescription.value = ''
}

const deletetype = async (id) => {
    await fetch(`http://localhost:4000/type/${id}`, {
        method: 'delete',
    })

    loadType()
}

const updateType = async (type) => {
    await fetch(`http://localhost:4000/type/${type.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(type)
    });
    
    loadType();
};

const createElement = (tag, innerText = '', innerHTML = '') => {
    const element = document.createElement(tag)

    if (innerText) {
        element.innerText = innerText
    }

    if (innerHTML) {
        element.innerHTML = innerHTML
    }

    return element
}

const createRow = (type) => {
    const {id, name, description} = type

    const tr = createElement('tr')
    const tdID = createElement('td', id)
    const tdName = createElement('td', name)
    const tdDescription = createElement('td', description)
    const tdEdit = createElement('td')
    const editButton = createElement('button', '', '<span class="material-symbols-outlined">edit</span>')
    const deleteButton = createElement('button', '', '<span class="material-symbols-outlined">delete</span>')
    editButton.addEventListener('click', () => editType(type, tr))
    deleteButton.addEventListener('click', () => deletetype(id))
    tdEdit.appendChild(editButton)
    tdEdit.appendChild(deleteButton)

    tdID.classList.add('id')
    tdName.classList.add('name')
    tdDescription.classList.add('description')

    tr.appendChild(tdID)
    tr.appendChild(tdName)
    tr.appendChild(tdDescription)
    tr.appendChild(tdEdit)

    return tr
}

const editType = (type, row) => {
    const { id, name, description} = type;

    row.innerHTML = ''; // Limpa a linha atual

    const tdID = createElement('td', id);
    const tdName = createElement('td');
    const nameInput = createElement('input');
    nameInput.value = name;
    tdName.appendChild(nameInput);

    const tdDescription = createElement('td');
    const descriptionInput = createElement('input');
    descriptionInput.value = description;
    tdDescription.appendChild(descriptionInput);

    const saveButton = createElement('button', 'Salvar');
    saveButton.addEventListener('click', async () => {
        const updatedType = {
            id,
            name: nameInput.value,
            description: descriptionInput.value
        };
        await updateType(updatedType);
    });

    const tdSave = createElement('td');
    tdSave.appendChild(saveButton);

    tdID.classList.add('id')
    tdName.classList.add('name')
    tdDescription.classList.add('description')

    row.appendChild(tdID);
    row.appendChild(tdName);
    row.appendChild(tdDescription);
    row.appendChild(tdSave);
};

const loadType = async () => {
    const types = await fetchTypes()
    
    tbody.innerHTML = '' // Limpa o tbody antes de adicionar novos elementos

    types.forEach((type) => {
        const tr = createRow(type)
        tbody.appendChild(tr)
    })
}

loadType()

addForm.addEventListener('submit', addType)
