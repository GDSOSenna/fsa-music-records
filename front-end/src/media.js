//Buscar os elementos HTML através da classe

const tbody = document.querySelector('tbody')
const addForm = document.querySelector('.data')
const inputName = document.querySelector('.name-input')
const inputDescription = document.querySelector('.description-input')
const selectType = document.querySelector('.type-select') 
const selectGender = document.querySelector('.gender-select') 
const inputPrice = document.querySelector('.price-input') 
const inputQuantity = document.querySelector('.quantity-input') 
const selectArtist = document.querySelector('.artist-select') 

//Sincronismo do JS com o backend
const fetchMedias = async () => {
    const medias = await fetch('http://localhost:4000/medias')
    const response = await medias.json()
    return response
}

//console.log(fetchMedias())

//Busca valores inseridos na tabela de type, gender e artist

const fetchType = async () =>{
    const types = await fetch('http://localhost:4000/type')
    const response = await types.json()

    if(response){
        var type = '<option value="">Tipo do produto</option>'
        for (var i = 0; i < response.length; i++){          
          type += '<option value="' + response[i]['id'] + '">' + response[i]['name'] + '</option>'
        }
        selectType.innerHTML = type
    }
} 

if(selectType){
    fetchType()
}

const fetchGender = async () =>{
    const genders = await fetch('http://localhost:4000/gender')
    const response = await genders.json()

    if(response){
        var gender = '<option value="">Gênero</option>'
        for (var i = 0; i < response.length; i++){          
          gender += '<option value="' + response[i]['id'] + '">' + response[i]['name'] + '</option>'
        }
        selectGender.innerHTML = gender
    }
}  

if(selectGender){
    fetchGender()
}

const fetchArtist = async () =>{
    const artists = await fetch('http://localhost:4000/artist')
    const response = await artists.json()

    if(response){
        var artist = '<option value="">Artista</option>'
        for (var i = 0; i < response.length; i++){          
          artist += '<option value="' + response[i]['id'] + '">' + response[i]['name'] + '</option>'
        }
        selectArtist.innerHTML = artist
    }
} 

if(selectArtist){
    fetchArtist()
}

//Adicionar uma nova mídia 

const addMedia = async (event) => {
    event.preventDefault()

    const media = {
        name: inputName.value,
        description: inputDescription.value,
        type_id: parseInt(selectType.value),
        gender_id: parseInt(selectGender.value),
        price: parseFloat(inputPrice.value),
        quantity: parseInt(inputQuantity.value),
        artist_id: parseInt(selectArtist.value)
    }

    await fetch('http://localhost:4000/medias', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(media)
    })
    
    loadMedia()

    inputName.value = ''
    inputDescription.value = ''
    selectType.value = 'Tipo do produto'
    selectGender.value = 'Gênero'
    inputPrice.value = ''
    inputQuantity.value = ''
    selectArtist.value = 'Artista'
}

const deleteMedia = async (id) => {
    await fetch(`http://localhost:4000/medias/${id}`, {
        method: 'delete',
    })

    loadMedia()
}

//Método para atualizar os dados do produto a partir do ID

const updateMedia = async (media) => {
    await fetch(`http://localhost:4000/medias/${media.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(media)
    });
    loadMedia();
};

//Função para criar elementos HTML através de tags

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

//Criando linha da tabela com elementos escolhidos

const createRow = (media) => {
    const {id, name, description, artist, gender, type, price} = media

    const tr = createElement('tr')
    const tdID = createElement('td', id)
    const tdName = createElement('td', name)
    const tdDescription = createElement('td', description)
    const tdArtist = createElement('td', artist.name)
    const tdGender = createElement('td', gender.name)
    const tdType = createElement('td', type.name)
    const tdPrice = createElement('td', 'R$ ' + price)
    const tdEdit = createElement('td')
    const editButton = createElement('button', '', '<span class="material-symbols-outlined">edit</span>')
    const deleteButton = createElement('button', '', '<span class="material-symbols-outlined">delete</span>')
    editButton.addEventListener('click', () => editMedia(media, tr))
    deleteButton.addEventListener('click', () => deleteMedia(id))
    tdEdit.appendChild(editButton)
    tdEdit.appendChild(deleteButton)

    tdID.classList.add('id')
    tdName.classList.add('name')
    tdDescription.classList.add('description')
    tdArtist.classList.add('artist')
    tdGender.classList.add('gender')
    tdType.classList.add('type')
    tdPrice.classList.add('price')
    tdEdit.classList.add('edit')

    tr.appendChild(tdID)
    tr.appendChild(tdName)
    tr.appendChild(tdDescription)
    tr.appendChild(tdArtist)
    tr.appendChild(tdGender)
    tr.appendChild(tdType)
    tr.appendChild(tdPrice)
    tr.appendChild(tdEdit)

    return tr
}

//Edita os inputs dos valores selecionados

const editMedia = (media, row) => {
    const { id, name, description, artist, gender, type, price } = media;

    row.innerHTML = '';

    const tdID = createElement('td', id);
    const tdName = createElement('td');
    const nameInput = createElement('input');
    nameInput.value = name;
    tdName.appendChild(nameInput);

    const tdDescription = createElement('td');
    const descriptionInput = createElement('input');
    descriptionInput.value = description;
    tdDescription.appendChild(descriptionInput);

    const tdArtist = createElement('td');
    const artistSelect = createElement('select');
    artistSelect.innerHTML = selectArtist.innerHTML;
    artistSelect.value = artist.id;
    tdArtist.appendChild(artistSelect);

    const tdGender = createElement('td');
    const genderSelect = createElement('select');
    genderSelect.innerHTML = selectGender.innerHTML;
    genderSelect.value = gender.id;
    tdGender.appendChild(genderSelect);

    const tdType = createElement('td');
    const typeSelect = createElement('select');
    typeSelect.innerHTML = selectType.innerHTML;
    typeSelect.value = type.id;
    tdType.appendChild(typeSelect);

    const tdPrice = createElement('td');
    const priceInput = createElement('input');
    priceInput.value = price;
    tdPrice.appendChild(priceInput);

    const saveButton = createElement('button', 'Salvar');
    saveButton.addEventListener('click', async () => {
        const updatedMedia = {
            id,
            name: nameInput.value,
            description: descriptionInput.value,
            artist_id: parseInt(artistSelect.value),
            gender_id: parseInt(genderSelect.value),
            type_id: parseInt(typeSelect.value),
            price: parseFloat(priceInput.value)
        };
        await updateMedia(updatedMedia);
    });

    const tdSave = createElement('td');
    tdSave.appendChild(saveButton);

    tdID.classList.add('id')
    tdName.classList.add('name')
    tdDescription.classList.add('description')
    tdArtist.classList.add('artist')
    tdGender.classList.add('gender')
    tdType.classList.add('type')
    tdPrice.classList.add('price')

    row.appendChild(tdID);
    row.appendChild(tdName);
    row.appendChild(tdDescription);
    row.appendChild(tdArtist);
    row.appendChild(tdGender);
    row.appendChild(tdType);
    row.appendChild(tdPrice);
    row.appendChild(tdSave);
};

//Regarrega as informações que vem do banco de dados/backend

const loadMedia = async () => {
    const medias = await fetchMedias()
    
    tbody.innerHTML = ''

    medias.forEach((media) => {
        const tr = createRow(media)
        tbody.appendChild(tr)
    })
}

loadMedia()

//Submete o fomrulário criado para atualizar as informações
addForm.addEventListener('submit', addMedia)
 