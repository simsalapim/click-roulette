$(document).ready(function() {
	var firstTimeIconClicked=true;
	var iconClicked; //If the extension icon has been clicked
	var randomNumber; //How many times the user has to click a link before it fires
	var timesClicked; //How many times links have been clicked
	var clickedAudio; //Sound to play when a link gets clicked and it fires
	var notClickedAudio; //Sound to play when a link gets clicked and it doesn't fire
	var x;//coordinates
	var y;//coordinates
	var goTo; //href of clicked link

	chrome.runtime.onMessage.addListener(function(message, sender) { //Receive information that the icon has been clicked from Background.js. If message=true the roulette has been started
		iconClicked=message; 
		randomNumber=Math.floor(Math.random() * 7) + 1
		timesClicked=0;
		
		if(firstTimeIconClicked){
			$("head").append("<link href='https://fonts.googleapis.com/css?family=Press+Start+2P' rel='stylesheet' type='text/css'>"); //Load font for "BOOOM" text
			$("body").append("<p class='boom'>BOOOM!</p>"); //Append the "BOOOM" text. It's hidden until a link has been clicked.
		    
		    //Load audio
		    clickedAudio = document.createElement('audio');
		    clickedAudio.setAttribute('src', 'http://www.freesound.org/data/previews/205/205013_3389063-lq.mp3');
		    
		    notClickedAudio = document.createElement('audio');
		    notClickedAudio.setAttribute('src', 'http://www.freesound.org/data/previews/154/154934_2575945-lq.mp3');
			$.get();

			firstTimeIconClicked=false; //Set the variable firstTimeIconClicked to false so that this if statement only gets run once
		}

		//Change the cursors according to if the roulette is started or not
		if(iconClicked){
			$("*").removeClass("defaultCursor")
			$("*").addClass("revolverCursor")
		}
		else{
			$("*").removeClass("revolverCursor")		
			$("*").addClass("defaultCursor")
		}
	});


	$("a, button").click(function(e) { 
		if(iconClicked){ //Check if the roulette is started
			timesClicked+=1;

			if(timesClicked==randomNumber){
				e.preventDefault(); //prevent from going directly to the link
				clickedAudio.play();
			    $(".boom").css("visibility","visible") //make "BOOOM" text visible
				goTo = this.getAttribute("href"); //Check where the link leads
			    setTimeout(function(){ 	//wait a moment before we go to the link
					iconClicked=false;
					chrome.runtime.sendMessage(iconClicked); //Send variable iconClicked to background.js 
					$(".boom").css("visibility","hidden")
		        	$("*").removeClass("revolverCursor")		
					$("*").addClass("defaultCursor")

					if(!goTo){ //if there's not a href, check what coordinates where clicked and then dispatch the event for those coordinates
						if (e.pageX || e.pageY) { 
						  x = e.pageX;
						  y = e.pageY;
						}
						else { 
						  x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
						  y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
						} 

						var event = document.createEvent("MouseEvents");
				    	event.initEvent("click", true, true);
				    	document.elementFromPoint(x, y).dispatchEvent(event);
			    	}
			    	else{
			    		window.location=goTo;
			    	}

			    },800);       

			}
			else{ //If the click shouldn't fire
	    		notClickedAudio.play();
				return false;
			}
		}
	});
});