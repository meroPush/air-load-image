(function ($) {
    function AirLoadImage(options) {
        var defaults = {
            items: '._air-load-image',
            pluginId: 'airLoadImage',
            extended: '75%',
            timeThrottle: 750
        };
        this._defaults = defaults;
        this.options = $.extend({}, defaults, options);
        this.extended = 0;
        this.windowHeight = 0;
        this.init();
    }
    window.AirLoadImage = AirLoadImage;
    AirLoadImage.prototype.getExtended = function () {
        var extended;
        if (typeof this.options.extended === 'string') {
            extended = parseFloat(this.options.extended) * this.windowHeight / 100;
        } else {
            extended = this.options.extended;
        }
        this.extended = -extended;
        return -extended;
    };
    AirLoadImage.prototype.updateWindowHeight = function () {
        this.windowHeight = document.documentElement.clientHeight;
        return this.windowHeight;
    };
    AirLoadImage.prototype.throttle = function (func, ms) {
        var isThrottle = false,
            savedArgs,
            savedThis;

        function wrapper() {
            // (2) В этом состоянии все новые вызовы запоминаются в замыкании через savedArgs/savedThis.
            // Обратим внимание, что и контекст вызова и аргументы для нас одинаково важны и запоминаются одновременно.
            // Только зная и то и другое, можно воспроизвести вызов правильно.
            if (isThrottle) {
                savedArgs = arguments;
                savedThis = this;
                return;
            }
            // (1) Декоратор throttle возвращает функцию-обёртку wrapper,
            // которая при первом вызове запускает func и переходит в состояние «паузы» (isThrottled = true)
            func.apply(this, arguments);
            isThrottle = true;
            setTimeout(function () {
                // (3) Далее, когда пройдёт таймаут ms миллисекунд – пауза будет снята,
                // а wrapper – запущен с последними аргументами и контекстом (если во время паузы были вызовы).
                isThrottle = false;
                if (savedArgs) {
                    wrapper.apply(savedThis, savedArgs);
                    savedArgs = savedThis = null;
                }
                // Шаг (3) запускает именно не саму функцию, а снова wrapper, так как необходимо не только выполнить func,
                // но и снова поставить выполнение на паузу. Получается последовательность
                // «вызов – пауза… вызов – пауза … вызов – пауза …», каждое выполнение в обязательном порядке сопровождается паузой после него.
                // Это удобно описывается рекурсией.
            }, ms);
        }
        return wrapper;
    };
    AirLoadImage.prototype.init = function () {
        var _this = this;
        var throttle = this.throttle(this.showVisible, this.options.timeThrottle);
        function handler(event) {
            _this.getExtended();
            if (event.type === 'resize') {
                _this.updateWindowHeight();
            }
            throttle.call(_this);
        }
        $(document).on('scroll.' + this.options.pluginId, handler);
        $(window).on('resize.' + this.options.pluginId, handler);

        this.getExtended();
        this.updateWindowHeight();
        this.showVisible();
    };
    AirLoadImage.prototype.checkVisible = function (elem) {
        var coordinates = elem.getBoundingClientRect();
        var visibleTop = coordinates.top > 0 && coordinates.top + this.extended <= this.windowHeight;
        var visibleBottom = coordinates.bottom > this.extended && coordinates.bottom <= this.windowHeight;
        var visibleCenter = coordinates.top < 0 && coordinates.bottom > this.windowHeight;

        return visibleTop || visibleBottom || visibleCenter;
    };
    AirLoadImage.prototype.showVisible = function () {
        var items = $(this.options.items);
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var realSrc = item.getAttribute('data-air-img');
            if (!realSrc) {
                continue;
            }
            if (this.checkVisible(item)) {
                if (item.tagName === 'IMG') {
                    item.src = realSrc;
                } else {
                    item.style.backgroundImage = 'url(' + realSrc + ')';
                }
                item.setAttribute('data-air-img', '');
            }
        }
    };
    AirLoadImage.prototype.reInit = function () {
        this.destroy();
        this.init();
    };
    AirLoadImage.prototype.destroy = function () {
        $(document).off('scroll.' + this.options.pluginId);
        $(window).off('resize.' + this.options.pluginId);
    };
})(jQuery);
