function initApp() {
    // Login
    var txtEmail = document.getElementById('email');
    var txtPassword = document.getElementById('password');
    var btnLogin = document.getElementById('btnLogin');
    var btnGoogle = document.getElementById('btnGoogle');
    var btnSignup = document.getElementById('btnSignup');
    var homebtn = document.getElementById('homebtn');
    var personalbtn = document.getElementById('personalbtn');
    var groupbtn = document.getElementById('groupbtn');
    var btnForgot = document.getElementById('btnForgot');

    homebtn.addEventListener('click', function() {
        location.href = "index.html";
    })

    personalbtn.addEventListener('click', function() {
        location.href = "chat_personal.html";
    })

    groupbtn.addEventListener('click', function() {
        location.href = "chat.html";
    })

    btnLogin.addEventListener('click', function() {
        const email = txtEmail.value;
        const pass = txtPassword.value;    
        const auth = firebase.auth();
        auth.signInWithEmailAndPassword(email, pass)
            .then(e => {
                create_alert('success', 'Login Success');
                location.href = "index.html";
            })
            .catch(() => {
                create_alert('error', 'Login Error');
                txtEmail.value = '';
                txtPassword.value = '';
            })
    });

    btnGoogle.addEventListener('click', function() {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function(result) { 
            // This gives you a Google Access Token. You can use it to access the Google API. 
            var token = result.credential.accessToken; 
            // The signed-in user info. 
            var user = result.user; 

            var set = {
                email: user.email,
                userUID: user.uid
            };

            console.log(user.email);
            console.log(user.uid);

            firebase.database().ref('user_list/').push(set);
            console.log("PUSH");
            location.href = "chat.html"
            // ... 
        }).catch(function(error) { 
            create_alert('error', 'Failed Login');
            // Handle Errors here. 
            var errorCode = error.code; 
            var errorMessage = error.message; 
            // The email of the user's account used. 
            var email = error.email; 
            // The firebase.auth.AuthCredential type that was used. 
            var credential = error.credential; })
    });

    btnSignup.addEventListener('click', function() {
        /// TODO 4: Add signup button event
        ///         1. Get user input email and password to signup
        ///         2. Show success message by "create_alert" and clean input field
        ///         3. Show error message by "create_alert" and clean input field
        const email = txtEmail.value;
        const pass = txtPassword.value;
        const auth = firebase.auth();
        
        auth.createUserWithEmailAndPassword(email, pass)
            .then(() => { 
                create_alert('success', 'signed');
                user = firebase.auth().currentUser;
                var set = {
                    email: email,
                    userUID: user.uid
                };
                firebase.database().ref('user_list/').push(set);
                txtEmail.value = '';
                txtPassword.value = '';
            })
            .catch(e => {
                create_alert('error', 'cannotsignup');
                txtEmail.value = '';
                txtPassword.value = '';
            })
    });

    btnForgot.addEventListener('click', function() {
        const auth = firebase.auth();
        auth.sendPasswordResetEmail(txtEmail.value).then(function() {
            // Email sent.
            create_alert('success', 'Check your email to reset password');
          }).catch(function(error) {
            // An error happened.
            create_alert('error', 'Something Wrong');
          });
    })

    homebtn.addEventListener('click', function() {
        location.href = "index.html";
    })
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

