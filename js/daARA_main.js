const app = require('electron').remote;
var main_logo_click_cnt = 0;
//---------------------------------------------------------------------------------------------------------Electron 관련 변수


//--------------------------------------------------------------------------------
//화면 최소화, 최대화, 창 옮기기 설정
function init() { 
  document.getElementById("min-btn").addEventListener("click", function (e) {
      remote.getFocusedWindow().minimize(); 
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
//--------------------------------------------------------------------------------





//----------------------------------------------------
//화면 크기 설정
(function($) {

	"use strict";

	var fullHeight = function() {

		$('.js-fullheight').css('height', $(window).height());
		$(window).resize(function(){
			$('.js-fullheight').css('height', $(window).height());
		});

	};
	fullHeight();

	$('#sidebarCollapse').on('click', function () {
      $('#sidebar').toggleClass('active');
  });

})(jQuery);
//------------------------------------------------------

function linkTOdaARA_UpLoad()
{
    location.href='./daARA_UpLoad.html'
}

function linkTIdaARA_admin()
{
    location.href='./daARA_admin.html'
}

function lintTOdaATA_InLecture()
{
    location.href='./daARA_InLecture.html'
}

function main_logo_click()
{
    main_logo_click_cnt++;
    if(main_logo_click_cnt>=5)
    {
        location.href = "./daARA_after_lecture.html"
    }
}