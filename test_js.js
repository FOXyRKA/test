"use strict";

// Получаем DOM-элементы
const innerContainer = document.querySelector(".inner"); // контейнер для карточек
const btn = document.querySelector(".btn");             // кнопка "Показать карточки"
const btn_add = document.querySelector(".btn_add");     // кнопка "Добавить еще"

const api = "https://jsonplaceholder.typicode.com/users"; // API для получения данных

// === СОСТОЯНИЕ ПРИЛОЖЕНИЯ (храним данные между вызовами) ===
let allCardsData = [];    // сюда сохраним всех пользователей из API
let currentIndex = 0;     // сколько карточек уже показали (индекс следующей)

// === ЗАГРУЗКА ВСЕХ ДАННЫХ С СЕРВЕРА ===
// Эта функция вызывается один раз при первом нажатии на "Показать карточки"
async function loadAllData() {
  try {
    const response = await fetch(api);      // отправляем запрос к API
    if (response.ok) {                      // если ответ успешный (код 200-299)
      allCardsData = await response.json(); // преобразуем ответ в массив объектов
      console.log(`Загружено ${allCardsData.length} пользователей`); // для отладки
    } else {
      console.log("Error: " + response.status); // ошибка сервера
    }
  } catch (error) {
    console.log(error.message); // ошибка сети (нет интернета и т.п.)
  }
}

// === ОТРИСОВКА КАРТОЧЕК ===
// Принимает массив объектов пользователей и добавляет их в DOM
function createCards(cardsData) {
  cardsData.forEach((cardData) => {
    // Формируем HTML одной карточки (исправлена опечатка cardDada -> cardData)
    const card = `
        <div class="card">
          <div class="card_img"><img src="/М.png" /></div>
          <div class="text_card card_name">${cardData.name}</div>
          <div class="text_card card_email">${cardData.email}</div>
          <div class="text_card card_city">${cardData.address.city}</div>
          <div class="text_card card_website">${cardData.website}</div>
        </div>`;
    // Добавляем карточку в конец контейнера (не удаляя предыдущие)
    innerContainer.insertAdjacentHTML("beforeEnd", card);
  });
}

// === ПОКАЗ СЛЕДУЮЩИХ КАРТОЧЕК ===
// Добавляет следующие 3 карточки (или меньше, если осталось меньше 3)
function showNextCards(count = 3) {
  // Вырезаем следующий блок из общего массива
  // slice(start, end) - не изменяет исходный массив, возвращает новый
  const nextCards = allCardsData.slice(currentIndex, currentIndex + count);
  
  // Отрисовываем эти карточки
  createCards(nextCards);
  
  // Увеличиваем счетчик показанных карточек на количество добавленных
  currentIndex += nextCards.length;
  
  // Если дошли до конца списка - блокируем кнопку "Добавить"
  if (currentIndex >= allCardsData.length) {
    btn_add.disabled = true;               // делаем кнопку неактивной
    btn_add.textContent = "Все карточки загружены"; // меняем текст
  }
}

// === СБРОС И ПОКАЗ ПЕРВЫХ КАРТОЧЕК ===
// Очищает контейнер и показывает первые 3 карточки
function resetAndShowFirstCards() {
  innerContainer.innerHTML = "";  // удаляем все карточки из контейнера
  currentIndex = 0;               // сбрасываем счетчик показанных
  showNextCards(3);               // показываем первые 3 карточки
}

// === ОБРАБОТЧИК КНОПКИ "Показать карточки" (btn) ===
btn.addEventListener("click", async () => {
  // Если данные еще не загружены - загружаем их в первый раз
  if (allCardsData.length === 0) {
    await loadAllData();  // ждем завершения загрузки
  }
  
  // Если в контейнере нет карточек - показываем первые 3
  if (innerContainer.childElementCount === 0) {
    resetAndShowFirstCards();
  } 
  // Если карточки уже есть - очищаем всё и снова показываем первые 3
  else {
    innerContainer.innerHTML = "";           // очищаем контейнер
    currentIndex = 0;                       // сбрасываем счетчик
    btn_add.disabled = false;               // активируем кнопку "Добавить"
    btn_add.textContent = "Показать еще";    // восстанавливаем текст кнопки
    showNextCards(3);                       // показываем первые 3 карточки
  }
});

// === ОБРАБОТЧИК КНОПКИ "Добавить еще" (btn_add) ===
btn_add.addEventListener("click", () => {
  // Защита: если данные не загружены - показываем предупреждение
  if (allCardsData.length === 0) {
    alert("Сначала нажмите 'Показать карточки'");
    return;
  }
  
  // Если ещё есть карточки для отображения - добавляем следующие 3
  if (currentIndex < allCardsData.length) {
    showNextCards(3);
  }
} );

