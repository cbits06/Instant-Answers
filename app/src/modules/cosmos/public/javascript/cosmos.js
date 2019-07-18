var IARuntime = function() {
    function CosmicExpansion(iaData) {
         constructor
    }

    CosmicExpansion.prototype.run = function() {

       var moreMoons = $('.ia__cosmos__moonlist--more');
       var lessMoons = $('.ia__cosmos__moonlist-less');
       var moonList = $('.ia__cosmos__moonlist');
       var moons = $('.ia__cosmos__moons');
       var moonsBtn = $('.ia__cosmos__moonbtn');
       var btnMore = $('.ia__cosmos__btn');
       var data = $('.ia__cosmos__data');
       var dataContainer = $('.ia__cosmos__datacontainer');
       var container = $('.ia__cosmos__container');

       if (moonsBtn[0]) {
            console.log("1");
            moonsBtn[0].addEventListener('click', function(e){
                console.log("2");
                if (hasClass(moons[0], 'ia__cosmos__moons--expanded')){
                    console.log("qsdqs")
                    moons[0].style.maxHeight = "29px";
                    setTimeout(function(){
                        removeClass(moons[0], 'ia__cosmos__moons--expanded');
                    },300);
                }else {
                    console.log("qsd");
                    addClass(moons[0], 'ia__cosmos__moons--expanded');
                    moons[0].style.maxHeight = moonList[0].offsetHeight+"px";
                }
            })
       };

       if (btnMore[0]) {
            btnMore[0].addEventListener('click', function(){
                if (hasClass(data[0], 'ia__cosmos__data--expanded')){
                    dataContainer[0].style.maxHeight = "0px";
                    setTimeout(function(){
                    removeClass(data[0], 'ia__cosmos__data--expanded');
                    removeClass(container[0], 'ia__cosmos__container--expanded');
                    },300);
                } else {
                    addClass(data[0], 'ia__cosmos__data--expanded');
                    addClass(container[0], 'ia__cosmos__container--expanded')
                    dataContainer[0].style.maxHeight = data[0].offsetHeight+"px";

                }
            })
       }


    };

    CosmicExpansion.prototype.stop = function() {
        // function that's gonna run upon exit
    };

    return CosmicExpansion;
}();