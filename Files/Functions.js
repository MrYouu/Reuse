//  The JavaScript code is property to Mr. You (Kristiyan Valchev) and can only be viewed
//  If you want to use part of the code, please first contact me: mr.youdevelopment@gmail.com

const firebaseConfig =
{
    apiKey: "AIzaSyDPe8R-KgSALIqe_p4t6PDgzF_WT6mcnUc",
    authDomain: "reuse-f9afa.firebaseapp.com",
    databaseURL: "https://reuse-f9afa.firebaseio.com",
    projectId: "reuse-f9afa",
    storageBucket: "reuse-f9afa.appspot.com",
    messagingSenderId: "563054909730",
    appId: "1:563054909730:web:999e16e483cf2a6e532d7b",
    measurementId: "G-DCW10DE8FL"
};

firebase.initializeApp(firebaseConfig);
const Auth = firebase.auth();
const cloudData = firebase.firestore();
const databaseStorage = firebase.storage();

function loadUserdata()
{
    Auth.onAuthStateChanged(function(user)
    {
        if (user)
        {
            if (document.getElementById("Title").innerHTML == "Reuse")
            {
                var userFN, accountPlan;
                cloudData.doc("users/" + user.uid).get().then(function(doc)
                {
                    if (doc && doc.exists)
                    {
                        const userData = doc.data();
                        userFN = userData.firstName;
                        accountPlan = userData.accountPlan;

                        document.getElementById("signInButton").style.display = "none";
                        document.getElementById("logInButton").style.display = "none";
                        document.getElementById("accountButton").innerHTML = userFN;
                    }
                }).catch(function(error)
                {
                    console.log("Got an Error: " +  error);
                });
            }
            else
            {

            }
        }
        else
        {
            if (document.getElementById("Title").innerHTML == "Reuse")
            {
                document.getElementById("signInButton").style.display = "inline-block";
                document.getElementById("logInButton").style.display = "inline-block";
                document.getElementById("accountButton").style.display = "none";
                document.getElementById("logOutButton").style.display = "none";
            }
            else
            {

            }
        }
    });
}

function signIn()
{
    var canSignIn;
    var firstNameField = document.getElementById("signInFNInputField");
    var firstNameText = firstNameField.value;
    var emailField = document.getElementById("signInEmailInputField");
    var passwordField = document.getElementById("signInPasswordInputField");

    if (firstNameText && firstNameText.length >= 2 && firstNameText.indexOf(' ') <= 0)
    {
        document.getElementById("FNInputFieldTitle").style.color = "#11111180";
        document.getElementById("FNInputFieldIcon").style.color = "#81b214";
        document.getElementById("Error invalidFN").style.display = "none";
        canSignIn = true;
    }
    else
    {
        document.getElementById("FNInputFieldTitle").style.color = "red";
        document.getElementById("FNInputFieldIcon").style.color = "red";
        document.getElementById("Error invalidFN").style.display = "block";
        canSignIn = false;
    }

    if (canSignIn)
    {
        Auth.createUserWithEmailAndPassword(emailField.value, passwordField.value).then(function()
        {
            cloudData.doc("users/" + Auth.currentUser.uid).set(
            {
                firstName: firstNameText,
                Email: emailField.value
            }).catch(function(error)
            {
                console.log("Got an Error: " + error);
            })

            document.getElementById("FNInputFieldTitle").style.color = "#11111180";
            document.getElementById("FNInputFieldIcon").style.color = "#81b214";
            document.getElementById("emailInputFieldTitle").style.color = "#11111180";
            document.getElementById("emailInputFieldIcon").style.color = "#81b214";
            document.getElementById("passwordInputFieldTitle").style.color = "#11111180";
            document.getElementById("passwordInputFieldIcon").style.color = "#81b214";

            errorDefault();

            document.getElementById("correctness userSighedIn").style.display = "block";
            desableElement("correctness userSighedIn", 2.5);

            Auth.signInWithEmailAndPassword(emailField.value, passwordField.value).then(function()
            {
                location.replace("../index.html");
            });

        }).catch(function(error)
        {
            if (error)
            {
                var errorCode = error.code;

                if (errorCode == 'auth/invalid-email')
                {
                    document.getElementById("emailInputFieldTitle").style.color = "red";
                    document.getElementById("emailInputFieldIcon").style.color = "red";
                    document.getElementById("Error invalidEmail").style.display = "block";
                }
                else if (errorCode == 'auth/email-already-in-use')
                {
                    document.getElementById("emailInputFieldTitle").style.color = "red";
                    document.getElementById("emailInputFieldIcon").style.color = "red";
                    document.getElementById("Error existingEmail").style.display = "block";
                }
                else
                {
                    document.getElementById("emailInputFieldTitle").style.color = "#11111180";
                    document.getElementById("emailInputFieldIcon").style.color = "#81b214";
                    document.getElementById("Error invalidEmail").style.display = "none";
                    document.getElementById("Error existingEmail").style.display = "none";
                }
        
                if (errorCode == 'auth/weak-password')
                {
                    document.getElementById("passwordInputFieldTitle").style.color = "red";
                    document.getElementById("passwordInputFieldIcon").style.color = "red";
                    document.getElementById("Error invalidPassword").style.display = "block";
                }
                else
                {
                    document.getElementById("passwordInputFieldTitle").style.color = "#11111180";
                    document.getElementById("passwordInputFieldIcon").style.color = "#81b214";
                    document.getElementById("Error invalidPassword").style.display = "none";
                }
        
                console.log(error);
            }
            else
                throw error;
        });
    }
}

