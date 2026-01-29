const signIn = document.getElementById("signIn-btn");
const signIn_user = document.getElementById('signIn-user');
const signIn_pass = document.getElementById('signIn-pass');
const signIn_error = document.getElementById('signIn-error');
const signUp = document.getElementById('signUp-btn');
const signUp_user = document.getElementById('signUp-user');
const signUp_pass1 = document.getElementById('signUp-pass-1');
const signUp_pass2 = document.getElementById('signUp-pass-2');
const signUp_email = document.getElementById('signUp-email');
const signUp_error = document.getElementById('signUp-error');

signIn.addEventListener('click', ()=>{
    if(signIn_user.value === "" || signIn_pass.value === ""){
        signIn_error.style.display = 'block'; 
        signIn_error.textContent = 'invalid credentials';
    }
    else{
        fetch('/authenticate/',{
            method:'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                "type":"login",
                "username":signIn_user.value,
                "password":signIn_pass.value 
            })
        })
        .then(response => {
            return response.json()
            .then(parsedResponse =>{
                if(response.status === 404){
                    signIn_error.textContent = parsedResponse.error;
                    signIn_error.style.display = 'block';
                }
                else if(response.status === 400){
                    signIn_error.textContent = parsedResponse.error;
                    signIn_error.style.display = 'block';
                }
                else if(response.status === 500){
                    signIn_error.textContent = 'Something went wrong, please try again'
                    signIn_error.style.display = 'block';
                    console.error(parsedResponse.error);
                }
                else if(parsedResponse.message){
                    window.location.href = '/home/';
                }
            })
        })
        .catch(error =>{
            signIn_error.textContent = "Something went wrong, please try again";
            signIn_error.style.display = 'block';
            console.error('Fetch error:', error);
        })
    }
})

signUp.addEventListener('click', ()=>{
    if(signUp_email.value === "" || signUp_pass1.value === "" || signUp_pass2.value === "" || signUp_user.value === ""){
        signUp_error.textContent = 'Please fill all the required fields';
        signUp_error.style.display = 'block';
    }
    else if(signUp_pass1.value !== signUp_pass2.value){
        signUp_error.textContent = 'passwords do not match';
        signUp_error.style.display = 'block';
    }
    else{
        fetch('/authenticate/',{
            method : "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                type:"signUp",
                username:signUp_user.value,
                password:signUp_pass1.value,
                email:signUp_email.value
            })
        })
        .then(response => {
            return response.json()
            .then(parsedResponse =>{
                if(response.status === 400){
                    if(parsedResponse.error){
                       signUp_error.textContent = parsedResponse.error;
                        signUp_error.style.display = 'block'; 
                    }
                    else{
                        const firstField = Object.keys(parsedResponse.errors)[0];
                        signUp_error.textContent = parsedResponse.errors[firstField][0];
                        signUp_error.style.display = 'block';
                    } 
                }
                else if(response.status === 500){
                    signUp_error.textContent = "Something wrong happened, please try again";
                    signUp_error.style.display = 'block';
                    console.error(parsedResponse.error);
                }
                else if(parsedResponse.message){
                    console.log(parsedResponse.message);
                    window.location.href = '/home/';
                }
            })
        })
        .catch(error =>{
            signUp_error.textContent = "Something wrong happened, please try again";
            signUp_error.style.display = 'block';
            console.error('Fetch error:', error);
        })
    }
})