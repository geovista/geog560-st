'use strict';

var $ = require('jquery'),
	L = require('leaflet');

require('torque.js');
require('bootstrap');

$(document).ready(function () {
	var CARTOCSS = [
	    'Map {',
	    '-torque-time-attribute: "datetime";',
	    '-torque-aggregation-function: "count(cartodb_id)";',
	    '-torque-frame-count: 760;',
	    '-torque-animation-duration: 15;',
	    '-torque-resolution: 2',
	    '}',
	    '#layer {',
	    '  marker-width: 3;',
	    '  marker-fill-opacity: 0.8;',
	    '  marker-fill: #FEE391; ',
	    '  comp-op: "lighten";',
	    '  [value > 2] { marker-fill: #FEC44F; }',
	    '  [value > 3] { marker-fill: #FE9929; }',
	    '  [value > 4] { marker-fill: #EC7014; }',
	    '  [value > 5] { marker-fill: #CC4C02; }',
	    '  [value > 6] { marker-fill: #993404; }',
	    '  [value > 7] { marker-fill: #662506; }',
	    '  [frame-offset = 1] { marker-width: 10; marker-fill-opacity: 0.05;}',
	    '  [frame-offset = 2] { marker-width: 15; marker-fill-opacity: 0.02;}',
	    '}'
	].join('\n');


	var map = new L.Map('map', {
	  zoomControl: true,
	  center: [0, 0],
	  zoom: 2
	});

	L.tileLayer('http://{s}.api.cartocdn.com/base-dark/{z}/{x}/{y}.png', {
	  attribution: 'CartoDB'
	}).addTo(map);

	var torqueLayer = new L.TorqueLayer({
	  user       : 'bwswedberg',
	  table      : 'last_500k',
	  cartocss: CARTOCSS
	});

	torqueLayer.on('change:time', function(changes) {
	  var datetime = changes.time.toString().substr(4).split(' ');
	  var timeElem = $('#time').text(datetime.slice(0, 4).join(' '));
	});

	$('#start-stop').click(function () {
	  torqueLayer.toggle();
	});

	torqueLayer.addTo(map);

	map.invalidateSize();

	torqueLayer.play();
});
