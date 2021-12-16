// ==UserScript==
// @name         Gladiatus Tricks
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Gladiatus script with small game improvements
// @author       Aveneid
// @match        *://*.gladiatus.gameforge.com/game/index.php*
// @icon         https://www.google.com/s2/favicons?domain=gameforge.com
// @downloadURL  https://raw.githubusercontent.com/Aveneid/GladiatusTricks/main/gladiatusTricks.js
// @updateURL    https://raw.githubusercontent.com/Aveneid/GladiatusTricks/main/gladiatusTricks.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @license 	 MIT
// @resource	 css https://raw.githubusercontent.com/Aveneid/GladiatusTricks/main/css.css

// ==/UserScript==

(function() {
	'use strict';

	var storage = window.localStorage;
	var config ={
		GT_removeBanner: false,
		GT_getGold: false,
		GT_set24H: false
	};

	var htmlMenu = "<div class='menuMain'><span class='menuOpen'>Gladiatus Tricks Menu</span><div id='menuDrop' class='menuBackground' style='display: none;'><ul><li>Remove banner <div class='menuButton menuButtonGreen' id='GT_removeBanner'>On<div><li> <li>Get gold form packages  <div class='menuButton menuButtonGreen' id='GT_gold' >On<div><li> <li>Set listing for 24H <div class='menuButton menuButtonGreen' id='GT_set24H'>On<div><li> </ul><span style='width: auto;' class='menuButton' id='GT_info'>Gladiatus Tricks by Aveneid</span></div></div>";

	function createWindow(){
		//create menu window
		$("head").append("<style>"+GM_getResourceText("css")+"</style>");
		$("body").append(htmlMenu);
		$('.menuOpen').click(function () {
			$('#menuDrop').slideToggle("fast","swing");
		});


		$("#GT_gold").click(function(){
			setCfg("gold");
		});
		$("#GT_removeBanner").click(function(){
			setCfg("removeBanner");
		});
		$("#GT_set24H").click(function(){
			setCfg("set24H");
		});
	}


	//helpers
	function loadCfg(){
		if(storage.getItem("GT_gladiatusTricks")){
			//load config from localStorage
			Object.keys(storage).forEach(function(keys){if(keys.substring(0,3)=="GT_") config[keys]=storage[keys];})
			Object.keys(config).forEach(function(keys){if(config[keys]==true){ $("div#"+keys).removeClass("menuButtonGreen");$("div#"+keys).addClass("menuButtonRed");$("div#GT_removeBanner").text("Off");}});
		}
	}
	function saveCfg(){
		//save config to local storage
		Object.keys(config).forEach(function(key){storage.setItem(key,config[key]);})
		storage.setItem("GT_gladiatusTricks",true);
	}

	function setCfg(data){
		//set config depending on option
		data = "GT_"+data;
		switch(data){
			case "GT_removeBanner":
				config[data]=!config[data];

				console.log("Setting banner to :"+config[data]);
				if(!config[data]){
					$("div#GT_removeBanner").removeClass("menuButtonGreen");$("div#GT_removeBanner").addClass("menuButtonRed");$("div#GT_removeBanner").text("Off");
				}else{
					$("div#GT_removeBanner").removeClass("menuButtonRed");$("div#GT_removeBanner").addClass("menuButtonGreen");$("div#GT_removeBanner").text("On")
				}
				break;

			case "GT_gold":
				config[data]=!config[data];

				console.log("Setting gold to :"+config[data]);
				if(!config[data]){
					$("div#GT_gold").removeClass("menuButtonGreen");$("div#GT_gold").addClass("menuButtonRed");$("div#GT_gold").text("Off");
				}else{
					$("div#GT_gold").removeClass("menuButtonRed");$("div#GT_gold").addClass("menuButtonGreen");$("div#GT_gold").text("On");
				}
				break;

			case "GT_set24H":
				config[data]=!config[data];

				console.log("Setting listing to :"+config[data]);
				if(!config[data]){
					$("div#GT_set24H").removeClass("menuButtonGreen");$("div#GT_set24H").addClass("menuButtonRed");$("div#GT_set24H").text("Off");
				}else{
					$("div#GT_set24H").removeClass("menuButtonRed");$("div#GT_set24H").addClass("menuButtonGreen");$("div#GT_set24H").text("On");
				}
				break;
		}
		saveCfg();
	}


	function getElementByXpath(path) {
		return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	}
	function createNotification(text,type){
		switch(type){
			case "normal":
				gca_notifications.normal(text);
				break;
			case "success":
				gca_notifications.success(text);
				break;
			case "error":
				gca_notifications.error(text);
				break;
			case "info":
				gca_notifications.info(text);
				break;
			case "warning":
				gca_notifications.warning(text);
				break;
		}
	}

	//main
	$( document ).ready(function() {
		createWindow();
		loadCfg();
		saveCfg();

		if(window.location.href.contains("mod=market")){
			if(config.GT_set24H == true)
				document.querySelector("#dauer").value = 3;
		}
		//removes banner
		if(config.GT_removeBanner == true){
			$("#banner_top").css("display","none");
			$("#banner_event").css("display","none");
			$("#banner_event_link").css("display","none");
			$("#cooldown_bar_event").css("display","none");
		}
		if(window.location.href.contains("mod=packages")){
			//collect all gold from packages
			if(config.GT_getGold == true)
				if($("div.item-i-14-1").length > 0){
					var total = 0;
					$("div.item-i-14-1").each(function(){
						gca_tools.item.move(this,"inv");
						total += $(this).attr("data-price-gold").attr("data-price-gold").toInt();
					});
					createNotification("Gladiatus Tools \n Gold collected, total: "+ total,"success");
				}
		}

	});
})();
