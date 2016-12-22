var want_levels = {
	unknown: "unknown",
	none: "do not want",
	low: "sort of want",
	med: "want it!",
	max: "NEED IT!!!",
};

var claim_states = {
	unclaimed: "unclaimed",
	claimed: "claimed",
	completed: "completed",
};

var relationship_states = {
    you: "you",
    stranger: "stranger",
    request_out: "request_out",
    request_in: "request_in",
    friend: "friend",
};

var create_item = function(name, link, want_level, claimed_by) {
	var item = {};
	
	item.name = name;
	item.link = link;
	item.want_level = want_level;
	
	item.claimed_by = claimed_by;
	
	return item;
};

var create_person = function(name) {
	var person = {};
	
	person.name = name;
	
	person.friend_ids = [];
	person.request_in_ids = [];
	person.request_out_ids = [];
	
	person.interests = [];
	
	person.wishlist = []; //items added
	person.suggestions = []; //items suggested by friends
	
	return person;
};

var people = [];

var create_test_data = function() {
    
    var person = create_person("Sami");
    person.interests.push("Makeup");
    person.wishlist.push(create_item("Final Fanasy XV", "www.google.ca", want_levels.max));
    person.wishlist.push(create_item("Lipstick", "www.google.ca", want_levels.max, {id: 0, name: "John"}));
    person.wishlist.push(create_item("Zelda Keychain", "www.google.ca", want_levels.max, {id: 2, name: "Laura"}));
    person.suggestions.push(create_item("Cat tail", "www.google.ca", want_levels.max));
    people[1] = person;
    var person = create_person("Laura");
    people[2] = person;
    var person = create_person("Jacob");
    people[3] = person;
    var person = create_person("Steve");
    people[4] = person;
    var person = create_person("Clarisse");
    people[5] = person;
    var person = create_person("Jessica");
    people[6] = person;
	
    var person = create_person("John");
    
    person = create_person("John");
    
    person.interests.push("Nintendo");
    person.interests.push("Virtual Reality");
    person.interests.push("Ponies");
    
    person.wishlist.push(create_item("PS4 Headset", "www.google.ca", want_levels.max));
    person.wishlist.push(create_item("The Last Guardian", "www.google.ca", want_levels.med));
    person.wishlist.push(create_item("Season 1 DVD", "www.google.ca", want_levels.low));
    
    person.friend_ids.push({id: 1, name: people[1].name});
    person.friend_ids.push({id: 2, name: people[2].name});
    person.friend_ids.push({id: 3, name: people[3].name});
    person.request_in_ids.push({id: 5, name: people[5].name});
    person.request_out_ids.push({id: 6, name: people[6].name});
    
    people[0] = person;
    
    people[1].friend_ids.push({id: 0, name: people[0].name});
    people[2].friend_ids.push({id: 0, name: people[0].name});
    people[3].friend_ids.push({id: 0, name: people[0].name});
    people[3].friend_ids.push({id: 4, name: people[4].name});
    people[4].friend_ids.push({id: 3, name: people[3].name});
    people[5].request_out_ids.push({id: 0, name: people[0].name});
    people[6].request_in_ids.push({id: 0, name: people[0].name});
};
create_test_data();

