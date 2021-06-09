var subjectarr = new Array()
var lectureFromChoice;
//getLectureFromS3();

function startLecture()
{
    //강의화면에 들어가기 전 윈도우 크기 1980*1080으로 늘이기
    //ipcRenderer.send('resize-window-bigger')
    //location.href='daARA_InLecture.html'
    location.href='daARA_InLecture.html'
}

const {remote, ipcRenderer, BrowserWindow} = require('electron');
const app = require('electron').remote.app;
function init() { 
  document.getElementById("min-btn").addEventListener("click", function (e) {
      remote.BrowserWindow.getFocusedWindow().minimize(); 
  });

  document.getElementById("max-btn").addEventListener("click", function (e) {
      if( remote.BrowserWindow.getFocusedWindow().isMaximized()==true || remote.BrowserWindow.getFocusedWindow().isFullScreen()==true)
      {
          remote.BrowserWindow.getFocusedWindow().restore();
      }
      else remote.BrowserWindow.getFocusedWindow().maximize(); 
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
