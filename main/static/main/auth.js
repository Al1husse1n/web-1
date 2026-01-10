const signIn = document.getElementById("signIn-btn");
const signIn_user = document.getElementById('signIn-user');
const signIn_pass = document.getElementById('signIn-pass');
const signIn_error = document.getElementById('signIn-error');
signIn.addEventListener('click', ()=>{
    if(signIn_user.value === "" || signIn_pass.value === ""){
        signIn_error.style.display = 'block'; 
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
                    signIn_error.style.display = 'block';
                }
                else if(response.status === 500){
                    signIn_error.textContent = 'Something went wrong, please try again'
                    signIn_error.style.display = 'block';
                    console.log(parsedResponse.error);
                }
                else if(parsedResponse.message){
                    window.location.href = '/leaderboards/';
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