var get_person_details = function(person_id, requester_id) {
 
    var results = {};
    
    //case A: no person with that id
    //error
    if (! people[person_id]) {
        return results;
    }
    
    //case B: no requester with that id
    //error
    if (! people[requester_id]) {
        return results;
    }
    
    results.name = people[person_id].name;
    results.id = person_id;
    
    //case C: that person is you
    //interests
    //friends
    //wishlist
    if (person_id == requester_id) {
        results.relationship = relationship_states.you;
//        results.relationship = relationship_states.stranger;
//        results.relationship = relationship_states.request_out;
//        results.relationship = relationship_states.request_in;
//        results.relationship = relationship_states.friend;
        
        results.friend_ids = people[person_id].friend_ids;
        results.request_in_ids = people[person_id].request_in_ids;
        results.request_out_ids = people[person_id].request_out_ids;
        
        results.interests = people[person_id].interests;
        results.wishlist = people[person_id].wishlist;
        
        return results;
    }
    
    //case D: friends
    //interests
    //friends
    //wishlist
    //suggestions
    var friend = people[requester_id].friend_ids.find(function(person_base) {
        return person_base.id == person_id;
    });
    if (friend) {
        results.relationship = relationship_states.friend;
        
        results.friend_ids = people[person_id].friend_ids;
        results.request_in_ids = people[person_id].request_in_ids;
        results.request_out_ids = people[person_id].request_out_ids;
        
        results.interests = people[person_id].interests;
        results.wishlist = people[person_id].wishlist;
        results.suggestions = people[person_id].suggestions;
        
        return results;
    }
    
    //case E: request sent
    //nothing
    var request_sent = people[requester_id].request_out_ids.find(function(person_base) {
        return person_base.id == person_id;
    });
    if (request_sent) {
        results.relationship = relationship_states.request_out;
        return results;
    }
    
    //case F: request received
    //nothing
    var request_got = people[requester_id].request_in_ids.find(function(person_base) {
        return person_base.id == person_id;
    });
    if (request_got) {
        results.relationship = relationship_states.request_in;
        return results;
    }
    
    //case G: strangers
    //nothing
    results.relationship = relationship_states.stranger;
    return results;
};

var urlParams;
init = function () {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
    
    var person_details = get_person_details(urlParams.id, "0");

    render_header();
    render_profile(person_details);
    render_friends(person_details);
    render_interests(person_details);
    render_wishlist(person_details);
    render_suggestions(person_details);
    
};

var render_header = function () {

    var link_to_you = document.getElementById("header_link_to_you");
    link_to_you.href = "person.html?id=0";
};

var render_profile = function (person_details) {

    var name_tag = document.getElementById("profile_name");
    var profile_message = document.getElementById("profile_message");
    var id_tag = document.getElementById("profile_id");
    
    if (person_details.name) {
        name_tag.textContent = person_details.name;
        id_tag.textContent = "ID: " + person_details.id;
    } else {
        profile_message.textContent = "There is no person here.  Turn back.";
        return;
    }
    
    switch (person_details.relationship) {
        case relationship_states.you:
            profile_message.textContent = "This is your page. ";

            var button = document.createElement("button");
            button.textContent = "Delete Account";
            profile_message.appendChild(button);
            
            break;
        
        case relationship_states.stranger:
            profile_message.textContent = "You are not yet friends with this person. ";
        
            var button = document.createElement("button");
            button.textContent = "Send Request";
            profile_message.appendChild(button);

            break;
        
        case relationship_states.request_out:
            profile_message.textContent = "You have already sent this person a friend request. ";
        
            var button = document.createElement("button");
            button.textContent = "Cancel Request";
            profile_message.appendChild(button);
            
            break;
        
        case relationship_states.request_in:
            profile_message.textContent = "They sent you a friend request. ";
        
            var button = document.createElement("button");
            button.textContent = "Accept";
            profile_message.appendChild(button);

            var button2 = document.createElement("button");
            button2.textContent = "Decline";
            profile_message.appendChild(button2);
            
            break;
        
        case relationship_states.friend:
            profile_message.textContent = "This person is your friend. ";
        
            var button = document.createElement("button");
            button.textContent = "End Friendship";
            profile_message.appendChild(button);
            
            break;
        
        default:
            console.error("unexpected relationship state when trying to render profile " + person_details.relationship);
    }
};


