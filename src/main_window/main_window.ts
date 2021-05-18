import * as fs from 'fs';
import io from '../Utils/iosys';
import $ from 'jquery';
import "@popperjs/core";
import "bootstrap";
// import "../js/popper.min";
import { DashboardController } from './Controller/DashBoardController';
import { DashboardView } from './View/DashboardView';
import { DashboardModel } from './Model/DashboardModel';
import { ipcRenderer } from 'electron';
import { remote } from 'electron';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import Handlebars from 'handlebars';

declare var functionAnimate: (element: any) => void;
const win = remote.getCurrentWindow();
io.init();

Handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});
$(document).ready(async () => {
    const firebaseConfig = io.getJsonData("firebase_config");
    await firebase.initializeApp(firebaseConfig);
    firebase.firestore().enablePersistence()
        .catch((err) => {
            if (err.code == 'failed-precondition') {
                // Multiple tabs open, persistence can only be enabled
                // in one tab at a a time.
                // ...
            } else if (err.code == 'unimplemented') {
                // The current browser does not support all of the
                // features required to enable persistence
                // ...
            }
        });

    let is_logged = true;
    let user: firebase.User;
    try {
        user = await new Promise<firebase.User>((resolve, reject) => {
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    console.log("MainWindow: ")
                    console.log(user)
                    resolve(user)
                }
                else {
                    reject("User Null Though Logged In");
                    is_logged = false;
                }
            });
        })
    } catch (e) {
        console.error(e);
    }
    console.log("Firebase is available");
    let mvc: DashboardController = new DashboardController(new DashboardModel(user), new DashboardView());
    $('.dashboard-lists').scroll(function () {
        var scrollTop = $('.dashboard-lists').scrollTop();


        $('.list-header').css({
            opacity: function () {
                var elementHeight = $('.koyoheader').height(),
                    opacity = ((1 - (elementHeight - scrollTop) / elementHeight) * 0.8);
                return opacity;
            }
        });

        // if (scrollTop > 10) {
        //     $('.list-header').fadeOut(1000);
        // }
    });
    $(".list-group-item").click((event: any) => {
        for (let element of $(".list-group-item")) {
            console.log(element)
            if (element.className.includes("active")) {
                element.classList.toggle("active")
            }
        };
        event.currentTarget.classList.toggle("active");
    })

    // $(".test-hide").click((event: any) => {
    //     $(".title1").css("word-wrap: initial,word-break: initial")
    //     console.log($(".title1"))
    //     collapseSection($(".title1")[0])
    //     $(".title1")[0].animate({
    //         opacity: 0
    //     }, 300)
    //     window.setTimeout(() => {
    //         $(".title1").remove();
    //     }, 300)
    // })

    $(".log-out").click((event: any) => {
        firebase.auth().signOut().then(function () {
            ipcRenderer.send("logged-out");
        })
    })

    $(".more-button").click((event: any) => {
        if ($(".modal").css("display") == "none") {
            $(".modal").css("display", "block");
            $(".task-menu").css("display", "block");
            let tempSave = (event: any) => {
                if (event.target.className.includes("modal")) {
                    $(".task-menu").hide(200, () => {
                        $(".task-menu").css("display", "none")
                        $(".modal").css("display", "none")
                    })

                }
            }
            window.addEventListener("click", tempSave)
        }
    })

    function collapseSection(element: any) {
        // get the height of the element's inner content, regardless of its actual size
        var sectionHeight = element.scrollHeight;

        // temporarily disable all css transitions
        var elementTransition = element.style.transition;
        element.style.transition = '';

        // on the next frame (as soon as the previous style change has taken effect),
        // explicitly set the element's height to its current pixel height, so we 
        // aren't transitioning out of 'auto'
        requestAnimationFrame(function () {
            element.style.height = sectionHeight + 'px';
            element.style.transition = elementTransition;

            // on the next frame (as soon as the previous style change has taken effect),
            // have the element transition to height: 0
            requestAnimationFrame(function () {
                element.style.height = 0 + 'px';
            });
        });

        // mark the section as "currently collapsed"
        element.setAttribute('data-collapsed', 'true');
    }

    window.addEventListener('contextmenu', (e) => {
        e.preventDefault()
        ipcRenderer.send('show-context-menu')
    })

})
