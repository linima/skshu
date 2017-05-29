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
        _this.preload();
        _this.main();
    },
    preload: function(){
        var _this = this;
        var manifest, preload;
        function setupManifest(){
            manifest = [
                {
                    src: 'img/loading-logo.png',
                    id: 'loadinglogo'
                },{
                    src: 'img/btns.png',
                    id: 'btns'
                },{
                    src: 'img/common-bg.jpg',
                    id: 'commonbg'
                },{
                    src: 'img/dazhao-txt.png',
                    id: 'dazhaotxt'
                },{
                    src: 'img/question.png',
                    id: 'question'
                },{
                    src: 'img/f-question.png',
                    id: 'fquestion'
                },{
                    src: 'img/m-question.png',
                    id: 'mquestion'
                },{
                    src: 'img/people-sprite.jpg',
                    id: 'peoplesprite'
                },{
                    src: 'img/f-reject.jpg',
                    id: 'freject'
                },{
                    src: 'img/m-reject.jpg',
                    id: 'mreject'
                },{
                    src: 'img/reject-txt.png',
                    id: 'rejecttxt'
                },{
                    src: 'media/f1.mp4',
                    id: 'f1'
                },{
                    src: 'media/f2.mp4',
                    id: 'f2'
                },{
                    src: 'media/f3.mp4',
                    id: 'f3'
                },{
                    src: 'media/m1.mp4',
                    id: 'm1'
                },{
                    src: 'media/m2.mp4',
                    id: 'm2'
                },{
                    src: 'media/m3.mp4',
                    id: 'm3'
                },{
                    src: 'media/f-bg.mp4',
                    id: 'fbg'
                },{
                    src: 'media/m-bg.mp4',
                    id: 'mbg'
                }
            ]
        }
        //开始预加载
        function startPreload() {
            preload = new createjs.LoadQueue(true);
            //注意加载音频文件需要调用如下代码行
            preload.installPlugin(createjs.Sound);         
            preload.on("fileload", handleFileLoad);
            preload.on("progress", handleFileProgress);
            preload.on("complete", loadComplete);
            preload.loadManifest(manifest);

        }

        //处理单个文件加载
        function handleFileLoad(event) {
            console.log("文件类型: " + event.item.type);
        }

        //已加载完毕进度 
        function handleFileProgress(event) {
            $('#loading .colorlogo').css({
                'height': (preload.progress*100|0)+'%'
            })
            $('#loading .percent').html('LOADING '+(preload.progress*100|0)+'%');
        }

        //全度资源加载完毕
        function loadComplete(event) {
            setTimeout(function(){
                $('#loading').hide();
                $('#home').addClass('active');
                _this.initMusic('media/bgm.mp3');
            }, 500)
        }
        setupManifest();
        startPreload();
    },
    main: function(){
        $('#home .enter').on('click', function(){
            var target = $(this).data('target');
            var $target = $(target);
            var $bgvideo = $target.find('.bg-video');
            $target.addClass('active').children('.page:lt(2)').addClass('active');
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


        $('[data-video]').on('click', function(){
            var $this = $(this);
            var $btnvideo = $this.parents('.section').find('.btn-video');
            var src = $this.data('video');
            var $thisBgvideo = $this.parents('.section').find('.bg-video');
            $this.parents('.section').children('.videoarea').addClass('active').siblings('.page').removeClass('active');
            // $btnvideo.attr('src', 'media/'+src);
            $btnvideo[0].src = 'media/' +src;
            $btnvideo[0].poster = 'img/f-reject.jpg';
            $btnvideo[0].play();
            $thisBgvideo[0].pause();

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
