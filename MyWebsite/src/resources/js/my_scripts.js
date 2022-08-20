function makeApiCall(){
  var input = document.getElementById("userInput").value;
  var url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${input}`;
  console.log(url);
  $.ajax({
    type:"GET",
    url: url,
    dataType: 'json'
  }).then(function(items){
    console.log(items.drinks[0]);
    for(var i = 0; i<5; i++){
      var element = items.drinks[i]
      var cardBody = document.createElement("div");
      cardBody.className = "card_body";
      cardBody.innerHTML = `<p id="${i}drink"> ${element.strDrink} </p> <p id="${i}Ingredient1"> ${element.strIngredient1} </p> <p id="${i}Ingredient2"> ${element.strIngredient2} </p> <p id="${i}Ingredient3"> ${element.strIngredient3} </p> <p id="${i}Instructions">${element.strInstructions}</p><button onclick="addSearchResult(${i})"> Add Search Result </button>`
      var card = document.createElement("div");
      card.className = "card";
      card.id = `card${i}`
      card.append(cardBody);
      document.getElementById("second").append(card);
    }
  })
}

function addSearchResult(id){
  var my_data={drinkName: '', drinkIngredient1: '', drinkIngredient2:'', drinkIngredient3:'', drinkInstructions:''}
  my_data['drinkName'] = document.getElementById(`${id}drink`).innerHTML
  my_data['drinkIngredient1'] = document.getElementById(`${id}Ingredient1`).innerHTML
  my_data['drinkIngredient2'] = document.getElementById(`${id}Ingredient2`).innerHTML
  my_data['drinkIngredient3'] = document.getElementById(`${id}Ingredient3`).innerHTML
  my_data['drinkInstructions'] = document.getElementById(`${id}Instructions`).innerHTML

  console.log(my_data)

  var url = '/main/addsearch';

  $.ajax({
    url:url,
    dataType: 'json',
    type:'POST',
    data: my_data
  }).then(function(items){
    console.log(items)
  })

}
