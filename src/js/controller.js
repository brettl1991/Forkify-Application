import * as model from './model.js';
import recipeView from './views/recipeView.js';
import SearchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import PaginationView from './views/resultsView.js';

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
    //Loading recipe
    ////not storing it in any variable as not return anything just manipulating the state
    await model.loadRecipe(id); //we get access to state.recipe from model.js

    //Rendering recipe
    recipeView.render(model.state.recipe); //this render methid will accept this data and store to the RecipeView object
  } catch (err) {
    //rendering error to ui
    recipeView.renderError();
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

//Implement publisher subscriber pattern
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdataservings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();
