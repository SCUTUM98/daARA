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

  ctx.fillStyle = 'Green';
  ctx.fillRect(canvas.width/2 - 100, canvas.height-250, 45, -(TEST_final_emotion_result[sorted_TEST_final_emotion[0]]/total_emotion_cnt)*300);

  ctx.fileStyle = 'blue'
  ctx.fillRect(canvas.width/2 - 50, canvas.height-250, 45, -(TEST_final_emotion_result[sorted_TEST_final_emotion[1]]/total_emotion_cnt)*300);
  
  ctx.fileStyle = "rgb(255, 100, 30)";
  ctx.fillRect(canvas.width/2, canvas.height-250, 45, -(TEST_final_emotion_result[sorted_TEST_final_emotion[2]]/total_emotion_cnt)*300);
  
  ctx.fileStyle = 'orange';
  ctx.fillRect(canvas.width/2 + 50, canvas.height-250, 45, -(TEST_final_emotion_result[sorted_TEST_final_emotion[3]]/total_emotion_cnt)*300);

  ctx.fileStyle = 'sky';
  ctx.fillRect(canvas.width/2 + 100, canvas.height-250, 45, -(TEST_final_emotion_result[sorted_TEST_final_emotion[4]]/total_emotion_cnt)*300);
}