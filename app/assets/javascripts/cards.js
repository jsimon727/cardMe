var allGroups;
var allCards;
var allConnections;

function addGroups() {
  $('#group_form').on("submit", function(e){
    e.preventDefault();
    input = $('input#group_group_name');
    $.ajax({
      url: '/users/' + localStorage["user_id"] + '/groups',
      // localStorage["user_id"] is a key for a special localstorage hash
      // that can be found in application.html.erb DmitryJ
      type: 'POST',
      data: {group_name: input.val()}
    });
    input.val("");
  showGroups();
  });
}


function getConnections(){
  $.getJSON("/connections", function(response){
    allConnections = response;
    $("ul.connection-cards").empty();
    for(var i = 0; i < allConnections.length; i++){
      if(allConnections[i].user_id == localStorage["user_id"]) {
        makeCards(i);
      }
    }
  });
}

function makeCards(i){
  $.getJSON("/cards/" + allConnections[i].card_id, function(cardFound) {
    var cards = $("<div class='card' id='" + cardFound.id + "' data-connection='" + allConnections[i].id + "'>");
    var cardmenu = $("<div class='cardmenu'></div>")
    var cardContainer = $("<div class='cardContainer'></div>")
    $(cards).appendTo("ul.connection-cards");
    $("<li>" + "Email: " + cardFound.email + "</li>").appendTo(cards);
    $("<li>" + "Phone Number: " + cardFound.phone_number + "</li>").appendTo(cards);
    $("<li>" + "Organization: " + cardFound.organization + "</li>").appendTo(cards);
    $("<li>" + "Position: " + cardFound.position + "</li>").appendTo(cards);

    if (parseInt(cardFound.id) <= 9){
      $(".card").css({"background-image": "url('http://s3.amazonaws.com/cardMe/cards/background_images/000/000/00" + cardFound.id + "/original/" + cardFound.background_image_file_name + "')" });
    } else if ((parseInt(cardFound.id) <= 99)) {
    $(".card").css({"background-image": "url('http://s3.amazonaws.com/cardMe/cards/background_images/000/000/0" + cardFound.id + "/original/" + cardFound.background_image_file_name + "')" });
    } else {
      $(".card").css({"background-image": "url('http://s3.amazonaws.com/cardMe/cards/background_images/000/000/" + cardFound.id + "/original/" + cardFound.background_image_file_name + "')" });
    }

    $("<button class='add'> + </button>").appendTo(cardmenu).on("click", addCardToGroup);
    $("<button class='arrow'> > </button>").appendTo(cardmenu).on("click", cardDashboard);
    $("<button id="+ allConnections[i].id +" class='delete-connection'> x </button>").appendTo(cardmenu).on("click", deleteConnection);
    $(cardmenu).insertAfter(cards)
    $(cardmenu).appendTo(cardContainer)
    $(cards).appendTo(cardContainer)
    $(cardContainer).appendTo($(".connection-cards"));
  });
}

function deleteConnection(){
    var deleteButtonId = $(this).attr("id")
    console.log(deleteButtonId)
    $.ajax({
    url: '/connections/' + deleteButtonId,
    type: "DELETE",
    success: function(){
      getConnections(); 
    }
  })
}


function addCardToGroup(){
  $('#add-group').remove();
  $("ul.groups_popup").detach();
  $("<ul class='groups_popup'>").appendTo($(this).parent());

  var connection_id = $(this).parent().parent().find(".card").attr("data-connection");
  // Making ajax request to get all the groups
  $.getJSON("/users/" + localStorage["user_id"] + "/groups", function(response){
    allGroups = response;
    // Get all of the connections that are already grouped together
    $.getJSON("/user/" + connection_id + "/groupsconnections", function(response) {
      var current_connections = response;

      // Iterate through the groups and make a new li and checkbox for the user to make a choice
      for(var i = 0; i < allGroups.length; i++) {
        var checkbox = $("<input type='checkbox'>");
                $("<li id=" + allGroups[i].id + ">" + allGroups[i].group_name + "</li>").appendTo("ul.groups_popup").append(checkbox);
        $(checkbox).on("change", selectGroup);

        // Iterate through the table that has the information about which cards have already been connected to a specific group, and if they have been connected previously, check the checkbox true. Otherwise leave it blank.
        for(var j = 0; j < current_connections.length; j++){
          if((current_connections[j].connection_id === parseInt(connection_id)) && (current_connections[j].group_id === allGroups[i].id)){
            $(checkbox).prop('checked', true);
          } else {
            $(checkbox).prop('checked', false);
          }
        }
        // Append the li and the checkbox(including it's value) to the popup div called groups_popup

      }
    });
    // This button closes the popup box and refreshes all of the connections 
    $("<button>Add To Groups</button>").appendTo("ul.groups_popup").on("click", getConnections);
  });
}

function selectGroup() {
  var group_id = $(this).parent().attr('id');
  var connection_id = $(this).parent().parent().parent().attr("data-connection");
  // This posts the connection to whatever group is checked
  if(this.checked === true){
    $.ajax({
      url: "/groupsconnections",
      data: {connection: connection_id, group: group_id},
      type: "POST"
    });
  } else {
    // This deletes the connection from a group
    $.ajax({
      url: "/groupsconnections",
      data: {connection: connection_id, group: group_id},
      type: "DELETE"
    });
  }
}



function showGroups() {
  $.getJSON("/users/" + localStorage["user_id"] + "/groups", function(response) {
    allGroups = response;
    $("ul.groups").empty();
    for(var i = 0; i < allGroups.length; i++) {
      ($("<li>" + allGroups[i].group_name + "</li>").append("<span id="+ allGroups[i].id + ">" + ' X ' + "</span>")).appendTo("ul.groups");
    }// for loop ends
    $("span").on("click", function(e){
      var groupId = e.target.id;
      $.ajax({
        url: '/users/' + localStorage["user_id"] + '/groups/' + groupId,
        type: "DELETE",
        success: function(){
          e.target.parentElement.remove();
        }//ends removing element from dom
      });
      //ajax closed
    });// ends listener
  });// ends getJSON
}// ends showGroups


function cardDashboard(){
  $(".showcard div").remove();
  $(this).parent().parent().find(".card").clone().appendTo(".showcard");
  $(".showcard .cardmenu").remove();
  cardId = $(".showcard .card").attr("id");
  console.log(cardId);
  $(".articles li").remove();
  $.get("/card_dashboard/"+cardId, {card_id: cardId}, function(response){
      companySummary = response[0]["company_summary"];
      $("<div class='company_summary'> Summary:" + companySummary + "</div>").appendTo(".company-summary-box");
      companyNews = response[0].news;
      for (var i = 0; i < 4; i++){
        newsResponse = companyNews[i];
        $(".articles").append($("<a href='" + newsResponse["Url"] + "'><li>" + newsResponse["Title"] + "</li></a>"));
      }
    });
}


cardDashboard();
getConnections();
showGroups();
addGroups();

