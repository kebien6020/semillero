(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

var $ = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

$('.success-panel, .error-panel').addClass('alert fade in');
$().alert();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
(function (global){
'use strict';

require('./app.js');

var _jquery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// DOM Elements
var $form = void 0,
    // Main form
$nameInput = void 0,
    $plusButton = void 0,
    $minusButton = void 0; // Table title input

// Module globals
// editing mode (true -> editing, false -> creating a new sample_group)
var currentRow = 1;

function init() {
    cacheDom();
    var edit_mode = $form.data('edit');;
    setupForm(edit_mode);
    bindHandlers();
}

function cacheDom() {
    $form = (0, _jquery2.default)('#the_form');
    $nameInput = $form.find('input[name="name"]');
    $plusButton = (0, _jquery2.default)('.plus-button');
    $minusButton = (0, _jquery2.default)('.minus-button');
}

function setupForm(edit_mode) {
    if (edit_mode) {
        getPreviousData().then(writeInForm, handleError);
    } else {
        for (var i = 0; i < 10; ++i) {
            addRow();
        }
    }
}

function getPreviousData() {
    var id = $form.data('sampleGroupId');
    return _jquery2.default.getJSON('/api/arenas/sample_group/' + id);
}

function writeInForm(sample_group) {
    $nameInput.val(sample_group.name);
    // Hide empty row (comes with the html)
    hideRow();
    sample_group.samples.forEach(addRow);
}

function addRow(sample) {
    var grain_size = void 0,
        frequency = void 0;
    if (sample === undefined) {
        grain_size = frequency = '';
    } else {
        grain_size = sample.grain_size;
        frequency = sample.frequency;
    }
    // Create new DOM Elements
    var $tr = (0, _jquery2.default)('<tr>');
    var $td_left = (0, _jquery2.default)('<td>');
    var $td_right = (0, _jquery2.default)('<td>');
    // Create by cloning existent
    var $input_size = (0, _jquery2.default)('[name="grain-size-' + currentRow + '"]').clone();
    var $input_frequency = (0, _jquery2.default)('[name="frequency-' + currentRow + '"]').clone();

    ++currentRow;
    $input_size.attr('name', 'grain-size-' + currentRow).val(grain_size);
    $input_frequency.attr('name', 'frequency-' + currentRow).val(frequency);

    $td_left.append($input_size);
    $td_right.append($input_frequency);
    $tr.append($td_left, $td_right);

    // Append the newly created row before the button row
    var $last_tr = (0, _jquery2.default)('#the_form .button-row');
    $last_tr.before($tr);
}

function hideRow() {
    var $last_row = getLastRow();
    // Empty row before hiding
    $last_row.find('input').val('');

    $last_row.hide();
}

function getLastRow() {
    // Get button row...
    var $last_row = (0, _jquery2.default)('#the_form .button-row');

    // And go back until there is a column which is not hidden
    do {
        $last_row = $last_row.prev();
    } while ($last_row.is(':hidden') && $last_row.is('tr'));

    return $last_row;
}

function bindHandlers() {
    $plusButton.click(addRow);
    $minusButton.click(hideRow);
}

function handleError() {
    // TODO: handle error properly
    alert('Error obteniendo los valores previos de la muestra');
}

init();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./app.js":1}]},{},[2]);

//# sourceMappingURL=arenas_matrix_edit.js.map
