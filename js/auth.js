// js/auth.js

// Тестовые пользователи
const USERS_DB = {
    'user1': 'password123',
    'admin': 'admin'
};

const STORAGE_KEY = 'mishkino_user_data';

// Загрузка данных из localStorage ПРИ ПОДКЛЮЧЕНИИ СКРИПТА
let userData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
    username: null,
    myAds: []
};

/* --- ОБЩИЕ ФУНКЦИИ --- */

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    updateAuthLinks(); // Обновляем кнопки сразу после сохранения
}

function isAuthenticated() {
    return !!userData.username;
}

/* --- УПРАВЛЕНИЕ КНОПКАМИ --- */
function updateAuthLinks() {
    const authLink = document.getElementById('authLink');
    const toggleBtn = document.getElementById('authToggleBtn');
    const footerBtn = document.getElementById('footerAuthToggleBtn');
    const adBtn = document.getElementById('openAdFormBtn');

    if (isAuthenticated()) {
        if (authLink) authLink.textContent = 'Личный кабинет';
        if (toggleBtn) toggleBtn.textContent = 'Выйти';
        if (footerBtn) footerBtn.textContent = 'Выйти';
        if (adBtn) {
            adBtn.textContent = "📝 Разместить рекламу";
            adBtn.classList.remove('disabled-btn');
            adBtn.style.pointerEvents = 'auto';
        }
    } else {
        if (authLink) authLink.textContent = 'Личный кабинет';
        if (toggleBtn) toggleBtn.textContent = 'Войти';
        if (footerBtn) footerBtn.textContent = 'Войти';
        if (adBtn) {
            adBtn.textContent = "🔒 Войти для размещения";
            adBtn.classList.add('disabled-btn');
            adBtn.style.pointerEvents = 'none';
        }
    }

    // Вешаем обработчики (они перезапишутся, но это безопасно)
    if (toggleBtn) toggleBtn.onclick = toggleAuth;
    if (footerBtn) footerBtn.onclick = toggleAuth;
}

function toggleAuth() {
    if (isAuthenticated()) {
        logout();
    } else {
        window.location.href = 'login.html';
    }
}

/* --- АВТОРИЗАЦИЯ --- */

function setupLoginForm() {
    const form = document.getElementById('loginForm');
    const errorMsg = document.getElementById('errorMsg');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const login = document.getElementById('login').value;
        const password = document.getElementById('password').value;

        if (USERS_DB[login] && USERS_DB[login] === password) {
            userData.username = login;
            saveData();
            window.location.href = 'cabinet.html';
        } else {
            errorMsg.style.display = 'block';
        }
    });
}

/* --- ЛИЧНЫЙ КАБИНЕТ --- */

function renderCabinet() {
    const greeting = document.getElementById('userGreeting');
    const logoutLink = document.getElementById('logoutLink');
    const myAdsContainer = document.getElementById('myAdsContainer');

    if (greeting) greeting.textContent = `Здравствуйте, ${userData.username}!`;
    if (logoutLink) logoutLink.onclick = logout;

    if (myAdsContainer) {
        renderAds('myAdsContainer', userData.myAds, "📝 Мои объявления");
    }
}

function logout() {
    userData.username = null;
    saveData();
    window.location.href = 'index.html';
}

/* --- ПОДАЧА ОБЪЯВЛЕНИЙ --- */

function setupAdForm() {
    const adForm = document.getElementById('adForm');
    const openAdFormBtn = document.getElementById('openAdFormBtn');
    const authModal = document.getElementById('authModal');
    const closeModalBtn = document.getElementById('closeModalBtn');

    if (!openAdFormBtn) return;

    openAdFormBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!isAuthenticated()) {
            window.location.href = 'login.html';
            return;
        }
        authModal.style.display = 'flex';
    });

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            authModal.style.display = 'none';
        });
    }

    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.style.display = 'none';
        }
    });

    if (adForm) {
        adForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('adTitle').value.trim();
            const price = document.getElementById('adPrice').value;

            if (title && price) {
                userData.myAds.push({
                    id: Date.now(),
                    title: title,
                    price: parseInt(price, 10),
                    date: new Date().toLocaleDateString('ru-RU')
                });
                saveData();
                
                // Обновляем список в кабинете
                const myAdsContainer = document.getElementById('myAdsContainer');
                if (myAdsContainer) {
                    renderAds('myAdsContainer', userData.myAds, "📝 Ваш портфель");
                }
                
                adForm.reset();
                authModal.style.display = 'none';
            }
        });
    }
}

/* --- ФУНКЦИЯ РЕНДЕРА ОБЪЯВЛЕНИЙ --- */
function renderAds(containerId, adsList, title = "Объявления") {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `<h2>${title}</h2>`;

    if (adsList.length === 0) {
        container.innerHTML += '<p>Объявлений пока нет.</p>';
        return;
    }

    const list = document.createElement('div');
    list.className = 'grid-dashboard';

    adsList.forEach(ad => {
        const item = document.createElement('article');
        item.className = 'dashboard-widget ads';
        item.innerHTML = `
            <div class="ad-item">
                <div class="ad-item-content"><h3>${ad.title}</h3></div>
                <span class="price">${ad.price.toLocaleString('ru-RU')} ₽</span>
            </div>
            <p class="ad-date" style="font-size: 0.9em; color: #666;">Добавлено: ${ad.date}</p>
        `;
        list.appendChild(item);
    });

    container.appendChild(list);
}

/* ======================================================== */
/* === ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СКРИПТА === */
/* ======================================================== */

// 1. Сразу обновляем кнопки на ВСЕХ страницах
updateAuthLinks();

// 2. Если мы на странице Личного кабинета
if (window.location.pathname.split('/').pop() === 'cabinet.html') {
    if (!userData.username) {
        window.location.href = 'login.html';
    } else {
        renderCabinet();
    }
}

// 3. Если мы на странице Логина
if (window.location.pathname.split('/').pop() === 'login.html') {
    if (userData.username) {
        window.location.href = 'cabinet.html';
    } else {
        setupLoginForm();
    }
}

// 4. Если мы на Главной — инициализируем форму объявлений
if (window.location.pathname.split('/').pop() === 'index.html') {
    setupAdForm();
}