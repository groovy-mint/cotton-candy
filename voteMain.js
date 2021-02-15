var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./resources/cc.db');

function voteAddContent(){ //투표 항목을 추가합니다.
    contentCount=Number(document.getElementById('voteContentCount').innerHTML);
    if(contentCount==10){ //투표 항목을 11개 이상으로 설정하려고 할 경우 1번 알림창을 띄웁니다.
        document.getElementById('alert1').style.display='block';
        overlay(true);
    }else{ //투표 항목을 제거합니다.
        contentCount=Number(document.getElementById('voteContentCount').innerHTML)+1;
        document.getElementById('voteContent').innerHTML += `<input type="text" class="textInput partn p12" placeholder="`+contentCount+`번" id="part`+contentCount+`" name="part`+contentCount+`"><br id="partBr`+contentCount+`">`;
        document.getElementById('voteContentCount').innerHTML = contentCount;
    }
}
//$("#div1").remove();
function voteRemoveContent(){
    contentCount=Number(document.getElementById('voteContentCount').innerHTML); //투표 항목의 갯수를 '총 n개' 라는 글자에서 떼옵니다.
    if(contentCount==2){ //투표 항목을 2개 미만으로 설정하려고 할 경우 1번 알림창을 띄웁니다.
        document.getElementById('alert1').style.display='block';
        overlay(true);
    }else{ //투표 항목을 제거합니다.
        $("#part"+contentCount).remove();
        $("#partBr"+contentCount).remove();
        document.getElementById('voteContentCount').innerHTML = contentCount-1;
    }
}
function voteConfirm(){ //첫 화면에서 다음 버튼을 눌렀을 때 실행할 함수입니다.
    contentCount=Number(document.getElementById('voteContentCount').innerHTML);
    var err=0;
    if($("#voteTitle").val()==''){ //제목을 안 썼다면 3번 알림창을 띄웁니다.
        document.getElementById('alert3').style.display='block';
        overlay(true);
        err=1;
    }else if(Number($("#voteMember").val())<=0||Number($("#voteMember").val())==''){
        document.getElementById('alert4').style.display='block';
        overlay(true);
        err=1;
    }else{
        for(i=1;i<=contentCount;i++){ //항목을 쓰지 않았다면 에러를 2로 설정합니다.
            if($("#part"+i).val()==''){
                err=2;
            }
        }
    }
    if(err==2){ //에러가 2일 때(항목을 쓰지 않았을 때), 2번 알림창을 띄웁니다.
        document.getElementById('alert2').style.display='block';
        overlay(true);
    }

    

    if(err==0){ //모든 필드에 이상이 없다면 컨펌합니다.
        document.getElementById('voteCreate').style.display='none'; //투표 제작 필드 숨김
        document.getElementById('voteTitleConfirm').innerHTML = '<span class="p2">'+$("#voteTitle").val()+'</span>'; //투표 제목을 컨펌 필드에 작성
        document.getElementById('voteContentsConfirm').innerHTML = ''; //투표 항목 컨펌 필드 초기화
        for(i=1;i<=contentCount;i++){ //투표 항목을 컨펌 필드에 순차적으로 작성
            document.getElementById('voteContentsConfirm').innerHTML += '<span class="p12">'+i+'. '+$("#part"+i).val()+"</span><br>";
        }
        document.getElementById('voteMembersConfirm').innerHTML = $("#voteMember").val();
        document.getElementById('voteConfirm').style.display='flex'; //투표 컨펌 필드 보임
    }
}

function voteEdit(){ //컨펌 화면에서 이전 버튼을 눌렀을 때 실행할 함수입니다.
    document.getElementById('voteConfirm').style.display='none'; //투표 컨펌 필드 숨김
    document.getElementById('voteCreate').style.display='flex'; //투표 제작 필드 보임
}

