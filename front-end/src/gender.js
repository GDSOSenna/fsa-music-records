const tbody = document.querySelector('tbody')
const addForm = document.querySelector('.data')
const inputName = document.querySelector('.name-input')

// Busca rota
const fetchGenders = async () => {
    const Genders = await fetch('http://localhost:4000/gender')
    const response = await Genders.json()
    return response
}


const addGender = async (event) => {
    event.preventDefault()

    const gender = {
        name: inputName.value
    }
    
    await fetch('http://localhost:4000/gender', {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(gender)
    })
    loadGender()

    inputName.value = ''
}

const deleteGender = async (id) => {
    await fetch(`http://localhost:4000/gender/${id}`, {
        method: 'delete',
    })

    loadGender()
}

const updateGender = async (gender) => {
    await fetch(`http://localhost:4000/Gender/${gender.id}`, {
        method: 'PUT',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(gender)
    });
    
    loadGender();
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

const createRow = (gender) => {
    const {id, name} = gender

    const tr = createElement('tr')
    const tdID = createElement('td', id)
    const tdName = createElement('td', name)
    const tdEdit = createElement('td')
    const editButton = createElement('button', '', '<span class="material-symbols-outlined">edit</span>')
    const deleteButton = createElement('button', '', '<span class="material-symbols-outlined">delete</span>')
    editButton.addEventListener('click', () => editGender(gender, tr))
    deleteButton.addEventListener('click', () => deleteGender(id))
    tdEdit.appendChild(editButton)
    tdEdit.appendChild(deleteButton)

    tdID.classList.add('id')
    tdName.classList.add('name')

    tr.appendChild(tdID)
    tr.appendChild(tdName)
    tr.appendChild(tdEdit)

    return tr
}

const editGender = (gender, row) => {
    const { id, name} = gender;

    row.innerHTML = ''; // Limpa a linha atual

    const tdID = createElement('td', id);
    const tdName = createElement('td');
    const nameInput = createElement('input');
    nameInput.value = name;
    tdName.appendChild(nameInput);

    const saveButton = createElement('button', 'Salvar');
    saveButton.addEventListener('click', async () => {
        const updatedGender = {
            id,
            name: nameInput.value
        };
        await updateGender(updatedGender);
    });

    const tdSave = createElement('td');
    tdSave.appendChild(saveButton);

    tdID.classList.add('id')
    tdName.classList.add('name')

    row.appendChild(tdID);
    row.appendChild(tdName);
    row.appendChild(tdSave);
};

const loadGender = async () => {
    const genders = await fetchGenders()
    
    tbody.innerHTML = '' // Limpa o tbody antes de adicionar novos elementos

    genders.forEach((gender) => {
        const tr = createRow(gender)
        tbody.appendChild(tr)
    })
}

loadGender()

addForm.addEventListener('submit', addGender)
