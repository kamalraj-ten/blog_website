function dispBlog(){
    let blogID = document.getElementById('blogID').innerHTML;
    console.log(blogID);
    window.location.href = "/blog/"+blogID+
        "-"+document.getElementById("email").innerHTML+
        "-"+document.getElementById("username").innerHTML;
}