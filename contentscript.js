$(document).ready(function() {
	var firstTimeIconClicked=true;
	var iconClicked; //If the extension icon has been clicked
	var randomNumber; //How many times the user has to click a link before it fires
	var timesClicked; //How many times links have been clicked
	var clickedAudio; //Sound to play when a link gets clicked and it fires
	var notClickedAudio; //Sound to play when a link gets clicked and it doesn't fire


	chrome.runtime.onMessage.addListener(function(message, sender) { //Receive information that the icon has been clicked from Background.js. If message=true the roulette has been started
		console.log(message)
		iconClicked=message; 
		randomNumber=Math.floor(Math.random() * 7) + 1
		timesClicked=0;
		
		if(firstTimeIconClicked){
			//Here we do the stuff we only need to do the first time the icon is clicked
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
			console.log("changing cursors")
			$("*").removeClass("defaultCursor")
			$("*").addClass("revolverCursor")
		}
		else{
			$("*").removeClass("revolverCursor")		
			$("*").addClass("defaultCursor")
		}
	});


	$( "a, button" ).click(function(e) { //listen to if any links or buttons get clicked
		timesClicked+=1;
		if(iconClicked){ //Check if the roulette is started
			if(timesClicked==randomNumber){
				clickedAudio.play();
				e.preventDefault(); //prevent from going directly to the link
			    $(".boom").css("visibility","visible") //make "BOOOM" text visible
			  	var goTo = this.getAttribute("href"); //Check where the link leads
			    console.log(goTo)
			    if(goTo=="null"){
			    	goTo="#"
			    }
			    console.log(goTo)

			    setTimeout(function(){ 	//wait a moment before we go to the link
					iconClicked=false;
					chrome.runtime.sendMessage(iconClicked); //Send variable iconClicked to background.js 
					if(goTo=="#"){ //If it's a link that doesn't takes the user to a new page
			        	$(".boom").css("visibility","hidden")
			        	$("*").removeClass("revolverCursor")		
						$("*").addClass("defaultCursor")
	  				}
	  				else{ //If the link takes the user to a new page
			        	window.location = goTo; //... then go to that link
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