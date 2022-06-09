import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import SearchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import PaginationView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';
import searchView from './views/searchView.js';
import paginationView from './views/paginationView.js';

//coming from parcel
// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    //Getting dynamically id from the url (window.location is the entire url)
    const id = window.location.hash.slice(1);
    // console.log('id:', id);
    //Guard clause
    if (!id) return;
    recipeView.renderSpinner(); //parentEl is recipeContainer

    //0) Update results view to markselected search result
    resultsView.update(model.getSearchResultsPage());
    //1) Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    //2) Loading recipe
    ////not storing it in any variable as not return anything just manipulating the state
    await model.loadRecipe(id); //we get access to state.recipe from model.js

    //3) Rendering recipe
    recipeView.render(model.state.recipe); //this render methid will accept this data and store to the RecipeView object
  } catch (err) {
    //rendering error to ui
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //Get search query
    const query = searchView.getQuery();
    if (!query) return;
    //not storing it in any variable as not return anything just manipulating the state
    //Load search results
    await model.loadSearchResults(query);
    //Render results
    // console.log(model.state.search.results);
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());
    //Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

//controller will be executed when the click on the btn happens
const controlPagination = function (goToPage) {
  console.log(goToPage);
  //Render new results

  resultsView.render(model.getSearchResultsPage(goToPage));
  //Render new pagination buttons
  paginationView.render(model.state.search);
};

//Controll servings
const controlServings = function (newServings) {
  //Update recipe servings in state
  model.updateServings(newServings);
  //Update the recipeView
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //Add or remove bookmark
  // console.log(model.state.recipe.bookmarked);
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // console.log(model.state.recipe);
  //Update recipeview
  recipeView.update(model.state.recipe);
  //Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //Show loading spinner
    addRecipeView.renderSpinner();
    console.log(newRecipe);
    //Upload new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    //Render recipe
    recipeView.render(model.state.recipe);
    //Success message
    addRecipeView.renderMessage();

    //Render bookmark view: we always use this when we want to incert a new element
    bookmarksView.render(model.state.bookmarks);

    //Change ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`); //pushstate method allow us to change the url without reloading the page

    //Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('!!!', err);
    addRecipeView.renderError(err.message);
  }
};

//Implement publisher subscriber pattern
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdataservings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
