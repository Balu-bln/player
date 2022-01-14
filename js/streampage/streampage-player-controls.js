/*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
+ A simple style injector for educational use only
+ In cooperation with the Berliner Hochschule für Technik (https://www.beuth-hochschule.de/)
+ and Nanocosmos Berlin (https://www.nanocosmos.de/)
+ Copyright (c) 2021 Steve Margenfeld (margenfeld.s@gmail.com)
 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

/**
 * actual position of the second player
 * @type {string} position in clear name
 */
let secondPlayerPosition = "bottomRight";
let splittScreen = false;

let dualPlayer = true;
let sideView = true;
let lastPosition = "";

/**
 * Applies in nanoplayer-streamconfig saved settings to the website style
 */
let initializeControls = function (){
    initPlayerControls();
    nanocosmosBugfix();
}

/**
 * Init all Player controls
 */
let initPlayerControls = function (){

    document.getElementById("playButton").onclick = function (){
        playerStartPlayPlayback();
        hideShowPlayButton();
        hideShowPauseButton();
    }
    document.getElementById("pauseButton").onclick = function (){
        playerStopPlayback();
        hideShowPlayButton();
        hideShowPauseButton();
    }
    document.getElementById("soundMuteButton").onclick = function (){
        playerMute();
        hideShowSoundMuteButton();
        hideShowSoundUnmuteButton();
    }
    document.getElementById("soundUnmuteButton").onclick = function () {
        playerUnmute();
        hideShowSoundMuteButton();
        hideShowSoundUnmuteButton();
    }
    document.getElementById("volume").onchange = function (){
        changeVolume();
    }
    document.getElementById("fullscreen").onclick = function (){
        hideShowFullscreenButton();
        hideShowExitFullscreenButton();
        playerFullscreen();
    }
    document.getElementById("exitFullscreen").onclick = function (){
        hideShowFullscreenButton();
        hideShowExitFullscreenButton();
        playerExitFullscreen();
    }
    document.getElementById("switch").onclick = function (){
        rotatePlayerTwoAlignment.switchPosition(secondPlayerPosition);
    }

    document.getElementById("oneDiv").onclick = function(){
        hideShowSplittScreenButton();
        hideShowSwitchPositionButton();
        onePlayer();
    }

    document.getElementById("splittScreen").onclick = function (){
        playerSplittScreen.refresh();
    }

    document.getElementById("twoDivs").onclick = function(){
        //twoPlayers();
        hideShowTwoDivsButton();
        hideShowOneDivButton();
        hideShowSwitchPositionButton();
    }

    document.getElementById("changePosition").onclick = function (){
        switchPlayerPosition();
    }

    document.getElementById("player").onmousemove = function (){
        fadeControls();
    }
}

/**
 * Some bugfixes for unexpected actions
 */
let nanocosmosBugfix = function (){

    // Nanocosmos player changes the attributes of the second(mini) player after fullscreen event is fired
    let observer = new MutationObserver(function (mutations){
        mutations.forEach(function (mutations){
            if (sideView) rotatePlayerTwoAlignment.refresh();
        })
    });
    observer.observe(document.getElementById("playerDiv2"), {
        attributes : true
    })
 //TODO umsetzten

    let observer2 = new MutationObserver(function (mutations2){

        mutations2.forEach(function (mutations2){
            //if (!splittScreen) playerSplittScreen.refresh();
        })

    });
    observer2.observe(document.getElementById("playerDiv2"), {
        attributes : true
    })
}

/**
 * Start all Player Videos
 */
let playerStartPlayPlayback = function (){
    player.play();
    if (player2 !== undefined) player2.play();
}

/**
 * Stop all Player Videos
 */
let playerStopPlayback = function (){
    player.pause();
    if (player2 !== undefined)  player2.pause();
}

/**
 * Mute the Player
 */
let playerMute = function(){
    player.mute();
    if (player2 !== undefined)  player2.mute();
}

/**
 * Unmute the Player
 */
