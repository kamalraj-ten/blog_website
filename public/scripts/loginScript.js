async function handleSubmit(event) {
  event.preventDefault();
  var email = document.getElementById("email_id");
  var pswd = document.getElementById("password");
  var btn = document.getElementById("submit-btn");
  btn.innerHTML = "Signing in";
  btn.disabled = true;
  btn.style.color = "LightGrey";
  const response = await fetch("/database/sign_in", {
    method: "POST",
    body: JSON.stringify({
      email_id: email.value,
      password: pswd.value,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const { validity,token } = await response.json();
  console.log(token);
  btn.innerHTML = "Sign in";
  btn.disabled = false;
  btn.style.color = "white";
  if (validity) {
    localStorage.setItem("email_id", email.value);
    document.cookie = `token = ${token}; max-age = 10800; path=/;`
    await fetch("/tracking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email_id: email.value }),
    });
    window.location.href = "/blogHome/" + email.value + '-' +token;
  } else {
    alert("Invalid credentials");
  }
}
