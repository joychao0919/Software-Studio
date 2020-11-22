function init() {
    var personalbtn = document.getElementById('personalbtn');
    var groupbtn = document.getElementById('groupbtn');
    var homebtn = document.getElementById('homebtn');
    var logoutbtn = document.getElementById('logoutbtn');
    post_btn = document.getElementById('post_btn');
    post_txt = document.getElementById('comment');

    homebtn.addEventListener('click', function() {
        location.href = "index.html";
    })

    personalbtn.addEventListener('click', function() {
        location.href = "chat_personal.html";
    })

    var user_email = '';
    firebase.auth().onAuthStateChanged(function (user) {
        var menu = document.getElementById('dynamic-menu');
        // Check user login
        if (user) {
            user_email = user.email;
            menu.innerHTML = "<a class='nav-item nav-link' href='#' id='logoutbtn'>Logout</a>";
            /// TODO 5: Complete logout button event
            ///         1. Add a listener to logout button 
            ///         2. Show alert when logout success or error (use "then & catch" syntex)
            var btnSignOut = document.getElementById('logoutbtn');
            btnSignOut.addEventListener("click", e =>{
                firebase.auth().signOut()
                .then( e=>{
                    create_alert('success','Log Out');
                    location.href = "index.html";
                })
                .catch(()=> {
                    create_alert('error','Log Out Error');
                });
            });

            post_btn.addEventListener('click', function () {
                if (post_txt.value != "" && checkHtml(post_txt.value)==0) {
                    /// TODO 6: Push the post to database's "com_list" node
                    ///         1. Get the reference of "com_list"
                    ///         2. Push user email and post data
                    ///         3. Clear text field
                    var set = {
                        email: user_email,
                        text: post_txt.value
                    }
        
                    firebase.database().ref('com_list/').push({
                        email: user_email,
                        text: post_txt.value
                    });
                    post_txt.value="";
                }
                if(checkHtml(post_txt.value)) {
                    create_alert('error', 'Do not type HTML');
                }
            });

            // The html code for post
            var str_before_username = "<div class='media text-muted pt-3'><p class='media-body pb-3 mb-0 small lh-125'><strong class='d-block text-gray-dark'>";
            var str_after_content = "</p></div>\n";

            var str_before_current_user = "<div class='media text-muted pt-3'><p class='media-body pb-3 mb-0 small lh-125' align='right'><strong class='d-block text-gray-dark'>";
            var str_after_current_user = "</p></div>"
            var str_before_current_content = "<div class='media text-white pt-3'><p class='media-body pb-3 mb-0 small lh-125' align='right' style='background-color:#70c5c0'><strong class='d-block text-gray-dark'>";
            var str_after_current_content = "</font></p></p></div>\n"

            var postsRef = firebase.database().ref('com_list');
            // List for store posts html
            var total_post = [];
            // Counter for checking history post update complete
            var first_count = 0;
            // Counter for checking when to update new post
            var second_count = 0;

            postsRef.once('value')
                .then(function (snapshot) {
                    /// TODO 7: Get all history posts when the web page is loaded and add listener to update new post
                    ///         1. Get all history post and push to a list (str_before_username + email + </strong> + data + str_after_content)
                    ///         2. Join all post in list to html in once
                    ///         4. Add listener for update the new post
                    ///         5. Push new post's html to a list
                    ///         6. Re-join all post in list to html when update
                    ///
                    ///         Hint: When history post count is less then new post count, update the new and refresh html
                    
                    for(var i in snapshot.val()){
                        if(snapshot.val()[i].email == user.email) {
                            total_post.push(str_before_current_user + snapshot.val()[i].email + "</strong>" + snapshot.val()[i].text + str_after_current_content);
                        }
                        else {
                            total_post.push(str_before_username + snapshot.val()[i].email + "</strong>" + snapshot.val()[i].text + str_after_content);
                        }
                        
                    }
                    //post_btn.addEventListener('click',function(){
                        document.getElementById('post_list').innerHTML = total_post.join("");
                    //});
                    postsRef.on('value',function (snapshot) {
                        total_post.length=0;
                        for(var i in snapshot.val()){
                            if(snapshot.val()[i].email == user.email) {
                                total_post.push(str_before_current_user + snapshot.val()[i].email + "</strong>" + snapshot.val()[i].text + str_after_current_content);
                            }
                            else {
                                total_post.push(str_before_username + snapshot.val()[i].email + "</strong>" + snapshot.val()[i].text + str_after_content);
                            }
                        }
                        //post_btn.addEventListener('click',function(){
                            document.getElementById('post_list').innerHTML = total_post.join("");});
                })
                .catch(e => console.log(e.message));
        } else {
            menu.innerHTML = "<a class='nav-item nav-link' href='#' id='loginbtn'>Login</a>";
            var btnLogin = document.getElementById('loginbtn');
            btnLogin.addEventListener('click', function() {
                location.href = "signup.html";
            });
            // It won't show any post if not login
            //document.getElementById('post_list').innerHTML = "";
            document.getElementById('post_list').innerHTML = "";
        }   
    });   
}

function checkHtml(htmlStr) {
    var reg = /<[^>]+>/g;
    return reg.test(htmlStr);
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
    init();
};