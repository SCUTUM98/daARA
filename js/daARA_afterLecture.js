function drawBarPlot()
{
  var canvas = document.getElementById("EmotionResultBarGraphCavas");
  canvas.width = 900;
  canvas.height = 600;
  var ctx = canvas.getContext("2d");
  
  var total_emotion_cnt = 0;
  
  var TEST_final_emotion_result = {
    "HAPPY": 43,
    "SAD": 70,
    "ANGRY": 120,
    "CONFUSED": 20,
    "DISGUSTED": 12,
    "SURPERISED": 4,
    "CALM": 3,
    "UNKNOWN": 0,
    "FEAR": 0,
  };

  var sorted_TEST_final_emotion = Object.keys(TEST_final_emotion_result).sort(function(a,b) { return TEST_final_emotion_result[b] - TEST_final_emotion_result[a]; });
  console.log(sorted_TEST_final_emotion);

  for(var i=0; i<sorted_TEST_final_emotion.length; i++) total_emotion_cnt += TEST_final_emotion_result[sorted_TEST_final_emotion[i]];
  console.log(total_emotion_cnt);

  draw_canvar(TEST_final_emotion_result);
}

var color = ["#E43176", "#FA4660", "#FF6447", "#FF852C", "#FFA600"];
var widthSize = [450, 400, 350, 300, 250];
var heightSize = [430, 390, 350, 310, 270];

function draw_canvar(final_emotion_result) {
  var canvas = document.getElementById("EmotionResultBarGraphCavas");
  canvas.width = 900;
  canvas.height = 500;
  var ctx = canvas.getContext("2d");

  var total_emotion_cnt = 0;

  var sorted_final_emotion = Object.keys(final_emotion_result).sort(
    function (a, b) {
      return final_emotion_result[b] - final_emotion_result[a];
    }
  );

  for (var i = 0; i < sorted_final_emotion.length; i++)
    total_emotion_cnt += final_emotion_result[sorted_final_emotion[i]];
  console.log(total_emotion_cnt);

  for (step = 0; step < 5; step++) 
  {
    ctx.fillStyle = color[step];
    ctx.fillRect(
      canvas.width / 2 - widthSize[step],
      canvas.height - 250,
      45, -(final_emotion_result[sorted_final_emotion[step]] / total_emotion_cnt) * 500
    );
    ctx.beginPath();
    ctx.arc(canvas.width / 2 - 100, canvas.height - heightSize[step],  7,  0,  Math.PI * 2);
    ctx.fillStyle = color[step];
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.font = "20px arial";
    ctx.fillText(
      sorted_final_emotion[step],
      canvas.width / 2 - 85,
      canvas.height - heightSize[step]+5
    );
    if(Math.floor((final_emotion_result[sorted_final_emotion[step]] / total_emotion_cnt) * 100)>=10)
        ctx.fillText(Math.floor((final_emotion_result[sorted_final_emotion[step]] / total_emotion_cnt) * 100) + "%", canvas.width / 2 - widthSize[step] + 5, canvas.height-220);
    else
        ctx.fillText(Math.floor((final_emotion_result[sorted_final_emotion[step]] / total_emotion_cnt) * 100) + "%", canvas.width / 2 - widthSize[step] + 12, canvas.height-220);
    ctx.closePath();
  }
}