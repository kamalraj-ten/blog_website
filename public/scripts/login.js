function login(){
    var email = document.getElementById("email_inp")
    var password = document.getElementById("password_inp")
    console.log(email.value)
    console.log(password.value)
    if(email.value == "" || password.value == ""){

    }else{
        email.value = ""
        password.value = ""
    }
}