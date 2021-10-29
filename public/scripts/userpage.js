async function follow(follower_email, following_email) {
  if (follower_email === following_email) {
    alert("Sorry you cannot follow yourself");
    return;
  }
  console.log("emails", follower_email, following_email);
  const res = await fetch("/follow_user", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      follower: follower_email,
      following: following_email,
    }),
  });
  const result = await res.json();
  console.log(result);

  if (result.validity) {
    //ele.following = true;
    location.reload();
  } else {
    alert("cannot follow");
  }
}

async function loadChart(email_id) {
  var canvas = document.getElementById("myChart");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");

  var xValues = [];
  var yValues = [];

  try {
    const result = await fetch("/tracking/" + email_id + "/10");
    const values = await result.json();
    if (values.length === 0) {
      xValues = [new Date().getDate()];
      yValues = [0.1];
    }
    for (var i = 0; i < values.length; ++i) {
      let curr_date = new Date(values[i]["date"]);
      xValues.push(
        curr_date.getDate().toString() + "/" + curr_date.getMonth().toString()
      );
      yValues.push(values[i]["hours_used"]);
    }
  } catch (e) {
    console.log(e.stack);
    xValues = [];
    yValues = [];
  }
  console.log(xValues, yValues);
  new Chart(ctx, {
    type: "line",
    data: {
      labels: xValues,
      datasets: [
        {
          fill: false,
          lineTension: 0,
          backgroundColor: "rgba(0,0,255,1.0)",
          borderColor: "rgba(0,0,255,0.1)",
          data: yValues,
        },
      ],
    },
    options: {
      legend: { display: false },
      scales: {
        yAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: "hours used",
            },
          },
        ],
        xAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: "dd/mm",
            },
          },
        ],
      },
    },
  });
}

function logout() {
  window.location.href = "/logout";
}

// calling addtracking
// async function updateTracking() {
//   const email_id = await localStorage.getItem("email_id");
//   await fetch("/tracking/" + email_id);
// }

let startDate = new Date();
let elapsedTime = 0;

const focus = function () {
  startDate = new Date();
};

const blur = function () {
  const endDate = new Date();
  const spentTime = endDate.getTime() - startDate.getTime();
  elapsedTime += spentTime;
};

const beforeunload = function () {
  const endDate = new Date();
  const spentTime = endDate.getTime() - startDate.getTime();
  elapsedTime += spentTime;
  console.log("time spend", elapsedTime);

  // elapsedTime contains the time spent on page in milliseconds
  fetch("/tracking/", {
    method: "post",
    body: JSON.stringify({
      elapsedTime,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

window.addEventListener("focus", focus);
window.addEventListener("blur", blur);
window.addEventListener("beforeunload", beforeunload);
