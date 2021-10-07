function rdsignup() {
  var letter = /^[A-Za-z]+$/;
  var Name = document.getElementById("signupname");
  var Username = document.getElementById("signupusername");
  var email = document.getElementById("signupmail");
  var pswd = document.getElementById("signuppswd");
  var cpswd = document.getElementById("signupcpswd");
  var gen = document.getElementById("signupgender");
  var country = document.getElementById("signupcntry");
  var allCorrect = true;

  if (pswd.value != cpswd.value) {
    alert("Renter the password");
    console.log(pswd.value);
    allCorrect = false;
  }
  if (!email.includes("gmail.com")) {
    alert("Enter the valid Gmail Id");
    allCorrect = false;
  }
  if (pswd.value.length < 10) {
    alert("Your password length is too low");
    allCorrect = false;
  }
  if (pswd.value.length > 20) {
    alert("Your password length is too low");
    allCorrect = false;
  }
  if (!Name.value.match(letter)) {
    alert("Enter the correct Name");
    allCorrect = false;
  }
  if (!country.value.match(letter)) {
    alert("Enter valid country name");
    allCorrect = false;
  }
}
