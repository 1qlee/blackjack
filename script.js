$(document).ready(function() {
  var button = $("#bet-button");
  var money = 1000;

  var values = [2,3,4,5,6,7,8,9,10,"J", "Q", "K", "A"];
  var suits = ["Diamond", "Clubs", "Heart", "Spade"]
  var deck = [];

  function makeDeck(values, suits, deck) {
    for (var i = 0; i < suits.length; i++) {
       var suit = suits[i];

       for (var n = 0 ; n < values.length; n++) {
         var value = values[n];
         var card = {value: value, suit: suit};
         deck.push(card);
       }
    }
  }

  makeDeck(values, suits, deck);

  setMoney(money);

  button.on("click", function() {
    var bet = $("#bet").val();
    storeBet(bet, money, deck);
  });

  console.log(deck);

});

function dealCards(deck) {
  var dealer = $("#dealer-cards");
  var player = $("#player-cards");

  function dealCard(person) {
    var card = deck[Math.floor(Math.random() * deck.length)];
    person.append($("<p></p>").append(card.value + " " + card.suit));
    deck.splice(deck.indexOf(), 1);
    console.log(deck);
  }

  dealCard(dealer);
  dealCard(player);
  dealCard(dealer);
  dealCard(player);
}

function storeBet(bet, money, deck) {
  if (bet < 2) {
    console.log("Invalid bet amount");
    $("#bet-amount").text("");
    $("#bet-error").text("Bet must be >= 2");
  }
  else if (bet > money) {
    console.log("Bet amount greater than money");
    $("#bet-amount").text("");
    $("#bet-error").text("You don't have enough money!");
  }
  else {
    console.log("Bet is " + bet);
    $("#bet-error").text("");
    $("#bet-amount").text("Bet: " + bet);
    $("#bet, #bet-button").hide();
    setMoney(money - bet);
    return dealCards(deck);
  }
}

function setMoney(money) {
  var moneyCounter = $("#player-money");
  moneyCounter.text("Money: "+ money);
}
