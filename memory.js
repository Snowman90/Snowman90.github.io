//Preload obrazków
$.fn.preload = function() { this.each(function() { $('<img/>')[0].src = this; })};
let i = ["img/1.png", "img/2.png", "img/3.png", "img/4.png", "img/karta.png", "img/5.png", "img/6.png"];
$(i).preload();

let pictures, lock, oneVisible, pairs, imgData, cards;
let turnCounter = 0;

let g = new Game();
g.play();

function Game(){
    //liczba par TODO jako zmienna
    pairs = 6;

    this.play = function() {

        let $board = $(".board");
        $board.html("<div class=\"field\"></div>");

        let $field = $(".field");

        pictures = [];
        lock = false;
        oneVisible = false;
        imgData = "";
        cards = [];

        for(let i = 1; pairs >= i; i++) pictures.push(i + ".png");

        // Return random ordered and doubled array
        const shuffleArray = array => _(array).concat(array).shuffle().value();
        pictures = shuffleArray(pictures);

        $(pictures).each(() => $field.append("<div class=\"card\"></div>"));
        $(".card").each(function (i) {
            cards.push(new Card(pictures[i], this));
            $(this).on("click", function () { cards[i].revealCard() });
        });

        $(".board").addClass('easy');

        //$board.html("<div class=\"score-header\">Congratulations You won!</div>");
        $board.append("<div class=\"turns\">Turn Counter: " + 0 + "</div>");


    }

}

function Card(img, query) {

    this.img = "url(img/" + img + ")";
    this.query = $(query);
    this.state = "normal";
    this.points = 30;
    this.firstReveal = false;

    this.revealCard = function () {

        if(!lock && this.state === "normal") {

            lock = true;
            this.state = "revealed";

            this.query.css({"background-image": this.img});
            this.query.toggleClass("highlight rotateCard");

            if(!oneVisible) {
                oneVisible = true;
                imgData = this.img;
                lock = false;
            } else {

                this.img === imgData ? setTimeout(() => changeCardState("hide"), 750) : setTimeout(() => changeCardState("restore"), 1000);
                oneVisible = false;
                turnCounter++;
                $(".turns").html('Turn counter: ' + turnCounter);
            }
        }



    };

    this.restore = function () {

        if(!this.firstReveal) {
            this.firstReveal = true;
        } else {
            if(this.points >= 0) this.points -= 5;
        }

        this.state = "normal";
        this.query.toggleClass("highlight rotateCard");
        this.query.css({"background-image":""});
    };

    this.hide = function () {
        const hiddenCards = () => $.grep(cards, (e) => e.state === "hidden").length;
        let $board = $(".board");

        this.state = "hidden";
        this.query.toggleClass("hidden highlight");


        if(cards.length === hiddenCards()) {


            $board.html("<div class=\"score-header\">Congratulations You won!</div>" +
                "<div class=\"score\">Done in "+turnCounter+" turns</div>");

            $board.append("<a class=\"btn\">Play again</a>");
            $(".btn").on("click", () => g.play());
        }

    };

    function changeCardState(state) {
        lock = false;
        $.grep(cards, function (e) {
            if (e.state === "revealed") {
                switch(state) {
                    case "hide":
                        e.hide();
                        break;
                    case "restore":
                        e.restore();
                        break;
                }
            }
        });
    }

}
