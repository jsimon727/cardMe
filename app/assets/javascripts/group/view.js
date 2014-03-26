function renderGroupsPopup(){
  console.log("POP UP VIDEO!");

  // create and append popup!
  var popup = $("<ul class ='groups_popup'>");
  popup.appendTo($(this).parent());
  
  //for each group, show the group
  for(var i=0; i < CardMe.groups.length; i++ ){
    var groupId   = CardMe.groups[i].id;
    var groupName = CardMe.groups[i].name;
    var connectionId = popup.siblings(".add").data("connection")

    var listItem = $("<li data-group=" + groupId + ">" + groupName + "</li>")
    listItem.appendTo(popup);
    
    $("<input type='checkbox'>")
      .attr("checked",    isCheckboxChecked(groupId, connectionId))
      .data("group",      groupId)
      .data("connection", connectionId)
      .prependTo(listItem)
      .on("change", function() {
        if(this.checked === false) {
          deleteGroupConnection(connectionId, $(this).parent().data("group"));
        } else {
          postGroupConnection(connectionId,   $(this).parent().data("group"));
        }
      });
  }
  $("<button class='popup-save'> Close </button>")
    .appendTo(popup)
    .on("click", function() {
      popup.remove();
    });
}


function postGroupConnection(connectionId, groupId) {
  $.ajax({
    url: "/groupsconnections",
    data: {connection: connectionId, group: groupId},
    type: "POST"
  });
};

function deleteGroupConnection(connectionId, groupId) {
  $.ajax({
    url: "/groupsconnections",
    data: {connection: connectionId, group: groupId},
    type: "DELETE"
  });
};

function isCheckboxChecked(groupId, connectionId){
  console.log("Connection ID: " + connectionId);
  console.log("Group ID: "      + groupId);

  for(var i = 0; i < CardMe.groupsconnections.length; i++){
    if( (CardMe.groupsconnections[i].connectionId == connectionId ) && 
        (CardMe.groupsconnections[i].groupId == groupId ) ){
      return true;
    }
  }
  return false;
}



// CardMe.groupsconnections 

 // $("ul.groups_popup").remove();
//   popup = $("<ul class='groups_popup'>");
//   popup.appendTo($(this).parent());
//   cardID = $(this).parent().parent().attr("id");
//   var connectionID;

//   // match connection to card ID
//   for(var x=0; x<allConnections.length; x++){
//       if(allConnections[x].connection.card_id === cardID){
//       connectionID = allConnections[x].connection.id;
//     }
//   }