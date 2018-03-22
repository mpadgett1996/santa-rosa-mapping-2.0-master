/* For adding new admin users */
$("#submit-new-user").click(function() {
    $.post('/addUser', {
        username: $("#newUsername").val(),
        password: $("#newPassword").val()
    });
    window.alert("User has been added as an administrator.");
});

/* For deleting admin users from the db */
$("#submit-user-remove").click(function() {
    $.post('/removeUser', {
        username: $("#removeUsername").val()
    });
    window.alert("User marked for deletion.");
});

/* For searching pins in db */
/* Does this also need layer information? */

/* Also need to convert AttributeToQuery value into
the actual field from the database. Right now it is
just a generic description of the field so that
a new user knows what to search for.
*/


$("#submit-pin-query").click(function() {
    $.post('/searchPin', {
        AttributeToQuery: $("#AttributeToQuery").val(),
        StringToQuery: $("#StringToQuery").val()
    });
    window.alert("Pin search submitted.");
});

/* For deleting pins in the db */
$("#submit-pin-remove").click(function() {
    $.post('/removePin', {
        featureID: $("#AttributeToQuery").val()
    });
    window.alert("Pin marked for deletion.");
});