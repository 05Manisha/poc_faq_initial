// set the focus to the input box
//document.getElementById("wisdom").focus();

// Initialize the Amazon Cognito credentials provider
AWS.config.region = 'us-west-2'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    // Provide your Pool Id here
    IdentityPoolId: 'us-west-2:654394b6-ed1f-4b33-bab9-b216b1bf4151',
});

var lexruntime = new AWS.LexRuntime();
var lexUserId = 'Lex_admin_user' + Date.now();
var sessionAttributes = {};

function pushChat() {

    // if there is text to be sent...
    var wisdomText = document.getElementById('wisdom');
    // wisdomText.style.backgroundColor = "red"
    //alert("value init"+wisdomText.value)
    if (wisdomText && wisdomText.value && wisdomText.value.trim().length > 0) {

        // disable input to show we're sending it
        var wisdom = wisdomText.value.trim();
        wisdomText.value = '...';
        // wisdomText.style.textAlign = "center"
        wisdomText.locked = true;

        // send it to the Lex runtime
        var params = {
            botAlias: 'dev',
            botName: 'test',
            inputText: wisdom,
            userId: lexUserId,
            sessionAttributes: sessionAttributes
        };
        showRequest(wisdom);
        // alert('wisdom '+wisdom);
        lexruntime.postText(params, function (err, data) {
            // alert('params '+JSON.stringify(params));
            // alert('data '+data);
            if (err) {
                console.log(err, err.stack);
                showError('Error:  ' + err.message + ' (see console for details)')
            }
            if (data) {
                // capture the sessionAttributes for the next cycle
                sessionAttributes = data.sessionAttributes;
                // show response and/or error/dialog status
                showResponse(data);
            }
            // re-enable input
            wisdomText.value = '';
            wisdomText.locked = false;
        });
    }
    // we always cancel form submission
    return false;
}

function pushButton(msg) {

alert("msg"+msg)
    // if there is text to be sent...
    var wisdomText = msg;
    //alert("value"+wisdomText.value);
    //alert("length"+wisdomText.value.trim().length);

    // wisdomText.style.backgroundColor = "red"
    if (wisdomText && wisdomText.trim().length > 0) {

        // disable input to show we're sending it
        var wisdom = wisdomText.trim();
        //wisdomText.value = '...';
        // wisdomText.style.textAlign = "center"
        wisdomText.locked = true;

        // send it to the Lex runtime
        var params = {
            botAlias: 'dev',
            botName: 'test',
            inputText: wisdom,
            userId: lexUserId,
            sessionAttributes: sessionAttributes
        };
        showRequest(wisdom);
        lexruntime.postText(params, function (err, data) {
            // alert('params '+JSON.stringify(params));
            // alert('data '+data);
            if (err) {
                console.log(err, err.stack);
                showError('Error:  ' + err.message + ' (see console for details)')
            }
            if (data) {
                // capture the sessionAttributes for the next cycle
                sessionAttributes = data.sessionAttributes;
                // show response and/or error/dialog status
                showResponse(data);
            }
            // re-enable input
            wisdomText.value = '';
            wisdomText.locked = false;
        });
    }
    // we always cancel form submission
    return false;
}

function showRequest(daText) {
    var conversationDiv = document.getElementById('conversation');
    var divelement = document.createElement("div")
    var requestPara = document.createElement("P");
    requestPara.className = 'userRequest1';
    divelement.className = 'userRequest'
    // divelement.style.backgroundColor = "red";
    // divelement.style.textAlign = "center";

    // creating the DC logo
    var imageuserres = document.createElement("img");
    imageuserres.className = "imageuseresponse"
    imageuserres.src = "./assets/logo_round.svg";
    divelement.appendChild(imageuserres);
    // end
    divelement.appendChild(document.createTextNode(daText));
    conversationDiv.appendChild(divelement);
    conversationDiv.scrollTop = conversationDiv.scrollHeight;


}

