import * as model from './model.js';
import recipeView from './views/recipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    //Getting dynamically id from the url (window.location is the entire url)
    const id = window.location.hash.slice(1);
    console.log(id);
    //Guard clause
    if (!id) return;
    recipeView.renderSpinner(); //parentEl is recipeContainer
    //Loading recipe
    await model.loadRecipe(id); //we get access to state.recipe from model.js

    //Rendering recipe
    recipeView.render(model.state.recipe); //this render methid will accept this data and store to the RecipeView object
  } catch (err) {
    alert(err);
  }
};

//when we copy url and paste it in new tab not loading recipe, solution

//Listen for hashchange
// window.addEventListener('hashchange', controlRecipes );

// //Listen for load event
// window.addEventListener('load', controlRecipes );

//shorthand:
['hashchange', 'load'].forEach(ev =>
  window.addEventListener(ev, controlRecipes)
);
