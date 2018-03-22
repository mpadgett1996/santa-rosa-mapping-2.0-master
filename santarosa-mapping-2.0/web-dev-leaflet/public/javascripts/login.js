// Login feature for admin users.
$("#submit-login").click(function() {
    $.post('/login/login', {
        username: $("#username").val(),
        password: $("#password").val()
    });
    window.alert("Login credentials submitted.");
});