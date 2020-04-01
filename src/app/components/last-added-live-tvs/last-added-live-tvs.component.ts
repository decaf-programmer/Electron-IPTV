import { Component, OnInit, Input } from '@angular/core';
import { Card } from '../../models';
import jQuery from 'jquery';
import jQueryBridget from 'jquery-bridget';
import Flickity from 'flickity';
import { ShareService } from '../../services/share.service';

declare var $: any;
@Component({
  selector: 'app-last-added-live-tvs',
  templateUrl: './last-added-live-tvs.component.html',
  styleUrls: ['./last-added-live-tvs.component.css']
})
export class LastAddedLiveTVsComponent implements OnInit {

  @Input() cards: Card[];
  @Input() slider_title: string;
  sliderTitlePosX: number;
  subscription: any;
  constructor(private shareService: ShareService) { }

  ngOnInit(): void {
    (function ($) {
      $(document).ready(
        function () {
          Flickity.setJQuery($);
          jQueryBridget('flickity', Flickity, $);

          var $imagesCarousel = $('#last_livetvs .carouselOfImages').flickity({
            contain: true,
            autoplay: false,
            wrapAround: true,
            friction: 0.2,
            pageDots: false
          });
          function resizeCells() {
            var flkty = $imagesCarousel.data('flickity');
            var $current = flkty.selectedIndex;
            var $length = flkty.cells.length;
            if ($length <= '3') {
              $imagesCarousel.flickity('destroy');
            }
            $('#last_livetvs .carouselOfImages .carouselImage').removeClass("nextToSelected");
            $('#last_livetvs .carouselOfImages .carouselImage').eq($current - 1).addClass("nextToSelected");
            if ($current + 1 == $length) {
              var $endCell = "0"
            } else {
              var $endCell_num = $current + 1;
              var $endCell: string = $endCell_num.toString();
            }
            $('#last_livetvs .carouselOfImages .carouselImage').eq($endCell).addClass("nextToSelected");
          };
          resizeCells();
          $imagesCarousel.on('scroll.flickity', function () {
            resizeCells();
          });
          $("#last_livetvs .carouselImage img").click(function () {
            var $this = $(this);
            var imageID = $this.attr('data-tab');
            var imageSrc = $this.attr('src');

            $('.' + imageID).removeClass('hide');
            $('.' + imageID + ' .product-detail-image img').attr('src', imageSrc);
          });
          $('.product-detail-close,.product-detail').on('click', function () {
            $('.product-detail').addClass('hide');
          });
          $('.modal-video').on('hidden.bs.modal', function (e) {
            $('.modal-video iframe').attr('src', $('.modal-video iframe').attr('src'));
          });

          autoPlayYouTubeModal();
          function autoPlayYouTubeModal() {
            var trigger = $("body").find('[data-the-video]');
            trigger.click(function () {
              var theModal = $(this).data("target"),
                videoSRC = $(this).attr("data-the-video"),
                videoSRCauto = videoSRC + "&autoplay=1";
              $(theModal + ' iframe').attr('src', videoSRCauto);
              $(theModal + ' button.close').click(function () {
                $(theModal + ' iframe').attr('src', videoSRC);
              });
              $('.modal-video').click(function () {
                $(theModal + ' iframe').attr('src', videoSRC);
              });
            });
          }
          $(window).on('load resize', function () {
            var $window = $(window);
            $('.modal-fill-vert .modal-body > *').height(function () {
              return $window.height() - 60;
            });
          });
        }
      );

    })(jQuery);

    this.subscription = this.shareService.getEmittedPosX().subscribe((sidebarPosX) => {
      this.sliderTitlePosX = sidebarPosX + 10
    })
  }
  setSliderTitlePosX() {
    const styles = { 'margin-left': this.sliderTitlePosX + 'px' };
    return styles;
  }
}