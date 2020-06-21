class View {
  constructor() {
    this.app = document.getElementById("app");

    this.title = this.createElement("h1", "title");
    this.title.textContent = "GitHub Searsh Repositories";

    this.searchLine = this.createElement("div", "search_line");
    this.searchInput = this.createElement("input", "search_input");
    this.divForSearchButton = this.createElement("div", "for_search_button");
    this.searchButton = this.createElement("button", "search_button");
    this.searchButton.innerHTML = "&#128269";

    this.divForSearchButton.append(this.searchButton);
    this.searchLine.append(this.searchInput);
    this.searchLine.append(this.divForSearchButton);

    this.repoesWrap = this.createElement("div", "repoes-wrapper");
    this.repoesList = this.createElement("ul", "repoes-list");
    this.repoesWrap.append(this.repoesList);

    this.main = this.createElement("div", "main");
    this.main.append(this.repoesWrap);

    this.app.append(this.title);
    this.app.append(this.searchLine);
    this.app.append(this.main);
  }

  createElement(elementTag, elementClass) {
    const element = document.createElement(elementTag);
    if (elementClass) {
      element.classList.add(elementClass);
    } 
    return element;
  }

  createRepo(repoData) {
    const repoElement = this.createElement("li", "repo");
    repoElement.innerHTML = `<h2 class="repo_name">Name: ${repoData.name}</h2>
                             <span>Number of stars: ${repoData.stargazers_count} </span><br>
                             <span>Date of the last commit: ${repoData.updated_at}</span><br>
                             <span>link: ${repoData.git_url}</span>`
    this.repoesList.append(repoElement);
  }
}

//сколько элементов отображать на одной странице
const REPOES_PER_PAGE = 10;

class Search {
  constructor(view) {
    this.view = view;
    this.view.searchButton.addEventListener("click", this.searchRepoes.bind(this));
  }

  async searchRepoes() {
    return await fetch(`https://api.github.com/search/repositories?q=${this.view.searchInput.value}&per_page=${REPOES_PER_PAGE}`).
    then((res) => {
        if (res.ok) {
          res.json().then(res => {
            res.items.forEach(repository => this.view.createRepo(repository))
          })
        } else {
          //ошибка
        }
    })
  }
}


new Search(new View());