let playerUnmute = function (){
    player.unmute();
    if (player2 !== undefined)  player2.unmute();
}

/**
 * Change the Volume of the Player
 */
let changeVolume = function (){
    let volumeValue = document.getElementById("volume").value;
    let value = volumeValue / 100;

    player.setVolume(value);
    if (player2 !== undefined)  player2.setVolume(value);
}

/**
 * Make the Player to fullscreen
 */
let playerFullscreen = function (){
    let playerDivs = document.getElementById("playerDivs");

    if (playerDivs.requestFullscreen) {
        playerDivs.requestFullscreen();
    } else if (playerDivs.webkitRequestFullscreen) { /* Safari */
        playerDivs.webkitRequestFullscreen();
    } else if (playerDivs.msRequestFullscreen) { /* IE11 */
        playerDivs.msRequestFullscreen();
    }
}

/**
 * Exit the Fullscreen
 */
let playerExitFullscreen = function (){
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
    }
}

/**
 * Holder for rotating functions of the player
 * @type {{getLastState: ((function(): (string))|*), switchPosition: rotatePlayerTwoAlignment.switchPosition, refresh: rotatePlayerTwoAlignment.refresh}}
 */
let rotatePlayerTwoAlignment = {

    /**
     * Switches position of the player to given position (in plain text)
     * @param position position to be switched to in plain text camel cased (e.g. "bottomRight")
     */
    switchPosition : function (position){
        let playerElement = document.getElementById("playerDiv2");
        let states = {
            "bottomRight": function (){
                playerElement.style.top = null;
                playerElement.style.bottom = "0";
                playerElement.style.left = null;
                playerElement.style.right = "0";
            },
            "bottomLeft": function (){
                playerElement.style.top = null;
                playerElement.style.bottom = "0";
                playerElement.style.left = "0";
                playerElement.style.right = null;
            },
            "topLeft": function (){
                playerElement.style.top = "0";
                playerElement.style.bottom = null;
                playerElement.style.left = "0";
                playerElement.style.right = null;
            },
            "topRight": function (){
                playerElement.style.top = "0";
                playerElement.style.bottom = null;
                playerElement.style.left = null;
                playerElement.style.right = "0";
            }
        }

        switch (position){
            case "bottomRight" :
                states.bottomLeft();
                secondPlayerPosition = "bottomLeft"
                break;
            case "bottomLeft" :
                states.topLeft();
                secondPlayerPosition = "topLeft"
                break;
            case "topLeft" :
                states.topRight();
                secondPlayerPosition = "topRight"
                break;
            case "topRight" :
                states.bottomRight();
                secondPlayerPosition = "bottomRight"
                break;
        }
    },
    /**
     * returns the last (not the actual!) position of the player in plain text camel cased (e.g. "bottomRight")
     * needed for internal functionality
     * @returns {string} last position of the player
     */
    getLastState : function (){
        if (secondPlayerPosition === "bottomRight") return "topRight";
        else if (secondPlayerPosition === "topRight") return "topLeft";
        else if (secondPlayerPosition === "topLeft") return "bottomLeft";
        else return "bottomRight";
    },

    /**
     * Refreshes the position of the second (small) player
     */
    refresh : function (){
        this.switchPosition(this.getLastState());
    }
}

/**
 * Switches the position of the two players
 */
let switchPlayerPosition = function (){
    let videoOneElement = document.getElementById("h5live-playerDiv");
    let videoTwoElement = document.getElementById("h5live-playerDiv2");

    videoOneElement.id = "h5live-playerDiv2";
    videoTwoElement.id = "h5live-playerDiv";

    document.getElementById("playerDiv").appendChild(videoTwoElement);
    document.getElementById("playerDiv2").appendChild(videoOneElement);
}

/**
 * TODO wird im Fullscreen / exit Fullscreen zurückgesetzt
 */
