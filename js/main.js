var boostrap = (function () {
    var module = {};
    var self = module;
    var listAutoComplete = [];

    module.init = function () {
        //Escondemos los bloques de información
        $('#block-detail').hide();
        // Cargamos una lista con todos los países
        $.get('https://restcountries.eu/rest/v2/all').done(function (data) {
            $.each(data, function (index, value) {
                listAutoComplete.push(data[index].name);

            });
            console.log(listAutoComplete);
        });

$( "#id-search" ).autocomplete({
      source: listAutoComplete
    });

    };

    return {
        init: module.init
    };

})();

var countryList = (function () {
    var module = {};
    var self = module;

    module.getData = function () {

        var div = $('list-country');
        var _button = '';
        var txtToSearch;

        if ($('#id-search')[0].value != "") {

            txtToSearch = 'https://restcountries.eu/rest/v2/name/' + $('#id-search')[0].value + '?fullText=false';
        } else {
            txtToSearch = 'https://restcountries.eu/rest/v2/all';
        }

        $.get(txtToSearch).done(function (data) {

            $('.list-country').empty();

            $.each(data, function (index, value) {
                _button = $('<button type="button" class="btn btn-primary" data-code="' + data[index].alpha2Code + '" > <img src="' + data[index].flag + '" width="30" > ' + data[index].name + '</button>');

                // Añadimos onclick al botón
                _button.on('click', function () {
                    showDetail(data[index].alpha2Code);
                });

                $('.list-country').append(_button);

            });


        }).fail(function (response) {
            $('.list-country').html("THERE IS NO RESULTS FOR YOUR SELECTION!! <br> <br> Error: " + response.status);
        });


    };

    return {
        getData: module.getData
    };

})();

function showDetail(_country) {



    // Pintamos el detalle del país
    $.get('https://restcountries.eu/rest/v2/alpha/' + _country).done(function (data) {
        var _flag = $('');
        $('#country-name').html(data.nativeName);
        $('#country-flag').attr('src', data.flag);
        // Pintamos nombre país y Capital
        $('#txt-name').html(data.name);
        $('#txt-capital').html(data.capital);
        // Pintamos Region y Population
        $('#txt-region').html(data.region);
        $('#txt-population').html(data.population);
        // Pintamos Area y Time-Zone
        $('#txt-area').html('<span class="span-time">' + data.area + ' m &#178 </span>');

        // We inform timezones, borders & languages

        informTimezones(data.timezones);
        informBorders(data.borders);
        informLanguages(data.languages);
    });

    $('#block-detail').show();
};

function informTimezones(_timezones) {

    var i;
    var _listTimeZones = '';
    var _length = _timezones.length;
    var num = 0;
    //    $('#ul-timezones').html('');

    for (i = 0; i < _length; i++) {


        //        $("#ul-timezones").append($("<li>").text(_timezones[i]));

        _listTimeZones += '<span class="span-time" >' + _timezones[i] + '</span>';


        $('#txt-timezones').html(_listTimeZones);
    }

}


function informLanguages(_languages) {

    var i;
    $('#ul-languages').html('');

    for (i = 0; i < _languages.length; i++) {
        $("#ul-languages").append($("<li>").text(_languages[i].name));
    }

}

function informBorders(_borders) {

    var i;
    var _country_border;
    $('#ul-borders').html('');

    for (i = 0; i < _borders.length; i++) {
        $.get('https://restcountries.eu/rest/v2/alpha/' + _borders[i]).done(function (data) {
            _country_border = (data.nativeName);
            $("#ul-borders").append($("<li>").text(_country_border));

        });

    }

}


function searchCountry() {
    countryList.getData();
}

function doSomething(element, e) {
    var charCode;

    charCode = e.which;
    if (charCode == 13) {
        countryList.getData();
    }
}

$(document).ready(function () {
    boostrap.init();
});
