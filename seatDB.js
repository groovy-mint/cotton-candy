var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./resources/cc.db',sqlite3.OPEN_READWRITE);
db.all('SELECT * FROM seatList',[], (err,sql)=>{
    for(i=0;i<sql.length;i++){
        document.getElementById('dbinfo').innerHTML += "<tr><td>"+ sql[i].idx +"</td><td>"+ sql[i].title +"</td><td>"+sql[i].male+"</td><td>"+sql[i].female+"</td><td>"+sql[i].date+'</td><td><a onclick="DBdel(true,'+sql[i].idx+');" class="click"> 삭제 </a><a onclick="DBedit(true,'+sql[i].idx+');" class="click"> 수정 </a></td></tr>';
    }
});

function DBadd(){
    var title = document.getElementById("title").value;
    var male = document.getElementById("male").value;
    var female = document.getElementById("female").value;
    var today = new Date();
    var year = today.getFullYear(); // 년도
    var month = today.getMonth() + 1;  // 월
    var date = today.getDate();  // 날짜
    const query = `INSERT INTO seatList(title,male,female,date) VALUES ('`+title+`','`+male+`','`+female+`','`+year + '-' + month + '-' + date+`')`;
  db.serialize();
  db.each(query);
}
function DBdel(bool,idx){
  if(bool==true){
    document.getElementById("del_num").value = idx;
    document.getElementById('delete').style.display='block';
    overlay(true);
  }else{
    const query = `DELETE FROM seatList WHERE idx=`+document.getElementById('del_num').value;
    db.serialize();
    db.each(query);
    moveInto('setting_seatdb.html');
  }
}

function DBedit(bool,idx){
  if(bool==true){
  var x = Number(idx);
  db.all('SELECT * FROM seatList WHERE idx='+x,[], (err,sql)=>{
    document.getElementById("idx_e").value = x;
    document.getElementById("title_e").value = sql[0].title;
    document.getElementById("male_e").value = sql[0].male;
    document.getElementById("female_e").value = sql[0].female;
    document.getElementById('edit').style.display='block';
  });
  overlay(true);
  }else{
  idx = Number(document.getElementById("idx_e").value);
  var title = document.getElementById("title_e").value;
  var male = document.getElementById("male_e").value;
  var female = document.getElementById("female_e").value;
  var today = new Date();
  var year = today.getFullYear(); // 년도
  var month = today.getMonth() + 1;  // 월
  var date = today.getDate();  // 날짜
    
  const query = `UPDATE seatList SET title='`+title+`',male='`+male+`',female='`+female+`', date='`+year + '-' + month + '-' + date+`' WHERE idx=`+idx;
  db.serialize();
  db.each(query);
  moveInto('setting_seatdb.html');
  }
}