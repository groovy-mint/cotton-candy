var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./resources/cc.db');

function seatMainInit(){
  db.all('SELECT * FROM seatLayout',[], (err,sql)=>{
    for(i=0;i<sql.length;i++){
      bd=sql[i].bd;
      column=sql[i].column;
      row=sql[i].row;
      document.getElementById('seat_list').innerHTML +=`<div><div class="seat_list_box" href="javascript:void(0)" onclick="seatLayout(`+bd+`,`+column+`,`+row+`);"><i class="material-icons seat_list_ico icon">apps</i><button class="seat_list_del"><i class="material-icons seat_list_del_ico icon" onclick="seatLayoutDel(`+sql[i].idx+`);">close</i></button><br>`+bd+`x`+column+`x`+row+`</div></div>`
    }
    document.getElementById('seat_list').innerHTML +=`<div class="seat_list_box" href="javascript:void(0)" onclick="moveInto('seat_add.html');"><i class="material-icons seat_list_ico icon">add</i><br>추가</div><div class="seat_list_box" href="javascript:void(0)" onclick="moveInto('seat_free.html');"><i class="material-icons seat_list_ico icon">more_horiz</i><br>사용자 정의</div>`;
  });
}

function seatInit(){
db.all('SELECT * FROM seatList',[], (err,sql)=>{
  for(i=0;i<sql.length;i++){
    document.getElementById('stdntSelect').innerHTML += '<option value="'+sql[i].idx+'">'+sql[i].title+'</option>';
  }
});
}
function seatRemoteAddMinus(bool,where){
  document.getElementById('seat_frame').innerHTML = '';
  num=Number($('#'+where).val());
  if(bool==true){
    $('#'+where).val(num+1);
  }else{
    if(num>1){
    $('#'+where).val(num-1);
    }
  }
  bd=$('#bd').val();
  column=$('#column').val();
  row=$('#row').val();

  for(i=1;i<=bd;i++){ //분단 생성
    document.getElementById('seat_frame').innerHTML += '<div class="seat_flex" id="seat_outer'+i+'"></div>';
    for(j=column*(i-1)+1;j<=column*i;j++){ //분단별 줄 생성
      document.getElementById('seat_outer'+i).innerHTML += '<div class="seat_column" id="seat_inner'+j+'"></div>';
    }
  }
  for(k=1;k<=column*bd;k++){ //줄 별 책상 생성 
    var m=k;
    for(l=1;l<=row;l++){
      document.getElementById('seat_inner'+k).innerHTML += `<div onclick="nonSeat('`+m+`');" class="seat_row" id="`+m+`cont"><span id="`+m+`">`+m+`</span></div><input type="checkbox" class="nonSeatCheck" id="nonSeat`+m+`" value="" />`;
      m+=column*bd;
    }
  }
}

function seatLayoutSave(){
  bd=$('#bd').val();
  column=$('#column').val();
  row=$('#row').val();
  const query = `INSERT INTO seatLayout(bd,column,row) VALUES ('`+bd+`','`+column+`','`+row+`')`;
  db.serialize();
  db.each(query);
  document.getElementById('alert1').style.display='block';
  overlay(true);
}

function seatLayoutDel(idx){
  const query = `DELETE FROM seatLayout WHERE idx=`+idx;
  db.serialize();
  db.each(query);
  moveTo('seat.html');
}

function seatLayout(bd,column,row){
  $(".title_back").css('maxWidth', '1.2em');
  $(".innerContent").animate({opacity: '0'}, "fast");
  setTimeout(function() {
    $(".innerContent").load('seat_layout.html', function(){for(i=1;i<=bd;i++){ //분단 생성
      document.getElementById('seat_frame').innerHTML += '<div class="seat_flex" id="seat_outer'+i+'"></div>';
      for(j=column*(i-1)+1;j<=column*i;j++){ //분단별 줄 생성
        document.getElementById('seat_outer'+i).innerHTML += '<div class="seat_column" id="seat_inner'+j+'"></div>';
      }
    }
    for(k=1;k<=column*bd;k++){ //줄 별 책상 생성 
      var m=k;
      for(l=1;l<=row;l++){
        document.getElementById('seat_inner'+k).innerHTML += `<div onclick="nonSeat('`+m+`');" class="seat_row" id="`+m+`cont"><span id="`+m+`">`+m+`</span></div><input type="checkbox" class="nonSeatCheck" id="nonSeat`+m+`" value="" />`;
        m+=column*bd;
      }
    }
    $('#layoutForm').text('형식: '+bd+'x'+column+'x'+row);
    $(".innerContent").animate({opacity: '1'}, "fast");})},220);
}
function changeSeat(){ //change_seat callback
  changeSeatFirst(function (){
    var seats = $(".seat_row").length;
    for(i=1;i<=seats;i++){
      $("#"+i).css("font-size", '2.5vw');
      contHeight = $("#"+i+"cont").outerHeight();
      fontHeight = $("#"+i).outerHeight();
      while(contHeight<fontHeight){
        windowHeight = $(window).height();
        fontSize = $("#"+i).css("font-size").replace('px', '');
        $("#"+i).css("font-size", (((fontSize / windowHeight) * 60)+'vw'));
        contHeight = $("#"+i+"cont").outerHeight();
        fontHeight = $("#"+i).outerHeight();
        console.log(i+'afdsfda'+fontSize);
      }
    }
  });
}
function changeSeatFirst(cb){
  var dbidx = document.getElementById('stdntSelect').value;
  var seats = $(".seat_row").length;
  var wm = Number($(':radio[name="wm"]:checked').val());
  if(dbidx=="-1"){
    return;
  }else{
    if(wm>0){
      db.each('SELECT * FROM seatList WHERE idx='+dbidx,[], (err,sql)=>{
        var maleNames = sql.male.split(",").sort(function(){return 0.5-Math.random();});
        var femaleNames = sql.female.split(",").sort(function(){return 0.5-Math.random();});
        var x = 0;
        var y = 0;
        for(i=1;i<=seats;i++){
          var nonSeat = $('#nonSeat'+String(i)).is(":checked");
          if(wm==1){
            if(i%2==1){
              if(nonSeat==true||maleNames[x]==undefined)
              {document.getElementById(i).innerText = " ";
              }else{document.getElementById(i).innerText = maleNames[x];x++;
              }
            }else{
              if(nonSeat==true||femaleNames[y]==undefined)
              {document.getElementById(i).innerText = " ";
              }else{document.getElementById(i).innerText = femaleNames[y];y++;
              }
            }
          }else{
            if(i%2==1){
              if(nonSeat==true||femaleNames[y]==undefined)
              {document.getElementById(i).innerText = " ";
              }else{document.getElementById(i).innerText = femaleNames[y];y++;
              }
            }else{
              if(nonSeat==true||maleNames[x]==undefined)
              {document.getElementById(i).innerText = " ";
              }else{document.getElementById(i).innerText = maleNames[x];x++;
              }
            }
          }
          
        }
      });
    }else{
    db.each('SELECT * FROM seatList WHERE idx='+dbidx,[], (err,sql)=>{
        var names = sql.male+','+sql.female;
        var arr = names.split(",");
        var array = arr.sort(function(){return 0.5-Math.random();}); //출처: 제타위키
        var x = 0;
        for(i=1;i<=seats;i++){
          var nonSeat = $('#nonSeat'+String(i)).is(":checked");
          if(nonSeat==true||array[x]==undefined)
          {
            document.getElementById(i).innerText = " ";
          }else{
            document.getElementById(i).innerText = array[x];
            x++;
          }
        }
      });
}}
setTimeout(() => cb(),1);}