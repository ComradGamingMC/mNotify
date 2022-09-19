local PromptResponse = nil

RegisterNetEvent('mNotify:sendMessage')
AddEventHandler('mNotify:sendMessage', function(data)
	DoCustomHudText(data.type, data.message, data.delay)
end)

RegisterNetEvent('mNotify:client:SendAlert')
AddEventHandler('ml_notify:client:SendAlert', function(data)
		DoHudText(data.type, data.text)
end)
RegisterNetEvent('mNotify:client:SendAlert:long')
AddEventHandler('mNotify:client:SendAlert:long', function(data)
		DoLongHudText(data.type, data.text)
end)
RegisterNetEvent('mNotify:client:SendAlert:custom')
AddEventHandler('mNotify:client:SendAlert:custom', function(data)
		DoCustomHudText(data.type, data.text, data.length)
end)

RegisterNetEvent('mNotify:client:SendAlert:new')
AddEventHandler('mNotify:client:SendAlert:new', function(data)
		DoNewHudText(data.type, data.text, data.length, data.img, data.sticky, data.title, data.icon)
end)

RegisterNetEvent('mNotify:client:SendAlert:DoNewHudTextBlink')
AddEventHandler('mNotify:client:SendAlert:DoNewHudTextBlink', function(data)
	DoNewHudTextBlink(data.type, data.text, data.length, data.img, data.sticky, data.title, data.icon)
end)

RegisterNUICallback('notification', function(data)
	DoNewHudText(data.type, data.message, data.timeout, false, data.sticky, data.title, data.icon)
end)

RegisterNetEvent('tab:closeUI')
AddEventHandler('tab:closeUI', function()
	SendNUIMessage({
		request = "bar",
		display = false
	})
	ClosePrompt()
end)

function DoShortHudText(type, message)
	SendNUIMessage({
		request = "notification",
		type = type,
		delay = 1000,
		message = message,
	})
end

function DoHudText(type, message)
	SendNUIMessage({
		request = "notification",
		type = type,
		delay = 2500,
		message = message
	})
end

function DoLongHudText(type, message)
	SendNUIMessage({
		request = "notification",
		type = type,
		delay = 5000,
		message = message
	})
end

function DoCustomHudText(type, message, length)
	SendNUIMessage({
		request = "notification",
		type = type,
		message = message,
		delay = length
	})
end

function DoNewHudText(type, message, length, img, sticky, title, icon)
	SendNUIMessage({
		request = "notification",
		type = type,
		message = message,
		delay = length,
		image = img,
		sticky = sticky,
		title = title,
		icon = icon
	})
end

function DoNewHudTextBlink(type, message, length, img, sticky, title, icon)
	SendNUIMessage({
		request = "notification",
		type = type,
		message = message,
		delay = length,
		image = img,
		sticky = sticky,
		title = title,
		icon = icon,
		blink = true
	})
end

function StartBar(displayText)
	SendNUIMessage({
	  request = "bar",
	  display = true,
	  text = displayText
	})
end

function CloseBar()
	SendNUIMessage({
		request = "bar",
		display = false
	})
end


function StartProgress(time, text) 
	SendNUIMessage({
		request = "progress",
		display = true,
		text = text,
		delay = time,
	})
end


function CloseProgress() 
	SendNUIMessage({
		request = "progress",
		display = false
	})
end

function FlashScreen() 
	SendNUIMessage({
		request = "flash",
		display = true,
	})
end



exports('StartPrompt', function(text, cb) 
	PromptResponse = nil
	SetNuiFocus(true, true)
	SendNUIMessage({
		request = "prompt",
		display = true,
		text = text
	})

	while PromptResponse == nil do
		Citizen.Wait(10)
	end

	cb(PromptResponse)
end)

function ClosePrompt() 
	SetNuiFocus(false, false)
	SendNUIMessage({
		request = "prompt",
		display = false
	})
end

function CloseProgressNotification() 
	SendNUIMessage({
		request = "closeProgressNotification",
	})
end

RegisterNUICallback('promptResponse', function(data)
	PromptResponse = data
	ClosePrompt()
end)


RegisterCommand('flash', function()
	exports['mNotify']:DoLongHudText('progress', 'Test Notification')
	exports['mNotify']:DoLongHudText('info', 'Test Notification')
	exports['mNotify']:DoNewHudText('progress', 'Drinking Milkshake', 10000, false, false, "Drinking Milkshake", "glass-whiskey")
	exports['mNotify']:DoLongHudText('success', 'Test Notification')
	exports['mNotify']:DoLongHudText('warning', 'Test Notification')
	Wait(6000)
	CloseProgressNotification()
end)
