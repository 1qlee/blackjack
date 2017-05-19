$(document).ready(function() {
  var values = [2,3,4,5,6,7,8,9,10,"J", "Q", "K", "A"];
  var suits = ["diamonds", "clubs", "hearts", "spades"]
  var deck = [];

  var dealerHand = $("#dealer-cards");
  var playerHand = $("#player-cards");

  var dealerCards = [];
  var playerCards = [];

  var dealerScore = 0;
  var playerScore = 0;

  // set the initial money to 1000
  setMoney(1000);

  // on bet-button click
  $("#bet-button").on("click", function() {
    // money vars
    var bet = parseInt($("#bet").val());
    var moneyValue = $("#player-money").text().substring(7);
    var money = parseInt(moneyValue);
    // make a standard 52 card deck
    makeDeck(values, suits, deck);
    // store the bet, which returns a function to deal cards if bet fits logic
    if (storeBet(bet, money)) {
      // show all action buttons
      $(".action-button").removeClass("is-hidden");
      // deal cards
      dealCards(deck, dealerCards, playerCards, dealerHand, playerHand);
      addCards(dealerCards, playerCards, dealerHand, playerHand);
      // check score
      checkScore(playerCards, dealerCards, "natural");
    }
  });
  // play again button click
  $("#play-again").on("click", function() {
    $("#gen-msg, #bet-amount").text("");
    $("#bet, #bet-button").removeClass("is-hidden");
    $(this).addClass("is-hidden");
    // clear all hands
    newGame(deck, dealerCards, playerCards, dealerHand, playerHand);
  });
  // hit button click
  $("#hit").on("click", function() {
    hit(deck, playerHand, playerCards);
    checkScore(playerCards, dealerCards, "checkPlayer");
  });
  // stand button click
  $("#stand").on("click", function() {
    stand(deck, dealerHand, dealerCards);
    checkScore(playerCards, dealerCards, "checkAll");
  });
  $("#surrender").on("click", function() {
    return endGame("You surrendered, losing half your bet.", "surrender");
  });

});

// function to hit
function hit(deck, playerHand, playerCards) {
  // deal one card
  dealCard(playerCards, deck, "player");
  // set variable equal to that card
  var lastCard = playerCards[playerCards.length - 1];
  console.log("Player hits, adding " + lastCard.value + " of " + lastCard.suit);
  // append the card to the DOM
  playerHand.append($("<p class='card'></p>").append(
    "<p class='value'>" + lastCard.value + "<span class='suit " + lastCard.suit + "'></span>" + "</p>",
    "<p class='value'>" + "<span class='suit " + lastCard.suit + "'></span>" + lastCard.value + "</p>"
  ));
}

// function to stand
function stand(deck, dealerHand, dealerCards) {
  // dealer flips card
  revealHiddenCard();
  // set var for dealer's current score
  var dealerScore = handValue(dealerCards)[1];
  console.log("Dealer score is " + dealerScore);
  // while his current score is less than 17, deal him another card
  while (dealerScore < 17) {
    dealCard(dealerCards, deck, "dealer");
    dealerScore = handValue(dealerCards)[1];
    // set variable equal to that card
    var lastCard = dealerCards[dealerCards.length - 1];
    console.log("Player stands, adding " + lastCard.value + " of " + lastCard.suit +" to dealer's hand.");
    // append the card to the DOM
    dealerHand.append($("<p class='card'></p>").append(
      "<p class='value'>" + lastCard.value + "<span class='suit " + lastCard.suit + "'></span>" + "</p>",
      "<p class='value'>" + "<span class='suit " + lastCard.suit + "'></span>" + lastCard.value + "</p>"
    ));
  }
}

// function to reveal dealer's hidden hand (on stand)
function revealHiddenCard() {
  $("#hidden-card").removeClass("is-hidden");
  $("#dummy-card").addClass("is-hidden");
}

// function to set the current amount of money
function setMoney(amount) {
  $("#player-money").text("Money: " + amount);
  console.log("Setting money at " + amount);
}

