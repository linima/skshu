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
    }
}

processor.fixViewport('fixed', 750);
