window.addEventListener("load", () => {
  const characters = document.querySelector("#characters");
  const pagination = document.querySelector("#paginationUl");
  const ara = document.querySelector("#search");
  let currentPage = 1;
  let name = "";
  class Characters {
    async get() {
      const response = await fetch(
        `https://rickandmortyapi.com/api/character?page=${currentPage}`
      );
      const json = await response.json();
      return json;
    }
    async search() {
      const response = await fetch(
        `https://rickandmortyapi.com/api/character?name=${name}`
      );
      const json = await response.json();
      return json;
    }
  }
  let oneC = new Characters();

  const writeCharacters = (json) => {
    const { results, info } = json;
    characters.innerHTML = null;
    results.forEach((character) => {
      characters.innerHTML += `
        <a href="#" class="card">
          <div class="top">
            <img src=${character.image} alt="" />
          </div>
          <div class="bottom">
            <h3>${character.name}</h3>
          </div>
        </a>
      `;
    });

    writePaginationItems(info);
  };

  const writePaginationItems = (info) => {
    pagination.innerHTML = null;

    if (currentPage > 1) {
      pagination.innerHTML += `
      <li>
        <a href="#" class="pIcons" id="prevPageBtn"><span class="material-icons">west</span></a>
      </li>`;
    }
    let currentPagelimit =
      currentPage + 5 > info.pages ? info.pages : currentPage + 5;
    for (let x = currentPage; x <= currentPagelimit; x++) {
      pagination.innerHTML += `
    <li>
      <a href="#" class="${
        info.pages === currentPage && "currentPageNumber"
      }" data-page-number=${x}><span>${x}</span></a>
    </li>
    `;
    }

    if (currentPage < info.pages) {
      pagination.innerHTML += `
      <li>
        <a href="#" class="pIcons" id="nextPageBtn"><span class="material-icons">east</span></a>
      </li>`;
    }

    paginationEvent(info);
  };

  const paginationEvent = (info) => {
    const paginationItems = document.querySelectorAll("[data-page-number]");
    const nextPageBtn = document.querySelector("#nextPageBtn");
    const prevPageBtn = document.querySelector("#prevPageBtn");

    paginationItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        currentPage = parseInt(item.getAttribute("data-page-number"));
        oneC.get().then((json) => writeCharacters(json));
      });
    });

    nextPageBtn?.addEventListener("click", (e) => {
      currentPage++;
      oneC.get().then((json) => writeCharacters(json));
    });

    prevPageBtn?.addEventListener("click", (e) => {
      currentPage--;
      oneC.get().then((json) => writeCharacters(json));
    });
  };
  oneC.get().then((json) => {
    writeCharacters(json);
  });
  ara.addEventListener("keyup", (key) => {
    name = key.target.value;
    oneC.search().then((json) => {
      writeCharacters(json);
      console.log(json.info);
    });
  });
});
