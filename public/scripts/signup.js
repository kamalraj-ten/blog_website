async function rdsignup() {
  var letter = /^[A-Za-z]+$/;
  var Name = document.getElementById("signupname");
  var Username = document.getElementById("signupusername");
  var email = document.getElementById("signupmail");
  var pswd = document.getElementById("signuppswd");
  var cpswd = document.getElementById("signupcpswd");
  var gen = document.getElementById("signupgender");
  var country = document.getElementById("signupcntry");
  var dob = document.getElementById("signupdob");
  console.log(dob.value);

  var allCorrect = true;

  if (pswd.value != cpswd.value) {
    alert("Renter the password");
    console.log(pswd.value);
    allCorrect = false;
  }
  if (email.value.length < 5) {
    alert("Enter the valid Gmail Id with length > 5");
    allCorrect = false;
  }
  if (pswd.value.length < 5) {
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
  if (interests.length < 3) {
    alert("Select atleast 3 interested fields");
    allCorrect = false;
  }

  if (allCorrect) {
    const body = {
      email_id: email.value,
      username: Username.value,
      name: Name.value,
      dob: new Date(dob.value),
      gender: gen.value === "Male" ? "M" : "F",
      country: country.value,
      interests: interests,
      password: pswd.value,
    };
    // signup
    await fetch("/database/sign_up", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    window.location.href = '/login'
  }
}

let interests = [];
function selectInterest(event) {
  const srcText = event.srcElement.firstChild.data;
  if (event.srcElement.id == "interests") return;

  const classlist = event.srcElement.classList;
  if (classlist.contains("checked")) {
    classlist.remove("checked");
    classlist.remove('btn-success')
    classlist.add('btn-outline-success')
    interests = interests.filter((ele) => ele !== srcText);
  } else {
    classlist.add("checked");
    classlist.remove('btn-outline-success')
    classlist.add('btn-success')
    interests.push(srcText);
  }
  event.stopPropagation();
}
