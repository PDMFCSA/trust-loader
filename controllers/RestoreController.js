import SpinnerService from "./services/SpinnerService.js";
import SWAgent from "./services/SWAgent.js";
function RestoreController() {

    let EDFS;
    let seed;
    let pin;
    let wizard;
    let spinner;

    function displayContainer(containerId) {
        document.getElementById(containerId).style.display = "block";
    }

    this.initView = function () {
        document.getElementsByTagName("title")[0].text = APP_CONFIG.appName;
        spinner = new SpinnerService(document.getElementsByTagName("body")[0]);
        EDFS = require("edfs");
        EDFS.checkForSeedCage((err) => {
            if (err) {
                //inform user that he is possible to delete his old pskwallet instance
            }

            wizard = new Stepper(document.getElementById("psk-wizard"));

        });
    };

    this.validateSeed =function(event) {
        let seed = event.target.value;
        let btn = document.getElementById("restoreSeedBtn");
        if(seed.length>0){
            document.getElementById("seedError").innerText = "";
            btn.removeAttribute("disabled");
        }
        else{
            btn.setAttribute("disabled","disabled");
        }
    };

    this.validatePIN = function (event) {
        pin = document.getElementById("pin").value;
        let pinConfirm = document.getElementById("confirmPin").value;
        let btn = document.getElementById("setPINBtn");

        if (pin === pinConfirm && pin.length >= APP_CONFIG.PIN_MIN_LENGTH) {
            btn.removeAttribute("disabled");
        } else {
            btn.setAttribute("disabled", "disabled");
        }
    };


    this.restore = function (event) {
        event.preventDefault();
        seed = document.getElementById("seed").value;
        try {
            EDFS.attachWithSeed(seed, function(err, edfs){
                if(err){
                    throw err;
                }
                EDFS = edfs;
                wizard.next();
            });

        }
        catch (e) {
           console.log(e);
           document.getElementById("seedError").innerText="Seed is not valid."
        }
    };

    this.previous = function (event) {
        event.preventDefault();
        document.getElementById("seed").value = "";
        document.getElementById("restoreSeedBtn").setAttribute("disabled","disabled");
        wizard.previous();
    };

    this.setPin = function (event) {
        event.preventDefault();
        EDFS.loadWallet(seed, pin, true, function (err, wallet) {
            if (err) {
                return document.getElementById("pinError").innerText = "Operation failed. Try again"
            }
            wizard.next();
        });
    };

    this.openWallet = function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        window.location ="/";
    }
}

let controller = new RestoreController();
document.addEventListener("DOMContentLoaded", function () {
    controller.initView();
});
window.controller = controller;


