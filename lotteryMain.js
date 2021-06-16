function lotteryStart(){
    var firstnum=Number(document.getElementById('lotteryFirstNum').value);
    var lastnum=Number(document.getElementById('lotteryLastNum').value);
    var randNum = Math.floor(Math.random() * (lastnum-1)) + firstnum;
    $(".title_back").css('maxWidth', '1.2em'); // 타이틀 오른쪽으로 밀어서 뒤로가기 버튼 보이기
    $(".lottery_remote, .p12").animate({opacity: '0'}, "fast");
    setTimeout(function(){$(".lotteryBox").animate({marginTop: '-100px', opacity: '0'}, "fast");$(".lotteryResult").animate({marginBottom: '0px', opacity: '1'}, "fast");}, 220);

    for(i=1; i<10; i++){
        (function(x){
          setTimeout(function(){
            $(".lotteryResult").text(Math.floor(Math.random() * (lastnum-1)) + firstnum);
          }, 440+50*x);
        })(i);
      }
    for(i=1; i<10; i++){
    (function(x){
        setTimeout(function(){
        $(".lotteryResult").text(Math.floor(Math.random() * (lastnum-1)) + firstnum);
        }, 940+100*x);
    })(i);
    }
    for(i=1; i<3; i++){
        (function(x){
            setTimeout(function(){
            $(".lotteryResult").text(Math.floor(Math.random() * (lastnum-1)) + firstnum);
            }, 1940+300*x);
        })(i);
        }

    setTimeout(function() {
    $(".lottery_remote").html('<div class="voteBack" href="javascript:void(0)" onclick="lotteryStart();"><i class="material-icons voteBackIco icon">replay</i><br>다시 뽑기</div>');
    $(".lottery_remote").animate({opacity: '1'}, "fast");
    $(".lotteryInst").html("<p style='font-size:3.5vh;'>번이 당첨되었습니다.</p><br><br><br>(범위를 다시 설정하려면 왼쪽 위의 이전 버튼을 누르세요.)");
    $(".lotteryInst").animate({opacity: '1'}, "fast");
},2840)
}
function lotteryEnd(){
    $(".title_back").css('maxWidth', '0');
    $(".lottery_remote, .lotteryInst").animate({opacity: '0'}, "fast");
    setTimeout(function() {$(".lottery_remote").html('<div class="voteBack" href="javascript:void(0)" onclick="lotteryStart();"><i class="material-icons voteBackIco icon">play_arrow</i><br>시작</div>');}, 220);
    setTimeout(function() {$(".lotteryInst").html("위 칸에 시작 번호와 끝 번호를 적으세요.");$(".lotteryResult").animate({marginTop: '-150px', opacity: '0'}, "fast");
    $(".lotteryBox").animate({marginTop: '17vh', opacity: '1'}, "fast"); // 내용물 감추기
}, 220);
    setTimeout(function() {$(".lotteryInst, .lottery_remote").animate({opacity: '1'}, "fast");}, 480);
}