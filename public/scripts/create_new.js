function postBlog(){
    let title = document.getElementById('inputTitle')
    let subject = document.getElementById()
    let data = {

    }
    fetch("/database/sign_up", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })
}

let interests = [];
function selectInterest(event) {
  const srcText = event.srcElement.firstChild.data;
  if (event.srcElement.id == "interests") return;

  const classlist = event.srcElement.classList;
  if (classlist.contains("checked")) {
    classlist.remove("checked");
    interests = interests.filter((ele) => ele !== srcText);
  } else {
    classlist.add("checked");
    interests.push(srcText);
  }
  event.stopPropagation();
}