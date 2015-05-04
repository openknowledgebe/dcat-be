$(function(){
    init();

    function init() {
        $('#live-example').hide();
        loadMeetings();
    }

    $( '.scroll' ).on('click', function(event) {
        event.preventDefault();
        var target = "#" + $(this).data('target');
        $('html, body').animate({
            scrollTop: $(target).offset().top - 80
        }, 700);
    });

    $( '.scrollTop' ).on('click', function(event) {
        event.preventDefault();
        $('body').animate({
            scrollTop: $('body').offset().top
        }, 700);
    });

    if(!Modernizr.svg) {
        $('img[src*="svg"]').attr('src', function() {
            return $(this).attr('src').replace('.svg', '.png');
        });
    }

    $( '.exampleDcat' ).on('click', function(event) {
        event.preventDefault();
        var that = $(this);
        that.next("i").removeClass("hidden");
        getExample(that);
    });

    function getExample(that) {
        var url = that.attr("href");
        $.ajax({
            url: url,
            error: function() {
                console.log('An error has occurred');
                that.next("i").addClass("hidden");
            },
            success: function(data) {
                showExample(data);
                $('#live-example-title').html(that.html());
                $('#live-example-footer a').attr('href', that.attr('href'));
                $('#live-example').show();
                that.next("i").addClass("hidden");
            },
            type: 'GET',
            cache: true
        });
    }

    function showExample(data) {
        var tar = $('#live-example-code p');
        tar.html('');
        var newData = data.split("\n");
        if(newData.length > 60) {
            for(i = 0; i < 60; i++) {
                var value = newData[i];
                value = value.replace(/</g,'&lt;');
                value = value.replace(/>/g,'&gt;');
                tar.append(value);
                tar.append('\n');
            }
        } else {
            $.each(newData, function(index, value) {
                value = value.replace(/</g,'&lt;');
                value = value.replace(/>/g,'&gt;');
                tar.append(value);
                tar.append('\n');
            });
        }
    }

    function loadMeetings() {
        $.ajax({
            url: 'meetings/meetings.json',
            error: function() {
                console.log('An error has occurred');
            },
            success: function(data) {
                parseMeetings(data);
            },
            type: 'GET',
            cache: false
        });
    }

    function parseMeetings(data) {
        var weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        $.each(data.upcoming, function(i, v) {
           // $("#upcoming-meeting");
            $("#upcoming-meeting-desc").html(v.description);
            var date = new Date(v.startDate);
            var enddate = new Date(v.endDate);
            var dateString = weekday[date.getDay()] + ', ' +
                date.getDate() + '/' + date.getMonth() +
                '/' + date.getFullYear() + ' - ' +
                date.getHours() + ':' + date.getMinutes() + ' - ' +
                enddate.getHours() + ':' + enddate.getMinutes();
            var t = $(
                '<a href="' + v.link + '" class="list-group-item">' +
                'Open Data in Belgium' +
                '<br>' + dateString +
                '<i class="fa fa-chevron-right arrow-right"></i></a>'
            );
            $("#upcoming-meeting").html(t);
        });

        $.each(data.past, function(i, v) {
            console.log("past");
        });


    }
});