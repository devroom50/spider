// window.addEventListener('beforeunload', (event)=>{
//   event.preventDefault();
//   event.returnValue = '';
// });
$(document).ready(function () {
  let score=0; //점수 저장
  const intro = new Audio(); //오디오 객체
  intro.src = $('#intro').attr('src');
  const dduk = new Audio(); //오디오 객체
  dduk.src = $('#effect').attr('src');
  const ending = new Audio(); //오디오 객체
  ending.src = $('#ending').attr('src');

  $('#modal').fadeIn(400,function(){ //인트로 화면 표시
    intro.play(); //인트로 음악 재생
    $('img', this).delay(400).slideDown(800);
    $('#start').delay(600).fadeIn(800);
  });

  $('#start').click(function (e) { 
    e.preventDefault();
    $('#modal>img').hide();
    $(this).hide();
    $('#modal').hide(); //초기 화면 숨기고
    spider_game(); //게임 호출
  });

  $('#restart').click(function (e) { 
    e.preventDefault();
    location.reload(); //페이지 다시 로드
  });

  function spider_game() {
    setTimeout(function(){
      clearInterval(game); // 게임을 멈춤
      $('#last_score>h1').text('score : '+score);
      $('#restart').show();
      $('#modal').fadeIn(800, function(){
        $('img', this).slideDown(800);
        ending.play();
      });
    }, 5000*6); // 한 게임당 5회

    let game = setInterval(function(){
      $('#wrap').empty();
      let left = []; // X 축 좌표
      let durate = []; // 떨어지는 기간
      let delay = []; // 낙하 지연시간
      for(var i=0;i<=4;i++) { //한번에 거미 5마리 낙하
        left[i] = Math.round(Math.random()*85)+'vw'; // X축 좌표 무작위 발생
        durate[i] = Math.round(Math.random()*3500); // 떨어지는 속도 무작위 발생 최대 3.5초
        delay[i] = Math.round(Math.random()*1500); // 지연시간 최대 1.5초
        if(durate[i]<2000) {
          durate[i]=1500; //최소 낙하 시간 1.5초
        }
      }
      for(var j=0;j<=4;j++) {
        $('#wrap').append($('body>.spider').clone().css({left: left[j]})); //원본 거미를 5마리 복제
        $('#wrap>.spider').eq(j).delay(delay[j]).animate({top: '100vh'}, durate[j]); //거미마다 별도로 애니메이션 지정
      }
    }, 5000); //5초 마다 반복

    $('#wrap').on('touchstart', function(e){
      for(var t in e.originalEvent.touches) {
        let tx = e.originalEvent.touches[t].pageX; //터치 X좌표 구하고
        let ty = e.originalEvent.touches[t].pageY; //터치 Y좌표 구함
        let ox, oy;
        for(var i=0;i<=4;i++){
          var offset = $('#wrap>.spider').eq(i).offset(); //거미 위치 구하고
          ox = offset.left; // 거미 X좌표
          oy = offset.top;  // 거미 Y좌표
          if(Math.abs(ox-tx)<40&&Math.abs(oy-ty)<40){ // X, Y 축 오차가 40px 내외 일때
            $('#wrap>.spider').eq(i).stop().hide(); //거미 지우고
            dduk.play(); //효과음 재생
            score++; // 스코어 올리고
            $('#score>h1').text(score); //스코어 표시
          }            
        }
      }
    });
  } //함수 끝
});