var x = document.getElementById("login");
var y = document.getElementById("register");
var z = document.getElementById("btn");
var form_wrap = document.getElementById("ID_form-wrap");

var username;
var password;
var personalname;
var poolData = 
{
    UserPoolId : configKey.UserPoolId, // Your user pool id here
    ClientId : configKey.ClientId, // Your client id here
};
//var cognitoUser = userPool.getCurrentUser();
var cognitoUser;

const {remote, ipcRenderer, BrowserWindow} = require('electron');
const app = require('electron').remote.app;

console.log("0610 NEW VERSION");

function init() { 
    document.getElementById("min-btn").addEventListener("click", function (e) {
        remote.BrowserWindow.getFocusedWindow().minimize(); 
    });

    document.getElementById("max-btn").addEventListener("click", function (e) {
        if( remote.BrowserWindow.getFocusedWindow().isMaximized()==true)
        {
            remote.BrowserWindow.getFocusedWindow().restore();
        }
        else remote.BrowserWindow.getFocusedWindow().maximize(); 
    });

    document.getElementById("close-btn").addEventListener("click", function (e) {
    app.quit();
    }); 
}; 

document.onreadystatechange = function () {
    if (document.readyState == "complete") {
         init(); 
    }
};

if (cognitoUser != null) 
{
    cognitoUser.getSession(function(err, result) 
    {
        if (result) 
        {
            console.log('You are now logged in.');
            var cognitoSession = 'cognito-idp.ap-northeast-2.amazonaws.com/' + configKey.UserPoolId;

            // Add the User's Id Token to the Cognito credentials login map.
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: config.IdentityPoolId,
                Logins: 
                {
                    cognitoSession : result.getIdToken().getJwtToken()
                }
            });
        }
    });
}

function login()
{
    x.style.left = "50px";
    y.style.left = "450px";
    z.style.left = "0";
    form_wrap.style.height = "290px";
}

function register()
{
    x.style.left = "-400px";
    y.style.left = "50px";
    z.style.left = "115px";
    form_wrap.style.height = "390px";
}

function loginButton() 
{

    var authenticationData = 
    {
        Username : document.getElementById("inputUsername").value,
        Password : document.getElementById("inputPassword").value,
    };
    
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    
   
    
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    
    var userData = 
    {
        Username : document.getElementById("inputUsername").value,
        Pool : userPool,
    };
    
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    
    cognitoUser.authenticateUser(authenticationDetails, 
        {
        onSuccess: function (result) 
        {
            var accessToken = result.getAccessToken().getJwtToken();
            console.log(accessToken);	
            location.href='daARA_main.html'
        },

        onFailure: function(err) 
        {
            //alert(err.message || JSON.stringify(err));
            //location.reload();
            document.getElementById("loginErr").value = "아이디/비밀번호를 확인해주세요.";
            button = document.getElementById('sign_in_BTN');

        },
    });
}

function registerButton() 
{
    personalnamename =  document.getElementById("personalnameRegister").value;	
    username = document.getElementById("emailInputRegister").value;
    console.log(personalname)
    console.log(username)
    if (document.getElementById("passwordInputRegister").value != document.getElementById("confirmationpassword").value) 
    {
        document.getElementById("registerErr").value = "비밀번호가 동일하지 않습니다";
        throw "Passwords Do Not Match!"
    } 
    else 
    {
        password =  document.getElementById("passwordInputRegister").value;	
    }

    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    var attributeList = [];
    
    var dataEmail =
    {
        Name : 'email', 
        Value : username, //get from form field
    };
    
    var dataPersonalName = 
    {
        Name : 'name', 
        Value : personalname, //get from form field
    };

    var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
    var attributePersonalName = new AmazonCognitoIdentity.CognitoUserAttribute(dataPersonalName);
    
    
    attributeList.push(attributeEmail);
    attributeList.push(attributePersonalName);

    userPool.signUp(username, password, attributeList, null, function(err, result)
    {
        if (err) 
        {
            //alert(err.message || JSON.stringify(err));
            //location.reload();
            document.getElementById("registerErr").value = "아이디/비밀번호를 확인해주세요.";
            return;
        }
        cognitoUser = result.user;
        //console.log('user name is ' + cognitoUser.getUsername());
        document.getElementById("registerErr").style.color = "black";
        document.getElementById("registerErr").value = "확인 이메일을 전송했습니다.";
        //change elements of page
        //alert('이메일을 전송했습니다. 확인 링크를 클릭해주세요.');
    });
}

function enterKey()
{
    if (window.event.keyCode == 13)
    {
        loginButton();
    }
}

