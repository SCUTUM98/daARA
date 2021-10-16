//js 기본 모듈
const os   = require('os');
const fs   = require('fs');
const path = require('path');

const { writeFile } = require('fs');
//------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------
//electron 모듈
const electron        = require('electron');
const desktopCapturer = electron.desktopCapturer;
const electronScreen  = electron.screen;
const shell           = electron.shell;
const app             = require('electron').remote.app;
const ipc = require('electron').ipcRenderer;

const {remote, ipcRenderer, BrowserWindow} = require('electron');
const dialog = require('electron').remote.dialog;
//------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------
//DaARA variable
const ACCESS_KEY_ID     = configKey.accessKeyId;
const SECRET_ACCESS_KEY = configKey.secretAccessKey;
const REGION            = "ap-northeast-2"

const BUCKET_NAME       = "public-daara-test"
var globalSource, class_name;
var uncheckedFaces      = [], checkedFaces = [], S3imagesName = [];

var save_data = '\uFEFF';
//------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------
//DAARA html 
const videoElement     = document.querySelector('video');
const videoSelectBtn   = document.getElementById('videoSelectBtn');
const startBtn         = document.getElementById('startBtn');
const stopBtn          = document.getElementById('stopBtn');
const cbox             = document.getElementById('uncheckedFaces');
const checkedFacesBox  = document.getElementById('checkedFaces');
const {Menu } = remote; 
//------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------
//AWS config, S3
const AWS = require('aws-sdk')
AWS.config.update({region:REGION});
const s3 = new AWS.S3({
  accessKeyId     : ACCESS_KEY_ID,
  secretAccessKey : SECRET_ACCESS_KEY,
  region          : REGION
});
const config = new AWS.Config({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
  region: REGION
})
var bucketParams = {
  Bucket : 'public-daara-test',
}
//------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------
//오늘의 날짜
var now     = new Date();
var year    = now.getFullYear();
var month   = now.getMonth()+1;
var day     = now.getDate();
var hours   = now.getHours();
var minutes = now.getMinutes();   
var seconds = now.getSeconds();
//------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------

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

//화면 조정
function show(shown, hidden) {
  document.getElementById(shown).style.display='block';
  document.getElementById(hidden).style.display='none';
}

//choice 옵션 추가
getLectureFromS3();
async function getLectureFromS3()
{
  var subjectarr = new Array()
  const AWS = require('aws-sdk')
  AWS.config.update({region:'ap-northeast-2'});

  
  var mySet = new Set();

 
await s3.listObjects(bucketParams, function(err, data) {
  if(err)
  {
    if (err.message == "Cannot convert undefined or null to object") {
      location.reload();
    }
    console.log(err.message);
  }
  for(var i = 0; i < Object.keys(data["Contents"]).length; i++){
    for(var j = 0; j < data["Contents"][i]["Key"].length; j++){
      if(data["Contents"][i]["Key"][j] == "/"){
        mySet.add(data["Contents"][i]["Key"].substring(0, j))
        break
      }
    }
  }
  }).promise();

  if(mySet.size != 0) checkLoaded(1);
  else checkLoaded(0);

  for(const item of mySet){
    if(item==undefined) continue;
    subjectarr.push(item)
  }
  console.log(subjectarr);
  
  select = document.getElementById('lecture_select');
  for (i = 0; i < subjectarr.length; i++) {
     var op = document.createElement('option');
    op.value = subjectarr[i];
    op.text = subjectarr[i];
    select.appendChild(op);
  }
}

function checkLoaded(flag)
{
  if(flag == 1)
  {
    document.getElementById("load").style.display = "none";
    show('Page1', 'Page2');
  }
  else
  {
    for(var i=0; i<20; i++)
    {
      s3.listObjects(bucketParams)
    }
    dialog.showErrorBox('', '생성된 강의가 없습니다! 강의를 등록해주세요.')
    location.href='daARA_main.html';
  }
}

function changedOption(obj)
{
  document.getElementById("showSelectedLecture").innerHTML = obj.value;
  globalSource, class_name = obj.value;
  console.log(class_name) 
  //savedata 초기화
  
}

