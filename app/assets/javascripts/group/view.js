function renderGroupsPopup(){

  var popup = $("<ul class ='groups_popup'>")
  popup.appendTo($(this).parent());
  for(var i=0; i < CardMe.groups.length; i++ ){
    var group = $("<li data-connection=" + CardMe.groups[i].id + ">" + CardMe.groups[i].name + "</li>")
    group.appendTo(popup);
    var checkbox = $("<input type='checkbox'>");
    checkbox.prop("checkbox", false);
    isCheckboxChecked(checkbox);
    checkbox.appendTo(group);

    var groupId = checkbox.parent().attr("data-connection");
    console.log("groupid:" + groupId)
    var connectionId = checkbox.parent().parent().parent().find(".add").attr("data-connection");
    console.log("connectionId" + connectionId)

    checkbox.attr("data-connection", connectionId)
    checkbox.attr("data-group", groupId)

    checkbox.on("change", function() {
      if(this.checked === false) {
         deleteGroupConnection(connectionId, groupId)
      } else {
        postGroupConnection(connectionId, groupId)
    }
  })
}
  $("<button class='popup_save'> Close </button>").appendTo(popup);
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

function isCheckboxChecked(checkbox){
  console.log("checkboxinsidecheckfunction:" + checkbox);
  
  var connectionId = checkbox.attr("data-connection");
  var groupId = checkbox.attr("data-group");

  console.log("Connection ID" + connectionId);
   console.log("Group ID" + groupId);


  for(var i = 0; i < CardMe.groupsconnections.length; i++){
    if((CardMe.groupsconnections[i].connectionId == connectionId ) && (CardMe.groupsconnections[i].groupId == groupId )){
        checkbox.prop("checked", true);
        console.log("HERE!");
    }
  }
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