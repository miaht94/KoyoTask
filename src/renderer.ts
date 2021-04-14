import * as fs from 'fs';
import io from './utils/iosys';
import $ from './js/jquery';
import "@popperjs/core";
import "./js/bootstrap.min";
// import './js/jquery-ui';
import { DashboardController } from './Controller/DashBoardController';
import { DashboardView } from './View/DashboardView';
import { DashboardModel } from './Model/DashboardModel';
import { ipcRenderer } from 'electron';

$(document).ready(() => {
  io.init();
  console.log(io.getData("list_data"));
  // let a = new DashboardView();
  console.log("ready");
  // $("html").append(html);
  // $("#tabs").tabs();
  let a: DashboardController = new DashboardController(new DashboardModel(), new DashboardView());
  ipcRenderer.on("Receive root path", (event, message) => {
    console.log(message);
  });

  $('.dashboard-lists').scroll(function () {
    var scrollTop = $('.dashboard-lists').scrollTop();
    console.log('scroll-top: ' + scrollTop);

    $('.list-header').css({
      opacity: function () {
        var elementHeight = $('.koyoheader').height(),
          opacity = ((1 - (elementHeight - scrollTop) / elementHeight) * 0.8);
        console.log(elementHeight);
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

  $(".test-hide").click((event: any) => {
    $(".title1").css("word-wrap: initial,word-break: initial")
    console.log($(".title1"))
    collapseSection($(".title1")[0])
    $(".title1")[0].animate({
      opacity: 0
    }, 300)
    window.setTimeout(() => {
      $(".title1").remove();
    }, 300)
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

  ipcRenderer.on('context-menu-command', (e, command) => {
    // ...
  })
})