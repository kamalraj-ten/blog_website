function dispBlog() {
  let blogID = document.getElementById("blogID").innerHTML;
  console.log(blogID);
  window.location.href = "/blog/" + blogID;
}
const email_id = localStorage.getItem("email_id");
document.getElementById("profile-link").href =
  "/user/" + email_id + "-" + email_id;
