//Definitions
var blapronURL = 'https://www.blueapron.com/recipes/';
var corsURL = 'http://cors.io/?u=' + blapronURL; //user cors.io for cross domain function
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


//get recipe function
function getRecipe(corsURL){
    var recipeNumber = getRandomInt(minRecipe, maxRecipe).toString();

    //Restart function if using excluded number
    if(recipeNumber === exclude){
        getRecipe();
    }
    corsURL = corsURL + recipeNumber;
    try{
      httpGet(corsURL);
    }
    catch(err){
      console.log(err);
      getRecipe();
    }
    //Figure out how to catch the error here
    //recipePage now holds values

    //restart function if you get a 404 page
    if(recipePage.indexOf('js-RecipeArea') === -1){
        getRecipe();
    }

    var recipeResult = document.createElement('div');
    recipeResult.innerHTML = recipePage;

    var recipeImage = recipeResult.getElementsByClassName('rec-splash-img')[0].src;
    var recipeTitle = recipeResult.getElementsByClassName('main-title')[0].textContent;
    var recipeSubtitle = recipeResult.getElementsByClassName('sub-title')[0].textContent;
    var recipeTime;
    var recipeServings;
    var recipeLink = recipeResult.getElementsByClassName('pdf-download-link')[0].href;

    var recipeDiv = document.createElement('div');
    recipeDiv.className = 'recipe';

    var recipeMarkup = '<div class="recipe__image" style="background-image: url('+ recipeImage +')"></div><a class="recipe__regenerate" onclick="recipeRegenerate()" href=""> &#x27f2;</a><div class="recipe__details"><h2 class="recipe__title">' + recipeTitle + '</h2><h3 class="recipe__subtitle">'+ recipeSubtitle +'</h3><table class="recipe__meta"><tbody><tr><th>Cooking Time</th><th>Servings</th></tr><tr><td class="meta__time">'+ recipeTime +'</td><td class="meta__servings">'+ recipeServings +'</td></tr></tbody></table><a class="recipe__pdf-link" href="'+ recipeLink +'">Download PDF</a></div></div><div class="recipe__blind">';

    recipeDiv.innerHTML = recipeMarkup;
    console.log(recipeDiv);
    document.getElementById('recipes').appendChild(recipeDiv);
}



//generate recipes loop
function generateRecipes(corsURL){
    var loopCounter = document.getElementById('generator__number').value;
    while(loopCounter !== 0){
        getRecipe(corsURL);
        loopCounter--;
    }
}
//generate recipes function
document.getElementById("generate-recipes").addEventListener("click", function(){
    generateRecipes(corsURL);
});
