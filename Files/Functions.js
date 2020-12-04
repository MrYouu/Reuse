//  The JavaScript code is property to Mr. You (Kristiyan Valchev) and can only be viewed
//  If you want to use part of the code, please first contact me: mr.youdevelopment@gmail.com

// Update printng data in shop announsments
// Update printing data in staff index
// Print announsments in my profile
// Make Axept and Reject button in staff index
// Make place for Admin to ad new staff account

var firebaseConfig =
{
    apiKey: "AIzaSyAOdhH4IptHACoDNgbuISRzr2Hx-ucQ9wE",
    authDomain: "reuseapp-b7b48.firebaseapp.com",
    databaseURL: "https://reuseapp-b7b48.firebaseio.com",
    projectId: "reuseapp-b7b48",
    storageBucket: "reuseapp-b7b48.appspot.com",
    messagingSenderId: "786660741967",
    appId: "1:786660741967:web:cecbb48a2b5bae69feab3a"
};

firebase.initializeApp(firebaseConfig);
const Auth = firebase.auth();
const cloudData = firebase.firestore();
const Database = firebase.database();
const databaseStorage = firebase.storage();

function loadUserdata()
{
    Auth.onAuthStateChanged(function(user)
    {
        if (user)
        {
            if (document.getElementById("Title").innerHTML == "Reuse")
            {
                var userFN;
                Database.ref("/Users/" + user.uid).once("value").then((snapshot) =>
                {
                    userFN = (snapshot.val() && snapshot.val().firstName) || "Name";

                    document.getElementById("accountButton").innerHTML = userFN;
                    document.getElementById("signInButton").style.display = "none";
                    document.getElementById("logInButton").style.display = "none";
                }).catch(function(error)
                {
                    console.log("Got an Error: " +  error);
                });
            }
            else if (document.getElementById("Title").innerHTML == "my account")
            {
                var userFN, userEmail, userType, userAnnouncementsCount, userPoint, userResidence, userImage;
                Database.ref("/Users/" + user.uid).once("value").then((snapshot) =>
                {
                    userFN = (snapshot.val() && snapshot.val().firstName) || "undefined";
                    userEmail = (snapshot.val() && snapshot.val().Email) || "undefined";
                    userType = (snapshot.val() && snapshot.val().Type) || "undefined";
                    userAnnouncementsCount = (snapshot.val() && snapshot.val().announcementsCount) || 0;
                    userPoint = (snapshot.val() && snapshot.val().Point) || 0;
                    userResidence = (snapshot.val() && snapshot.val().Residence) || 0;

                    document.getElementById("Title").innerHTML = userFN + "'s account";
                    document.getElementById("accountName").innerHTML = userFN;
                    document.getElementById("accountEditFNInputField").value = userFN;
                    document.getElementById("accountEditEmailInputField").value = userEmail;
                    document.getElementById("accountEditResidenceInputField").value = userResidence;
                    
                    var pathReference = databaseStorage.ref("/Users/" + Auth.currentUser.uid + ".jpg");
                    pathReference.getDownloadURL().then(function(url)
                    {
                        userImage = url;
                        document.getElementById("accountImage").src = userImage;
                        document.getElementById("accountEditImage").src = userImage;
                    }).catch(function(error)
                    {
                        switch (error.code)
                        {
                            case 'storage/object-not-found':
                                console.log("Got an Error: File doesn't exist");
                                break;
                            case 'storage/unauthorized':
                                console.log("Got an Error: User doesn't have permission to access the object");
                                break;
                            case 'storage/canceled':
                                console.log("Got an Error: User canceled the upload");
                                break;
                            case 'storage/unknown':
                                console.log("Got an Error: Unknown error occurred, inspect the server response");
                                break;
                        }
                    });

                    if (userType == "Normal")
                    {
                        document.getElementById("accountFastInfoDataAnnouncements").innerHTML = userAnnouncementsCount.toString();
                        document.getElementById("accountFastInfoDataPoint").innerHTML = userPoint.toString();
                    
                        var Size;
                        var announcementsHolder = document.getElementById("announcementsHolder");
                        Database.ref("/SaleItems").once("value").then((snapshot) =>
                        {
                            Size = (snapshot.val() && snapshot.val().Size) || 0;

                            if (Size == 0)
                            {
                                announcementsHolder.innerHTML = '<div class = "Announcement Empty"><img src = "Images/noDataImage.svg" class = "announcementImage"><h3 class = "announcementTitle">No items yet</h3></div>';
                            }
                            else
                            {
                                announcementsHolder.innerHTML = "";
                                for (let index = 1; index < Size + 1; index++)
                                {
                                    var announcementOwner, announcementImage, announcementTitle, announcementPrice,
                                        announcementCondition, announcementInfo, announcementID, announcementStatus,
                                        announcementContact;
                                    Database.ref("/SaleItems/" + "announcement" + index).once("value").then((snapshot) =>
                                    {
                                        var pathReference = databaseStorage.ref("/Announcements/" + "announcement" + index.toString() + ".jpg");
                                        pathReference.getDownloadURL().then(function(url)
                                        {
                                            announcementOwner = (snapshot.val() && snapshot.val().Owner) || "undefined";
                                            announcementTitle = (snapshot.val() && snapshot.val().Title) || "undefined";
                                            announcementPrice = (snapshot.val() && snapshot.val().Price) || 0;
                                            announcementCondition = (snapshot.val() && snapshot.val().Condition) || "undefined";
                                            announcementInfo = (snapshot.val() && snapshot.val().additionalInformation) || "undefined";
                                            announcementID = (snapshot.val() && snapshot.val().ID) || "undefined";
                                            announcementStatus = (snapshot.val() && snapshot.val().Status) || "undefined";
                                            announcementContact = (snapshot.val() && snapshot.val().Contact) || "undefined";
                                            announcementImage = url;

                                            if (announcementStatus == "Waiting") announcementStatus = '<text style = "color: #f6d743">' + announcementStatus + '</text>';
                                            else if (announcementStatus == "Online") announcementStatus = '<text style = "color: #81b214">' + announcementStatus + '</text>';
                                            else if (announcementStatus == "Rejected") announcementStatus = '<text style = "color: red">' + announcementStatus + '</text>';
                    
                                            if (announcementOwner == Auth.currentUser.uid)
                                            {
                                                var newAnnouncement = "";
                                                newAnnouncement += '<div class = "Announcement" onclick = "openCloseAnnouncementPriview(' + "'" + "Announcement" + index + "'" + ')" id = "';
                                                newAnnouncement += "Announcement" + index + '"><img src = "';
                                                newAnnouncement += announcementImage;
                                                newAnnouncement += '" class = "announcementImage"><h3 class = "announcementTitle">';
                                                newAnnouncement += announcementTitle
                                                newAnnouncement += '</h3><p class = "announcementTitle"> Status: ';
                                                newAnnouncement +=  announcementStatus + '</p><p class = "announcementText">';
                                                newAnnouncement += parseFloat(announcementPrice).toFixed(2) + 'lv.</p>';
                                                newAnnouncement += '<p class = "announcementText Hidden">';
                                                newAnnouncement +=  announcementCondition + '</p>';
                                                newAnnouncement += '<p class = "announcementText Hidden">';
                                                newAnnouncement +=  announcementInfo + '</p>';
                                                newAnnouncement += '<p class = "announcementText Hidden">';
                                                newAnnouncement +=  announcementID + '</p>';
                                                newAnnouncement += '<p class = "announcementText Hidden">';
                                                newAnnouncement +=  announcementContact + '</p></div>';
                    
                                                announcementsHolder.innerHTML += newAnnouncement;
                                            }
                                        });
                                    });
                                }
                            }
                        });
                    }
                    else if (userType == "Staff" || userType == "Admin")
                    {
                        document.getElementById("accountFastInfoHolder").style.display = "none";
                        document.getElementById("savedAnnouncementsTextBox").style.display = "none";
                        document.getElementById("yourAnnouncementsTextBox").style.display = "none";
                        document.getElementById("deleteAccountTextBox").style.display = "none";
                    }
                }).catch(function(error)
                {
                    console.log("Got an Error: " +  error);
                });
            }
            else if (document.getElementById("Title").innerHTML == "Staff - Reuse")
            {
                var userFN, userType;
                Database.ref("/Users/" + user.uid).once("value").then((snapshot) =>
                {
                    userFN = (snapshot.val() && snapshot.val().firstName) || "undefined";
                    userType = (snapshot.val() && snapshot.val().Type) || "undefined";

                    if (userType == "Normal")
                    {
                        location.replace("logIn.html");
                    }
                    else
                    {
                        document.getElementById("accountName").innerHTML = userFN;
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
            else if (document.getElementById("Title").innerHTML == "my account")
            {
                location.replace("../signIn.html");
            }
            else if (document.getElementById("Title").innerHTML == "Staff - Reuse")
            {
                location.replace("../staff/logIn.html");
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
            Database.ref('Users/' + Auth.currentUser.uid).set(
            {
                firstName: firstNameText,
                Email: emailField.value,
                Type: "Normal",
                Residence: "",
                announcementsCount: parseInt(0),
                Point: parseInt(0)
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
                location.replace("../me.html");
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

        location.replace("../me.html");
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

function staffLogIn()
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

        location.replace("index.html");
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
        document.getElementById("correctness userLoggedOut").style.display = "block";
        desableElement("correctness userLoggedOut", 2.5);
        location.replace("../index.html");
    });
}

function updateUserData()
{
    var canSaveInformation;
    var firstNameField = document.getElementById("accountEditFNInputField");
    var firstNameText = firstNameField.value;
    var ResidenceField = document.getElementById("accountEditResidenceInputField");
    var ResidenceText = ResidenceField.value;

    if (firstNameText && firstNameText.length >= 2 && firstNameText.indexOf(' ') <= 0)
    {
        document.getElementById("FNInputFieldTitle").style.color = "#11111180";
        document.getElementById("FNInputFieldIcon").style.color = "#81b214";
        document.getElementById("Error invalidFN").style.display = "none";
        canSaveInformation = true;
    }
    else
    {
        document.getElementById("FNInputFieldTitle").style.color = "red";
        document.getElementById("FNInputFieldIcon").style.color = "red";
        document.getElementById("Error invalidFN").style.display = "block";
        canSaveInformation = false;
    }

    if (canSaveInformation)
    {
        Database.ref("Users/" + Auth.currentUser.uid).update(
        {
            firstName: firstNameText,
            Residence: ResidenceText
        }).catch(function(error)
        {
            console.log("Got an Error: " + error);
        });

        try
        {
            var storageRef = databaseStorage.ref("/Users/" + Auth.currentUser.uid + ".jpg");
            var uploadTask = storageRef.put(document.getElementById("accountImageUploadButton").files[0]);
        } catch {}
    
        document.getElementById("correctness dataSuccessfullySaved").style.display = "block";
        desableElement("correctness dataSuccessfullySaved", 2.5);
        openCloseAccountEditBox();
        history.go(0);
    }
}

function deleteAccount()
{
    document.getElementById("Error cannotDeleteAccount").style.display = "block";
    desableElement("Error cannotDeleteAccount", 2.5);

    //Auth.deleteUser(uid).then(() =>
    //{
    //    console.log('Successfully deleted user');
    //}).catch((error) =>
    //{
    //    console.log('Error deleting user:', error);
    //});
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

function printAnnouncements(announcementsCategory, categoryButtonID)
{
    var timerForNoItems;
    clearTimeout(timerForNoItems);
    var announcementsHolder = document.getElementById("announcementsHolder");
    var announcementsHolderTitle = document.getElementById("announcementsHolderTitle");
    
    if (document.getElementById("Title").innerHTML == "Reuse Shop")
        announcementsHolder.innerHTML = '<div class = "Announcement Empty"><div class = "Loader01"><div class = "circleBorder"><div class = "circleCore"></div></div></div><h3 class = "announcementTitle">Loading...</h3></div>';
    else if (document.getElementById("Title").innerHTML == "Reuse")
        announcementsHolder.innerHTML = '<div class = "scrollerItem Empty"><div class = "Loader01"><div class = "circleBorder"><div class = "circleCore"></div></div></div><h3 class = "scrollerItemTitle">Loading...</h3></div>';

    if (announcementsCategory != "Wait")
    {
        var allCategoryButtons = document.getElementById("categoriesScroller").childNodes;

        for (let index = 0; index < allCategoryButtons.length; index++)
            allCategoryButtons[index].className = "scrollerItem";

        document.getElementById(categoryButtonID).className += " Active";

        if (announcementsCategory == "Last") announcementsHolderTitle.innerHTML = "Newest Items";
        else if (announcementsCategory == "bath") announcementsHolderTitle.innerHTML = "Baths";
        else if (announcementsCategory == "blender") announcementsHolderTitle.innerHTML = "Blenders";
        else if (announcementsCategory == "camera") announcementsHolderTitle.innerHTML = "Cameras";
        else if (announcementsCategory == "chair") announcementsHolderTitle.innerHTML = "Chairs";
        else if (announcementsCategory == "couch") announcementsHolderTitle.innerHTML = "Couches";
        else if (announcementsCategory == "desktop") announcementsHolderTitle.innerHTML = "Displays";
        else if (announcementsCategory == "laptop") announcementsHolderTitle.innerHTML = "Laptops";
        else if (announcementsCategory == "sink") announcementsHolderTitle.innerHTML = "Sinks";
        else if (announcementsCategory == "toilet") announcementsHolderTitle.innerHTML = "Toilets";
        else if (announcementsCategory == "tv") announcementsHolderTitle.innerHTML = "Televisions";
        else if (announcementsCategory == "volume-up") announcementsHolderTitle.innerHTML = "Speakers";
    }

    if (announcementsCategory == "Wait")
    {
        var Size;
        Database.ref("/SaleItems").once("value").then((snapshot) =>
        {
            Size = (snapshot.val() && snapshot.val().Size) || 0;

            if (Size == 0)
            {
                announcementsHolder.innerHTML = '<div class = "Announcement Empty"><img src = "Images/noDataImage.svg" class = "announcementImage"><h3 class = "announcementTitle">No items yet</h3></div>';
            }
            else
            {
                announcementsHolder.innerHTML = "";
                for (let index = 1; index < Size + 1; index++)
                {
                    var announcementImage, announcementTitle, announcementPrice,
                        announcementCondition, announcementInfo, announcementID, announcementStatus, announcementContact;
                    Database.ref("/SaleItems/" + "announcement" + index).once("value").then((snapshot) =>
                    {
                        var pathReference = databaseStorage.ref("/Announcements/" + "announcement" + index.toString() + ".jpg");
                        pathReference.getDownloadURL().then(function(url)
                        {
                            announcementTitle = (snapshot.val() && snapshot.val().Title) || "undefined";
                            announcementPrice = (snapshot.val() && snapshot.val().Price) || 0;
                            announcementCondition = (snapshot.val() && snapshot.val().Condition) || "undefined";
                            announcementInfo = (snapshot.val() && snapshot.val().additionalInformation) || "undefined";
                            announcementID = (snapshot.val() && snapshot.val().ID) || "undefined";
                            announcementStatus = (snapshot.val() && snapshot.val().Status) || "undefined";
                            announcementContact = (snapshot.val() && snapshot.val().Contact) || "undefined";
                            announcementImage = url;
    
                            if (announcementStatus == "Waiting")
                            {
                                var newAnnouncement = "";
                                newAnnouncement += '<div class = "Announcement" id = "';
                                newAnnouncement += "announcement" + index + '"><img src = "';
                                newAnnouncement += announcementImage;
                                newAnnouncement += '" class = "announcementImage"><h3 class = "announcementTitle">';
                                newAnnouncement += announcementTitle
                                newAnnouncement += '</h3><p class = "announcementText">';
                                newAnnouncement += parseFloat(announcementPrice).toFixed(2) + 'lv.</p>';
                                newAnnouncement += '<p class = "announcementText Hidden">';
                                newAnnouncement +=  announcementCondition + '</p>';
                                newAnnouncement += '<p class = "announcementText Hidden">';
                                newAnnouncement +=  announcementInfo + '</p>';
                                newAnnouncement += '<p class = "announcementText Hidden">';
                                newAnnouncement +=  announcementID + '</p>';
                                newAnnouncement += '<p class = "announcementText Hidden">';
                                newAnnouncement +=  announcementContact + '</p>';
                                newAnnouncement += '<p class = "announcementText Hidden">';
                                newAnnouncement +=  announcementContact + '</p><p onclick = "acceptAnnouncement(' + "'announcement" + index + "'" + ')" class = "announcementButton Accept"><i class = "fas fa-check"></i></p>';
                                newAnnouncement +=  '<p onclick = "rejectAnnouncement(' + "'announcement" + index + "'" + ')" class = "announcementButton Reject"><i class = "fas fa-times"></i></p>';
                                newAnnouncement +=  '<p onclick = "openCloseAnnouncementPriview(' + "'" + "Announcement" + index + "'" + ')" class = "announcementButton Info"><i class = "fas fa-info"></i></p>';
    
                                announcementsHolder.innerHTML += newAnnouncement;
                            }
                        });
                    });
                }
            }
        });
    }
    else if (announcementsCategory == "Last")
    {
        var Size;
        Database.ref("/SaleItems").once("value").then((snapshot) =>
        {
            Size = (snapshot.val() && snapshot.val().Size) || 0;

            if (Size == 0)
            {
                announcementsHolder.innerHTML = '<div class = "Announcement Empty"><img src = "Images/noDataImage.svg" class = "announcementImage"><h3 class = "announcementTitle">No items yet</h3></div>';
            }
            else
            {
                announcementsHolder.innerHTML = "";
                for (let index = Size; index > Size - 6; index--)
                {
                    if (index >= 1)
                    {
                        var announcementCategory, announcementImage, announcementTitle, announcementPrice,
                            announcementCondition, announcementInfo, announcementID, announcementStatus, announcementContact;
                        Database.ref("/SaleItems/" + "announcement" + index).once("value").then((snapshot) =>
                        {
                            var pathReference = databaseStorage.ref("/Announcements/" + "announcement" + index.toString() + ".jpg");
                            pathReference.getDownloadURL().then(function(url)
                            {
                                announcementCategory = (snapshot.val() && snapshot.val().Category) || "undefined";
                                announcementTitle = (snapshot.val() && snapshot.val().Title) || "undefined";
                                announcementPrice = (snapshot.val() && snapshot.val().Price) || 0;
                                announcementCondition = (snapshot.val() && snapshot.val().Condition) || "undefined";
                                announcementInfo = (snapshot.val() && snapshot.val().additionalInformation) || "undefined";
                                announcementID = (snapshot.val() && snapshot.val().ID) || "undefined";
                                announcementStatus = (snapshot.val() && snapshot.val().Status) || "undefined";
                                announcementContact = (snapshot.val() && snapshot.val().Contact) || "undefined";
                                announcementImage = url;
                
                                if (announcementStatus == "Online")
                                {
                                    var newAnnouncement = "";
                                    newAnnouncement += '<div class = "Announcement" onclick = "openCloseAnnouncementPriview(' + "'" + "Announcement" + index + "'" + ')" id = "';
                                    newAnnouncement += "Announcement" + index + '"><img src = "';
                                    newAnnouncement += announcementImage;
                                    newAnnouncement += '" class = "announcementImage"><h3 class = "announcementTitle">';
                                    newAnnouncement += announcementTitle
                                    newAnnouncement += '</h3><p class = "announcementText">';
                                    newAnnouncement += parseFloat(announcementPrice).toFixed(2) + 'lv.</p>';
                                    newAnnouncement += '<p class = "announcementText Hidden">';
                                    newAnnouncement +=  announcementCondition + '</p>';
                                    newAnnouncement += '<p class = "announcementText Hidden">';
                                    newAnnouncement +=  announcementInfo + '</p>';
                                    newAnnouncement += '<p class = "announcementText Hidden">';
                                    newAnnouncement +=  announcementID + '</p>';
                                    newAnnouncement += '<p class = "announcementText Hidden">';
                                    newAnnouncement +=  announcementContact + '</p><p onclick = "" class = "announcementButton"><i class = "fas fa-phone-alt"></i></p></div>';

                                    announcementsHolder.innerHTML += newAnnouncement;
                                }
                            });
                        });
                    }
                }
            }
        });
    }
    else
    {
        var Size;
        Database.ref("/SaleItems").once("value").then((snapshot) =>
        {
            Size = (snapshot.val() && snapshot.val().Size) || 0;

            if (Size == 0)
            {
                announcementsHolder.innerHTML = '<div class = "Announcement Empty"><img src = "Images/noDataImage.svg" class = "announcementImage"><h3 class = "announcementTitle">No items yet</h3></div>';
            }
            else
            {
                announcementsHolder.innerHTML = "";
                for (let index = 1; index < Size + 1; index++)
                {
                    var announcementCategory, announcementImage, announcementTitle, announcementPrice,
                        announcementCondition, announcementInfo, announcementID, announcementStatus, announcementContact;
                    Database.ref("/SaleItems/" + "announcement" + index).once("value").then((snapshot) =>
                    {
                        var pathReference = databaseStorage.ref("/Announcements/" + "announcement" + index.toString() + ".jpg");
                        pathReference.getDownloadURL().then(function(url)
                        {
                            announcementCategory = (snapshot.val() && snapshot.val().Category) || "undefined";
                            announcementTitle = (snapshot.val() && snapshot.val().Title) || "undefined";
                            announcementPrice = (snapshot.val() && snapshot.val().Price) || 0;
                            announcementCondition = (snapshot.val() && snapshot.val().Condition) || "undefined";
                            announcementInfo = (snapshot.val() && snapshot.val().additionalInformation) || "undefined";
                            announcementID = (snapshot.val() && snapshot.val().ID) || "undefined";
                            announcementStatus = (snapshot.val() && snapshot.val().Status) || "undefined";
                            announcementContact = (snapshot.val() && snapshot.val().Contact) || "undefined";
                            announcementImage = url;
    
                            if (announcementStatus == "Online" && announcementCategory == announcementsCategory)
                            {
                                var newAnnouncement = "";
                                newAnnouncement += '<div class = "Announcement" onclick = "openCloseAnnouncementPriview(' + "'" + "Announcement" + index + "'" + ')" id = "';
                                newAnnouncement += "Announcement" + index + '"><img src = "';
                                newAnnouncement += announcementImage;
                                newAnnouncement += '" class = "announcementImage"><h3 class = "announcementTitle">';
                                newAnnouncement += announcementTitle
                                newAnnouncement += '</h3><p class = "announcementText">';
                                newAnnouncement += parseFloat(announcementPrice).toFixed(2) + 'lv.</p>';
                                newAnnouncement += '<p class = "announcementText Hidden">';
                                newAnnouncement +=  announcementCondition + '</p>';
                                newAnnouncement += '<p class = "announcementText Hidden">';
                                newAnnouncement +=  announcementInfo + '</p>';
                                newAnnouncement += '<p class = "announcementText Hidden">';
                                newAnnouncement +=  announcementID + '</p>';
                                newAnnouncement += '<p class = "announcementText Hidden">';
                                newAnnouncement +=  announcementContact + '</p><p onclick = "" class = "announcementButton"><i class = "fas fa-phone-alt"></i></p></div>';
    
                                announcementsHolder.innerHTML += newAnnouncement;
                            }
                        });
                    });
                }
            }
        });
    }

    timerForNoItems = window.setTimeout(function()
    {
        if (announcementsHolder.innerHTML == "")
        {
            if (document.getElementById("pageTitle").innerHTML != "Staff")
                announcementsHolder.innerHTML = '<div class = "Announcement Empty"><img src = "Images/noDataImage.svg" class = "announcementImage"><h3 class = "announcementTitle">No items yet</h3></div>';
            else
                announcementsHolder.innerHTML = '<div class = "Announcement Empty"><img src = "../../Images/noDataImage.svg" class = "announcementImage"><h3 class = "announcementTitle">No items yet</h3></div>';
        }
    }, 4 * 1000);
}

function rejectAnnouncement(announcementIndex)
{
    var announcementsHolder = document.getElementById("announcementsHolder");

    Database.ref("SaleItems/" + announcementIndex).update(
    {
        Status: "Rejected"
    }).catch(function(error)
    {
        console.log("Got an Error: " + error);
    });

    Database.ref("/SaleItems/" + announcementIndex).once("value").then((snapshot) =>
    {
        var announcementStatus = (snapshot.val() && snapshot.val().Status) || "undefined";
        console.log(announcementStatus);
    });


    document.getElementById(announcementIndex).remove();

    if (announcementsHolder.innerHTML == "")
        announcementsHolder.innerHTML = '<div class = "Announcement Empty"><img src = "../../Images/noDataImage.svg" class = "announcementImage"><h3 class = "announcementTitle">No items yet</h3></div>';
}

function acceptAnnouncement(announcementIndex)
{
    var announcementsHolder = document.getElementById("announcementsHolder");

    Database.ref("SaleItems/" + announcementIndex).update(
    {
        Status: "Online"
    }).catch(function(error)
    {
        console.log("Got an Error: " + error);
    });

    document.getElementById(announcementIndex).remove();

    if (announcementsHolder.innerHTML == "")
        announcementsHolder.innerHTML = '<div class = "Announcement Empty"><img src = "../../Images/noDataImage.svg" class = "announcementImage"><h3 class = "announcementTitle">No items yet</h3></div>';
}

function makeRandomString(Length)
{
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;

    for ( var i = 0; i < Length; i++ )
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    
    return result;
}

var Timer;
function noActionYet()
{
    clearTimeout(Timer);
    document.getElementById("Error noActionYet").style.display = "block";

    Timer = window.setTimeout(function()
    {
        var Item = document.getElementById("Error noActionYet");
        if (Item != null)
        {
            Item.style.display = "none";
        }
    }, 2.5 * 1000);
}

var isOpenedAccountEditBox = false;
function openCloseAccountEditBox()
{
    if (isOpenedAccountEditBox)
    {
        document.getElementById("accountEditBoxHolder").style.animation = "fadeOut .3s ease-out forwards";
        document.getElementById("pageTitle").innerHTML = "My account";

        setTimeout(function ()
        {
            document.getElementById("accountEditBoxHolder").style.display = "none";
            isOpenedAccountEditBox = false;
        }, 500);
    }
    else if (!isOpenedAccountEditBox)
    {
        document.getElementById("accountEditBoxHolder").style.display = "unset";
        document.getElementById("accountEditBoxHolder").style.animation = "fadeIn .5s ease-out forwards .1s";
        document.getElementById("pageTitle").innerHTML = "Edit account";

        var pathReference = databaseStorage.ref("/Users/" + Auth.currentUser.uid + ".jpg");
        pathReference.getDownloadURL().then(function(url)
        {
            userImage = url;
            document.getElementById('accountEditImage').src = userImage;
        }).catch(function(error)
        {
            switch (error.code)
            {
                case 'storage/object-not-found':
                    console.log("Got an Error: File doesn't exist");
                    break;
                case 'storage/unauthorized':
                    console.log("Got an Error: User doesn't have permission to access the object");
                    break;
                case 'storage/canceled':
                    console.log("Got an Error: User canceled the upload");
                    break;
                case 'storage/unknown':
                    console.log("Got an Error: Unknown error occurred, inspect the server response");
                    break;
            }
        });

        isOpenedAccountEditBox = true;
    }
}

var isOpenedAnnouncementPriview = false;
function openCloseAnnouncementPriview(announcementID)
{
    if (isOpenedAnnouncementPriview)
    {
        document.getElementById("announcementPriviewHolder").style.animation = "fadeOut .3s ease-out forwards";

        setTimeout(function ()
        {
            document.getElementById("announcementPriviewHolder").style.display = "none";
            isOpenedAnnouncementPriview = false;
        }, 500);
    }
    else if (!isOpenedAnnouncementPriview)
    {
        if (document.getElementById("pageTitle").innerHTML != "My account")
        {
            document.getElementById("announcementPriviewHolder").style.animation = "fadeIn .5s ease-out forwards .1s";
            document.getElementById("announcementPriviewHolder").style.display = "unset";
            document.getElementById("announcementPriviewImage").src = document.getElementById(announcementID).childNodes[0].src;
            document.getElementById("announcementPriviewTitle").innerHTML = document.getElementById(announcementID).childNodes[1].innerHTML;
            document.getElementById("announcementPriviewPrice").innerHTML = document.getElementById(announcementID).childNodes[2].innerHTML;
            document.getElementById("announcementPriviewStatus").innerHTML = document.getElementById(announcementID).childNodes[3].innerHTML;
    
            if (document.getElementById("announcementPriviewStatus").innerHTML == "Working")
                document.getElementById("announcementPriviewStatus").style.color = "green";
            else if (document.getElementById("announcementPriviewStatus").innerHTML == "Broken")
                document.getElementById("announcementPriviewStatus").style.color = "red";
    
            document.getElementById("announcementPriviewID").innerHTML = document.getElementById(announcementID).childNodes[5].innerHTML;
            document.getElementById("announcementPriviewInfo").innerHTML = document.getElementById(announcementID).childNodes[4].innerHTML;
            document.getElementById("announcementPriviewButton").innerHTML = '<i class = "fas fa-phone-alt"></i>' + document.getElementById(announcementID).childNodes[6].innerHTML;
            document.getElementById("announcementPriviewButton").setAttribute("onclick", "copyText(" + document.getElementById(announcementID).childNodes[6].innerHTML.toString() + ")");
        }
        else if (document.getElementById("pageTitle").innerHTML == "My account")
        {
            document.getElementById("announcementPriviewHolder").style.animation = "fadeIn .5s ease-out forwards .1s";
            document.getElementById("announcementPriviewHolder").style.display = "unset";
            document.getElementById("announcementPriviewImage").src = document.getElementById(announcementID).childNodes[0].src;
            document.getElementById("announcementPriviewTitle").innerHTML = document.getElementById(announcementID).childNodes[1].innerHTML;
            document.getElementById("announcementPriviewPrice").innerHTML = document.getElementById(announcementID).childNodes[3].innerHTML;
            document.getElementById("announcementPriviewStatus").innerHTML = document.getElementById(announcementID).childNodes[4].innerHTML;
    
            if (document.getElementById("announcementPriviewStatus").innerHTML == "Working")
                document.getElementById("announcementPriviewStatus").style.color = "green";
            else if (document.getElementById("announcementPriviewStatus").innerHTML == "Broken")
                document.getElementById("announcementPriviewStatus").style.color = "red";
    
            document.getElementById("announcementPriviewID").innerHTML = document.getElementById(announcementID).childNodes[6].innerHTML;
            document.getElementById("announcementPriviewInfo").innerHTML = document.getElementById(announcementID).childNodes[5].innerHTML;
            document.getElementById("announcementPriviewButton").innerHTML = '<i class = "fas fa-phone-alt"></i>' + document.getElementById(announcementID).childNodes[7].innerHTML;
            document.getElementById("announcementPriviewButton").setAttribute("onclick", "copyText(" + document.getElementById(announcementID).childNodes[7].innerHTML.toString() + ")");
        }

        isOpenedAnnouncementPriview = true;
    }
}

function updateAccountImagePriview()
{
    document.getElementById("accountEditImage").src = URL.createObjectURL(document.getElementById("accountImageUploadButton").files[0]);
}

function getDropDownMenuData()
{
    var dropDownMenuCategory = document.getElementById("dropDownMenu0");
    var dropDownMenuItem = document.getElementById("dropDownMenu1");
    var dropDownMenuCondition = document.getElementById("dropDownMenu2");
    
    if (dropDownMenuCategory.innerHTML != "Categoty")
    {
        document.getElementById("newAnnouncementBox1NextButton").className = "newAnnouncementBoxButton";
        document.getElementById("newAnnouncementBox1NextButton").setAttribute("onclick", "nextNewAnnouncementBox(2)");
    }
    
    if (dropDownMenuItem.innerHTML != "Item")
    {
        document.getElementById("newAnnouncementBox2NextButton").className = "newAnnouncementBoxButton";
        document.getElementById("newAnnouncementBox2NextButton").setAttribute("onclick", "nextNewAnnouncementBox(3)");
    }

    if (dropDownMenuCondition.innerHTML != "Condition")
    {
        document.getElementById("newAnnouncementBox4NextButton").className = "newAnnouncementBoxButton";
        document.getElementById("newAnnouncementBox4NextButton").setAttribute("onclick", "nextNewAnnouncementBox(5)");
    }
}

function saveNewAnnouncementImage()
{
    document.getElementById("chosenFileLabel").innerHTML = document.getElementById("uploadButton").files[0].name;
    document.getElementById("newAnnouncementBox5NextButton").className = "newAnnouncementBoxButton";
    document.getElementById("newAnnouncementBox5NextButton").setAttribute("onclick", "nextNewAnnouncementBox(6)");
}

function checkInputFieldData(elementID, elementIndex)
{
    var inputFiel = document.getElementById(elementID);

    if (elementIndex == 1)
    {
        if (inputFiel.value >= 0 && inputFiel.value <= 200 && inputFiel.value != "")
        {
            document.getElementById("newAnnouncementBox3NextButton").className = "newAnnouncementBoxButton";
            document.getElementById("newAnnouncementBox3NextButton").setAttribute("onclick", "nextNewAnnouncementBox(4)");
        }
        else
        {
            document.getElementById("newAnnouncementBox3NextButton").className = "newAnnouncementBoxButton Disabled";
            document.getElementById("newAnnouncementBox3NextButton").removeAttribute("onclick");
        }
    }
    else if (elementIndex == 2)
    {
        if (inputFiel.value >= 359000000000 && inputFiel.value <= 359999999999)
        {
            document.getElementById("newAnnouncementBox6NextButton").className = "newAnnouncementBoxButton";
            document.getElementById("newAnnouncementBox6NextButton").setAttribute("onclick", "nextNewAnnouncementBox(7)");
        }
        else
        {
            document.getElementById("newAnnouncementBox6NextButton").className = "newAnnouncementBoxButton Disabled";
            document.getElementById("newAnnouncementBox6NextButton").removeAttribute("onclick");
        }
    }
}

var nowAnnouncementBoxIndex = 1;
function nextNewAnnouncementBox(nextNewAnnouncementBoxID)
{
    var nowNewAnnouncementBox = document.getElementById("newAnnouncementBox" + nowAnnouncementBoxIndex);
    var nextNewAnnouncementBox = document.getElementById("newAnnouncementBox" + nextNewAnnouncementBoxID);

    if (nextNewAnnouncementBoxID == 8)
    {
        nowNewAnnouncementBox.style.animation = "middleToLefttItem .3s ease-out forwards";
        nextNewAnnouncementBox.style.display = "inline-block";
        nextNewAnnouncementBox.style.animation = "rightToMiddleItem .3s ease-out forwards";

        window.setTimeout(function()
        {
            var newAnnouncementCategoty = document.getElementById("dropDownMenu0").innerHTML;
            var newAnnouncementItem = document.getElementById("dropDownMenu1").innerHTML;
            var newAnnouncementPrice = document.getElementById("priceInputField").value;
            var newAnnouncementCondition = document.getElementById("dropDownMenu2").innerHTML;
            var newAnnouncementContact = document.getElementById("contactInputField").value;
            var newAnnouncementInfo = document.getElementById("infoInputField").value;
            var newAnnouncementID = makeRandomString(8);
            var newAnnouncementTitle = newAnnouncementCategoty + " " + newAnnouncementItem;
            var newAnnouncementOwner = Auth.currentUser.uid;

            var Size, newSize;
            Database.ref("SaleItems").once("value").then((snapshot) =>
            {
                Size = (snapshot.val() && snapshot.val().Size) || 0;

                Size++;
                Database.ref("SaleItems/" + "announcement" + Size).set(
                {
                    Category: newAnnouncementCategoty,
                    Condition: newAnnouncementCondition,
                    Contact: newAnnouncementContact,
                    ID: newAnnouncementID,
                    Owner: newAnnouncementOwner,
                    Price: parseFloat(newAnnouncementPrice),
                    Status: "Waiting",
                    Title: newAnnouncementTitle,
                    additionalInformation: newAnnouncementInfo,
                }).catch(function(error)
                {
                    console.log("Got an Error: " + error);
                })

                Database.ref("SaleItems/").update(
                {
                    Size: parseInt(Size)
                }).catch(function(error)
                {
                    console.log("Got an Error: " + error);
                });

                var storageRef = databaseStorage.ref("/Announcements/" + "announcement" + Size + ".jpg");
                var uploadTask = storageRef.put(document.getElementById("uploadButton").files[0]);
            
                document.getElementById("trigger").className += " allDoneTickDrawn";
                window.setTimeout(function()
                {
                    location.replace("../me.html");
                }, 1.2 * 1000);
            });
        }, .5 * 1000);
    }
    else if (nowAnnouncementBoxIndex + 1 == nextNewAnnouncementBoxID)
    {
        nowNewAnnouncementBox.style.animation = "middleToLefttItem .3s ease-out forwards";
        nextNewAnnouncementBox.style.display = "inline-block";
        nextNewAnnouncementBox.style.animation = "rightToMiddleItem .3s ease-out forwards";
        
        nowAnnouncementBoxIndex += 1;
    }
}

function peviousNewAnnouncementBox(peviousNewAnnouncementBoxID)
{
    if (nowAnnouncementBoxIndex - 1 == peviousNewAnnouncementBoxID)
    {
        var nowNewAnnouncementBox = document.getElementById("newAnnouncementBox" + nowAnnouncementBoxIndex);
        var peviousNewAnnouncementBox = document.getElementById("newAnnouncementBox" + peviousNewAnnouncementBoxID);
        
        nowNewAnnouncementBox.style.animation = "middleToRightItem .3s ease-out forwards";
        peviousNewAnnouncementBox.style.animation = "leftToMiddleItem .3s ease-out forwards";

        nowAnnouncementBoxIndex -= 1;
    }
}

function copyText(text)
{
    navigator.clipboard.writeText(text);
    document.getElementById("correctness phoneNumberCopyed").style.display = "block";
    desableElement("correctness phoneNumberCopyed", 2.5);
}