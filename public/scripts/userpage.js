async function follow(email_id) {
  const callerEmail = localStorage.getItem("email_id");
  if (!callerEmail) return;
  console.log(email_id);
  if (callerEmail === email_id) {
    alert("Sorry you cannot follow yourself");
    return;
  }
  const res = await fetch("/follow_user", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      follower: callerEmail,
      following: email_id,
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
      yValues = [1];
    }
    for (var i = 0; i < values.length; ++i) {
      xValues.push(new Date(values[i]["date"]).getDate());
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
    },
  });
}

// calling addtracking
// async function updateTracking() {
//   const email_id = await localStorage.getItem("email_id");
//   await fetch("/tracking/" + email_id);
// }

// increases even if others see
