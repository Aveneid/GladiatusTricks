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

var gladiatusTricks =  (function() {
	'use strict';

	var config ={
		GT_removeBanner: false,
		GT_getGold: false,
		GT_set24H: false
	};

	var htmlMenu = "<div class='menuMain'><span class='menuOpen'>Gladiatus Tricks Menu</span><div id='menuDrop' class='menuBackground' style='display: none;'><ul><li>Remove banner <div class='menuButton menuButtonGreen' id='GT_removeBanner'>On<div><li> <li>Get gold form packages  <div class='menuButton menuButtonGreen' id='GT_getGold' >On<div><li> <li>Set listing for 24H <div class='menuButton menuButtonGreen' id='GT_set24H'>On<div><li> </ul><span style='width: auto;' class='menuButton' id='GT_info'>Gladiatus Tricks by Aveneid</span></div></div>";

	function createWindow(){
		//create menu window
		$("head").append("<style>"+GM_getResourceText("css")+"</style>");
		$("body").append(htmlMenu);
		$('.menuOpen').click(function () {
			$('#menuDrop').slideToggle("fast","swing");
		});


		$("#GT_getGold").click(function(){
			setCfg("getGold");
		});
		$("#GT_removeBanner").click(function(){
			setCfg("removeBanner");
		});
		$("#GT_set24H").click(function(){
			setCfg("set24H");
		});
	}


	//helpers
	localStorage.setItem("GT_gladiatusTricks",true);
	function loadCfg(){

		if(castToBool(localStorage.getItem("GT_gladiatusTricks"))==true){
			//load config from localStorage
			debugger;
			Object.keys(localStorage).forEach(function(keys){ if(keys.substring(0,3)=="GT_") config[keys]=castToBool(localStorage[keys]); });
			debugger;
			Object.keys(config).forEach(function(keys){
				console.log(keys +":"+ config[keys]);
				if(castToBool(config[keys])==true){
					$("div#"+keys).removeClass("menuButtonGreen");
					$("div#"+keys).addClass("menuButtonRed");
					$("div#"+keys).text("Off");
				}});
		}

	}
	function saveCfg(){
		//save config to local localStorage
		Object.keys(config).forEach(function(key){localStorage.setItem(key,config[key]);})
	}
	function castToBool(data){ return (data=="true" || data=="True" || data==true)?true:false;}

	function setCfg(data){
		//set config depending on option
		data = "GT_"+data;
		config[data]=!config[data];

		switch(data){
			case "GT_removeBanner":
				console.log("Setting "+data+" to :"+config[data]);
				if(config[data]){
					$("div#GT_removeBanner").removeClass("menuButtonGreen");$("div#GT_removeBanner").addClass("menuButtonRed");$("div#GT_removeBanner").text("Off");
				}else{
					$("div#GT_removeBanner").removeClass("menuButtonRed");$("div#GT_removeBanner").addClass("menuButtonGreen");$("div#GT_removeBanner").text("On")
				}
				break;

			case "GT_getGold":
				console.log("Setting gold to :"+config[data]);
				if(config[data]){
					$("div#GT_getGold").removeClass("menuButtonGreen");$("div#GT_getGold").addClass("menuButtonRed");$("div#GT_getGold").text("Off");
				}else{
					$("div#GT_getGold").removeClass("menuButtonRed");$("div#GT_getGold").addClass("menuButtonGreen");$("div#GT_getGold").text("On");
				}
				break;

			case "GT_set24H":
				console.log("Setting listing to :"+config[data]);
				if(config[data]){
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
			if(config.GT_set24H)
				document.querySelector("#dauer").value = 3;
		}
		//removes banner
		if(config.GT_removeBanner){
			$("#banner_top").css("display","none");
			$("#banner_event").css("display","none");
			$("#banner_event_link").css("display","none");
			$("#cooldown_bar_event").css("display","none");
		}
		if(window.location.href.contains("mod=packages")){
			//collect all gold from packages
			if(config.GT_getGold)
				if($("div.item-i-14-1").length > 0){
					var total = 0;
					setInterval(function(){
					$("div.item-i-14-1").each(function(){
						gca_tools.item.move(this,"inv");
						total += $(this).attr("data-price-gold").attr("data-price-gold").toInt();
					});},500);
					createNotification("Gladiatus Tools \n Gold collected, total: "+ total,"success");
				}
		}

	});
})();
