/* name of the cards in the deck */
const cardNames = ['diamond', 'paper-plane-o', 'anchor', 'bolt', 'cube', 'anchor', 'leaf', 'bicycle', 'diamond', 'bomb','leaf', 'bomb', 'bolt', 'bicycle', 'paper-plane-o', 'cube']
/* assigns to variable the list of cards */
let cards = $('li.card');
/* when a user opens the first card of a duo, this variable will hold the element of the first card */
let currentCard = null;
/* total number of moves, when a user opens a pair of cards, it counts as a move */
let moves = 0;
/* checks if the timer is moving */
let hasTimerStarted = false;
/* the number minutes since the game started */
let minutesLabel = document.getElementById("minutes");
/* the number of seconds since the game started */ 
let secondsLabel = document.getElementById("seconds");
/* the html element in which the total number of minutes the user needed to complete the game will be displayed */
let finalTimeMinutes = document.getElementById("timeMinutes");
/* the html element in which the total number of seconds the user needed to complete the game will be displayed */
let finalTimeSeconds = document.getElementById("timeSeconds");
/* internal javascript id related to setInterval operation that defines the game's timer */
let intervalId;
/* the total number of seconds the user needed to complete the game */
let totalSeconds = 0;
/* the number of stars in the beginning of the game */
let rating = 3;
let stars = $('.stars li');

/* Get the modal */
var modal = document.getElementById('myModal');

/* When the user clicks anywhere outside of the modal, close it */
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

/* Shuffle the list of cards; shuffle function from http://stackoverflow.com/a/2450976 */
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    
	return array;
}


function create_card(cardClassName) {
	var card = '<i class="fa fa-' + cardClassName +'"></i>'; 
	return card;
}

/* Start game: loop through each card to create its HTML and add each card's HTML to the page  */	
function initGame() {
	shuffle(cardNames);
	for (var i = 0; i < cardNames.length; i++) {
		var card = create_card (cardNames[i]);
		$(cards[i]).html(card);
	}
}

function isAlreadyMatched(card){
	return $(card).hasClass('match');
}

function displayCard (card) {
	$(card).addClass('show open');
}

function compareCards (card1, card2) {
	var x = $(card1).find("i");
	var y = $(card2).find("i");
	return x[0].className === y[0].className; 
}

function matchCards (card1, card2) {
	$(card1).removeClass('show open');
	$(card2).removeClass('show open');
	$(card1).addClass('match');
	$(card2).addClass('match');	
}

function closeCards (card1, card2) {
	$(card1).removeClass('show open');
	$(card2).removeClass('show open');
	$('.card').each(function(){this.addEventListener('click', onClickHandler);});
}

/* html is ready to go */
$( document ).ready(function() {
    initGame();
	$('.card').each(function(){this.addEventListener('click', onClickHandler);});
	$('.restart').each(function(){this.addEventListener('click', restartGame);});
	$('.close').each(function(){this.addEventListener('click', function(){modal.style.display = "none";})});
});	

/* timer */
function setTime() {
  ++totalSeconds;
  secondsLabel.innerHTML = pad(totalSeconds % 60);
  minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}


function pad(val) {
  var valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}		

/* describes the behaviour of the cards as they are clicked by the user */
function onClickHandler(){
	var clickedCard = this;
	if (!hasTimerStarted) {
		intervalId = setInterval(setTime, 1000);
		hasTimerStarted = true;
	}
	if(isAlreadyMatched(clickedCard)){
		return;
	}
	else if ($(clickedCard).hasClass('open')) {
		return;
	}
	else if(currentCard == null){
		displayCard(clickedCard);
		currentCard = clickedCard; 
	}
	else if(currentCard !== null) {
		displayCard(clickedCard);
		var compareResult = compareCards(currentCard, clickedCard);
		if(compareResult) {
			matchCards(currentCard, clickedCard);
		}
		else {
			$('.card').each(function(){this.removeEventListener('click', onClickHandler);});
			setTimeout(closeCards, 900, currentCard, clickedCard);
		}
		moveCounter();
		$($('.moves')[0]).html(moves);
		updateStars();
		currentCard = null;
		
		if(isGameOver()){
			modal.style.display = "block";
			clearInterval(intervalId);
			$('#moves-final').html(moves);
			$('#timeMinutes').html(pad(parseInt(totalSeconds / 60)));
			$('#timeSeconds').html(totalSeconds % 60);
			for(i=0; i<rating; i++){
				 $("#rating-final").append('<i class="fa fa-star"></i>');
			 }
		}
	}
}

/* increment the move counter */
function moveCounter() { 
	moves++;
}

/* remove stars according to the number of moves made by the user */
function updateStars () {
	if (moves > 11 && moves <= 14){
		$(stars[2]).css("visibility", "hidden");
		rating = 2;
	}		
	else if (moves > 14 && moves <= 18) {
		$(stars[1]).css("visibility", "hidden");
		rating = 1;
	}
	else if (moves > 18) {
		$(stars[0]).css("visibility", "hidden");
		rating = 0;
	}	
}

/* restarts game: makes the three stars (rating) visible, closes the cards, moves the counter to 0 and sets the timer to 0 */
function restartGame () {
	$(stars[0]).css("visibility", "visible");
	$(stars[1]).css("visibility", "visible");
	$(stars[2]).css("visibility", "visible");
	
	for (i=0; i < cards.length; i++) {
		$(cards[i]).removeClass('show open match');
		$(cards[i]).html(' ');
	}
	moves = 0;
	$($('.moves')[0]).html(moves);
	totalSeconds = 0;
	clearInterval(intervalId);
	secondsLabel.innerHTML = '00';
	minutesLabel.innerHTML = '00';
	hasTimerStarted = false;
	initGame();
}

function isGameOver() {
	return $('.match').length == 16;
}	


/*

 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)

*/
 

