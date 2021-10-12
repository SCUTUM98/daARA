var albumBucketName = 'public-daara-test';
var bucketRegion = 'ap-northeast-2';
var IdentityPoolId = configKey.IdentityPoolId;
const {remote, ipcRenderer, BrowserWindow} = require('electron');
const app = require('electron').remote.app;

AWS.config.update({
  region: bucketRegion,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IdentityPoolId
  })
});
const SESConfig = {
  apiVersion: "2010-12-01",
  accessKeyId: configKey.accessKeyId,
  secretAccessKey: configKey.secretAccessKey,
  region: 'ap-northeast-2'
}

var s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  params: { Bucket: albumBucketName }
});

//###############################################################################################################################################
//###############################################################################################################################################
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



function listAlbums() {
  s3.listObjects({ Delimiter: "/" }, function (err, data) {
    if (err) {
      return submitErrMSG.value = "과목을 불러오는데 오류가 발생했습니다. 관리자에게 문의하십시오.";
    } else {
      var albums = data.CommonPrefixes.map(function (commonPrefix) {
        var prefix = commonPrefix.Prefix;
        var albumName = decodeURIComponent(prefix.replace("/", ""));
        return getHtml([
          "<li>",
          "<span onclick=\"deleteAlbum('" + albumName + "')\">X</span>",
          "<span onclick=\"viewAlbum('" + albumName + "')\">",
          albumName,
          "</span>",
          "</li>"
        ]);
      });
      var message = albums.length
        ? getHtml([
        ])
        : "<p style=\"text-align: center;\" id='upload_text'>강의 시작 전 수강생들의 이미지를 업로드 합니다.";
      var htmlTemplate = [
        message,
        // "<ul>",
        // getHtml(albums),
        // "</ul>",
        '<form>',
        " <input class='input' type='email' id='albumName' placeholder='과목 이름을 입력해주세요.'>",
        "<button  class=\"submit\" id = \"manageBTN\" type='button' button onclick=\"createAlbum(albumName.value)\" >",
        "과목 생성",
        "</button>",
        "<button class=\"submit\" id = \"manageBTN\"type=\"button\" onclick=\"location.href='daARA_choice.html'\" style=\"margin-top: 20px\" hidden>홈 화면으로</button>",
        "<input type='text' class='submitErrMSG' id='lectureNameErrMSG' style='color: red;' readonly></textarea>",
        '</form>'
      ];
      document.getElementById("app").innerHTML = getHtml(htmlTemplate);
    }
  });
}

function createAlbum(albumName) {
  albumName = albumName.trim()+'/';
  var submitErrMSG = document.getElementById("lectureNameErrMSG");

  if (!albumName) {
    return submitErrMSG.value = "과목을 입력해 주세요.";
  }

  var albumKey = albumName;
  s3.headObject({ Key: albumKey }, function (err, data) {
    if (!err) {
      submitErrMSG.style.color = 'red';
      return submitErrMSG.value = "동일과목이 존재합니다.";
    }
    if (err.code !== "NotFound") {
      console.log("error message: " + err.message);
      return submitErrMSG.value = "과목을 생성할 수 없습니다. 관리자에게 문의하십시오."
    }
    s3.putObject({ Key: albumKey }, function (err, data) {
      if (err) {
        console.log("error message: " + err.message);
        return submitErrMSG.value = "과목을 생성할 수 없습니다. 관리자에게 문의하십시오."
      }
      submitErrMSG.style.color = 'green';
      submitErrMSG.value = "과목을 등록하였습니다.";
      document.getElementById(manageBTN).style.display='block';
    });
  });
}

function autoviewAlbum(albumName) {
  var submitErrMSG = document.getElementById("uploaderrMSG");
  var albumPhotosKey = albumName + "/";
  s3.listObjects({ Prefix: albumPhotosKey }, function (err, data) {
    if (err) {
      return submitErrMSG.value = "관리자에게 문의하십시오. error: Listing albums";
    }
    var href = this.request.httpRequest.endpoint.href;
    var bucketUrl = href + albumBucketName + "/";
    var photos = data.Contents.map(function (photo) {
      var photoKey = photo.Key;
      var photoUrl = bucketUrl + encodeURIComponent(photoKey);
      // return getHtml([
      //   "<span>",
      //   "<div>",
      //   '<img style="width:128px;height:128px;" src="' + photoUrl + '"/>',
      //   "</div>",
      //   "<div>",
      //   "<button id = 'deletephoto' onclick=\"autodeletePhoto('" +
      //   albumName +
      //   "','" +
      //   photoKey +
      //   "')\">",
      //   "X",
      //   "</botton>",
      //   "<span>",
      //   photoKey.replace(albumPhotosKey, ""),
      //   "</span>",
      //   "</div>",
      //   "</span>"
      // ]);
    });
    var htmlTemplate = [
      "<ul>",
      getHtml(photos),
      "</ul>",
      '<input class="button" multiple id="photoupload" type="file" accept="image/*" name="filename[]" style="padding-left: 3em">',
      '<input type="text" class="submitErrMSG" id="uploaderrMSG" style="color: red;" readonly></textarea>',
      '<button class="submit" type="button" button id="addphoto" onclick="autoaddPhoto(\'' + albumName + "')\">",
      "수강생 추가",
      "</button>",
      "<button class='submit' type='button' button id='deletealbum' onclick='deleteAlbum(\""+albumName+'")\'>',
      albumName + "과목 삭제",
      "</button>"
    ];
    document.getElementById("app").innerHTML = getHtml(htmlTemplate);
  });
}

