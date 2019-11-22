// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
//= require leaflet
//= require leaflet-geoman.min
//= require jquery.form
//= require decidim/navigation_maps/admin/map_editor
//= require_self

$(function() {

  var $maps = $('.navigation_maps.map');
  var $progress = $('.navigation_maps .progress');
  var $bar = $('.navigation_maps .progress-meter');
  var $loading = $('.navigation_maps .loading');
  var $callout = $('.navigation_maps .callout');
  var $form = $('form');
  var $tabs = $('#navigation_maps-tabs');
  var editors = {};

  $maps.each(function() {
    var table = document.getElementById("navigation_maps-table-" + $(this).data('id'));
    editors[$(this).data('id')] = new MapEditor(this, table);
  });

  $tabs.on('change.zf.tabs', function(e, $tab, $content) {
    var id = $content.find('.map').data('id');
    editors[id].reload();
  });

  $form.ajaxForm({
    url: $form.find('[name=action]').val(),
    beforeSerialize: function() {
      Object.keys(editors).forEach(function(key) {
        var editor = editors[key];
        $(`#blueprints_${editor.id}_blueprint`).val(JSON.stringify(editor.getBlueprint()));
      });
    },
    beforeSend: function() {
        var percentVal = '0%';
        $bar.width(percentVal).html(percentVal);
        $progress.show();
        $callout.hide();
        $callout.removeClass('alert success');
        $loading.show();
    },
    uploadProgress: function(event, position, total, percentComplete) {
        var percentVal = percentComplete + '%';
        $bar.width(percentVal).html(percentVal);
    },
    success: function(responseText, statusText, xhr, $form) {
        $callout.show();
        $progress.hide();
        $callout.contents('p').html(responseText);
        $callout.addClass('success');
        $loading.hide();
        $form.find('input[type=file]').each(function() {
          if($(this).val()) {
            $loading.show();
            location.reload();
            return false;
          }
        });
    },
    error: function(xhr) {
      $loading.hide();
      $callout.show();
      $callout.contents('p').html(xhr.responseText);
      $callout.addClass('alert');
    }
  });
});