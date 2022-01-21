fx_version 'adamant'
game 'gta5'

author 'M. Loveless'
description 'ml_notify'
version '1.0'

client_scripts {
    'client/main.lua'
}

ui_page 'html/ui.html'

files {
    'html/ui.html',
    'html/css/style.css',
    'html/img/noise.png',
    'html/js/script.js',
    'html/sounds/pop.ogg'
}

exports {
    'DoShortHudText',
    'DoHudText',
    'DoLongHudText',
    'DoCustomHudText',
    'DoNewHudText',
    'DoNewHudTextBlink',
    'StartBar',
    'CloseBar',
    'StartProgress',
    'CloseProgress',
    'FlashScreen',
    'StartPrompt',
    'CloseProgressNotification'
}