function addPhoto(albumName) {
  var submitErrMSG = document.getElementById("uploaderrMSG");
  var files = document.getElementById("photoupload").files;
  if (!files.length) {
    return submitErrMSG.value = "에러: 학생들의 사진을 업로드해주세요."
  }
  else {
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      var fileName = file.name;
      var albumPhotosKey = albumName + "/";
      var photoKey = albumPhotosKey + fileName;
      var upload = new AWS.S3.ManagedUpload({
        params: {
          Bucket: albumBucketName,
          Key: photoKey,
          Body: file
        }
      });
      var promise = upload.promise();
    }
  }
  promise.then(
    function (data) {
      submitErrMSG.style.color = 'green'
      submitErrMSG.value = "업로드 하였습니다."
      viewAlbum(albumName);
    },
    function (err) {
      return submitErrMSG.value = "업로드 할 수 없습니다. 관리자에게 문의하십시오."
    }
  );
}

function autoaddPhoto(albumName, photoupload) {
  var submitErrMSG = document.getElementById("uploaderrMSG");
  var files = document.getElementById("photoupload").files;
  if (!files.length) {
    submitErrMSG.style.color = 'red'
    return submitErrMSG.value = "에러: 수강생의 사진을 업로드해주세요."
  }
  else {
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      var fileName = file.name;
      var albumPhotosKey = albumName + "/";
      var photoKey = albumPhotosKey + fileName;
      var upload = new AWS.S3.ManagedUpload({
        params: {
          Bucket: albumBucketName,
          Key: photoKey,
          Body: file
        }
      });
      var promise = upload.promise();
    }
  }
  promise.then(
    function (data) {
      autoviewAlbum(albumName);
      submitErrMSG.style.color = 'green';
      submitErrMSG.value = "업로드 하였습니다."
    },
    function (err) {
      return submitErrMSG.value = "업로드 할 수 없습니다. 관리자에게 문의하십시오."
    }
  );
}

function deletePhoto(albumName, photoKey) {
  var submitErrMSG = document.getElementById("uploaderrMSG");
  s3.deleteObject({ Key: photoKey }, function (err, data) {
    if (err) {
      return submitErrMSG.value = "이미지를 삭제할 수 없습니다. 관리자에게 문의하십시오."
    }
    submitErrMSG.value = "이미지를 삭제하였습니다."
    viewAlbum(albumName);
  });
}

function autodeletePhoto(albumName, photoKey) {
  var submitErrMSG = document.getElementById("uploaderrMSG");
  s3.deleteObject({ Key: photoKey }, function (err, data) {
    if (err) {
      return submitErrMSG.value = "이미지를 삭제할 수 없습니다. 관리자에게 문의하십시오."
    }
    submitErrMSG.value = "이미지를 삭제하였습니다."
    autoviewAlbum(albumName);
  });
}

function deleteAlbum(albumName) {
  var submitErrMSG = document.getElementById("uploaderrMSG");
  var albumKey = albumName + "/";
  var junkalbum = albumName;
  s3.listObjects({ Prefix: junkalbum }, function (err, data) {
    if (err) {
      return submitErrMSG.value = "과목을 삭제할 수 없습니다. 관리자에게 문의하십시오."
    }
    var objects = data.Contents.map(function (object) {
      return { Key: object.Key };
    });
    s3.deleteObjects(
      {
        Delete: { Objects: objects, Quiet: true }
      },
      function (err, data) {
        if (err) {
          return submitErrMSG.value = "과목을 삭제할 수 없습니다. 관리자에게 문의하십시오."
        }
        submitErrMSG.value = "과목을 삭제하였습니다."
        listAlbums();
      }
    );
  });
}
function autodeleteAlbum(albumName) {
  var submitErrMSG = document.getElementById("uploaderrMSG");
  var albumKey = albumName + "/";
  var junkalbum = albumName;
  s3.listObjects({ Prefix: junkalbum }, function (err, data) {
    if (err) {
      return submitErrMSG.value = "과목을 삭제할 수 없습니다. 관리자에게 문의하십시오."
    }
    var objects = data.Contents.map(function (object) {
      return { Key: object.Key };
    });
    s3.deleteObjects(
      {
        Delete: { Objects: objects, Quiet: true }
      },
      function (err, data) {
        if (err) {
          return submitErrMSG.value = "과목을 삭제할 수 없습니다. 관리자에게 문의하십시오."
        }
        submitErrMSG.value = "과목을 삭제하였습니다."
        listAlbums();
      }
    );
  });
}