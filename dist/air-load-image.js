/*
 * Air load image - v1.0.0
 * Description: Lazy loading of images and the background when scrolling
 * author.name: mero.push
 * author.email: mero.push@gmail.com
 * https://github.com/meroPush/air-load-image
 * Created: Mon Mar 06 2017 18:05:53 GMT+0200 (EET)
 */

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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhaXItbG9hZC1pbWFnZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCQpIHtcbiAgICBmdW5jdGlvbiBBaXJMb2FkSW1hZ2Uob3B0aW9ucykge1xuICAgICAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICBpdGVtczogJy5fYWlyLWxvYWQtaW1hZ2UnLFxuICAgICAgICAgICAgcGx1Z2luSWQ6ICdhaXJMb2FkSW1hZ2UnLFxuICAgICAgICAgICAgZXh0ZW5kZWQ6ICc3NSUnLFxuICAgICAgICAgICAgdGltZVRocm90dGxlOiA3NTBcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fZGVmYXVsdHMgPSBkZWZhdWx0cztcbiAgICAgICAgdGhpcy5vcHRpb25zID0gJC5leHRlbmQoe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcbiAgICAgICAgdGhpcy5leHRlbmRlZCA9IDA7XG4gICAgICAgIHRoaXMud2luZG93SGVpZ2h0ID0gMDtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxuICAgIHdpbmRvdy5BaXJMb2FkSW1hZ2UgPSBBaXJMb2FkSW1hZ2U7XG4gICAgQWlyTG9hZEltYWdlLnByb3RvdHlwZS5nZXRFeHRlbmRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGV4dGVuZGVkO1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5leHRlbmRlZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGV4dGVuZGVkID0gcGFyc2VGbG9hdCh0aGlzLm9wdGlvbnMuZXh0ZW5kZWQpICogdGhpcy53aW5kb3dIZWlnaHQgLyAxMDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBleHRlbmRlZCA9IHRoaXMub3B0aW9ucy5leHRlbmRlZDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmV4dGVuZGVkID0gLWV4dGVuZGVkO1xuICAgICAgICByZXR1cm4gLWV4dGVuZGVkO1xuICAgIH07XG4gICAgQWlyTG9hZEltYWdlLnByb3RvdHlwZS51cGRhdGVXaW5kb3dIZWlnaHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMud2luZG93SGVpZ2h0ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodDtcbiAgICAgICAgcmV0dXJuIHRoaXMud2luZG93SGVpZ2h0O1xuICAgIH07XG4gICAgQWlyTG9hZEltYWdlLnByb3RvdHlwZS50aHJvdHRsZSA9IGZ1bmN0aW9uIChmdW5jLCBtcykge1xuICAgICAgICB2YXIgaXNUaHJvdHRsZSA9IGZhbHNlLFxuICAgICAgICAgICAgc2F2ZWRBcmdzLFxuICAgICAgICAgICAgc2F2ZWRUaGlzO1xuXG4gICAgICAgIGZ1bmN0aW9uIHdyYXBwZXIoKSB7XG4gICAgICAgICAgICAvLyAoMikg0JIg0Y3RgtC+0Lwg0YHQvtGB0YLQvtGP0L3QuNC4INCy0YHQtSDQvdC+0LLRi9C1INCy0YvQt9C+0LLRiyDQt9Cw0L/QvtC80LjQvdCw0Y7RgtGB0Y8g0LIg0LfQsNC80YvQutCw0L3QuNC4INGH0LXRgNC10Lcgc2F2ZWRBcmdzL3NhdmVkVGhpcy5cbiAgICAgICAgICAgIC8vINCe0LHRgNCw0YLQuNC8INCy0L3QuNC80LDQvdC40LUsINGH0YLQviDQuCDQutC+0L3RgtC10LrRgdGCINCy0YvQt9C+0LLQsCDQuCDQsNGA0LPRg9C80LXQvdGC0Ysg0LTQu9GPINC90LDRgSDQvtC00LjQvdCw0LrQvtCy0L4g0LLQsNC20L3RiyDQuCDQt9Cw0L/QvtC80LjQvdCw0Y7RgtGB0Y8g0L7QtNC90L7QstGA0LXQvNC10L3QvdC+LlxuICAgICAgICAgICAgLy8g0KLQvtC70YzQutC+INC30L3QsNGPINC4INGC0L4g0Lgg0LTRgNGD0LPQvtC1LCDQvNC+0LbQvdC+INCy0L7RgdC/0YDQvtC40LfQstC10YHRgtC4INCy0YvQt9C+0LIg0L/RgNCw0LLQuNC70YzQvdC+LlxuICAgICAgICAgICAgaWYgKGlzVGhyb3R0bGUpIHtcbiAgICAgICAgICAgICAgICBzYXZlZEFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgICAgICAgICAgc2F2ZWRUaGlzID0gdGhpcztcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyAoMSkg0JTQtdC60L7RgNCw0YLQvtGAIHRocm90dGxlINCy0L7Qt9Cy0YDQsNGJ0LDQtdGCINGE0YPQvdC60YbQuNGOLdC+0LHRkdGA0YLQutGDIHdyYXBwZXIsXG4gICAgICAgICAgICAvLyDQutC+0YLQvtGA0LDRjyDQv9GA0Lgg0L/QtdGA0LLQvtC8INCy0YvQt9C+0LLQtSDQt9Cw0L/Rg9GB0LrQsNC10YIgZnVuYyDQuCDQv9C10YDQtdGF0L7QtNC40YIg0LIg0YHQvtGB0YLQvtGP0L3QuNC1IMKr0L/QsNGD0LfRi8K7IChpc1Rocm90dGxlZCA9IHRydWUpXG4gICAgICAgICAgICBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICBpc1Rocm90dGxlID0gdHJ1ZTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vICgzKSDQlNCw0LvQtdC1LCDQutC+0LPQtNCwINC/0YDQvtC50LTRkdGCINGC0LDQudC80LDRg9GCIG1zINC80LjQu9C70LjRgdC10LrRg9C90LQg4oCTINC/0LDRg9C30LAg0LHRg9C00LXRgiDRgdC90Y/RgtCwLFxuICAgICAgICAgICAgICAgIC8vINCwIHdyYXBwZXIg4oCTINC30LDQv9GD0YnQtdC9INGBINC/0L7RgdC70LXQtNC90LjQvNC4INCw0YDQs9GD0LzQtdC90YLQsNC80Lgg0Lgg0LrQvtC90YLQtdC60YHRgtC+0LwgKNC10YHQu9C4INCy0L4g0LLRgNC10LzRjyDQv9Cw0YPQt9GLINCx0YvQu9C4INCy0YvQt9C+0LLRiykuXG4gICAgICAgICAgICAgICAgaXNUaHJvdHRsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlmIChzYXZlZEFyZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgd3JhcHBlci5hcHBseShzYXZlZFRoaXMsIHNhdmVkQXJncyk7XG4gICAgICAgICAgICAgICAgICAgIHNhdmVkQXJncyA9IHNhdmVkVGhpcyA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vINCo0LDQsyAoMykg0LfQsNC/0YPRgdC60LDQtdGCINC40LzQtdC90L3QviDQvdC1INGB0LDQvNGDINGE0YPQvdC60YbQuNGOLCDQsCDRgdC90L7QstCwIHdyYXBwZXIsINGC0LDQuiDQutCw0Log0L3QtdC+0LHRhdC+0LTQuNC80L4g0L3QtSDRgtC+0LvRjNC60L4g0LLRi9C/0L7Qu9C90LjRgtGMIGZ1bmMsXG4gICAgICAgICAgICAgICAgLy8g0L3QviDQuCDRgdC90L7QstCwINC/0L7RgdGC0LDQstC40YLRjCDQstGL0L/QvtC70L3QtdC90LjQtSDQvdCwINC/0LDRg9C30YMuINCf0L7Qu9GD0YfQsNC10YLRgdGPINC/0L7RgdC70LXQtNC+0LLQsNGC0LXQu9GM0L3QvtGB0YLRjFxuICAgICAgICAgICAgICAgIC8vIMKr0LLRi9C30L7QsiDigJMg0L/QsNGD0LfQsOKApiDQstGL0LfQvtCyIOKAkyDQv9Cw0YPQt9CwIOKApiDQstGL0LfQvtCyIOKAkyDQv9Cw0YPQt9CwIOKApsK7LCDQutCw0LbQtNC+0LUg0LLRi9C/0L7Qu9C90LXQvdC40LUg0LIg0L7QsdGP0LfQsNGC0LXQu9GM0L3QvtC8INC/0L7RgNGP0LTQutC1INGB0L7Qv9GA0L7QstC+0LbQtNCw0LXRgtGB0Y8g0L/QsNGD0LfQvtC5INC/0L7RgdC70LUg0L3QtdCz0L4uXG4gICAgICAgICAgICAgICAgLy8g0K3RgtC+INGD0LTQvtCx0L3QviDQvtC/0LjRgdGL0LLQsNC10YLRgdGPINGA0LXQutGD0YDRgdC40LXQuS5cbiAgICAgICAgICAgIH0sIG1zKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gd3JhcHBlcjtcbiAgICB9O1xuICAgIEFpckxvYWRJbWFnZS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIHRocm90dGxlID0gdGhpcy50aHJvdHRsZSh0aGlzLnNob3dWaXNpYmxlLCB0aGlzLm9wdGlvbnMudGltZVRocm90dGxlKTtcbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlcihldmVudCkge1xuICAgICAgICAgICAgX3RoaXMuZ2V0RXh0ZW5kZWQoKTtcbiAgICAgICAgICAgIGlmIChldmVudC50eXBlID09PSAncmVzaXplJykge1xuICAgICAgICAgICAgICAgIF90aGlzLnVwZGF0ZVdpbmRvd0hlaWdodCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3R0bGUuY2FsbChfdGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgJChkb2N1bWVudCkub24oJ3Njcm9sbC4nICsgdGhpcy5vcHRpb25zLnBsdWdpbklkLCBoYW5kbGVyKTtcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUuJyArIHRoaXMub3B0aW9ucy5wbHVnaW5JZCwgaGFuZGxlcik7XG5cbiAgICAgICAgdGhpcy5nZXRFeHRlbmRlZCgpO1xuICAgICAgICB0aGlzLnVwZGF0ZVdpbmRvd0hlaWdodCgpO1xuICAgICAgICB0aGlzLnNob3dWaXNpYmxlKCk7XG4gICAgfTtcbiAgICBBaXJMb2FkSW1hZ2UucHJvdG90eXBlLmNoZWNrVmlzaWJsZSA9IGZ1bmN0aW9uIChlbGVtKSB7XG4gICAgICAgIHZhciBjb29yZGluYXRlcyA9IGVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHZhciB2aXNpYmxlVG9wID0gY29vcmRpbmF0ZXMudG9wID4gMCAmJiBjb29yZGluYXRlcy50b3AgKyB0aGlzLmV4dGVuZGVkIDw9IHRoaXMud2luZG93SGVpZ2h0O1xuICAgICAgICB2YXIgdmlzaWJsZUJvdHRvbSA9IGNvb3JkaW5hdGVzLmJvdHRvbSA+IHRoaXMuZXh0ZW5kZWQgJiYgY29vcmRpbmF0ZXMuYm90dG9tIDw9IHRoaXMud2luZG93SGVpZ2h0O1xuICAgICAgICB2YXIgdmlzaWJsZUNlbnRlciA9IGNvb3JkaW5hdGVzLnRvcCA8IDAgJiYgY29vcmRpbmF0ZXMuYm90dG9tID4gdGhpcy53aW5kb3dIZWlnaHQ7XG5cbiAgICAgICAgcmV0dXJuIHZpc2libGVUb3AgfHwgdmlzaWJsZUJvdHRvbSB8fCB2aXNpYmxlQ2VudGVyO1xuICAgIH07XG4gICAgQWlyTG9hZEltYWdlLnByb3RvdHlwZS5zaG93VmlzaWJsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGl0ZW1zID0gJCh0aGlzLm9wdGlvbnMuaXRlbXMpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IGl0ZW1zW2ldO1xuICAgICAgICAgICAgdmFyIHJlYWxTcmMgPSBpdGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1haXItaW1nJyk7XG4gICAgICAgICAgICBpZiAoIXJlYWxTcmMpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrVmlzaWJsZShpdGVtKSkge1xuICAgICAgICAgICAgICAgIGlmIChpdGVtLnRhZ05hbWUgPT09ICdJTUcnKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc3JjID0gcmVhbFNyYztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpdGVtLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9ICd1cmwoJyArIHJlYWxTcmMgKyAnKSc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGl0ZW0uc2V0QXR0cmlidXRlKCdkYXRhLWFpci1pbWcnLCAnJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEFpckxvYWRJbWFnZS5wcm90b3R5cGUucmVJbml0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfTtcbiAgICBBaXJMb2FkSW1hZ2UucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICQoZG9jdW1lbnQpLm9mZignc2Nyb2xsLicgKyB0aGlzLm9wdGlvbnMucGx1Z2luSWQpO1xuICAgICAgICAkKHdpbmRvdykub2ZmKCdyZXNpemUuJyArIHRoaXMub3B0aW9ucy5wbHVnaW5JZCk7XG4gICAgfTtcbn0pKGpRdWVyeSk7XG4iXSwiZmlsZSI6ImFpci1sb2FkLWltYWdlLmpzIn0=
