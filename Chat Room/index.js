function initApp() {
    // Login
    var txtEmail = document.getElementById('email');
    var txtPassword = document.getElementById('password');
    var btnLogin = document.getElementById('loginbtn');
    var groupbtn = document.getElementById('groupbtn');
    var btnLogout = document.getElementById('logoutbtn');
    var personalbtn = document.getElementById('personalbtn');
    

    firebase.auth().onAuthStateChanged(function (user) {
        var menu = document.getElementById('dynamic-menu');
        if (user) {
            menu.innerHTML = "<a class='nav-item nav-link' href='#' id='logoutbtn'>Logout</a>";
            var btnLogout = document.getElementById('logoutbtn');
            btnLogout.addEventListener("click", e =>{
                firebase.auth().signOut()
                .then( e=>{
                    create_alert('success','Log Out');
                    location.href = "index.html";
                })
                .catch(()=> {
                    create_alert('error','Log Out Error');
                });
            });
        }
        else {
            menu.innerHTML = "<a class='nav-item nav-link' href='#' id='loginbtn'>Login</a>";
            console.log('no user');
            var btnLogin = document.getElementById('loginbtn');
            btnLogin.addEventListener('click', function() {
                location.href = "signup.html";
            });
        }
    });

    
    var btnLogout = document.getElementById('logoutbtn');

    groupbtn.addEventListener('click', function() {
        location.href = "chat.html";
    })

    personalbtn.addEventListener('click', function() {
        location.href = "chat_personal.html";
    })

    btnLogin.addEventListener('click', function() {
        location.href = "signup.html";
    });

}

// Custom alert
function create_alert(type, message) {
    var alertarea = document.getElementById('custom-alert');
    if (type == "success") {
        str_html = "<div class='alert alert-success alert-dismissible fade show' role='alert'><strong>Success! </strong>" + message + "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div>";
        alertarea.innerHTML = str_html;
    } else if (type == "error") {
        str_html = "<div class='alert alert-danger alert-dismissible fade show' role='alert'><strong>Error! </strong>" + message + "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div>";
        alertarea.innerHTML = str_html;
    }
}

window.onload = function () {
    initApp();
};

