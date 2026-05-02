"use script";
const innerContainer = document.querySelector(".inner");
const btn = document.querySelector(".btn");
const btn_add = document.querySelector(".btn_add");

const api = "https://jsonplaceholder.typicode.com/users";

async function showFriendList() {
  try {
    const response = await fetch(api);
    if (response.ok) {
      const data = await response.json();
      createCards(data);
    } else {
      console.log("Error: " + response.status);
    }
  } catch (error) {
    console.log(error.message);
  }
}

function createCards(cardsData) {
  cardsData.forEach((cardDada) => {
    const card = `
        <div class="card">
          <div class="card_img"><img src="image.png" /></div>
          <div class="text_card card_name">${cardDada.name}</div>
          <div class="text_card card_email">${cardDada.email}</div>
          <div class="text_card card_city">${cardDada.address.city}</div>
          <div class="text_card card_website">${cardDada.website}</div>
        </div>`;
    innerContainer.insertAdjacentHTML("beforeEnd", card);
  });
}

btn.addEventListener("click", () => {
  if (innerContainer.childElementCount > 0) {
    innerContainer.innerHTML = "";
  } else {
    showFriendList();
  }
});