function startLecture()
{
  getNameFromS3();
  document.getElementById('imKING').style.backgroundImage = "url(./img/le_back.jpg)";
  document.getElementById('imKING').style.backgroundSize = "cover";
  var data= year+" "+class_name+" 출석체크\n"
  save_data += data;
  var data= "출석일\," + "시간\," + '이름\,' + '출석확인\n'
  save_data += data;
  //emotionLog 초기화
  const text = "[" + month + "월 " + day + "일 "+ class_name + " 과목 감정인식 로그]\n";
  fs.appendFileSync(__dirname+"\\emotion.log", '\ufeff' + text, {encoding: 'utf8'});
  show('Page2','Page1');
}


//uncheckedFaces에 학생 얼굴 저장
async function getNameFromS3() {
  try {
    const data = await s3.listObjects({ Bucket : BUCKET_NAME }).promise();

    for(var i = 0; i < data["Contents"].length; i++){
      if(data["Contents"][i]["Key"].split('/')[0] != class_name) continue
      var getName = data["Contents"][i]["Key"].split('/')[1]

      if( getName == "예상 화면.png" || getName == "screenshot.png" || getName.length==0) continue; //S3 Bucket에 올라가는 캡쳐본
      
      S3imagesName.push(getName)
      uncheckedFaces.push(getName.split('.')[0])

      var newLi = document.createElement('li');
      var cb = document.createElement("input");
      cb.type    = "checkbox";
      cb.id      = "uncheckedStudent"
      cb.value   = uncheckedFaces[uncheckedFaces.length - 1];
      cb.checked = false;

      newLi.appendChild(cb);

      var text = document.createTextNode(uncheckedFaces[uncheckedFaces.length - 1]);
      //Append the text node to the <li>
      newLi.appendChild(text);

      //Append the <li> to the <ul>
      var ul = document.getElementById("uncheckedFaces");
      ul.appendChild(newLi);
    }
  } catch (err) {
    console.log("Error", err);
    return;
  }
}

//------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------
//Select screen
videoSelectBtn.onclick = getVideoSources;

async function getVideoSources() {
  const inputSources = await desktopCapturer.getSources({
    types: ['window', 'screen']
  })

  const videoOptionsMenu = Menu.buildFromTemplate(
    inputSources.map(source => {
      return {
        label: source.name,
        click: () => selectSource(source)
      };
    })
  );  
  videoOptionsMenu.popup();
}

