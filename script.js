// Локальная база данных
if (!localStorage.getItem('local_wishlists')) {
    let initialData = { "Лера": {}, "Катя": {}, "Елена": {}, "Сергей": {}, "Дима": {} };
    localStorage.setItem('local_wishlists', JSON.stringify(initialData));
}

const users = ["Лера", "Катя", "Елена", "Сергей", "Дима"];
let currentUser = null;
let targetUser = null;
let currentLang = 'ru';

// Дефолтные языки для каждого члена семьи
const userDefaultLanguages = {
    "Дима": "ru",
    "Лера": "ru",
    "Сергей": "ru", // Папа
    "Катя": "de",
    "Елена": "en"
};

// Словари переводов интерфейса
const translations = {
    ru: {
        loginTitle: "Кто ты?",
        welcome: "Здравствуйте, ",
        btnEdit: "Редактировать вишлист",
        btnView: "Просмотр вишлистов",
        btnLogout: "Сменить пользователя",
        langLabel: "Язык:",
        langTxt: "Русский",
        flag: "🇷🇺",
        myListTitle: "Мой вишлист",
        placeholder: "напиши своё пожелание",
        btnAdd: "Добавить",
        btnBack: "Назад в меню",
        viewSelectionTitle: "Чей вишлист посмотреть?",
        friendListTitle: "Вишлист: ",
        btnBackSel: "Назад к выбору",
        btnEditItem: "Ред.",
        btnDelItem: "Удалить",
        reserved: "🔒 Забронировано: ",
        fulfills: "🔒 Исполняет: ",
        alertReserved: "Этот подарок уже забронировал(а) ",
        promptEdit: "Отредактируйте ваше пожелание:"
    },
    en: {
        loginTitle: "Who are you?",
        welcome: "Hello, ",
        btnEdit: "Edit wishlist",
        btnView: "View wishlists",
        btnLogout: "Change user",
        langLabel: "Language:",
        langTxt: "English",
        flag: "🇺🇸",
        myListTitle: "My wishlist",
        placeholder: "write your wish here",
        btnAdd: "Add",
        btnBack: "Back to menu",
        viewSelectionTitle: "Whose wishlist to view?",
        friendListTitle: "Wishlist: ",
        btnBackSel: "Back to selection",
        btnEditItem: "Edit",
        btnDelItem: "Delete",
        reserved: "🔒 Reserved by: ",
        fulfills: "🔒 Fulfills: ",
        alertReserved: "This gift has already been reserved by ",
        promptEdit: "Edit your wish:"
    },
    de: {
        loginTitle: "Wer bist du?",
        welcome: "Hallo, ",
        btnEdit: "Wunschliste bearbeiten",
        btnView: "Wunschlisten anzeigen",
        btnLogout: "Benutzer wechseln",
        langLabel: "Sprache:",
        langTxt: "Deutsch",
        flag: "🇩🇪",
        myListTitle: "Meine Wunschliste",
        placeholder: "Schreib deinen Wunsch",
        btnAdd: "Hinzufügen",
        btnBack: "Zurück zum Menü",
        viewSelectionTitle: "Wessen Wunschliste anzeigen?",
        friendListTitle: "Wunschliste: ",
        btnBackSel: "Zurück zur Auswahl",
        btnEditItem: "Bearb.",
        btnDelItem: "Löschen",
        reserved: "🔒 Reserviert von: ",
        fulfills: "🔒 Erfüllt von: ",
        alertReserved: "Dieses Geschenk wurde уже reserviert von ",
        promptEdit: "Bearbeite deinen Wunsch:"
    }
};

// Генерация кнопок входа на стартовом экране
const loginButtonsDiv = document.getElementById('login-buttons');
users.forEach(user => {
    const btn = document.createElement('button');
    btn.className = 'user-btn';
    btn.innerText = user;
    btn.onclick = () => login(user);
    loginButtonsDiv.appendChild(btn);
});

function login(user) {
    currentUser = user;
    
    // Применяем персональную тему через атрибут тега body
    document.body.setAttribute('data-user', user);
    
    // Устанавливаем дефолтный язык пользователя
    changeLanguage(userDefaultLanguages[user]);
    
    showScreen('screen-menu');
}

function logout() {
    currentUser = null;
    document.body.setAttribute('data-user', 'default'); // Возвращаем темную тему Димы
    showScreen('screen-login');
}

function changeLanguage(langCode) {
    currentLang = langCode;
    const t = translations[langCode];
    
    // Обновляем тексты в меню
    document.getElementById('welcome-text').innerText = `${t.welcome}${currentUser}!`;
    document.getElementById('btn-edit-wishlist').innerText = t.btnEdit;
    document.getElementById('btn-view-wishlists').innerText = t.btnView;
    document.getElementById('btn-logout').innerText = t.btnLogout;
    
    // Селектор языка
    document.getElementById('lang-label').innerText = t.langLabel;
    document.getElementById('current-flag').innerText = t.flag;
    document.getElementById('current-lang-txt').innerText = t.langTxt;
    
    // Экраны списков
    document.getElementById('my-list-title').innerText = t.myListTitle;
    document.getElementById('wish-input').placeholder = t.placeholder;
    document.getElementById('btn-add-wish').innerText = t.btnAdd;
    document.getElementById('btn-back-menu-1').innerText = t.btnBack;
    document.getElementById('btn-back-menu-2').innerText = t.btnBack;
    document.getElementById('view-selection-title').innerText = t.viewSelectionTitle;
    document.getElementById('btn-back-selection').innerText = t.btnBackSel;
    
    if (targetUser) {
        document.getElementById('friend-list-title').innerText = `${t.friendListTitle}${targetUser}`;
    }
}

