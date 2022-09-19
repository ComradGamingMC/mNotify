fx_version 'cerulean'
game { 'gta5' }

name 'mNotify'
author 'Mathew Loveless <mloveless7@yahoo.com> (https://github.com/ComradGamingMC/)'
description 'Simple Notify Script used for mScripts'
Version '1.1'
url 'https://github.com/ComradGamingMC/mNotify'

client_scripts {
    'client/main.lua',
    'client/version_checker.lua'
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
