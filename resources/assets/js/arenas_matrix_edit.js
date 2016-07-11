import './app.js';
import $ from 'jquery';

// DOM Elements
let $form,      // Main form
    $nameInput,
    $plusButton,
    $minusButton; // Table title input

// Module globals
// editing mode (true -> editing, false -> creating a new sample_group)
let currentRow = 1;

function init() {
    cacheDom();
    const edit_mode = $form.data('edit');;
    setupForm(edit_mode);
    bindHandlers();
}

function cacheDom() {
    $form = $('#the_form');
    $nameInput = $form.find('input[name="name"]');
    $plusButton = $('.plus-button');
    $minusButton = $('.minus-button');
}

function setupForm(edit_mode) {
    if (edit_mode) {
        getPreviousData()
            .then(writeInForm, handleError);
    } else {
        for (let i = 0; i < 10; ++i)
            addRow();
    }
}

function getPreviousData() {
    const id = $form.data('sampleGroupId');
    return $.getJSON(`/api/arenas/sample_group/${id}`);
}

function writeInForm(sample_group) {
    $nameInput.val(sample_group.name);
    // Hide empty row (comes with the html)
    hideRow();
    sample_group.samples.forEach(addRow);
}

function addRow(sample) {
    let grain_size, frequency;
    if (sample === undefined) {
        grain_size = frequency = '';
    } else {
        grain_size = sample.grain_size;
        frequency = sample.frequency;
    }
    // Create new DOM Elements
    const $tr = $('<tr>');
    const $td_left = $('<td>');
    const $td_right = $('<td>');
    // Create by cloning existent
    const $input_size = 
        $('[name="grain-size-' + currentRow + '"]').clone();
    const $input_frequency = 
        $('[name="frequency-' + currentRow + '"]').clone();

    ++currentRow;
    $input_size
        .attr('name', 'grain-size-' + currentRow)
        .val(grain_size);
    $input_frequency
        .attr('name', 'frequency-' + currentRow)
        .val(frequency);

    $td_left.append($input_size);
    $td_right.append($input_frequency);
    $tr.append($td_left, $td_right);
    
    // Append the newly created row before the button row
    const $last_tr = $('#the_form .button-row');
    $last_tr.before($tr);
}

function hideRow() {
    const $last_row = getLastRow();
    // Empty row before hiding
    $last_row.find('input').val('');

    $last_row.hide();
}

function getLastRow() {
    // Get button row...
    let $last_row = $('#the_form .button-row');

    // And go back until there is a column which is not hidden
    do {
        $last_row = $last_row.prev();
    } while ($last_row.is(':hidden') && $last_row.is('tr'))

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