// Управление выпадающим списком языка
function toggleLangDropdown() {
    document.getElementById('lang-dropdown').classList.toggle('open');
}

function changeLanguageFromDropdown(langCode) {
    changeLanguage(langCode);
    document.getElementById('lang-dropdown').classList.remove('open');
}

// Закрытие списка языков при клике в другое место
window.addEventListener('click', function(e) {
    if (!document.querySelector('.lang-selector-container').contains(e.target)) {
        document.getElementById('lang-dropdown').classList.remove('open');
    }
});

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function backToMenu() { showScreen('screen-menu'); }

/* МОЙ ВИШЛИСТ */
function openMyWishlist() {
    showScreen('screen-my-list');
    renderMyWishes();
}

document.getElementById('wish-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') addWish();
});

function addWish() {
    const input = document.getElementById('wish-input');
    const text = input.value.trim();
    if (!text) return;

    let localData = JSON.parse(localStorage.getItem('local_wishlists'));
    let newId = 'wish_' + Date.now();
    
    localData[currentUser][newId] = {
        id: newId,
        text: text,
        checked: false,
        checkedBy: null
    };
    
    localStorage.setItem('local_wishlists', JSON.stringify(localData));
    input.value = '';
    renderMyWishes();
}

function renderMyWishes() {
    const ul = document.getElementById('my-wishes-ul');
    ul.innerHTML = '';
    let localData = JSON.parse(localStorage.getItem('local_wishlists'));
    let wishes = Object.values(localData[currentUser] || {});
    const t = translations[currentLang];

    wishes.forEach(wish => {
        const li = document.createElement('li');
        if (wish.checked) li.classList.add('checked');
        let html = `<div class="wish-text">${wish.text}</div>`;
        if (wish.checked) html += `<div class="checked-by">${t.reserved}${wish.checkedBy}</div>`;
        html += `
            <div class="item-actions">
                <button class="edit" onclick="editWish('${wish.id}', '${wish.text.replace(/'/g, "\\'")}')">${t.btnEditItem}</button>
                <button class="delete" onclick="deleteWish('${wish.id}')">${t.btnDelItem}</button>
            </div>
        `;
        li.innerHTML = html;
        ul.appendChild(li);
    });
}

function deleteWish(id) {
    let localData = JSON.parse(localStorage.getItem('local_wishlists'));
    delete localData[currentUser][id];
    localStorage.setItem('local_wishlists', JSON.stringify(localData));
    renderMyWishes();
}

function editWish(id, oldText) {
    const t = translations[currentLang];
    const newText = prompt(t.promptEdit, oldText);
    if (newText !== null && newText.trim() !== "") {
        let localData = JSON.parse(localStorage.getItem('local_wishlists'));
        localData[currentUser][id].text = newText.trim();
        localStorage.setItem('local_wishlists', JSON.stringify(localData));
        renderMyWishes();
    }
}

/* ПРОСМОТР ЧУЖИХ СПИСКОВ */
function openViewSelection() {
    showScreen('screen-view-selection');
    const div = document.getElementById('view-buttons');
    div.innerHTML = '';
    users.forEach(user => {
        if (user !== currentUser) {
            const btn = document.createElement('button');
            btn.innerText = user;
            btn.onclick = () => openFriendWishlist(user);
            div.appendChild(btn);
        }
    });
}

function openFriendWishlist(user) {
    targetUser = user;
    const t = translations[currentLang];
    document.getElementById('friend-list-title').innerText = `${t.friendListTitle}${targetUser}`;
    showScreen('screen-friend-list');
    renderFriendWishes();
}

function renderFriendWishes() {
    const ul = document.getElementById('friend-wishes-ul');
    ul.innerHTML = '';
    let localData = JSON.parse(localStorage.getItem('local_wishlists'));
    let wishes = Object.values(localData[targetUser] || {});
    const t = translations[currentLang];

    wishes.forEach(wish => {
        const li = document.createElement('li');
        if (wish.checked) li.classList.add('checked');
        let html = `<div class="wish-text">${wish.text}</div>`;
        if (wish.checked) html += `<div class="checked-by">${t.fulfills}${wish.checkedBy}</div>`;
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'checkbox-container';
        checkbox.checked = wish.checked;
        checkbox.onclick = () => toggleWishCheck(wish.id, wish.checked, wish.checkedBy);
        li.innerHTML = html;
        li.appendChild(checkbox);
ul.appendChild(li);
});
}
function toggleWishCheck(id, isChecked, checkedBy) {
let localData = JSON.parse(localStorage.getItem('local_wishlists'));
const t = translations[currentLang];
if (!isChecked) {
localData[targetUser][id].checked = true;
localData[targetUser][id].checkedBy = currentUser;
} else {
if (checkedBy === currentUser) {
localData[targetUser][id].checked = false;
localData[targetUser][id].checkedBy = null;
} else {
alert(${t.alertReserved}${checkedBy}!);
}
}
localStorage.setItem('local_wishlists', JSON.stringify(localData));
renderFriendWishes();
}
// Переопределяем функцию для клика по выпадающему списку
window.changeLanguage = changeLanguageFromDropdown;
