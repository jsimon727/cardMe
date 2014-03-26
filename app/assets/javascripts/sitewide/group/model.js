function Group(name, id) {
 this.name = name
 this.id = id
 // this.updateConnected();
}

// ConnectionGroup.prototype.updateConnected = function(){
 //ajax call that sets the connected status to what is in the database

// }


Group.getGroups = function(){
  $.getJSON("/users/" + localStorage["user_id"] + "/groups", function(userGroups){
    for(var i=0; i < userGroups.length; i++){
      var group = new Group(userGroups[i].group_name, userGroups[i].user_id);
      CardMe.groups.push(group);
    }
  }).success(Application);
}


