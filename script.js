$(document).ready(function() {
  var money = 1000;

  var values = [2,3,4,5,6,7,8,9,10,"J", "Q", "K", "A"];
  var suits = ["Diamond", "Club", "Heart", "Spade"]
  var deck = [];

  var dealerHand = $("#dealer-cards");
  var playerHand = $("#player-cards");

  var dealerCards = [];
  var playerCards = [];

  var dealerScore = 0;
  var playerScore = 0;

  // set the initial money to 1000
  setMoney(money);

  // on bet-button click
  $("#bet-button").on("click", function() {
    var bet = $("#bet").val();
    // make a standard 52 card deck
    makeDeck(values, suits, deck);
    // store the bet, which returns a function to deal cards if bet fits logic
    if (storeBet(bet, money)) {
      dealCards(deck, dealerCards, playerCards, dealerHand, playerHand);
      if (handValue(playerCards) == "Blackjack!") {
        endGame(player, true);
      }
    }
  });
  // play again button click
  $("#play-again").on("click", function() {
    $("#gen-msg, #bet-amount").text("");
    $("#bet, #bet-button, .action-button").removeClass("is-hidden");
    $(this).addClass("is-hidden");
    // clear all hands
    clearHands(dealerCards, playerCards, dealerHand, playerHand);
  });

});

// function to set the current amount of money
function setMoney(amount) {
  $("#player-money").text("Money: "+ amount);
  money = amount;
  return money;
}

// function to make the 52 car deck
function makeDeck(values, suits, deck) {
  // loop thru card suits
  for (var i = 0; i < suits.length; i++) {
     var suit = suits[i];
     // loop thru card values
     for (var n = 0 ; n < values.length; n++) {
       var value = values[n];
       // create a card object with the suit and value
       var card = {value: value, suit: suit};
       // push card to deck
       deck.push(card);
     }
  }
}

// function to set and store the bet
function storeBet(bet, amount) {
  // set minimum bet at 2
  if (bet < 2) {
    console.log("Invalid bet amount");
    $("#bet-amount").text("");
    $("#bet-error").text("Bet must be >= 2");
    return false;
  }
  // bet cannot exceed amount of money
  else if (bet > amount) {
    console.log("Bet amount greater than money");
    $("#bet-amount").text("");
    $("#bet-error").text("You don't have enough money!");
    return false;
  }
  // set bet and return true
  else {
    console.log("Bet is " + bet);
    $("#bet-error").text("");
    $("#bet-amount").text("Bet: " + bet);
    $("#bet, #bet-button").addClass("is-hidden");
    setMoney(amount - bet);
    return true;
  }
}

// function to deal cards
function dealCards(deck, dealer, player, dealerHand, playerHand) {
  // function to deal a single card to a person
  function dealCard(person) {
    // set random variable
    var rand = Math.floor(Math.random() * deck.length);
    // set card to a random card in the deck
    var card = deck[rand];
    // push that card to the person's hand
    person.push(card);
    // remove that card from the deck
    deck.splice(rand, 1);
  }
  // deal cards alternatively to dealer and player
  dealCard(dealer);
  dealCard(player);
  dealCard(dealer);
  dealCard(player);

  // add the dealer's cards to the DOM, show 2nd card as hidden
  for (var i = 0; i < dealer.length; i++) {
    if (i == 0) {
      dealerHand.append($("<p class='card'></p>").append(dealer[i].value + " " + dealer[i].suit));
    } else {
      dealerHand.append($("<p class='card'></p>").text("Hidden"));
    }
  }
  // add the player's cards to the DOM
  for (var n = 0; n < player.length; n++) {
    playerHand.append($("<p class='card'></p>").append(player[n].value + " " + player[n].suit));
  }
}

function clearHands(dealer, player, dealerHand, playerHand) {
  // clear all hands
  dealer.length = 0;
  player.length = 0;
  // remove past round's cards from the DOM
  dealerHand.empty();
  playerHand.empty();
}

// function to calculate the value of a card
function cardValue(card) {
  // if the card is J, Q, K and is not an A, value is 10
  if (isNaN(card.value) && card.value !== "A") {
    return 10;
  }
  // else if the card is an A, value is 11
  else if (card.value == "A") {
    return 11;
  }
  // else card is face value
  else {
    return card.value;
  }
}

// function to calculate the score of a hand
function handValue(hand) {
  var temp_value = 0;
  var num_aces = 0;
  // loop through the hand and add the value to the temp_value var
  // if the hand has an ace, add one to the value of num_aces var
  for (var i = 0; i < hand.length; i++) {
    if (hand[i] == "A") {
      num_aces += 1;
    }
    temp_value += cardValue(hand[i]);
  }

  while (num_aces > 0) {
    if (temp_value > 21) {
      temp_value -= 10;
      num_aces -= 1;
    }
    else {
      break;
    }
  }

  if (temp_value < 21) {
    return temp_value;
  }
  else if (temp_value == 21) {
    return "Blackjack!";
  }
  else {
    return "Bust";
  }
}

function endGame(winner, Boolean) {
  var message = $("#gen-msg");
  // natural wins and game ends
  if (Boolean) {
    message.text("Natural. You win!");
    $("#play-again").removeClass("is-hidden");
    $(".action-button").addClass("is-hidden");
  }
  else if (winner == player) {
    message.text("You win!");
  }
  else {
    message.text("Dealer wins.");
  }
}
