var app = require('electron').remote.app;
var pathToApp=app.getAppPath().replace('app.asar','');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(pathToApp+'cc.db',sqlite3.OPEN_READWRITE);

db.all('SELECT * FROM voteList',[], (err,sql)=>{
    for(i=0;i<sql.length;i++){
        document.getElementById('dbinfo').innerHTML += "<tr><td>"+ sql[i].idx +"</td><td>"+ sql[i].title +"</td><td>"+sql[i].memberNum+"</td><td>"+sql[i].date+'</td><td><a onclick="voteDBinfo('+sql[i].idx+');" class="click"> 결과 </a></td><td><a onclick="voteDBdel(true,'+sql[i].idx+');" class="click"> 삭제 </a></td></tr>';
    }
});

function voteDBdel(bool,idx){
  if(bool==true){
    document.getElementById("del_num").value = idx;
    document.getElementById('delete').style.display='block';
    overlay(true);
  }else{
    const query = `DELETE FROM voteList WHERE idx=`+document.getElementById('del_num').value;
    db.serialize();
    db.each(query);
    moveInto('setting_voterecord.html');
  }
}

function voteDBdelall(bool,idx){
    if(bool==true){
      document.getElementById("del_num").value = idx;
      document.getElementById('delete').style.display='block';
      overlay(true);
    }else{
      const query = `DELETE FROM voteList`;
      db.serialize();
      db.each(query);
      moveInto('setting_voterecord.html');
    }
  }

function voteDBinfo(idx){
    document.getElementById('voteResultPopup').style.display='block';
    overlay(true);
    document.getElementById('voteResultTable').innerHTML = '<th style="min-width:30px;">항목 번호</th><th style="min-width:30px;">항목 이름</th><th style="width:100px;">투표한 사람 수</th>';
    db.all('SELECT * FROM voteList WHERE idx="'+idx+'"',[], (err,sql)=>{
        document.getElementById('voteTitle').innerHTML = sql[0].title;
        numbers =  sql[0].numbers.split("%%");
        parts =  sql[0].parts.split("%%");
        for(i=0;i<sql[0].partsNum;i++){
            a=i+1;
            document.getElementById('voteResultTable').innerHTML += "<tr><td>"+ a +"</td><td>"+parts[i]+"</td><td>"+numbers[i]+"</td>";
        }
        if(Number(sql[0].memberNum) - Number(sql[0].votedNum)==0){
            document.getElementById('voteClear').innerHTML = '모든 인원 투표 완료';
        }else{
            document.getElementById('voteClear').innerHTML = '투표 미완료';
        }
    });
}