function logIn()
{
    var emailField = document.getElementById("logInEmailInputField");
    var passwordField = document.getElementById("logInPasswordInputField");

    Auth.signInWithEmailAndPassword(emailField.value, passwordField.value).then(function()
    {
        document.getElementById("emailInputFieldTitle").style.color = "#11111180";
        document.getElementById("emailInputFieldIcon").style.color = "#81b214";
        document.getElementById("passwordInputFieldTitle").style.color = "#11111180";
        document.getElementById("passwordInputFieldIcon").style.color = "#81b214";

        errorDefault();

        location.replace("../index.html");
    }).catch(function(error)
    {
        if (error)
        {
            var errorCode = error.code;

            if (errorCode == 'auth/invalid-email')
            {
                document.getElementById("emailInputFieldTitle").style.color = "red";
                document.getElementById("emailInputFieldIcon").style.color = "red";
                document.getElementById("Error invalidEmail").style.display = "block";
            }
            else if (errorCode == 'auth/email-already-in-use')
            {
                document.getElementById("emailInputFieldTitle").style.color = "red";
                document.getElementById("emailInputFieldIcon").style.color = "red";
                document.getElementById("Error existingEmail").style.display = "block";
            }
            else
            {
                document.getElementById("emailInputFieldTitle").style.color = "#11111180";
                document.getElementById("emailInputFieldIcon").style.color = "#81b214";
                document.getElementById("Error invalidEmail").style.display = "none";
                document.getElementById("Error nonExistingUser").style.display = "none";
            }

            if (errorCode == 'auth/wrong-password')
            {
                document.getElementById("passwordInputFieldTitle").style.color = "red";
                document.getElementById("passwordInputFieldIcon").style.color = "red";
                document.getElementById("Error wrongPassword").style.display = "block";
            }
            else if (errorCode == 'auth/user-not-found')
            {
                document.getElementById("emailInputFieldTitle").style.color = "red";
                document.getElementById("emailInputFieldIcon").style.color = "red";
                document.getElementById("passwordInputFieldTitle").style.color = "red";
                document.getElementById("passwordInputFieldIcon").style.color = "red";
                document.getElementById("Error nonExistingUser").style.display = "block";
            }
            else
            {
                document.getElementById("passwordInputFieldTitle").style.color = "#11111180";
                document.getElementById("passwordInputFieldIcon").style.color = "#81b214";
                document.getElementById("Error nonExistingUser").style.display = "none";
                document.getElementById("Error wrongPassword").style.display = "none";
            }

            if (errorCode == 'auth/too-many-requests')
            {
                errorDefault();
                document.getElementById("Error toManyRequests").style.display = "block";
                console.log("too-many-requests");
            }
        }
        else
            throw error;
    });
}

function logOut()
{
    Auth.signOut().then(function()
    {
        document.getElementById("correctness userSighedOut").style.display = "block";
        desableElement("correctness userSighedOut", 2.5);
        location.replace("../index.html");
    });
}

function errorDefault()
{
    document.getElementById("Error invalidFN").style.display = "none";
    document.getElementById("Error invalidEmail").style.display = "none";
    document.getElementById("Error existingEmail").style.display = "none";
    document.getElementById("Error invalidPassword").style.display = "none";
    document.getElementById("Error wrongPassword").style.display = "none";
    document.getElementById("Error nonExistingUser").style.display = "none";
    document.getElementById("Error toManyRequests").style.display = "none";
}

// Other

function goTo(pagePath)
{
    toPageAnimation();
    setTimeout(function ()
    {
        location.replace("../" + pagePath);
    }, 500);
}

function desableElement(elementID, timerSeconds)
{
    window.setTimeout(function()
    {
        var Item = document.getElementById(elementID);
        if (Item != null)
        {
            Item.style.display = "none";
        }
    }, timerSeconds * 1000);
}

function toPageAnimation()
{
    document.getElementById("redirectionBox1").style.height = "100%";

    setTimeout(function ()
    {
        document.getElementById("redirectionBox2").style.height = "100%";
    }, 100);

    setTimeout(function ()
    {
        document.getElementById("redirectionBox3").style.height = "100%";
    }, 200);
}