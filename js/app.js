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
        var _this = this;
        _this.main();
        _this.initMusic('media/bgm.mp3');
    },
    main: function(){
        $.imgpreloader({
            paths: [
                'img/btns.png',
                'img/common-bg.jpg',
                'img/dazhao-txt.png',
                'img/question.png',
                'img/f-question.png',
                'img/m-question.png',
                'img/loading-logo.png',
                'img/people-sprite.jpg',
                'img/input-bg.png',
                'img/f-reject.jpg',
                'img/m-reject.jpg',
                'img/prize1.png',
                'img/prize2.png',
                'img/prize3.png',
                'img/reject-txt.png',
                'img/score-title.png',
                'img/share-txt.png',
                'img/success-txt.png'
            ]
        }).done(function($allImages){
            $('#loading').hide();
            $('#home').addClass('active');
        }).progress(function($image, $allImages, $properImages, $brokenImages, isBroken, percentage){
            $('#loading .colorlogo').css({
                'height': percentage+'%'
            })
            $('#loading .percent').html('LOADING '+percentage+'%');
        });

        $('#home .enter').on('click', function(){
            var target = $(this).data('target');
            var $target = $(target);
            var $bgvideo = $target.find('.bg-video');
            $target.addClass('active').children('.page:lt(2)').addClass('active');
            setVideoPosition($bgvideo[0]);
            $bgvideo[0].play();

            //背景视频循环播放
            $bgvideo.on('ended', function(){
                this.currentTime = 0;
                this.play();
            })
        });

        //给Ta支招
        $('[data-role=zhizhao]').on('click', function(){
            $(this).parent().removeClass('active').next().addClass('active');
        });


        function setVideoPosition(el){
            var offsetY = el.clientHeight - (el.clientWidth * el.videoHeight / el.videoWidth);
            el.style["object-position"]= "0px " + offsetY + "px";
        }

        $('[data-video]').on('click', function(){
            var $this = $(this);
            var $btnvideo = $this.parents('.section').find('.btn-video');
            var src = $this.data('video');
            $this.parents('.section').children('.videoarea').addClass('active').siblings('.page').removeClass('active');
            $btnvideo.attr('src', 'media/'+src);
            setVideoPosition($btnvideo[0]);
            $btnvideo[0].play();

            var text = $this.text();
            var $reject = $this.parents('.section').children('.reject');
            var $btns = $reject.children('.btn');
            $btns.each(function(index, el){
                if($(el).text() == text){
                    $(el).hide().siblings('.btn').show();
                    return false;
                }
            })

            $btnvideo.on('ended', function(){
                $reject.addClass('active').siblings('.pages').removeClass('active');
            })
        })

        //放大招相关
        $('.btn-dazhao').on('click', function(){
            var origin = $(this).parents('.section').attr('id');
            $('#dazhao').addClass('active');
            $('#dazhao .btn-jixu').attr('data-origin', origin);
        })
        $('#dazhao .btn-jixu').on('click', function(){
            var origin = $(this).data('origin');
            $('#dazhao').removeClass('active');
            $('#'+origin).children('.page').removeClass('active');
            $('#'+origin).children('.method, .bgvideo').addClass('active');
        })
    },
    initMusic: function(url){
        var options = {
            autoplay: true,
            loop: true,
            src: url
        }
        if(!options.src){
            return
        }
        var className = 'on',
            music = document.getElementById('music'),
            trigger = 'ontouchstart' in window ? 'touchstart' : 'click',
            audio = document.createElement('audio');
        audio.src = options.src;

        function toggle(e) {
            e.stopPropagation()
            !audio.paused ? audio.pause() : audio.play()
        }

        function play(e) {
           music.classList.add(className);
        }

        function pause(e) {
            music.classList.remove(className);
        }

        audio.addEventListener('play', play, false);
        audio.addEventListener('pause', pause, false);
        music.addEventListener(trigger, toggle, false);

        if (options.loop) {
            audio.loop = 'loop';
        } else {
            audio.addEventListener('ended', pause, false);
        }

        if (options.autoplay) {
            audio.play()
        }

        music.style.display = 'block';
            return audio
    }
}

processor.fixViewport('fixed', 750);

window.onload=function(){
    processor.init();
}
