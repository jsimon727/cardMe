
// one for each ConnectionGroup
function ConnectionGroup(connectionId, groupId) {
 this.connectionId = connectionId;
 this.groupId      = groupId;
 // this.updateConnected();
}

// ConnectionGroup.prototype.updateConnected = function(){
 //ajax call that sets the connected status to what is in the database

// }

ConnectionGroup.prototype.connect = function(){
  $.ajax({
    url: "/groupsconnections",
    data: {connection: this.connectionId, group: this.groupId},
    type: "POST"
  });
}

ConnectionGroup.prototype.disconnect = function(){
   $.ajax({
    url: "/groupsconnections",
    data: {connection: this.connectionId, group: this.groupId},
    type: "DELETE"
  });
}

ConnectionGroup.getConnectionsGroups = function(){
  $.getJSON("/groupsconnections", function(groupsconnections) {
    for(var i=0; i<groupsconnections.length; i++) {
      var connectiongroup = new ConnectionGroup(groupsconnections[i].connection_id, groupsconnections[i].group_id)
      CardMe.groupsconnections.push(connectiongroup);
    }
  }).success(Application);
 //ajax call to get all groups, and then loop for each group and instantiate a new ConnectionGroup

 //render a ul
 //for each group, create a connectiongroup object
 //render the new object
}
