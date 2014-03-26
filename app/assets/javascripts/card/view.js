Card.prototype.render = function() {
    var cards = $("<div id=" + this.card.id + " class='card'>");
    var cardmenu = $("<div class='cardmenu'>x");
    var cardContainer = $("<div class='cardContainer'>");
    cardContainer.appendTo(".connection-cards");
    cardmenu.appendTo(cardContainer);
    cards.appendTo(cardContainer);

    console.log(this);
    console.log($(this));

    $("<li>" + "Email: " + this.card.email + "</li>").appendTo(cards);
    $("<li>" + "Phone Number: " + this.card.phone_number + "</li>").appendTo(cards);
    $("<li>" + "Organization: " + this.card.organization + "</li>").appendTo(cards);
    $("<li>" + "Position: " + this.card.position + "</li>").appendTo(cards);
    $("<button class='add' data-connection=" + this.card.id + "> + </button>").appendTo(cardmenu).on("click", renderGroupsPopup);
    $("<button class='arrow'> > </button>").appendTo(cardmenu).on("click", cardDashboard);

}