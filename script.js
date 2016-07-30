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


//get recipe function
function getRecipe(){
    var blapronURL = 'https://www.blueapron.com/recipes/';
    var corsURL = 'http://cors.io/?u=' + blapronURL; //user cors.io for cross domain function
    var recipeNumber = getRandomInt(minRecipe, maxRecipe).toString();
    blapronURL = blapronURL + recipeNumber;
    corsURL = corsURL + recipeNumber;

    //Restart function if using excluded number
    if(recipeNumber === exclude){
        getRecipe();
    }

    //Figure out how to catch the error here
    try{
      httpGet(corsURL);
    }
    catch(err){
      console.log("YIKES AHOY");
      getRecipe();
    }
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
    //var recipeTime;
    //var recipeServings;
    var recipeMeta = recipeResult.getElementsByClassName('nutrition-information')[0].innerHTML;
    var recipeLink = recipeResult.getElementsByClassName('pdf-download-link')[0].href;

    var recipeMarkup = '<a class="recipe__regenerate" onclick="recipeRegenerate(this)" href="#"> &#x27f2;</a><div class="recipe__image" style="background-image: url('+ recipeImage +')"></div><div class="recipe__details"><h2 class="recipe__title"><a href="'+ blapronURL +'" target="_blank">' + recipeTitle + '</a></h2><h3 class="recipe__subtitle">'+ recipeSubtitle +'</h3><div class="nutrition-information">'+ recipeMeta +'</div><a class="recipe__pdf-link" href="'+ recipeLink +'" download>Download PDF</a></div></div><div class="recipe__blind">';

    //This part should be in the generate Recipes function
    /*var recipeDiv = document.createElement('div');
    recipeDiv.className = 'recipe';
    recipeDiv.innerHTML = recipeMarkup;
    document.getElementById('recipes').appendChild(recipeDiv);*/
    return recipeMarkup;
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
    var recipe = clickedLink.parentNode;
    recipe.innerHTML = "";
    var regeneratedRecipe = getRecipe();
    recipe.innerHTML = regeneratedRecipe;
}
