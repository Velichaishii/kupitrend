function YOURAPPNAME(doc) {
    var _self = this;

    _self.doc = doc;
    _self.window = window;
}

YOURAPPNAME.prototype.bootstrap = function() {
    var _self = this;

    _self.appLoad('loading', function () {
        console.log('App is loading... Paste your app code here.');
        // App is loading... Paste your app code here. 4example u can run preloader event here and stop it in action appLoad dom or full
    });

    _self.appLoad('dom', function () {
        console.log('DOM is loaded! Paste your app code here (Pure JS code).');
        // DOM is loaded! Paste your app code here (Pure JS code).
        // Do not use jQuery here cause external libs do not loads here...

        _self.initSwitcher(); // data-switcher="{target='anything'}" , data-switcher-target="anything"
    });

    _self.appLoad('full', function (e) {
        console.log('App was fully load! Paste external app source code here... For example if your use jQuery and something else');
        // App was fully load! Paste external app source code here... 4example if your use jQuery and something else
        // Please do not use jQuery ready state function to avoid mass calling document event trigger!
    });

};

// Window load types (loading, dom, full)
YOURAPPNAME.prototype.appLoad  = function (type, callback) {
    var _self = this;

    switch(type) {
        case 'loading':
            if (_self.doc.readyState === 'loading') callback();

            break;
        case 'dom':
            _self.doc.onreadystatechange = function () {
                if (_self.doc.readyState === 'complete') callback();
            };

            break;
        case 'full':
            _self.window.onload = function(e) {
                callback(e);
            };

            break;
        default:
            callback();
    }
};

YOURAPPNAME.prototype.initSwitcher = function () {
    var _self = this;

    var switchers = _self.doc.querySelectorAll('[data-switcher]');

    if(switchers && switchers.length > 0) {
        for(var i=0; i<switchers.length; i++) {
            var switcher = switchers[i],
                switcherOptions = _self.options(switcher.dataset.switcher),
                switcherElems = switcher.children,
                switcherTargets = _self.doc.querySelector('[data-switcher-target="' + switcherOptions.target + '"]').children;

            for(var y=0; y<switcherElems.length; y++) {
                var switcherElem = switcherElems[y],
                    parentNode = switcher.children,
                    switcherTarget = switcherTargets[y];

                if(switcherElem.classList.contains('active')) {
                    for(var z=0; z<parentNode.length; z++) {
                        parentNode[z].classList.remove('active');
                        switcherTargets[z].classList.remove('active');
                    }
                    switcherElem.classList.add('active');
                    switcherTarget.classList.add('active');
                }

                switcherElem.children[0].addEventListener('click', function (elem, target, parent, targets) {
                    return function (e) {
                        e.preventDefault();
                        if(!elem.classList.contains('active')) {
                            for(var z=0; z<parentNode.length; z++) {
                                parent[z].classList.remove('active');
                                targets[z].classList.remove('active');
                            }
                            elem.classList.add('active');
                            target.classList.add('active');
                        }
                    };

                }(switcherElem, switcherTarget, parentNode, switcherTargets));
            }
        }
    }
};

YOURAPPNAME.prototype.str2json = function(str, notevil) {
    try {
        if (notevil) {
            return JSON.parse(str
                .replace(/([\$\w]+)\s*:/g, function(_, $1){return '"'+$1+'":';})
                .replace(/'([^']+)'/g, function(_, $1){return '"'+$1+'"';})
            );
        } else {
            return (new Function("", "var json = " + str + "; return JSON.parse(JSON.stringify(json));"))();
        }
    } catch(e) { return false; }
};

YOURAPPNAME.prototype.options = function(string) {
    var _self = this;

    if (typeof string !='string') return string;

    if (string.indexOf(':') != -1 && string.trim().substr(-1) != '}') {
        string = '{'+string+'}';
    }

    var start = (string ? string.indexOf("{") : -1), options = {};

    if (start != -1) {
        try {
            options = _self.str2json(string.substr(start));
        } catch (e) {}
    }

    return options;
};

var app = new YOURAPPNAME(document);

app.appLoad('full', function () {
    $(".slider-range").each(function () {
        var slider = $(this);
        slider.slider();
        slider.on("slide", function (slideEvt) {
            $('#slider-range-start-price').val(slideEvt.value[0]);
            $('#slider-range-finish-price').val(slideEvt.value[1]);
        });
        setTimeout(function () {
            $('#slider-range-start-price').val(slider.data('slider').value[0]);
            $('#slider-range-finish-price').val(slider.data('slider').value[1]);
        }, 500);
    });

    var mouseX = 0, mouseY = 0;

    $(document).mousemove(function(event) {
        mouseX = event.pageX;
        mouseY = event.pageY;
    });

    $(".catalog-showcase__item").hover(function(e) {
        var x  = mouseX - $(this).offset().left - 100;
        var y = mouseY - $(this).offset().top - 100;
        $(this).find('.gps_ring').css({
            "left": x,
            "top": y
        }).show(0);

    }, function() {
    });

    // $('.m-mh-half').matchHeight();
    // $('.m-mh-full').matchHeight();

    // Array.prototype.max = function() {
    //     return Math.max.apply(null, this);
    // };
    // Array.prototype.min = function() {
    //     return Math.min.apply(null, this);
    // };
    //
    // var matchHeightElems = function (elemClass) {
    //     var elems = document.getElementsByClassName(elemClass),
    //         heightsArray = [];
    //     for(var i=0; i<elems.length; i++) {
    //         heightsArray.push(elems[i].clientHeight);
    //     }
    //     $('.' + elemClass).each(function () {
    //         $(this).css({
    //             'min-height': heightsArray.max()
    //         }) ;
    //     });
    // };
    //
    // matchHeightElems('m-mh-full');
    // matchHeightElems('m-mh-half');
    //
    // $('.catalog-nav__list').on('shown.bs.collapse', function (e) {
    //     matchHeightElems('m-mh-full');
    // }).on('hidden.bs.collapse', function (e) {
    //     matchHeightElems('m-mh-full');
    // });
    //
    // $('.catalog-nav__list').on('shown.bs.collapse', function (e) {
    //     matchHeightElems('m-mh-half');
    // }).on('hidden.bs.collapse', function (e) {
    //     matchHeightElems('m-mh-half');
    // });
});