function voteReady(){ //컨펌 화면에서 다음 버튼을 눌렀을 때 실행할 함수입니다.
    document.getElementById('voteConfirm').style.display='none'; //투표 컨펌 필드 숨김
    document.getElementById('voteCreate').style.display='none'; //투표 제작 필드 숨김
    //DB에 필드 값을 넣습니다.
    var title=$("#voteTitle").val();
    var memberNum=$("#voteMember").val();
    var votedNum=0;
    var partsNum=Number(document.getElementById('voteContentCount').innerHTML);
    var today = new Date();
    var year = today.getFullYear(); // 년도
    var month = today.getMonth() + 1;  // 월
    var date = today.getDate();  // 날짜
    var parts = '';
    var numbers = '';
    for(i=1;i<=partsNum;i++){
        parts += $("#part"+i).val()+'%%';
        numbers += '0'+'%%';
    }
    
    const query = `INSERT INTO voteList(title,parts,numbers,memberNum,votedNum,partsNum,date) VALUES ('`+title+`','`+parts+`','`+numbers+`','`+memberNum+`','`+votedNum+`','`+partsNum+`','`+year + '-' + month + '-' + date+`')`;
    db.serialize();
    db.each(query);

    moveInto('vote_ready.html');
}
function voteStart(){ //컨펌 화면에서 다음 버튼을 누른 뒤, 투표를 시작할 때 실행할 함수입니다.
    moveInto('vote_start.html');
}

function voteLoad(){ //차례가 돌아올 때마다 실행할 함수입니다.
    db.all('SELECT * FROM voteList ORDER BY idx DESC limit 1',[], (err,sql)=>{
        document.getElementById("voteTitle").innerHTML = sql[0].title; //제목 가져와서 표시하기
        document.getElementById("voteMemberLeft").innerHTML = Number(sql[0].memberNum) - Number(sql[0].votedNum); //남은 인원 수 계산해서 표시하기
        parts =  sql[0].parts.split("%%"); //투표 항목 가져와서 split
        x = sql[0].partsNum; //항목 갯수 가져오기
        for(p=0;p<x;p++){
            a=p+1;
            document.getElementById("voteContents").innerHTML += '<span style="font-size:3vh">'+a+'. '+parts[p]+'</span>'; //투표 항목 표시하기
        }
      });
      $(document).on('keydown', function(e) {voteUp(e);}); 
}
function voteUp(e){ //한 표를 던질 때 실행할 함수입니다.
    db.all('SELECT * FROM voteList ORDER BY idx DESC limit 1',[], (err,sql)=>{
    if(Number(e.key)<=sql[0].partsNum||e.key=='.'||e.key=='q'){
        $(document).off('keydown');//키를 누르지 못하게 전환
        var num = Number(e.key);//키를 숫자로 변환
        if(Number(e.key)==0){num=10;}//0->10 변환
        numbers =  sql[0].numbers.split("%%");
        x = sql[0].partsNum; //항목 갯수 가져오기
        var voted = ''; //voted 값 초기화

        for(p=0;p<x;p++){ //투표 +1 올릴 항목을 찾아내는 반복문
            a=num-1;
            if(a==p){
                voted += String(Number(numbers[p])+1)+'%%'; //투표 항목 표시하기
            }else{
                voted += numbers[p]+'%%';
            }
        }
        votedNum=Number(sql[0].votedNum)+1;
        const query = `UPDATE voteList SET numbers = '`+voted+`', votedNum=`+votedNum+` WHERE idx=`+sql[0].idx;
        db.serialize();
        db.each(query);

        if(Number(sql[0].memberNum) - Number(sql[0].votedNum)==1){ //모두 투표했는지 확인
            moveInto('vote_complete.html'); //모두 투표했으면 투표 완료 페이지로 이동
        }else{
            moveInto('vote_voted.html'); //남은 인원이 있으면 다음 페이지로 이동
        }
        

        }else{ //잘못된 키를 눌렀을 때 표시할 알림창 (1초 후 닫힘)
            document.getElementById('alertNotAvailableKey').style.display='block';
            overlay(true);
            setTimeout(function() {
                document.getElementById('alertNotAvailableKey').style.display='none';
                overlay(false);
            },1000);
        }
    });
}

function voteResult(){
    db.all('SELECT * FROM voteList ORDER BY idx DESC limit 1',[], (err,sql)=>{
        document.getElementById('voteTitle').innerHTML = sql[0].title;
        numbers =  sql[0].numbers.split("%%");
        parts =  sql[0].parts.split("%%");
        bestNum = numbers[0];
        bestPart = parts[0];
        for(i=0;i<sql[0].partsNum;i++){
            a=i+1;
            document.getElementById('voteResultTable').innerHTML += "<tr><td>"+ a +"</td><td>"+parts[i]+"</td><td>"+numbers[i]+"</td>";
            if(bestNum<numbers[i]){
                bestNum=numbers[i];
                bestPart=parts[i];
            }
        }
        document.getElementById('voteF').innerHTML=bestPart;
    });
}