// Change the videoSource window to record
async function selectSource(source) {
  globalSource = source

  videoSelectBtn.innerText = source.name;

  const constraints = {
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: source.id
      }
    }
  };
 
  // Create a Stream
  const stream = await navigator.mediaDevices
    .getUserMedia(constraints);

  // Preview the source in a video element
  videoElement.srcObject = stream;
  videoElement.play();
}
//------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------
//Start Class
startBtn.onclick = e => {
  //5초에 한번씩 캡쳐 시작
  startBtn.classList.add('is-danger');
  stopBtn.disabled = false;
  startBtn.innerText = '강의중';
  take_screen_shot = setInterval(takeScreenShot, 5000);
};
//출석 안된 인원 Checkbox
cbox.addEventListener('change', e => {
  if(e.target.checked) {
    checkedFaces.push(e.target.value); //e.target : checkbox로 출석이 된 사람 데이터
    createEXCEL(checkedFaces[checkedFaces.length - 1], true)

    for(var i = 0; i < uncheckedFaces.length; i++) {
      if (uncheckedFaces[i] == checkedFaces[checkedFaces.length - 1]) {
        uncheckedFaces.splice(i, 1)
        break;
      }
    }
    newCheckedStudentList();
    newUncheckedStudentList();
  }
});
//CheckBox로 출석 후 CheckedStudentList Reset
async function newCheckedStudentList() {
  checkedFacesBox.value = '';
  for(const i of checkedFaces) {
    checkedFacesBox.value += i + '\n';
  }
}
//CheckBox로 출석 후 UnCheckedStudentList Reset
async function newUncheckedStudentList() {
  document.getElementById('uncheckedFaces').innerHTML = "";
  
  for (const item of uncheckedFaces) {
    var studentName = item.split('.')[0]
    var newLi = document.createElement('li');
    var checkBox = cb = document.createElement( "input" );
    cb.type    = "checkbox"
    cb.id      = "uncheckedStudent"
    cb.value   = studentName
    cb.checked = false;

    newLi.appendChild(cb);

    var text = document.createTextNode(studentName);
    //Append the text node to the <li>
    newLi.appendChild(text);

    //Append the <li> to the <ul>
    var ul = document.getElementById("uncheckedFaces");
    ul.appendChild(newLi);
  }
  newCheckedStudentList();
}
//------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------
//캡쳐 및 Rekognition 시작
async function takeScreenShot() {
  //감정 확인 시작
  const thumbSize = {
    width: 1920,
    height: 1080
  }
  let options = { types: ['screen', 'window'], thumbnailSize: thumbSize };
  const current_dir = app.getAppPath() + '\\screenshot_Images';
  const screenshotPath = path.join(current_dir, 'screenshot.png'); 

  //<-----스크린샷 후 screenShot_Images폴더에 screenshot.png로 저장.
  desktopCapturer.getSources(options).then(async sources => {
    for (const source of sources) {
      if(source.name == globalSource.name) {
        fs.writeFile(screenshotPath, source.thumbnail.toPNG(), function (error) {
          if (error) return console.log(error)
          const message = `Saved screenshot to: ${screenshotPath}`
          //console.log(message)
        })
      }
    }
  })
//------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------
//Local 캡처 본 S3에 업로드
  var file = __dirname+"/screenshot_images/screenshot.png";
  uploadFile(file);
//------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------
//얼굴 비교 후 출석 체크
  const photo_target = '예상 화면.png';//스크린샷 화면
  //const photo_target = buffer;
  const client = new AWS.Rekognition();
  
  for (const item of S3imagesName) {
    var photo_source = class_name + "/" + item.toString();

    if(item == "예상 화면.png" || item == "screenshot.png" || item == "Black.png" ) continue;

    const params = {
      SourceImage: {
      S3Object: {
        Bucket: BUCKET_NAME,
        Name: photo_source
      },       
    },
      TargetImage: {
        S3Object: {
          Bucket: BUCKET_NAME,
          Name: photo_target
        }
      },
      SimilarityThreshold: 70
    }
    client.compareFaces(params, function(err, response) {
      if (err) {
        //console.log(err, err.stack); //an error occurred
      } else {
        response.FaceMatches.forEach(data => {
          var check_name = item.split('.')[0]
          
          for(var i = 0; i < uncheckedFaces.length; i++){
            if(uncheckedFaces[i] == check_name){
              checkedFaces.push(uncheckedFaces[i]);

              createEXCEL(uncheckedFaces[i], true)

              uncheckedFaces.splice(i, 1)
              break;
            }
          }
          newUncheckedStudentList();
        })
      }
    });
  }
//------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------
//감정 인식 결과 및 result 파일 생성
  const params_2 = {
    Image: {
      S3Object: {
        Bucket: BUCKET_NAME,
        Name: photo_target
      },
    },
    Attributes: ['ALL']
  }
  client.detectFaces(params_2, function(err, response) {
    var map = {
      "HAPPY"      : 0,
      "SAD"        : 0, 
      "ANGRY"      : 0, 
      "CONFUSED"   : 0, 
      "DISGUSTED"  : 0, 
      "SURPERISED" : 0, 
      "CALM"       : 0, 
      "UNKNOWN"    : 0, 
      "FEAR"       : 0,
    }
    if (err) {
      //console.log(err, err.stack); // an error occurred
    } else {
      response.FaceDetails.forEach(data => {
        map[data.Emotions[0].Type] += 1
      }) // for response.faceDetails
      var sorted_keys = Object.keys(map).sort(function(a,b) { return map[b] - map[a]; });
     
      document.getElementById('firstEmotion').value  = "";
      document.getElementById('secondEmotion').value = "";
      document.getElementById('thirdEmotion').value  = "";
      
      var now     = new Date();
      var year    = now.getFullYear();
      var month   = now.getMonth()+1;
      var day     = now.getDate();
      var hours   = now.getHours();
      var minutes = now.getMinutes();   
      var seconds = now.getSeconds();
      //log file로 감정 분석 결과 출력
      const text = "[" + year + "." + month + "." + day + " " + hours + ":" + minutes + ":" + seconds + "]  [" + "1순위 감정 : " + sorted_keys[0] + " " + map[sorted_keys[0]] + ", 2순위 감정 : " + sorted_keys[1] + " " + map[sorted_keys[1]] + ", 3순위 감정 : " + sorted_keys[2] +  " " + map[sorted_keys[2]] + "]\n";
      fs.appendFileSync(__dirname+"\\emotion.log", '\ufeff' + text, {encoding: 'utf8'});

      //display로 감정 분석 결과 출력
      if (map[sorted_keys[0]] != 0) {
        document.getElementById('firstEmotion').value = "🥇" + sorted_keys[0] + " " + map[sorted_keys[0]] + '명';
      }
      if (map[sorted_keys[1]] != 0) {
        document.getElementById('secondEmotion').value = "🥈" +sorted_keys[1] + " " + map[sorted_keys[1]] + '명';
      }
      if (map[sorted_keys[2]] != 0) {
        document.getElementById('thirdEmotion').value = "🥉" +sorted_keys[2] + " " + map[sorted_keys[2]] + '명';
      }
    } // if
  });
}
//------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------
//종료 버튼 : 출석 체크 종료
stopBtn.onclick = e => {
  clearInterval(take_screen_shot);
  buildTable();
  stopBtn.disabled = true;
  startBtn.classList.remove('is-danger');
  startBtn.innerText = '출석 시작';

  for (var i=0; i < uncheckedFaces.length; i++) {
    createEXCEL(uncheckedFaces[i], false)
  }

  var browserWindow = remote.getCurrentWindow();
  var options = {
      title: "출석파일 다운로드",
      filters: [
          {name: '엑셀파일', extensions: ['xls']}
      ],
      defaultPath: month + "월 " + day + "일 " + class_name + " 출석체크.xls"
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
    //검은 화면 업로드: 
    var file = __dirname+"/screenshot_images/Black.png";
    uploadFile(file);
}

function buildTable() {
  let today = new Date();
  var table = document.getElementById('studentAttendenceCheckTable');

  for (var i=0; i < checkedFaces.length; i++) { var row = `<tr> <td>${today.getMonth()+1+"월"+today.getDate()+"일"}</td> <td>${checkedFaces[i]}</td> <td>${"O"}</td> </tr>`; table.innerHTML += row }
  for (var i=0; i < uncheckedFaces.length; i++) { var row = `<tr> <td>${today.getMonth()+1+"월"+today.getDate()+"일"}</td> <td>${uncheckedFaces[i]}</td> <td>${"X"}</td> </tr>`; table.innerHTML += row }
}

//------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------
//create EXCEL
function createEXCEL(temp, checkOX) {
  var now     = new Date();
  var year    = now.getFullYear();
  var month   = now.getMonth()+1;
  var day     = now.getDate();
  var hours   = now.getHours();
  var minutes = now.getMinutes();   
  var seconds = now.getSeconds();
  if (checkOX) {
    var data= month + "월 " + day + "일\," + hours + ":" + minutes + ":" + seconds + '\,' + temp + '\,' + 'O' + '\n'
    save_data += data
  }
  else{
    var data= month + "월 " + day + "일\," + hours + ":" + minutes + ":" + seconds + '\,' + temp + '\,' + 'X' + '\n'
    save_data +=data
  }
}

const uploadFile = (fileName) => {
  // Read content from the file
  const fileContent = fs.readFileSync(fileName);

  // Setting up S3 upload parameters
  const params = {
    Bucket: BUCKET_NAME,
    Key: '예상 화면.png', // File name you want to save as in S3
    Body: fileContent
  };
  // Uploading files to the bucket
  s3.upload(params, function(err, data) {
    if (err) {
      throw err;
    }
    //console.log(`File uploaded successfully. ${data.Location}`);
  });
};