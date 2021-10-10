async function follow(email_id) {
  const callerEmail = localStorage.getItem("email_id");
  if (!callerEmail) return;
  console.log(email_id);
  if (callerEmail === email_id) {
    alert("Sorry you cannot follow yourself");
    return;
  }
  const result = await fetch("/follow_user", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      follower: callerEmail,
      following: email_id,
    }),
  });

  if (result.validity) {
    ele.following = true;
    location.reload();
  } else {
    alert("cannot follow");
  }
}
