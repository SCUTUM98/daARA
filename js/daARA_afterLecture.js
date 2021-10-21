const { ServerlessApplicationRepository } = require("aws-sdk");

function drawBarPlot()
{
  var canvas = document.getElementById("EmotionResultBarGraphCavas");
  canvas.width = 900;
  canvas.height = 500;
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

  ctx.fillStyle = '#E43176';
  ctx.fillRect(canvas.width/2 - 450, canvas.height-250, 45, -(TEST_final_emotion_result[sorted_TEST_final_emotion[0]]/total_emotion_cnt)*500);
  ctx.beginPath();
  ctx.arc(canvas.width/2, canvas.height-470, 7, 0, Math.PI*2);
  ctx.fillStyle = '#E43176';
  ctx.fill();
  ctx.fillStyle = 'white';
  ctx.font = '20px arial';
  ctx.fillText(sorted_TEST_final_emotion[0], canvas.width/2 + 15, canvas.height-465);
  ctx.fillText(Math.floor((TEST_final_emotion_result[sorted_TEST_final_emotion[0]]/total_emotion_cnt)*100) + "%", canvas.width/2 - 445, canvas.height-220);
  ctx.closePath();

  ctx.fillStyle = '#FA4660';
  ctx.fillRect(canvas.width/2 - 400, canvas.height-250, 45, -(TEST_final_emotion_result[sorted_TEST_final_emotion[1]]/total_emotion_cnt)*500);
  ctx.beginPath();
  ctx.arc(canvas.width/2, canvas.height-420, 7, 0, Math.PI*2);
  ctx.fillStyle = '#FA4660';
  ctx.fill();
  ctx.fillStyle = 'white';
  ctx.font = '20px arial';
  ctx.fillText(sorted_TEST_final_emotion[1], canvas.width/2 + 15, canvas.height-415);
  ctx.fillText(Math.floor((TEST_final_emotion_result[sorted_TEST_final_emotion[1]]/total_emotion_cnt)*100) + "%", canvas.width/2 - 395, canvas.height-220);
  ctx.closePath();

  ctx.fillStyle = "#FF6447";
  ctx.fillRect(canvas.width/2 - 350, canvas.height-250, 45, -(TEST_final_emotion_result[sorted_TEST_final_emotion[2]]/total_emotion_cnt)*500);
  ctx.beginPath();
  ctx.arc(canvas.width/2, canvas.height-370, 7, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle = 'white';
  ctx.font = '20px arial';
  ctx.fillText(sorted_TEST_final_emotion[2], canvas.width/2 + 15, canvas.height-365);
  ctx.fillText(Math.floor((TEST_final_emotion_result[sorted_TEST_final_emotion[2]]/total_emotion_cnt)*100) + "%", canvas.width/2 - 345, canvas.height-220);
  ctx.closePath();
  
  ctx.fillStyle = '#FF852C';
  ctx.fillRect(canvas.width/2 - 300, canvas.height-250, 45, -(TEST_final_emotion_result[sorted_TEST_final_emotion[3]]/total_emotion_cnt)*500);
  ctx.beginPath();
  ctx.arc(canvas.width/2, canvas.height-320, 7, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle = 'white';
  ctx.font = '20px arial';
  ctx.fillText(sorted_TEST_final_emotion[3], canvas.width/2 + 15, canvas.height-315);
  ctx.fillText(Math.floor((TEST_final_emotion_result[sorted_TEST_final_emotion[3]]/total_emotion_cnt)*100) + "%", canvas.width/2 - 295, canvas.height-220);
  ctx.closePath();

  ctx.fillStyle = '#FFA600';
  ctx.fillRect(canvas.width/2 - 250, canvas.height-250, 45, -(TEST_final_emotion_result[sorted_TEST_final_emotion[4]]/total_emotion_cnt)*500);
  ctx.beginPath();
  ctx.arc(canvas.width/2, canvas.height-270, 7, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle = 'white';
  ctx.font = '20px arial';
  ctx.fillText(sorted_TEST_final_emotion[1], canvas.width/2 + 15, canvas.height-265);
  ctx.fillText(Math.floor((TEST_final_emotion_result[sorted_TEST_final_emotion[4]]/total_emotion_cnt)*100) + "%", canvas.width/2 - 245, canvas.height-220);
  ctx.closePath();


}