$(function(){

    var weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    init();

    function init() {
        $('#live-example').hide();
        loadMeetings();
    }

    $('.scroll').on('click', function(event) {
        event.preventDefault();
        var target = "#" + $(this).data('target');
        var offs = $(target).offset().top;

        $('html, body').animate({
            scrollTop: offs
        }, 700);
    });

    $( '.scrollTop' ).on('click', function(event) {
        event.preventDefault();
        $('body').animate({
            scrollTop: $('body').offset().top
        }, 700);
    });

    var stickyNavTop = $('#nav').offset().top;

    var stickyNav = function(){
        var scrollTop = $(window).scrollTop();

        if (scrollTop > stickyNavTop) {
            $('#nav').addClass('sticky');
        } else {
            $('#nav').removeClass('sticky');
        }
    };

    stickyNav();

    $(window).scroll(function() {
        stickyNav();
    });

    if(!Modernizr.svg) {
        $('img[src*="svg"]').attr('src', function() {
            return $(this).attr('src').replace('.svg', '.png');
        });
    }

    $('.exampleDcat').on('click', function(event) {
        event.preventDefault();
        var that = $(this);
        that.next('i').removeClass('hidden');
        getExample(that);
    });

    function getExample(that) {
        var url = that.attr('href');
        $.ajax({
            url: url,
            error: function() {
                console.log('An error has occurred');
                that.next('i').addClass('hidden');
            },
            success: function(data) {
                showExample(data);
                $('#live-example-title').html(that.html());
                $('#live-example-footer a').attr('href', that.attr('href'));
                $('#live-example').show();
                that.next('i').addClass('hidden');
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
            url: 'meetings.json',
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

        $.each(data.upcoming, function(i, v) {

            if(v.description && v.description.length > 0) {
                $('#upcoming-meeting-desc').html(v.description);
            } else {
                $('#upcoming-meeting-desc').html('');
            }

            if(!v.startDate || !v.name || !v.link) {
                $('#upcoming-meeting').html('');
                $('#upcoming-meeting-desc').html('Currently there are no meetings planned in the near future.');
            } else {
                var t = parseMeeting(v);
                $('#upcoming-meeting').html(t);
            }
        });

        $.each(data.past, function(i, v) {
            var t = parseMeeting(v);
            $('#past-meetings').append(t);
        });
    }

    function parseMeeting(m) {
        var meeting;

        var date = new Date(m.startDate);
        var enddate = new Date(m.endDate);

        var minutes = ('0'+date.getMinutes()).slice(-2);
        var endMinutes = ('0'+enddate.getMinutes()).slice(-2);
        var day = ('0'+date.getDate()).slice(-2);
        var month = ('0'+(date.getMonth()+1)).slice(-2);
        var hours = ('0'+date.getHours()).slice(-2);
        var endHours = ('0'+enddate.getHours()).slice(-2);

        var dateString = weekday[date.getDay()] + ', ' +
            day + '/' + month +
            '/' + date.getFullYear() + ' - ' +
            hours + ':' + minutes + ' - ' +
            endHours + ':' + endMinutes;

        meeting = $(
            '<a href="' + m.link + '" class="list-group-item">' +
            m.name +
            '<br>' + dateString +
            '<i class="fa fa-chevron-right arrow-right"></i></a>'
        );

        return meeting;
    }
});