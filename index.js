(function() {
    const video = document.querySelector('video')

    const isTouchScreen = ('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0)
    const events = {
        start: isTouchScreen ? 'touchstart' : 'mousedown',
        move: isTouchScreen ? 'touchmove' : 'mousemove',
        end: isTouchScreen ? 'touchend' : 'mouseup',
    }

    const params = { 'timeValue': 0, 'mouseX': 0 }

    video.addEventListener(events.start, dragStart, false)
    video.addEventListener(events.end, dragEnd, false)

    function dragStart(event) {
        video.addEventListener(events.move, dragProgress, false)

        params.mouseX = event.pageX ? event.pageX : event.touches[0].pageX
        params.timeValue = video.currentTime
    }

    function dragProgress(event) {
        if (video.seeking) {
            return // to reduce lag in chrome and firefox
        }

        const step = video.getBoundingClientRect().width / video.duration
        const currentX = event.pageX ? event.pageX : event.touches[0].pageX
        const timeChange = (currentX - params.mouseX) / (2 * step)
        const change = params.timeValue + timeChange

        video.currentTime = change < 0
            ? change % video.duration + video.duration
            : change % video.duration
    }

    function dragEnd() {
        video.removeEventListener(events.move, dragProgress, false)
    }
})()
