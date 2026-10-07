document.addEventListener('DOMContentLoaded', function() {
    
    /* ======================================================== */
    /* === УПРАВЛЕНИЕ АВТОРИЗАЦИЕЙ (Вызов функций из auth.js) === */
    /* ======================================================== */
    
    // Эта функция меняет текст кнопок "Войти/Выйти" и "Личный кабинет"
    // в зависимости от того, есть ли данные в localStorage
    if (typeof updateAuthLinks === 'function') {
        updateAuthLinks();
    }

    /* --- ЛОГИКА ДЛЯ МИНИ-ФОРМЫ В ШАПКЕ --- */
    /* Если вы окончательно удалили форму #miniLoginForm из HTML, 
       этот блок можно удалить полностью, чтобы не было ошибок в консоли. */
    const miniLoginForm = document.getElementById('miniLoginForm');
    if (miniLoginForm) {
        miniLoginForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
            // Внимание: это заглушка. 
            // В реальном проекте здесь должен быть вызов auth.php
            alert("Эта форма входа отключена. Используйте кнопку 'Войти' в шапке.");
        });
    }

    /* ======================================================== */
    /* === МОДАЛЬНОЕ ОКНО ПОДАЧИ ОБЪЯВЛЕНИЯ === */
    /* ======================================================== */
    // Эта логика остается, так как мы используем модальное окно для подачи объявлений
    const authModal = document.getElementById('authModal');
    const openAdFormBtn = document.getElementById('openAdFormBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');

    if (authModal && openAdFormBtn && closeModalBtn) {
        
        // Открытие модалки
        openAdFormBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Проверка прав: только авторизованные могут подавать объявления
            if (typeof isAuthenticated === 'function' && isAuthenticated()) {
                authModal.style.display = 'flex';
            } else {
                // Если не авторизован — отправляем на страницу входа
                window.location.href = 'login.html';
            }
        });

        // Закрытие по крестику
        closeModalBtn.onclick = function() {
            authModal.style.display = 'none';
        };

        // Закрытие по клику на фон (оверлей)
        window.onclick = function(event) {
            if (event.target === authModal) {
                authModal.style.display = 'none';
            }
        };
    }

    /* --- ЛОГИКА ОТПРАВКИ ОБЪЯВЛЕНИЯ --- */
    // Эта функция теперь находится внутри js/auth.js (внутри setupAdForm), 
    // поэтому здесь её дублировать не нужно.
    // Если вы НЕ перенесли setupAdForm в auth.js, то её код должен быть здесь.
    
});