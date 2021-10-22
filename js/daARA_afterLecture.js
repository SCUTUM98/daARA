//------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------
//electron 모듈
const dialog = require('electron').remote.dialog;
const {remote, ipcRenderer, BrowserWindow} = require('electron');
const app             = require('electron').remote.app;
var browserWindow = remote.getCurrentWindow();
//------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------
//화면 최소화, 최대화, 창 옮기기 설정
function init() { 
  document.getElementById("min-btn").addEventListener("click", function (e) {
      remote.BrowserWindow.getFocusedWindow().minimize(); 
  });

  document.getElementById("max-btn").addEventListener("click", function (e) {
      remote.BrowserWindow.getFocusedWindow().maximize(); 
  });

  document.getElementById("close-btn").addEventListener("click", function (e) {
  app.quit();
  }); 
}; 

document.onreadystatechange = function () {
  if (document.readyState == "complete") {
       init(); 
  }
};
//--------------------------------------------------------------------------------
const downloadResultBTN = document.getElementById("downloadResultBTN");
const now     = new Date();
const month   = now.getMonth()+1;
const day     = now.getDate();
if(localStorage.getItem('getClassName')){ var class_name = JSON.parse(localStorage.getItem('getClassName')) }
if(localStorage.getItem('getFinalEmotionResult')){ var final_emotion_result= localStorage.getItem('getFinalEmotionResult') }
//--------------------------------------------------------------------------------
downloadResultBTN.addEventListener('click', e => {
 
  var options = {
    title: "출석파일 다운로드",
    filters: [
        {name: '엑셀파일', extensions: ['xls']}
    ],
    defaultPath: month + "월 " + day + "일 " + class_name.name + " 출석체크.xls"
  }
  let saveDialog = dialog.showSaveDialog(browserWindow, options);
  
  saveDialog.then(function(saveTo) {
      console.log(saveTo.filePath);
      fs.appendFile(saveTo.filePath, save_data, (err) => {
        if (err) throw console.log(err);
      });
      //추가 로그파일 다운로드 옵션
      const options = {
        type: 'question',
        buttons: ['감정 로그 확인', '취소', '다아라 종료하기'],
        defaultId: 0,
        title: '감정 로그를 확인하시겠습니까?',
        message: '기록된 감정 로그를 확인하시겠습니까?',
        detail: '기록된 감정을 확인하실 수 있습니다.',
        checkboxLabel: '응답 기억하기',
        checkboxChecked: true,
      };
     let messageDialog =  dialog.showMessageBox(browserWindow, options);
     messageDialog.then(function(selectedAns){
       if(selectedAns.response==0)
       {
          console.log(__dirname+"\\emotion.log");
          window.open(__dirname+"\\emotion.log", 'electron', 'frame=true');
       }
       else if(selectedAns.response==2)
       {
         app.quit();
       }
     })
    })
})


function drawBarPlot()
{
  var canvas = document.getElementById("EmotionResultBarGraphCavas");
  canvas.width = 900;
  canvas.height = 600;
  var ctx = canvas.getContext("2d");
  
  var total_emotion_cnt = 0;
  

  var sorted_final_emotion = Object.keys(final_emotion_result).sort(function(a,b) { return final_emotion_result[b] - final_emotion_result[a]; });
  console.log(sorted_final_emotion);

  for(var i=0; i<sorted_final_emotion.length; i++) total_emotion_cnt += final_emotion_result[sorted_final_emotion[i]];
  console.log(total_emotion_cnt);

  draw_canvas(final_emotion_result);
}

var color = ["#E43176", "#FA4660", "#FF6447", "#FF852C", "#FFA600"];
var widthSize = [450, 400, 350, 300, 250];
var heightSize = [430, 390, 350, 310, 270];

function draw_canvas(final_emotion_result) {
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