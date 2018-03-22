//Report features. Must add event handler to document because button is generated dynamically
$("#submit-report").click(function (evt) {
    $.post('/report', {
        layer: $("#layer").val(),
        ID: $("#feature-id").val(),
        field: $("#field").val(),
        why: $("#why").val(),
        email: $("#email").val(),
        reportType: $("#reportType").val()
    });
    window.alert("Thank you, this feature will be reviewed by a member of our staff.");
    window.location.replace("/map");
});