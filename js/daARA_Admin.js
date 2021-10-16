getLectureFromS3();

var opselected;
var selectedValue;

function getHtml(template) {
  return template.join('\n');
}

function test() {
    var submitErrMSG = document.getElementById("uploaderrMSG");
    var sel = document.getElementById("job");
    opselected, selectedValue = document.getElementById("showSelectedLecture").innerHTML;
    document.getElementById('selectbox').style.display='none';
    document.getElementById('selectboxBTN').style.display='none';
    autoviewAlbum(selectedValue); // 강의 선택하면 수강생 이미지 나열해야함
    submitErrMSG.style.color = 'black';
    submitErrMSG.value = selectedValue + "(을)를 선택하였습니다.";
}
function addphoto(srcList, photokey) {
    var submitErrMSG = document.getElementById("uploaderrMSG");
    var albumname = String(srcList);
    autoaddPhoto(albumname, photokey);
} //추가할 수강생
function deletephoto(srcList, photokey) {
    var albumname = srcList;
    deletePhoto(albumname, photokey);
} //삭제할 수강생
function deleteall(){
    deleteAlbum();
}

async function getLectureFromS3()
{
  var subjectarr = new Array()
  const AWS = require('aws-sdk')
  AWS.config.update({region:'ap-northeast-2'});
  const s3 = new AWS.S3({
    accessKeyId: configKey.accessKeyId,
    secretAccessKey: configKey.secretAccessKey
  });
  var bucketParams = {
    Bucket : 'public-daara-test',
  }
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
    if(mySet.size != 0) checkLoaded(1);
    else checkLoaded(0);
    document.getElementById('Page').style.display='block';
  }).promise();
  
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
    console.log(obj.value);
    opselected = toString(obj.value)+'/';
    selectedValue = toString(obj.value)+'/';
}