function showError(daText) {
    //  alert(' showError daText'+ daText);
    var conversationDiv = document.getElementById('conversation');
    var errorPara = document.createElement("P");
    errorPara.className = 'lexError';
    errorPara.appendChild(document.createTextNode(daText));
    conversationDiv.appendChild(errorPara);
    conversationDiv.scrollTop = conversationDiv.scrollHeight;
}

function showResponse(lexResponse) {
    //alert('showResponse lexResponse ' + JSON.stringify(lexResponse));
    var conversationDiv = document.getElementById('conversation');
    var divelement = document.createElement("div")
    var responsePara = document.createElement("P");
    divelement.className = 'lexRes'

    var button = document.createElement("btn");
    responsePara.className = 'lexResponse';
    button.className = "buttonResponse";
    var responseMessage = JSON.parse(lexResponse.message);

    var imageres = document.createElement("img");
    imageres.className = "imagebotresponse"
    imageres.src = "./assets/DCgovLogoCircular.png";
    responsePara.appendChild(imageres)
    // var buttonMessage = JSON.parse(lexResponse.message)
    if (lexResponse.message) {
        console.log("respone" + responseMessage)
        if (responseMessage.message) {
            let array=responseMessage.message.split(/\n?\n/);
            responsePara.appendChild(document.createTextNode(array[0]));
            responsePara.appendChild(document.createElement('br'));
            responsePara.appendChild(document.createElement('br'));
            responsePara.appendChild(document.createTextNode(array[1]));
        }
        conversationDiv.appendChild(responsePara);
        conversationDiv.appendChild(divelement);
        conversationDiv.scrollTop = conversationDiv.scrollHeight;
        let buttonText;
        let i=0;
        if (responseMessage.button) {
            for (i = 0; i < responseMessage.button.length; i++) {
                var button = document.createElement("btn");
                button.type = "button";
                button.className = "buttonResponse";
                //alert("button11111" + responseMessage.button[i]);
                buttonText=responseMessage.button[i];
                button.appendChild(document.createTextNode(responseMessage.button[i]));
               // alert("value in button"+responseMessage.button[i])
               // text.onclick = function (){buttonclick()};
                button.appendChild(document.createElement('br'));
                //alert("button value"+JSON.stringify(button))
                //button.addEventListener('click',function(){buttonclick(buttonText)});
               // document.body.appendChild(button);
                conversationDiv.appendChild(button).onclick=function(){buttonclick(responseMessage.button[i])}
                    

                
                // function(){
                //     alert("button value in function"+responseMessage.button[i]);
                //     pushButton(responseMessage.button[i]);
                // };
                //alert("value in button"+responseMessage.button[i])

               // alert("button val"+responseMessage.button[i])
                //button.onclick = function () { buttonclick(responseMessage.button[i]) };
            }
           // document.createTextNode(responseMessage.button).onclick = function (){buttonclick()};
        }
        // if(btn.buttonresponse.onclick){
        //     alert("button value")
        //     pushButton("bye");
        // }



        //responsePara.appendChild(document.createElement('br'));
    }
    if (lexResponse.dialogState === 'ReadyForFulfillment') {
        responsePara.appendChild(document.createTextNode(
            'Ready for fulfillment'));
        // TODO:  show slot values
    } else {
        /* responsePara.appendChild(document.createTextNode(
             '(' + lexResponse.dialogState + ')')); */
    }
    // responsePara.appendChild(document.createElement('br'));
    // for (var i = 0; i < responseMessage.button.length; i++) {
    //     if (responseMessage.button[i]) {
    //         conversationDiv.appendChild(button);
    //     }
    // }

}


function buttonclick(btnMessage) {
    alert("button value in function"+btnMessage)
    pushButton(btnMessage);
    //location.href='https://www.google.com'
}

document.getElementById("link").onclick=function(){
    location.href("https://www.google.com")
}