// function to make the 52 card deck
function makeDeck(values, suits, deck) {
  console.log("Making 52 card deck");
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
function storeBet(bet, money) {
  var betAmount = $("#bet-amount");
  var message = $("#bet-error");
  // set minimum bet at 2
  if (bet < 2) {
    console.log("Invalid bet amount");
    betAmount.text("");
    message.text("Bet must be >= 2");
    return false;
  }
  // bet cannot exceed amount of money
  else if (bet > money) {
    console.log("Bet amount greater than money");
    betAmount.text("");
    message.text("You don't have enough money!");
    return false;
  }
  // set bet and return true
  else {
    console.log("Bet is " + bet);
    betAmount.text("Bet: " + bet);
    message.text("");
    $("#bet, #bet-button").addClass("is-hidden");
    money -= bet;
    setMoney(money);
    return true;
  }
}

// function to check score
function checkScore(playerCards, dealerCards, action) {
  var playerScore = handValue(playerCards)[1];
  var dealerScore = handValue(dealerCards)[1];

  console.log("Checking score...");
  console.log("Player score is " + playerScore);
  console.log("Dealer score is " + dealerScore);
  // logic for player winning or losing (w naturals incl)
  if (action == "natural") {
    if (playerScore == 21) {
      revealHiddenCard();
      if (dealerScore == playerScore) {
        return endGame("It's a tie! Bet resetting.", "tie");
      }
      else {
        return endGame("Natural! You win!", "natural");
      }
    }
  }
  if (action == "checkPlayer") {
    if (playerScore > 21) {
      return endGame("Bust...", "lose");
    }
  }
  if (action == "checkAll") {
    if (dealerScore > 21) {
      return endGame("Dealer busts... You win!", "win");
    }
    else if (dealerScore > playerScore) {
      return endGame("Dealer wins.", "lose");
    }
    else if (dealerScore == playerScore) {
      if (dealerCards.length > playerCards.length) {
        return endGame("You win!", "win");
      }
      else if (dealerCards.length < playerCards.length){
        return endGame("Dealer wins", "lose");
      }
      else {
        return endGame("It's a tie! Bet resetting.", "tie");
      }
    }
    else {
      return endGame("You win!", "win");
    }
  }
}

// function to deal a single card to a person
function dealCard(personsCards, deck, person) {
  console.log("Dealt card to " + person);
  // set random variable
  var rand = Math.floor(Math.random() * deck.length);
  // set card to a random card in the deck
  var card = deck[rand];
  // push that card to the person's hand
  personsCards.push(card);
  // remove that card from the deck
  deck.splice(rand, 1);
}

// function to deal cards
function dealCards(deck, dealerCards, playerCards, dealerHand, playerHand) {
  console.log("Dealing cards...");
  // deal cards alternatively to dealer and player
  dealCard(dealerCards, deck, "dealer");
  dealCard(playerCards, deck, "player");
  dealCard(dealerCards, deck, "dealer");
  dealCard(playerCards, deck, "player");
}

// function to add cards to the DOM
function addCards(dealerCards, playerCards, dealerHand, playerHand) {
  // add the dealer's cards to the DOM, show 2nd card as hidden
  for (var i = 0; i < dealerCards.length; i++) {
    if (i == 0) {
      dealerHand.append($("<p class='card'></p>").append(
        "<p class='value'>" + dealerCards[i].value + "<span class='suit " + dealerCards[i].suit + "'></span>" + "</p>",
        "<p class='value'>" + "<span class='suit " + dealerCards[i].suit + "'></span>" + dealerCards[i].value + "</p>"
      ));
    }
    else {
      dealerHand.append($("<p id='dummy-card' class='card'></p>").text("Hidden"));
      dealerHand.append($("<p id='hidden-card' class='card is-hidden'></p>").append(
        "<p class='value'>" + dealerCards[i].value + "<span class='suit " + dealerCards[i].suit + "'></span>" + "</p>",
        "<p class='value'>" + "<span class='suit " + dealerCards[i].suit + "'></span>" + dealerCards[i].value + "</p>"
      ));
    }
  }
  // add the player's cards to the DOM
  for (var n = 0; n < playerCards.length; n++) {
    playerHand.append($("<p class='card'></p>").append(
      "<p class='value'>" + playerCards[n].value + "<span class='suit " + playerCards[n].suit + "'></span>" + "</p>",
      "<p class='value'>" + "<span class='suit " + playerCards[n].suit + "'></span>" + playerCards[n].value + "</p>"
    ));
  }
}

// function to clear both players' hands (end of round)
function newGame(deck, dealer, player, dealerHand, playerHand) {
  console.log("Clearing hands...");
  // clear deck
  deck.length = 0;
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
    if (hand[i].value == "A") {
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
    return [String(temp_value), temp_value];
  }
  else if (temp_value == 21) {
    return ["Blackjack!", 21];
  }
  else {
    return ["Bust", temp_value];
  }
}

function endGame(msg, pay) {
  console.log("Round is over.");
  var message = $("#gen-msg");
  // blackjack
  console.log(msg);
  message.text(msg);

  $("#play-again").removeClass("is-hidden");
  $(".action-button").addClass("is-hidden");

  return payOut(pay);
}

function payOut(pay) {
  // money vars
  var bet = parseInt($("#bet").val());
  var moneyValue = $("#player-money").text().substring(7);
  var money = parseInt(moneyValue);

  if (pay == "tie") {
    return setMoney(money + bet);
  }
  else if (pay == "natural") {
    return setMoney(money + (bet * 2.5));
  }
  else if (pay == "win") {
    return setMoney(money + bet * 2);
  }
  else if (pay == "surrender") {
    return setMoney(money + bet * 0.5);
  }
  else {
    return setMoney(money);
  }
}
