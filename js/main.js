class API {
  constructor() {
    this.apiHost = 'free-to-play-games-database.p.rapidapi.com';
    this.apiKey = '8574823d8cmshf3a9d0b11089231p1e6684jsn9f42c39cbc59';
  }

  async fetchGames(category) {
    const options = {
      method: "GET",
      headers: {
        'x-rapidapi-host': this.apiHost,
        'x-rapidapi-key': this.apiKey,
      },
    };
    const response = await fetch(`https://${this.apiHost}/api/games?category=${category}`, options);
    const data = await response.json();
    return data;
  }

  async fetchGameDetails(id) {
    const options = {
      method: "GET",
      headers: {
        'x-rapidapi-host': this.apiHost,
        'x-rapidapi-key': this.apiKey,
      },
    };
    const response = await fetch(`https://${this.apiHost}/api/game?id=${id}`, options);
    const data = await response.json();
    return data;
  }
}

class GameApp {
  constructor() {
    this.api = new API();
    this.allGames = [];
    this.content = document.querySelector(".content");
    this.cards = document.querySelector(".cards");
    this.pageTitle = document.querySelector(".page-title");
    this.categoryButtons = document.querySelectorAll(".category-btn");
    this.showDataElement = document.getElementById('showData');
    this.init();
  }

  init() {
    this.categoryButtons.forEach(button => {
      button.addEventListener("click", (event) => {
        this.getGames(event.target.dataset.category);
      });
    });
    this.getGames('mmorpg');  
  }

  async getGames(category) {
    try {
      this.allGames = await this.api.fetchGames(category);
      this.displayGames();
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  }

  async getGameDetails(id) {
    try {
      const gameDetails = await this.api.fetchGameDetails(id);
      this.showGameDetails(gameDetails);
    } catch (error) {
      console.error("Error fetching game details:", error);
    }
  }

  showGameDetails(gameDetails) {
    this.content.classList.add("d-none");
    this.pageTitle.classList.remove("d-none");

    let box = `
      <div class="container">
            <button id="close-btn" class="close-btn text-white">X</button>
      <h2 class="text-white py-2">Details Game</h2>
      <div class="row d-flex">
      <div class="col-md-4 col-12">
      <img class="d-block w-100 " src="${gameDetails.thumbnail}" alt="">
      </div>
      <div class="col-md-8 col-12">
      <header class="text-white ms-1">
      <h3 class="mt-2 mt-md-0">Title:<span">${gameDetails.title}</span></h3>
      <h4 class="h6 my-4">Category: <span class="title-game">${gameDetails.genre}</span></h4>
      <h4 class="h6 my-4">Platform: <span class="title-game">${gameDetails.platform}</span></h4>
      <h4 class="h6 my-4">Status: <span class="title-game">Live</span></h4>
      <p class="datils-game">${gameDetails.description}</p>
      </header>
      <a target="blank" href="${gameDetails.game_url}"><button style="border: 1px solid #FFC107;" class="bg-transparent btn rounded-2 text-white">Show Game</button></a>
      </div>
      </div>
      </div>
    `;
    this.pageTitle.innerHTML = box;

    let btnClose = document.querySelector("#close-btn");
    btnClose.addEventListener("click", () => {
      this.pageTitle.classList.add("d-none");
      this.content.classList.replace("d-none", "d-block");
    });
  }

  displayGames() {
    let cartona = '';
    this.allGames.forEach((game, index) => {
      cartona += `
        <div class="col-12 col-md-4">
          <div class="card" data-index="${index}">
            <div class="layerr">
              <img class="w-100 d-block" src="${game.thumbnail}" alt="">
              <div class="row">
                <div class="col-9">
                  <h3 class="h6 mt-3 text-white">${game.title}</h3>
                </div>
                <div class="col-3">
                  <h4 class="text-bg-primary fit-content h6 mt-2 p-1 rounded-2">Free</h4>
                </div>
              </div>
              <p style="color: #919395;" class="lg-font pg text-center">${game.short_description}</p>
            </div>
            <footer class="mt-2">
              <div class="row">
                <div class="col-4">
                  <h5 style="background-color: #32383E;" class="mt-3 sm-font text-white text-center rounded-1 fit-content p-1 fw-bold">${game.genre}</h5>
                </div>
                <div class="col-8 d-flex justify-content-end">
                  <h5 style="background-color: #32383E;" class="mt-3 sm-font text-white text-center rounded-1 fit-content p-1 fw-bold">${game.platform}</h5>
                </div>
              </div>
            </footer>
          </div>
        </div>
      `;
    });

    this.showDataElement.innerHTML = cartona;
    this.addCardEventListeners();
  }

  addCardEventListeners() {
    let cardsList = document.querySelectorAll('.card');
    cardsList.forEach(card => {
      card.addEventListener('click', () => {
        let index = card.getAttribute('data-index');
        let gameId = this.allGames[index].id;
        this.getGameDetails(gameId);
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new GameApp();
});
