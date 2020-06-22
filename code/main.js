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

    //pagenator доделать, переделать
    this.pages = this.createElement("div", "pages_div");
    for (let i = 1; i <= 5; i++) {
      this.linkPage = this.createElement("span", "link_page");
      this.linkPage.innerHTML = i;
      this.pages.append(this.linkPage);
    }

    this.main.append(this.pages);

    this.app.append(this.title);
    this.app.append(this.searchLine);
    this.app.append(this.main);
  }

/**
 * [createElement description]
 * @param  {[type]} elementTag   [description]
 * @param  {[type]} elementClass [description]
 * @return {[type]}              [description]
 */
  createElement(elementTag, elementClass) {
    const element = document.createElement(elementTag);
    if (elementClass) {
      element.classList.add(elementClass);
    } 
    return element;
  }

/**
 * [createRepo description]
 * @param  {[type]} repoData [description]
 * @return {[type]}          [description]
 */
  createRepo(repoData) {
    const repoElement = this.createElement("li", "repo");
    repoElement.innerHTML = `<h2 class="repo_name">Name: ${repoData.name}</h2>
                             <span>Number of stars: ${repoData.stargazers_count} </span><br>
                             <span>Date of the last commit: ${repoData.updated_at}</span><br>
                             <span>link: ${repoData.git_url}</span>`
    this.repoesList.append(repoElement);
  }

  clearRepoes() {
    this.repoesList.innerHTML = '';
  }
}


const REPOES_PER_PAGE = 10;
class Search {
  constructor(view) {
    this.view = view;
    this.view.searchButton.addEventListener("click", this.searchRepoes.bind(this));
    for (let i = 0; i < document.getElementsByClassName("link_page").length; i++) {
      document.getElementsByClassName("link_page")[i].addEventListener("click", this.loadMorePages.bind(this, i));
    }
  }

/**
 * [currentPageNumber description]
 * @return {[type]} [description]
 */
  get currentPageNumber() {
    return this.currentPage;
  }

/**
 * [setCurrentPageValue description]
 * @param {[type]} pageNumber [description]
 */
  setCurrentPageValue(pageNumber) {
    this.currentPage = pageNumber;
  }

/**
 * [searchRepoes description]
 * @return {[type]} [description]
 */
  async searchRepoes() {
    this.view.clearRepoes();
    return await fetch(`https://api.github.com/search/repositories?q=${this.view.searchInput.value}&per_page=${REPOES_PER_PAGE}&page=${this.currentPage}`).
    then((res) => {
        if (res.ok) {
          res.json().then(res => {
            res.items.forEach(repository => {
              this.view.createRepo(repository)
            })
          })
        } else {
          console.log('Error 2' + response.status);
        }
    })
  }

/**
 * [loadMorePages description]
 * @param  {[type]} i [description]
 * @return {[type]}   [description]
 */
  loadMorePages(i){
    this.view.clearRepoes();
    this.setCurrentPageValue(i + 1);
    this.loadRepoes(this.view.searchInput.value, this.currentPageNumber).then(response => this.updateRepoes(response, true))
  }

/**
 * [loadRepoes description]
 * @param  {[type]} searchValue [description]
 * @param  {[type]} page        [description]
 * @return {[type]}             [description]
 */
  async loadRepoes(searchValue, page) {
    return await fetch(`https://api.github.com/search/repositories?q=${this.view.searchInput.value}&per_page=${REPOES_PER_PAGE}&page=${page}`);
  }


/**
 * [updateRepoes description]
 * @param  {[type]}  response [description]
 * @param  {Boolean} isUpdate [description]
 * @return {[type]}           [description]
 */
  updateRepoes(response, isUpdate = false) {
    let repoes;
    if (response.ok) {
      if (!isUpdate) {
        this.view.clearRepoes();
      }
      response.json().then((res) => {
        if (res.items) {
          repoes = res.items;
          repoes.forEach(repo => this.view.createRepo(repo));
        } else {
          this.view.clearRepoes();
        }
      });
    } else {
      console.log('Error 1' + response.status);
    }
  }
}

new Search(new View());



class CardView {
  constructor() {
    this.appCard = document.getElementById("appCard");
    this.mainDiv = this.createElement("div", "main_div");
    this.appCard.append(this.mainDiv);
  }

  createElement(elementTag, elementClass) {
    const element = document.createElement(elementTag);
    if (elementClass) {
      element.classList.add(elementClass);
    } 
    return element;
  }

  createRepoCard(repoCardData) {
    const infoList = this.createElement("ul", "info_list");
    infoList.innerHTML = `<li><h1>${repoCardData.name}</h1></li>
                          <li><span>Number of stars: ${repoCardData.stargazers_count}</span></li>
                          <li><span>Date of the last commit: ${repoCardData.updated_at}</span></li>
                          <li><img src="${repoCardData.avatar_url}"></li>
                          <li>List of languages: ${repoCardData.languages_url}</li>
                          <li>Brief description: ${repoCardData.description}</li>
                          <li>Contributors: ${repoCardData.contributors_url}</li>`
    this.mainDiv.append(this.infoList);
  }
}

class FillCard {
  constructor(cardView) {
    this.cardView = cardView;

  }

 async cardDataFill() {
  return await fetch(`https://api.github.com/search/repositories?q=${this.view.searchInput.value}&per_page=${REPOES_PER_PAGE}&page=${this.currentPage}`).
  then((res) => {
      if (res.ok) {
        res.json().then(res => {
          res.items.forEach(repository => this.view.createRepoCard(repository))
        })
      } else {
        //ошибка
      }
    })
  }
}