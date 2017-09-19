//Definitions
var exclude = 0; //To make sure a number doesn't come up when rerolled
var minRecipe = 250; //Magic numbers from Blue Apron guess and test
var maxRecipe = 949;
var recipePage;

//AJAX function from http://stackoverflow.com/a/10642418 Removed the IE5/6 tester because IDGAF
function httpGet(theUrl){
    var xmlhttp=new XMLHttpRequest();
    xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState===4 && xmlhttp.status===200){
            recipePage = xmlhttp.responseText;
        }
    };
    xmlhttp.open("GET", theUrl, false);
    xmlhttp.send();
}

//utility functions

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getIngredients(recipeResult){
    /* if the item isn't set, it returns null */
    var blapronIngredients = recipeResult.querySelectorAll('ul.ingredients-list li');
    blapronIngredients.forEach(function(entry){
        if(entry.indexOf('div.non-story') !== -1){
            entry = this.getElementsByClassName('non-story').innerHTML;
        }
    });
}

function parseBlapronIngredientList(entry){
    //return children of div.non-story || a.js-IngModalLink
    entry

}

//get recipe function
function getRecipe(){
    // CORS.io is apparently unreliable, so instead I'm using this extension to allow CORS https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi/related?hl=en

    var blapronURL = 'https://cors.io/?https://www.blueapron.com/recipes/';
    var recipeNumber = getRandomInt(minRecipe, maxRecipe).toString();
    blapronURL = blapronURL + recipeNumber;
    var clickableURL = 'https://blueapron.com/recipes/' + recipeNumber;

    //Restart function if using excluded number
    if(recipeNumber === exclude){
        getRecipe();
    }

    //Figure out how to catch the error here
    try{
      httpGet(blapronURL);
    }
    catch(err){
      getRecipe();
    }
    //recipePage now holds values

    //restart function if you get a 404 page
    //if(recipePage.indexOf('js-RecipeArea') === -1){
    //    getRecipe();
    //}

    var recipeResult = document.createElement('div');
    recipeResult.innerHTML = recipePage;

    var recipeImage = recipeResult.getElementsByClassName('img-max')[0].src;
    var recipeTitle = recipeResult.getElementsByClassName('ba-recipe-title__main')[0].textContent;
    var recipeSubtitle = recipeResult.getElementsByClassName('ba-recipe-title__sub mt-10')[0].textContent;
    //var recipeTime;
    //var recipeServings;
    //var recipeMeta = recipeResult.getElementsByClassName('nutrition-information')[0].innerHTML;
    var recipeMeta = null;
    var recipeLink = recipeResult.getElementsByClassName('pdf-download-link')[0].href;
    var recipeMarkup = '<a class="recipe__regenerate" onclick="recipeRegenerate(this)" href="#"> &#x27f2;</a><div class="recipe__image" style="background-image: url('+ recipeImage +')"></div><div class="recipe__details"><h2 class="recipe__title"><a href="'+ clickableURL +'" target="_blank">' + recipeTitle + '</a></h2><h3 class="recipe__subtitle">'+ recipeSubtitle +'</h3><a class="recipe__pdf-link" href="'+ recipeLink +'" download>Download PDF</a></div></div><div class="recipe__blind">';

    getIngredients(recipeResult);
    return recipeMarkup;
}

//Storage loop
function recipeTable(){
//Check if item is in Storage
//if not in storage, insert
//if in storage, get value
    //add current value to value
}

//generate recipes loop
function generateRecipes(){
    //Wipe out previous session
    localStorage.clear();

    document.getElementById('recipes').className = 'recipes loading';
    var loopCounter = document.getElementById('generator__number').value;
    while(loopCounter !== 0){
        var recipeMarkup = getRecipe();

        var recipeDiv = document.createElement('div');
        recipeDiv.className = 'recipe';
        recipeDiv.innerHTML = recipeMarkup;
        document.getElementById('recipes').appendChild(recipeDiv);

        loopCounter--;

    }
    document.getElementById('recipes').className = 'recipes';
}

//regenerate a specific recipe
function recipeRegenerate(clickedLink){
    //Roll in an exclude here? (Even though it's a 1 in 700 chance of a dupe)
    var recipe = clickedLink.parentNode;
    recipe.innerHTML = "";
    var regeneratedRecipe = getRecipe();
    recipe.innerHTML = regeneratedRecipe;
}