var render_friends = function (person_details) {
    
    var div = document.getElementById("friends");
    var message = document.getElementById("friends_message");
    var list = document.getElementById("friends_list");
    var table = document.getElementById("friends_table");
    table.style.display = "none";
    
    if (! person_details.name) {
        div.style.display = "none";
        return;
    }
    
    switch (person_details.relationship) {
        case relationship_states.you:
                        
            //add every friend to the table
            person_details.friend_ids.forEach(function(friend_base) {
                var row = table.insertRow(-1);
                
                var cell = row.insertCell(-1);
                var link = document.createElement("a");
                link.textContent = friend_base.name;
                link.href = "person.html?id=" + friend_base.id;
                cell.appendChild(link);
                
                var cell = row.insertCell(-1);
                cell.textContent = "Friend";
                
                var cell = row.insertCell(-1);
                var button = document.createElement("button");
                button.textContent = "End";
                cell.appendChild(button);
            });
            
            //add every request_in to the table
            person_details.request_in_ids.forEach(function(friend_base) {
                var row = table.insertRow(-1);
                
                var cell = row.insertCell(-1);
                var link = document.createElement("a");
                link.textContent = friend_base.name;
                link.href = "person.html?id=" + friend_base.id;
                cell.appendChild(link);
                
                var cell = row.insertCell(-1);
                cell.textContent = "Request Received";
                
                var cell = row.insertCell(-1);
                var button = document.createElement("button");
                button.textContent = "Accept";
                cell.appendChild(button);
                var button = document.createElement("button");
                button.textContent = "Decline";
                cell.appendChild(button);
            });
            
            //add every request_out to the table
            person_details.request_out_ids.forEach(function(friend_base) {
                var row = table.insertRow(-1);
                
                var cell = row.insertCell(-1);
                var link = document.createElement("a");
                link.textContent = friend_base.name;
                link.href = "person.html?id=" + friend_base.id;
                cell.appendChild(link);
                
                var cell = row.insertCell(-1);
                cell.textContent = "Request Sent";
                
                var cell = row.insertCell(-1);
                var button = document.createElement("button");
                button.textContent = "Cancel";
                cell.appendChild(button);
            });
            
            var row = table.insertRow(-1);
            var cell = row.insertCell(-1);
            cell.textContent = "Enter new ID:";
            
            var cell = row.insertCell(-1);
            var input = document.createElement("input");
            cell.appendChild(input);
            
            var cell = row.insertCell(-1);
            var button = document.createElement("button");
            button.textContent = "Check ID";
            cell.appendChild(button);
            
            
            table.style.display = "table";
            
            //header row and new row
            if (table.rows.length <= 2) {
                table.rows[0].style.display = "none";
                message.textContent = "You don't have any friends yet!";
            }
            
            break;
        
        case relationship_states.stranger:
        case relationship_states.request_out:        
        case relationship_states.request_in:
            message.textContent = "You can not yet see this person's friends.";
            
            break;
            
        case relationship_states.friend:
            
            person_details.friend_ids.forEach(function(friend_base) {
                var item = document.createElement("li");
                var link = document.createElement("a");
                link.textContent = friend_base.name;
                link.href = "person.html?id=" + friend_base.id;
                item.appendChild(link);
                list.appendChild(item);
            });
            break;
        
        default:
            console.error("unexpected relationship state when trying to render friends " + person_details.relationship);
    }
};


var render_interests = function (person_details) {
var div = document.getElementById("interests");
    var message = document.getElementById("interests_message");
    var list = document.getElementById("interests_list");
    var table = document.getElementById("interests_table");
    table.style.display = "none";
    
    if (! person_details.name) {
        div.style.display = "none";
        return;
    }
    
    switch (person_details.relationship) {
        case relationship_states.you:
            
            //add every interest to the table
            person_details.interests.forEach(function(interest) {
                var row = table.insertRow(-1);
                var cell = row.insertCell(-1);
                cell.textContent = interest;
                
                var cell = row.insertCell(-1);
                var button = document.createElement("button");
                button.textContent = "Delete";
                cell.appendChild(button);
            });
            
            var row = table.insertRow(-1);
            var cell = row.insertCell(-1);
            var input = document.createElement("input");
            cell.appendChild(input);
            
            var cell = row.insertCell(-1);
            var button = document.createElement("button");
            button.textContent = "Add New";
            cell.appendChild(button);
            
            table.style.display = "table";
            
            break;
        
        case relationship_states.stranger:
        case relationship_states.request_out:        
        case relationship_states.request_in:
            message.textContent = "You can not yet see this person's interests.";
            
            break;
            
        case relationship_states.friend:
            
            table.style.display = "none";
            
            person_details.interests.forEach(function(interest) {
                var item = document.createElement("li");
                item.textContent = interest;
                list.appendChild(item);
            });
            
            if (person_details.interests.length <= 0) {
                message.textContent = "They don't have any interests yet!";
            }
            break;
        
        default:
            console.error("unexpected relationship state when trying to render interests " + person_details.relationship);
    }
};

