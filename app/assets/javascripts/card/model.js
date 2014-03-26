function Card(cardName, userId, card) {
 this.cardName = cardName;
 this.userId = userId;
 this.card = card;
 // this.updateConnected();
}

Card.getCards = function(){
  $.getJSON("/cards", function(cards){
    for(var i=0; i < cards.length; i++){
      var card = new Card(cards[i].card_name, cards[i].user_id, cards[i]);
      CardMe.cards.push(card);
    }
  }).success(findCardToRenderAndRender);
}

