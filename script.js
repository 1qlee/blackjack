$(document).ready(function() {
  var values = [2,3,4,5,6,7,8,9,10,"J", "Q", "K", "A"];
  var suits = ["Diamond", "Clubs", "Heart", "Spade"]
  var deck = [];
  var button = $("#bet-button");

  makeDeck(values, suits, deck);

  button.on("click", function() {
    var bet = $("#bet").val();
    storeBet(bet);
  });

});

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

function dealCards(deck) {
  var randomCard = deck[Math.floor(Math.random() * deck.length)];
  console.log(randomCard);
  var dealerCard = $("<p></p>")
  $(".dealer-cards").append(dealerCard.append(randomCard.value + randomCard.suit));
}

function storeBet(bet) {
  if (bet < 2) {
    console.log("Invalid bet amount");
    $("#bet-amount").text("");
    $("#bet-error").text("Bet must be >= 2");
  }
  else {
    console.log("Bet is " + bet);
    $("#bet-error").text("");
    $("#bet-amount").text("Bet is " + bet);
    $("#bet, #bet-button").hide();
  }
}
