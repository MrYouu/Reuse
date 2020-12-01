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
            else if (document.getElementById("Title").innerHTML == "my account")
            {
                var userFN, userEmail, announcementsCount, Point, userImage;
                cloudData.doc("users/" + user.uid).get().then(function(doc)
                {
                    if (doc && doc.exists)
                    {
                        const userData = doc.data();
                        userFN = userData.firstName;
                        userEmail = userData.Email;
                        announcementsCount = parseInt(userData.announcementsCount);
                        Point = parseInt(userData.Point);

                        document.getElementById("Title").innerHTML = userFN + "'s account";
                        document.getElementById("accountName").innerHTML = userFN;
                        document.getElementById("accountFastInfoDataAnnouncements").innerHTML = announcementsCount.toString();
                        document.getElementById("accountFastInfoDataPoint").innerHTML = Point.toString();

                        document.getElementById("accountEditFNInputField").value = userFN;
                        document.getElementById("accountEditEmailInputField").value = userEmail;

                        var pathReference = databaseStorage.ref("/users/" + Auth.currentUser.uid + ".jpg");
                        pathReference.getDownloadURL().then(function(url)
                        {
                            userImage = url;
                            document.getElementById('accountImage').src = userImage;
                            document.getElementById('accountEditImage').src = userImage;
                        }).catch(function(error)
                        {
                            document.getElementById('accountImage').src = "../Images/defaultProfileImage.jpg";
                            document.getElementById('accountEditImage').src = "../Images/defaultProfileImage.jpg";

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
                Email: emailField.value,
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

function logOut()
{
    Auth.signOut().then(function()
    {
        document.getElementById("correctness userSighedOut").style.display = "block";
        desableElement("correctness userSighedOut", 2.5);
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
        cloudData.doc("users/" + Auth.currentUser.uid).update(
        {
            firstName: firstNameText,
            Residence: ResidenceText
        }).catch(function(error)
        {
            console.log("Got an Error: " + error);
        })

        try
        {
            var storageRef = databaseStorage.ref("/users/" + Auth.currentUser.uid + ".jpg");
            var uploadTask = storageRef.put(document.getElementById("accountImageUploadButton").files[0]);
        } catch {}
    
        document.getElementById("correctness dataSuccessfullySaved").style.display = "block";
        desableElement("correctness dataSuccessfullySaved", 2.5);
        openCloseAccountEditBox();
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

function printAnnouncements(announcementsCategory)
{
    var announcementsHolder = document.getElementById("announcementsHolder");
    announcementsHolder.innerHTML = '<div class = "Announcement Empty"><div class = "Loader01"><div class = "circleBorder"><div class = "circleCore"></div></div></div><h3 class = "announcementTitle">Loading...</h3></div>'
    var announcementsHolderTitle = document.getElementById("announcementsHolderTitle");
    
    if (announcementsCategory != "AALast")
    {
        if (announcementsCategory == "bath") announcementsHolderTitle.innerHTML = "Baths";
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

        cloudData.doc("announcements/" + announcementsCategory).get().then(function(doc)
        {
            var Size;
            if (doc && doc.exists)
            {
                const userData = doc.data();
                Size = userData.Size;

                if (Size == 0)
                {
                    announcementsHolder.innerHTML = '<div class = "Announcement Empty"><img src = "Images/noDataImage.svg" class = "announcementImage"><h3 class = "announcementTitle">No items yet</h3></div>';
                }
                else
                {
                    announcementsHolder.innerHTML = "";
                    for (let index = 1; index < 6 + 1; index++)
                    {
                        cloudData.doc("announcements/" + announcementsCategory + ("/announcement" + index) + "/Data").get().then(function(doc)
                        {
                            var announcementImage, announcementTitle, announcementPrice, announcementStatus;
                            if (doc && doc.exists)
                            {
                                const userData = doc.data();
                                announcementTitle = userData.Title;
                                announcementPrice = userData.Price;
                                announcementStatus = userData.Status;
        
                                var pathReference = databaseStorage.ref("/Announcements/" + announcementsCategory + "/announcement" + index.toString() + ".jpg");
                                pathReference.getDownloadURL().then(function(url)
                                {
                                    announcementImage = url;
        
                                    if (announcementStatus == "Online")
                                    {
                                        var newAnnouncement = "";
                                        newAnnouncement += '<div class = "Announcement"><img src = "';
                                        newAnnouncement += announcementImage;
                                        newAnnouncement += '" class = "announcementImage"><h3 class = "announcementTitle">';
                                        newAnnouncement += announcementTitle
                                        newAnnouncement += '</h3><p class = "announcementText">';
                                        newAnnouncement += parseFloat(announcementPrice).toFixed(2) + 'lv.</p><p onclick = "" class = "announcementButton"><i class = "fas fa-plus"></i></p></div>';
        
                                        announcementsHolder.innerHTML += newAnnouncement;
                                    }
                                });
                            }
                        });
                    }
                }
            }
        });
    }
    else
    {
        cloudData.doc("announcements/" + announcementsCategory).get().then(function(doc)
        {
            var lastAnnouncementsList;
            if (doc && doc.exists)
            {
                const userData = doc.data();
                lastAnnouncementsList = userData.lastAnnouncements;

                if (lastAnnouncementsList.length == 0)
                {
                    announcementsHolder.innerHTML = '<div class = "Announcement Empty"><img src = "Images/noDataImage.svg" class = "announcementImage"><h3 class = "announcementTitle">No items yet</h3></div>';
                }
                else
                {
                    announcementsHolder.innerHTML = "";
                    for (let index = 0; index < lastAnnouncementsList.length; index++)
                    {
                        cloudData.doc("announcements/" + lastAnnouncementsList[index]).get().then(function(doc)
                        {
                            var announcementImage, announcementTitle, announcementPrice, announcementStatus;
                            if (doc && doc.exists)
                            {
                                const userData = doc.data();
                                announcementTitle = userData.Title;
                                announcementPrice = userData.Price;
                                announcementStatus = userData.Status;

                                var lastAnnouncementsListWords = new Array("", "", "");
                                var lastAnnouncementsListWordsIndex = 0;

                                for (let charIndex = 0; charIndex < lastAnnouncementsList[index].length; charIndex++)
                                {
                                    if (lastAnnouncementsList[index][charIndex] != "/")
                                        lastAnnouncementsListWords[lastAnnouncementsListWordsIndex] += lastAnnouncementsList[index][charIndex];
                                    else lastAnnouncementsListWordsIndex += 1;
                                }

                                var pathReference = databaseStorage.ref("/Announcements/" + lastAnnouncementsListWords[0] +  "/"+ lastAnnouncementsListWords[1] + ".jpg");
                                pathReference.getDownloadURL().then(function(url)
                                {
                                    announcementImage = url;
        
                                    if (announcementStatus == "Online")
                                    {
                                        var newAnnouncement = "";
                                        if (document.getElementById("Title").innerHTML == "Reuse Shop")
                                        {
                                            announcementsHolderTitle.innerHTML = "Newest Items";
        
                                            newAnnouncement += '<div class = "Announcement"><img src = "';
                                            newAnnouncement += announcementImage;
                                            newAnnouncement += '" class = "announcementImage"><h3 class = "announcementTitle">';
                                            newAnnouncement += announcementTitle
                                            newAnnouncement += '</h3><p class = "announcementText">';
                                            newAnnouncement += parseFloat(announcementPrice).toFixed(2) + 'lv.</p><p onclick = "" class = "announcementButton"><i class = "fas fa-plus"></i></p></div>';
            
                                        }
                                        else if (document.getElementById("Title").innerHTML == "Reuse")
                                        {
                                            newAnnouncement += '<div class = "scrollerItem"><img src = "';
                                            newAnnouncement += announcementImage;
                                            newAnnouncement += '" class = "scrollerItemImage"><h3 class = "scrollerItemTitle">';
                                            newAnnouncement += announcementTitle
                                            newAnnouncement += '</h3><p class = "scrollerItemText">';
                                            newAnnouncement += parseFloat(announcementPrice).toFixed(2) + 'lv.</p><p onclick = "" class = "scrollerItemButton"><i class = "fas fa-plus"></i></p></div>';
                                        }
                                        announcementsHolder.innerHTML += newAnnouncement;
                                    }
                                });
                            }
                        });
                    }
                }
            }
        });
    }
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
    var changableTextMy = document.getElementById("changableTextMy");
    var changableTextEdit = document.getElementById("changableTextEdit");

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
        document.getElementById("accountEditBoxHolder").style.animation = "fadeIn .5s ease-out forwards .1s";
        document.getElementById("accountEditBoxHolder").style.display = "unset";
        document.getElementById("pageTitle").innerHTML = "Edit account";

        var pathReference = databaseStorage.ref("/users/" + Auth.currentUser.uid + ".jpg");
        pathReference.getDownloadURL().then(function(url)
        {
            userImage = url;
            document.getElementById('accountEditImage').src = userImage;
        }).catch(function(error)
        {
            document.getElementById('accountEditImage').src = "../Images/defaultProfileImage.jpg";

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

function updateAccountImagePriview()
{
    document.getElementById("accountEditImage").src = URL.createObjectURL(document.getElementById("accountImageUploadButton").files[0]);
}