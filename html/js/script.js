var resourceName = 'prp-notify'

var lastPlayedAudio = 0,
    audioCooldown = 5000;

var progressBarShowing = false;

window.addEventListener('message', function(event)
{
    if (event.data.request == "notification")
    {
        showNotification(event.data);
    }
    else if (event.data.request == "bar")
    {
        if (event.data.display == true)
        {
            $("#bar").html(event.data.text).show();
            $("#bar").show();
        }
        else
        {
            $("#bar").hide();
        }
    }
    else if (event.data.request == "closeProgressNotification")
    {
        $( ".notif .progress" ).each(function( index ) 
        {
            var notification = $(this).parent().parent();
            notification.removeClass('normal')
            notification.addClass('back');

            setTimeout(() =>
            {
                notification.remove();
            }, 1000);

        });
    }
    else if (event.data.request == "prompt")
    {
        if (event.data.display == true)
        {
            $("#prompt span").html(event.data.text)
            $("#prompt").show();
        }
        else
        {
            $("#prompt").hide();
        }
    }
    else if (event.data.request == "progress")
    {
        if (event.data.display == true)
        {
            if (!progressBarShowing)
            {
                progressBarShowing = true;
                $('#pbar_innerdiv').css("width", "0%");
                $('#pbar_innertext').text(event.data.text);
                $("#progress").show();
                $('#pbar_innerdiv').animate(
                {
                    "width": "100%"
                }, event.data.delay - 200, "linear", function()
                {
                    progressBarShowing = false;
                    $("#progress").fadeOut(200);
                });
            }
        }
        else
        {
            $("#progress").fadeOut(200);
            $('#pbar_innerdiv').stop();
            progressBarShowing = false;
        }
    }
    else if (event.data.request == "flash")
    {
        $("#flash").fadeIn(50).delay(550).fadeOut(500);
    }
});

var showNotification = (data) =>
{
    var icon;

    if (data.icon && data.icon.length !== 0)
        icon = "fas fa-" + data.icon;
    else if (data.type == 'success')
        icon = 'fas fa-check-circle';
    else if (data.type == 'error')
        icon = 'fas fa-exclamation-circle';
    else if (data.type == 'warning')
        icon = 'fas fa-exclamation-triangle';
    else
        icon = 'fas fa-info-circle';

    if (!data.title || data.title.length == 0)
        data.title = data.type;

    if (!data.message)
        return;

    data.message = data.message.replace(/\n/g, "<br>");
    data.delay = parseInt(data.delay);
    if (data.image)
    {
        if (data.image.substr(0, 4) == "car:")
        {
            var picture = getVehiclePicture(data.image.substr(4));
            if (picture)
            {
                data.image = picture;
            }
        }

        var elem = $(`
        <div class="wrapper">
            <div class="notif ${data.type} padding">
                    <div class="row header">
                        <div class="icon"><i class="${icon}"></i></div>
                        <div class="title">${data.title}</div>
                    </div>
                    <div class="row"><img src="${data.image}" width='100%'/></div>
                    <div class="row">${data.message}</div>
            </div>
        </div>`);
    }
    else
    {
        if (data.type == 'progress')
        {
            var elem = $(`
            <div class="wrapper">
                <div class="notif ${data.type}">
                    <div class="padding">
                        <div class="row header">
                            <div class="icon"><i class="${icon}"></i></div>
                            <div class="title">${data.title}</div>
                        </div>
                        <div class="row">${data.message}</div>
                    </div>
                    <div class="progress">
                        <div class="pbar_outerdiv">
                                <div class="pbar_innerdiv"></div>
                        </div>
                    </div>
                </div>
            </div>`);
        }
        else
        {
            var elem = $(`
            <div class="wrapper">
                <div class="notif ${data.type} padding">
                        <div class="row header">
                            <div class="icon"><i class="${icon}"></i></div>
                            <div class="title">${data.title}</div>
                        </div>
                        <div class="row">${data.message}</div>
                </div>
            </div>`);
        }
    }

    if (data.sticky == 1)
    {
        elem.addClass('sticky');
    }

    /* If a stickied element exists, insert above */
    if ($(".sticky").length && !data.sticky)
    {
        $(elem).insertAfter(".sticky:last");
    }
    else
    {
        $('.notifications').prepend(elem);

    }

    elem.addClass('normal');

    if (new Date().getTime() > (lastPlayedAudio + audioCooldown))
    {
        $("audio")[0].play();
        lastPlayedAudio = new Date().getTime();
    }


    if (data.blink)
    {
        // Make the notification blink.
        setTimeout(() =>
        {
            elem.find(".notif").css(
            {
                "background-color": "#8a1f1f"
            }).delay(750).queue(function(next)
            {
                $(this).css(
                {
                    "background-color": ""
                });
                next();
            });
        }, 650);

        setTimeout(() =>
        {
            elem.find(".notif").css(
            {
                "background-color": "#8a1f1f"
            }).delay(750).queue(function(next)
            {
                $(this).css(
                {
                    "background-color": ""
                });
                next();
            });
        }, 2250);
    }

    setTimeout(() =>
    {
        height = elem.height() + 30;

        elem.removeClass('normal')
        elem.addClass('back');

        /* Animate sliding down remaining notifications */
        if (elem.next(".wrapper").length)
        {
            elem.next(".wrapper").addClass("slidingDown").css(
            {
                marginTop: 0 - height,
            });
        }
    }, data.delay + 100);

    setTimeout(() =>
    {
        next = elem.next(".slidingDown");

        if (next.length)
        {
            next.removeClass("slidingDown");
        }

        elem.remove();

        if (next.length)
        {
            next.css(
            {
                marginTop: 0
            });
        }
    }, data.delay + 1000);

    if (data.type == 'progress')
    {
        elem.find(".pbar_innerdiv").animate(
        {
            "width": "0%"
        }, data.delay);
    }
}

$(function()
{
    $("audio")[0].volume = 0.2;

    $("#red").click(function()
    {
        $.post(`http://${resourceName}/promptResponse`, JSON.stringify(false));
    });

    $("#green").click(function()
    {
        $.post(`http://${resourceName}/promptResponse`, JSON.stringify(true));
    });

});

function getVehiclePicture(model)
{
    var data;

    jQuery.ajax(
    {
        url: "https://gta.now.sh/api/vehicles/" + model,
        success: function(html)
        {
            data = html;
        },
        async: false
    });

    if (data.images.frontQuarter)
    {
        return data.images.frontQuarter;
    }
}