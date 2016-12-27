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

app.appLoad('loading',function () {

});

app.appLoad('dom',function () {

});

function handleFiles(files) {
    var UPList = document.getElementById("upload-photo__list");
    for (var i=0; i < files.length; i++) {
        var UPItem = document.createElement("div");
        var UPBtn = document.createElement("div");
        UPBtn.classList.add('upload-photo__btn-close');
        UPItem.classList.add('upload-photo__item');
        UPList.appendChild(UPItem);
        UPItem.appendChild(UPBtn);


        var img = document.createElement("img");
        img.src = window.URL.createObjectURL(files[i]);
        img.classList.add('upload-photo__img');
        img.onload = function() {
            window.URL.revokeObjectURL(this.src);
        };
        UPItem.appendChild(img);
    }
}

app.appLoad('full', function () {
    var navbarToggleOpen = $('.navbar-header .navbar-toggle');
    var navbarToggleClose = $('.navbar-collapse .navbar-toggle-close');
    var navbarCollapse = $('.navbar .navbar-collapse');
    var wrapOver = $('.page-wrap-overlay');

    navbarToggleOpen.click(function () {
        wrapOver.stop().fadeIn(400);
    });
    navbarToggleClose.click(function () {
        wrapOver.stop().fadeOut(400);
    });

    $(wrapOver).click(function () {
        wrapOver.stop().fadeOut(400);
        navbarCollapse.removeClass('in');
    });

    $(".product-card__photo-small").click(function(){
       var dataSrc = $(this).attr('data-large-src');

        $(".product-card__photo-big").html("<img src="+dataSrc+" alt=''>");
        $(".product-card__photo-big img").addClass("product-card__photo-img")
    });

    $(".slider-range").each(function () {
        var slider = $(this);
        var sliderStart = $('#slider-range-start-price');
        var sliderFinish = $('#slider-range-finish-price');

        slider.slider();
        slider.on("slide", function (slideEvt) {
            sliderStart.val(slideEvt.value[0]);
            sliderFinish.val(slideEvt.value[1]);
        });
        setTimeout(function () {
            sliderStart.val(slider.data('slider').value[0]);
            sliderFinish.val(slider.data('slider').value[1]);
        }, 500);
    });

    $(".product-card__photos-small").owlCarousel(
        {
            items: 3,
            nav: true,
            dots: false,
            margin: 10
        }
    );

    $(".products__gallery").owlCarousel(
        {
            items: 1,
            nav: true,
            dots: false,
            responsive: {
                480: {
                    items: 2
                },
                640: {
                    items: 3
                },
                768: {
                    items: 2
                },
                880: {
                    items: 3
                },
                992: {
                    items: 4
                }
            }
        }
    );

    $(document).on('click', '.upload-photo__btn-close', function(){
        $(this).closest(".upload-photo__item").remove();
    });

    function transfer() {
        var sortinDiv = $(".sorting");

        if (viewport().width <= 767) {
            sortinDiv.insertAfter(".page-body__sidebar");
        } else {
            sortinDiv.insertAfter(".banners-top");
        }
    }
    $(window).resize(function () {
        transfer();
    });
    transfer();

    function deploy() {
        var catalogUl = $("#catalog-nav__list");
        var filterDiv = $("#catalog-filter__list");

        if (viewport().width <= 767) {
            catalogUl.removeClass("in");
            filterDiv.removeClass("in");
        } else {
            catalogUl.addClass("in");
            filterDiv.addClass("in");
            catalogUl.css({
                height: 'auto'
            });
            filterDiv.css({
                height: 'auto'
            });
        }
    }
    $(window).resize(function () {
        deploy();
    });
    deploy();

});

function viewport() {
    var e = window, a = 'inner';
    if (!('innerWidth' in window )) {
        a = 'client';
        e = document.documentElement || document.body;
    }
    return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
}