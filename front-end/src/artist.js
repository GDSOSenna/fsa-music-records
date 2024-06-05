const tbody = document.querySelector('tbody')
const addForm = document.querySelector('.data')
const inputName = document.querySelector('.name-input')

// Busca rota
const fetchArtists = async () => {
    const artists = await fetch('http://localhost:4000/artist')
    const response = await artists.json()
    return response
}


const addArtist = async (event) => {
    event.preventDefault()

    const artist = {
        name: inputName.value
    }
    
    await fetch('http://localhost:4000/artist', {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(artist)
    })
    loadArtist()

    inputName.value = ''
}

const deleteArtist = async (id) => {
    await fetch(`http://localhost:4000/artist/${id}`, {
        method: 'delete',
    })

    loadArtist()
}

const updateArtist = async (artist) => {
    await fetch(`http://localhost:4000/artist/${artist.id}`, {
        method: 'PUT',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(artist)
    });
    
    loadArtist();
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

const createRow = (artist) => {
    const {id, name} = artist

    const tr = createElement('tr')
    const tdID = createElement('td', id)
    const tdName = createElement('td', name)
    const tdEdit = createElement('td')
    const editButton = createElement('button', '', '<span class="material-symbols-outlined">edit</span>')
    const deleteButton = createElement('button', '', '<span class="material-symbols-outlined">delete</span>')
    editButton.addEventListener('click', () => editArtist(artist, tr))
    deleteButton.addEventListener('click', () => deleteArtist(id))
    tdEdit.appendChild(editButton)
    tdEdit.appendChild(deleteButton)

    tdID.classList.add('id')
    tdName.classList.add('name')

    tr.appendChild(tdID)
    tr.appendChild(tdName)
    tr.appendChild(tdEdit)

    return tr
}

const editArtist = (artist, row) => {
    const { id, name} = artist;

    row.innerHTML = ''; // Limpa a linha atual

    const tdID = createElement('td', id);
    const tdName = createElement('td');
    const nameInput = createElement('input');
    nameInput.value = name;
    tdName.appendChild(nameInput);

    const saveButton = createElement('button', 'Salvar');
    saveButton.addEventListener('click', async () => {
        const updatedArtist = {
            id,
            name: nameInput.value
        };
        await updateArtist(updatedArtist);
    });

    const tdSave = createElement('td');
    tdSave.appendChild(saveButton);

    tdID.classList.add('id')
    tdName.classList.add('name')

    row.appendChild(tdID);
    row.appendChild(tdName);
    row.appendChild(tdSave);
};

const loadArtist = async () => {
    const artists = await fetchArtists()
    
    tbody.innerHTML = '' // Limpa o tbody antes de adicionar novos elementos

    artists.forEach((artist) => {
        const tr = createRow(artist)
        tbody.appendChild(tr)
    })
}

loadArtist()

addForm.addEventListener('submit', addArtist)