var render_wishlist = function (person_details) {
    var div = document.getElementById("wishlist");
    var message = document.getElementById("wishlist_message");
    var table = document.getElementById("wishlist_table");
    table.style.display = "none";
    var claim_header = document.getElementById("wishlist_claim_header");
    
    if (! person_details.name) {
        div.style.display = "none";
        return;
    }
    
    switch (person_details.relationship) {
        case relationship_states.you:
            
            claim_header.parentElement.removeChild(claim_header);
            
            //add every item to the table
            person_details.wishlist.forEach(function(item) {
                var row = table.insertRow(-1);
                var cell = row.insertCell(-1);
                cell.textContent = item.name;
                
                var cell = row.insertCell(-1);
                var link = document.createElement("a");
                link.href = item.link;
                link.textContent = "link";
                cell.appendChild(link);
                
                var cell = row.insertCell(-1);
                cell.textContent = item.want_level;
                
                var cell = row.insertCell(-1);
                var button = document.createElement("button");
                button.textContent = "Delete";
                cell.appendChild(button);
            });
            
            var row = table.insertRow(-1);
            var cell = row.insertCell(-1);
            var input = document.createElement("input");
            cell.appendChild(input);

            var cell = row.insertCell(-1);
            var input = document.createElement("input");
            cell.appendChild(input);

            var cell = row.insertCell(-1);
            var select = document.createElement("select");
            var want_levels_array = [];
            want_levels_array.push(want_levels.unknown);
            want_levels_array.push(want_levels.none);
            want_levels_array.push(want_levels.low);
            want_levels_array.push(want_levels.med);
            want_levels_array.push(want_levels.max);
            want_levels_array.forEach(function(want_level) {
                var option = document.createElement("option");
                option.textContent = want_level;
                select.appendChild(option);
            });
            select.selectedIndex = 3;
            cell.appendChild(select);
            
            var cell = row.insertCell(-1);
            var button = document.createElement("button");
            button.textContent = "Add New";
            cell.appendChild(button);
            
            table.style.display = "table";
            
            //header row and new row
            if (table.rows.length <= 2) {
                table.rows[0].style.display = "none";
                message.textContent = "You don't have any wishes yet!";
            }
            
            break;
        
        case relationship_states.stranger:
        case relationship_states.request_out:        
        case relationship_states.request_in:
            message.textContent = "You can not yet see this person's wishlist.";
            
            break;
            
        case relationship_states.friend:
            
            //add every item to the table
            person_details.wishlist.forEach(function(item) {
                var row = table.insertRow(-1);
                var cell = row.insertCell(-1);
                cell.textContent = item.name;
                
                var cell = row.insertCell(-1);
                var link = document.createElement("a");
                link.href = item.link;
                link.textContent = "link";
                cell.appendChild(link);
                
                var cell = row.insertCell(-1);
                cell.textContent = item.want_level;
                
                var cell = row.insertCell(-1);
                if (item.claimed_by) {
                    cell.textContent = "Claimed by " + item.claimed_by.name;
                } else {
                    cell.textContent = "Unclaimed ";
                }
                
                var cell = row.insertCell(-1);
                if (item.claimed_by) {
                    //todo: hook this up to current user
                    if (item.claimed_by.id == "0") {
                        var button = document.createElement("button");
                        button.textContent = "Unclaim";
                        cell.appendChild(button);
                    }
                } else {
                    var button = document.createElement("button");
                    button.textContent = "Claim";
                    cell.appendChild(button);
                }
            });
            
            //header row and new row
            if (table.rows.length <= 2) {
                table.rows[0].style.display = "none";
                message.textContent = "They don't have any wishes yet!";
            }
            
            table.style.display = "table";
            break;
        
        default:
            console.error("unexpected relationship state when trying to render wishlist " + person_details.relationship);
    }
};

