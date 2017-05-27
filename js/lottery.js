var processor = {
    fixViewport: function (type, width) {
        var docEl = document.documentElement;
        var metaEl = document.querySelector('meta[name="viewport"]');
        var clientWidth = Math.min(docEl.clientWidth, docEl.clientHeight);
        var scale, content;
        
        switch (type) {
            case 'fixed':
                scale = clientWidth / width;
                content = 'width=' + width + ',initial-scale=' + scale + ',maximum-scale=' + scale +
                    ',minimum-scale=' + scale;
                break;
            case 'rem':
                var dpr = window.devicePixelRatio || 1;
                docEl.setAttribute('data-dpr', dpr);
                docEl.style.fontSize = 100 * (clientWidth * dpr / width) + "px";

                scale = 1 / dpr;
                content = 'width=' + clientWidth * dpr + ',initial-scale=' + scale + ',maximum-scale=' + scale +
                    ', minimum-scale=' + scale;
                break;
        }
        
        metaEl.setAttribute('content', content);
    },
    init: function(){   
        /** 
            一级奖 240deg 运动手环
            二级奖 0deg   加湿器
            三级奖 120deg 优惠券
            未中奖 60deg  再接再厉
            未中奖 300deg 就差一点
        **/
        var angleArr = [240, 0, 120, 60, 300];
        var showResult = function(result){
            var $score = $('#score'),
                $caption = $score.children('.caption'),
                $prizeImg = $score.children('.prize').children('img'),
                $form = $score.children('.form'),
                $tips = $score.children('.tips'),
                $btns = $score.children('.btns');
            switch (result) {
                case 240:
                    $score.addClass('score-first');
                    $prizeImg.attr('src', 'img/prize1.png');
                    $caption.html('恭喜您获得<b>运动手环！</b>动起来，多回家看看！');
                    $tips.html('七个工作日内，会有三棵树工作人员与您联系，<br>沟通具体获奖事宜及后续操作，请留意您的电话。');
                    break;
                case 0:
                    $score.addClass('score-second');
                    $prizeImg.attr('src', 'img/prize2.png');
                    $caption.html('恭喜您获得<b>三棵树绿色加湿器！</b><br>家乡的气息还记得？回去感受吧！');
                    $tips.html('七个工作日内，会有三棵树工作人员与您联系，<br>沟通具体获奖事宜及后续操作，请留意您的电话。');
                    break;
                case 120:
                    $score.addClass('score-third');
                    $prizeImg.attr('src', 'img/prize3.png');
                    $caption.html('恭喜您获得了三棵树天猫旗舰店<br><b>【以10抵1000兑换券】，</b>让您省钱又有面儿！');
                    $tips.html('在2017年6月30日前，凭此截图，给到天猫旗舰店客服，即可<br>以10元购买面值1000元的现金抵用券，具体可与客服联系。');
                    $form.hide();
                    $btns.children('.submit').hide();
                    break;
                case 60:
                    alert('再接再厉');
                    return;
                    break;
                case 300:
                    alert('就差一点');
                    return;
                    break;
                default:
                    break;
            }
            $score.addClass('active');
            $('#draw').removeClass('active');
        };
        $("#lotteryStart").on('click', function () {
            $(this).attr('disabled', true);
            var result = angleArr[Math.floor(Math.random()*(angleArr.length))];

            var ret = {};
            ret.angles = result;
            ret.p_duration = 5;
            ret.p_baseanimate = 6;
            $(this).css({"transform": "rotate(0deg)", "transition": "all 0s"});
            setTimeout(function () {
                $('#lotteryStart').css("transition", "all " + ret.p_duration + "s").css("transform", "rotate(" + ( ret.angles + 360 * ret.p_baseanimate) + "deg)");
            }, 100);

            $(this).on('transitionend', function(){
                setTimeout(function(){
                    $(this).attr('disabled', false);
                    showResult(result);
                }, 500)
            })
        });

        $('#score .submit').on('click', function(){
            var tel = $('#score .tel').val();
            var address = $('#score .address').val();
            var reg = /^1[0-9]{10}$/;
            if(tel == '' || !reg.test(tel)){
                alert('请输入正确的手机号码！');
                return;
            }
            if(address == ''){
                alert('请填写您的邮寄地址，方便我们给您寄送礼品。');
                return;
            }
            //如果提交成功
            $('#score').removeClass('active');
            $('#success').addClass('active');
        });
        $('.share').on('click', function(){
            $('#popshare').addClass('active');
        });
        $('#popshare').on('click', function(){
            $(this).removeClass('active');
        });
    }
}

processor.fixViewport('fixed', 750);
window.onload = function(){
    processor.init();
}