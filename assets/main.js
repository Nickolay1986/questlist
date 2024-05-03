const body = document.body;



function createEl(element = 'div', elementClass = 'default') {
    let newElement = document.createElement(element);
    newElement.classList.add(elementClass);
    return newElement;
}

const wrapper = createEl('div', 'wrapper');
body.append(wrapper);
const pTitle = createEl('h1', 'page__title');
pTitle.textContent = 'Список задач'
wrapper.append(pTitle)

const inpField = createEl('div', 'input__field');
wrapper.append(inpField);

const inp = createEl('input', 'inp');
inp.type = 'text';
inp.placeholder = 'Введите задачу';
inpField.append(inp);

const btn = createEl('button', 'btn');
btn.classList.add('pluse')
// btn.textContent = 'Добавить задачу';
inpField.append(btn);

const cardsEl = createEl('div', 'cards');
wrapper.append(cardsEl);
let index = 0;

function iterateLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const id = task.id
        const text = task.text
        const localChecked = task.checked;
        // В этом блоке вы можете выполнить любые действия с каждой задачей
        // Например, вы можете вывести идентификатор и текст задачи в консоль
        addQuest(id, text, localChecked)
    });
    return tasks.length > 0;

}
iterateLocalStorage()
function addQuest(localIndex, text, localChecked) {
    let checked;
    let taskId;
    if (localIndex) {
        taskId = localIndex;
    } else {
        index++;
        taskId = index;
    }
    
    const cardEl = createEl('div', 'card');
    const title = createEl('div', 'card__title');
    if (text) {
        title.textContent = text;
    } else {
        title.textContent = inp.value;
    }
    cardEl.append(title);
    cardsEl.append(cardEl);

    const btnDone = createEl('button', 'card__btn');
    btnDone.classList.add('checkbox')
    if (localChecked === 1) {
        btnDone.classList.add('checked')
        cardEl.classList.add('card-active')
    } 
    // btnDone.textContent = 'Выполнено';
    btnDone.onclick = function () {
        
        if (btnDone.classList.contains('checked')) {
            checked = 0
            btnDone.classList.remove('checked')
            cardEl.classList.remove('card-active')
            cardEl.classList.add('card-passive')  
            updateLocalStorage(taskId, title.textContent, checked);
        } else {
            checked = 1
            btnDone.classList.add('checked')
            updateLocalStorage(taskId, title.textContent, checked);
            cardEl.classList.remove('card-passive')            
            cardEl.classList.add('card-active')
        }
        // cardEl.classList.toggle('card-activ')
    } 
    const btnCustom = createEl('button', 'card__btn');
    const editImg = createEl('img', 'img');
    editImg.src = './assets/edit.png';
    editImg.alt = 'edit.png'
    btnCustom.append(editImg)
        // <img  src="./edit.png" alt="edit.png">
    // btnCustom.textContent = 'Изменить'
    btnCustom.onclick = function customPrompt() {
        
        // Отображение prompt с текстом по умолчанию
        const userInput = prompt('Введите задачу', title.textContent);
        
        // Проверить, было ли что-то введено
        if (userInput !== null && userInput !== '') {
            title.textContent = userInput;
            updateLocalStorage(taskId, userInput);
            
        } else {
            alert('Введите название задачи. Поле не должно быть пустым!')
            customPrompt()
        }
    }
    
    const btnDelete = createEl('button', 'card__btn');
    btnDelete.classList.add('cross')
    btnDelete.onclick = function () {
        removeFromLocalStorage(taskId)
        cardEl.remove()
    } 
    if (!localIndex) {
        saveToLocalStorage(taskId, title.textContent); 
    }
    inp.value = ''
    cardEl.append(btnDone, btnCustom, btnDelete)

    
}


function saveToLocalStorage(taskId, taskText, checked = 0) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ id: taskId, text: taskText, checked: checked }); // Сохраняем задачу с индексом и текстом
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateLocalStorage(taskId, newText, checked) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const index = tasks.findIndex(task => task.id === taskId); 
    if (index !== -1) {
        tasks[index].text = newText; // Обновляем текст задачи
        tasks[index].checked = checked ? 1 : 0; // Преобразуем булево значение checked в число
        localStorage.setItem('tasks', JSON.stringify(tasks)); // Сохраняем обновленные задачи в локальное хранилище
    }
}

function removeFromLocalStorage(taskId) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const index = tasks.findIndex(task => task.id === taskId); 
    if (index !== -1) {
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

function checkAndAddTask() {
    if (inp.value === '') {
        alert('Введите название задачи. Поле не должно быть пустым!')
    } else {        
        addQuest();
    }
}

btn.addEventListener('click', checkAndAddTask);
document.addEventListener('keypress', function (event) {
    if (event.key === 'Enter' ) {
        checkAndAddTask();
    }
})