var render_suggestions = function (person_details) {
    var div = document.getElementById("suggestions");
    var message = document.getElementById("suggestions_message");
    var table = document.getElementById("suggestions_table");
    table.style.display = "none";
    var claim_header = document.getElementById("suggestions_claim_header");
    
    if (! person_details.name) {
        div.style.display = "none";
        return;
    }
    
    switch (person_details.relationship) {
        case relationship_states.you:
            message.textContent = "You can not see your own suggestions.";
            
            break;
        
        case relationship_states.stranger:
        case relationship_states.request_out:        
        case relationship_states.request_in:
            message.textContent = "You can not yet see this person's wishlist.";
            
            break;
            
        case relationship_states.friend:
            
            //add every item to the table
            person_details.suggestions.forEach(function(item) {
                var row = table.insertRow(-1);
                var cell = row.insertCell(-1);
                cell.textContent = item.name;
                
                var cell = row.insertCell(-1);
                var link = document.createElement("a");
                link.href = item.link;
                link.textContent = "link";
                cell.appendChild(link);
                
                var cell = row.insertCell(-1);
                cell.textContent = item.want_level;
                
                var cell = row.insertCell(-1);
                if (item.claimed_by) {
                    cell.textContent = "Claimed by " + item.claimed_by.name;
                } else {
                    cell.textContent = "Unclaimed ";
                }
                
                var cell = row.insertCell(-1);
                if (item.claimed_by) {
                    //todo: hook this up to current user
                    if (item.claimed_by.id == "0") {
                        var button = document.createElement("button");
                        button.textContent = "Unclaim";
                        cell.appendChild(button);
                    }
                } else {
                    var button = document.createElement("button");
                    button.textContent = "Claim";
                    cell.appendChild(button);
                }
            });
            
            var row = table.insertRow(-1);
            var cell = row.insertCell(-1);
            var input = document.createElement("input");
            cell.appendChild(input);

            var cell = row.insertCell(-1);
            var input = document.createElement("input");
            cell.appendChild(input);

            var cell = row.insertCell(-1);
            var select = document.createElement("select");
            var want_levels_array = [];
            want_levels_array.push(want_levels.unknown);
            want_levels_array.push(want_levels.none);
            want_levels_array.push(want_levels.low);
            want_levels_array.push(want_levels.med);
            want_levels_array.push(want_levels.max);
            want_levels_array.forEach(function(want_level) {
                var option = document.createElement("option");
                option.textContent = want_level;
                select.appendChild(option);
            });
            select.selectedIndex = 0;
            cell.appendChild(select);
            
            var cell = row.insertCell(-1);
            var check = document.createElement("input");
            check.type = "checkbox";
            check.id = "claim_check";
            cell.appendChild(check);
            var label = document.createElement("label");
            label.htmlFor = "claim_check";
            label.textContent = "Claim";
            cell.appendChild(label);
            
            var cell = row.insertCell(-1);
            var button = document.createElement("button");
            button.textContent = "Add New";
            cell.appendChild(button);
            
            //header row and new row
            if (table.rows.length <= 2) {
                //table.rows[0].style.display = "none";
                message.textContent = "They don't have any suggestions yet!";
            }
            
            table.style.display = "table";
            break;
        
        default:
            console.error("unexpected relationship state when trying to render suggestions " + person_details.relationship);
    }
};