let playerSplittScreen = {

    splittScreenActive : function(){
        let player = document.getElementById("playerDiv");
        let player2 = document.getElementById("playerDiv2");

        splittScreen = true;
        sideView = false;
        document.getElementById("splittScreen").style.stroke = "red";

        lastPosition = rotatePlayerTwoAlignment.getLastState();
        rotatePlayerTwoAlignment.switchPosition("topRight");
        document.getElementById("switch").style.display ="none";

        player.style.width = "50%";

        player2.style.width = "50%";
        player2.style.height = "100%";
        player2.style.margin = "0";
        player2.style.borderRadius = "0";
    },
    splittScreenDeactive : function (){
        let player = document.getElementById("playerDiv");
        let player2 = document.getElementById("playerDiv2");

        splittScreen = false;
        sideView = true;
        document.getElementById("splittScreen").style.stroke = "white";

        rotatePlayerTwoAlignment.switchPosition(lastPosition);
        document.getElementById("switch").style.display ="flex";

        player.style.width = "100%";

        player2.style.width = "30%";
        player2.style.height = "auto";
        player2.style.margin = "5px";
        player2.style.borderRadius = "10px";
    },
    refresh : function (){
        if(!splittScreen){
            this.splittScreenActive();
        }else{
            this.splittScreenDeactive();
        }
    }
}

/**
 * TODO anpassen wird im Fullscreen / exit Fullscreen zurückgesetzt
 */
let onePlayer = function(){
    if(dualPlayer){
        sideView = true;
        toggleElementVisibility(document.getElementById("playerDiv2"));
        dualPlayer = false;
    } else{
        sideView = false;
        toggleElementVisibility(document.getElementById("playerDiv2"));
        dualPlayer = true;
    }

}

/**
 * TODO anpassen / funktioniert nicht ....
 */
let fadeControls = function (){

    document.getElementById("controls-playerDiv").style.display = "flex";
    document.getElementById("player").onmouseout = function(){
        document.getElementById("controls-playerDiv").style.display = "none";
    }



        /*clearTimeout(timeout);
        timeout = setTimeout(
            function(){
                alert("move your mouse");
            }, 10000);*/

}

/**
 * Switch between hide and show of the play button
 */
let hideShowPlayButton = function (){
    toggleElementVisibility(document.getElementById("playButton"));
}

/**
 * Switch between hide and show of the pause button
 */
let hideShowPauseButton = function (){
    toggleElementVisibility(document.getElementById("pauseButton"));
}

/**
 * Switch between hide and show of the mute button
 */
let hideShowSoundMuteButton = function (){
    toggleElementVisibility(document.getElementById("soundUnmuteButton"));
}

/**
 * Switch between hide and show of the unmute button
 */
let hideShowSoundUnmuteButton = function () {
    toggleElementVisibility(document.getElementById("soundMuteButton"));
}

/**
 * Switch between hide and show of the fullscreen button
 */
let hideShowFullscreenButton = function () {
    toggleElementVisibility(document.getElementById("fullscreen"));
}

/**
 * Switch between hide and show of the exit fullscreen button
 */
let hideShowExitFullscreenButton = function () {
    toggleElementVisibility(document.getElementById("exitFullscreen"));
}

/**
 * Switch between hide and show of the switchPosition button
 */
let hideShowSwitchPositionButton = function () {
    toggleElementVisibility(document.getElementById("switch"));
}

/**
 * Switch between hide and show of the splittScreen button
 */
let hideShowSplittScreenButton = function () {
    toggleElementVisibility(document.getElementById("splittScreen"));
}

/**
 * Switch between hide and show of the oneDiv button
 */
let hideShowOneDivButton = function () {
    toggleElementVisibility(document.getElementById("oneDiv"));
}

/**
 * Switch between hide and show of the twoDivs button
 */
let hideShowTwoDivsButton = function () {
    toggleElementVisibility(document.getElementById("twoDivs"));
}

/**
 * Injector to start this script
 */
document.addEventListener('DOMContentLoaded', function () {
    initializeControls();
});