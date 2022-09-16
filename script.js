function chamaApi(url) {
  const promise = new Promise(function (resolve, reject) {
    const req = new XMLHttpRequest();

    req.onload = function (event) {
      const dados = JSON.parse(req.response);

      if (dados.detail === "Not found") {
        reject("Não encontrado");
      } else {
        resolve(dados);
      }
    };

    req.open("GET", url);
    req.responseType = "application/json";
    req.send();
  });

  return promise;
}
const buttonEl = document.querySelector("#botao");
buttonEl.addEventListener("click", () => {
  const inputEL = document.querySelector("#id");

  const nameEL = document.querySelector("#name");
  const birthEl = document.querySelector("#birthyear");
  const heightEl = document.querySelector("#height");
  const genderEl = document.querySelector("#gender");

  const homeworldEl = document.querySelector("#homeworld");
  const populationEl = document.querySelector("#population");
  const listaEl = document.querySelector("#li");

  const id = inputEL.value;

  const url = `https://swapi.dev/api/people/${id}`;
  function puxarInfoChar(character) {
    nameEL.innerHTML = "Nome : " + character.name;
    birthEl.innerHTML = "Ano de Nascimento : " + character.birth_year;
    heightEl.innerHTML = "Altura : " + character.height + " cm";
    genderEl.innerHTML =
      "Genero : " +
      character.gender[0].toUpperCase() +
      character.gender.substr(1);
    return chamaApi(character.homeworld);
  }

  chamaApi(url)
    .then(puxarInfoChar)
    .then((Planet) => {
      homeworldEl.innerHTML =
        "Planeta Natal: " +
        Planet.name[0].toUpperCase() +
        Planet.name.substr(1);
      populationEl.innerHTML = "Habitantes: " + Planet.population;
      const promises = Planet.films.map((filmUrl) => chamaApi(filmUrl));
      return Promise.all(promises);
    })
    .then((filmes) => {
      listaEl.innerHTML = "";

      for (let filme of filmes) {
        const li = document.createElement("li");
        li.innerText = `${filme.title} (${filme.release_date})`;
        listaEl.appendChild(li);
      }
    })
    .catch((error) => {
      const errorEl = document.querySelector("#error");
      errorEl.innerHTML = error;
      errorEl.style.color = "red";
    });
});
