(function($){
	var videoBox,canvasBox,ctx;
	var gifCanvs=[];
	var cnt=0;
	var options;
	var drowSizes;
	var thisObj;
	var videoInit=false;
	var isComplete=true;

	var cameraWidth,cameraHeight;
	$.fn.jRapidCam=function(config){
		if(!isComplete){
			if(typeof(options.onerror)=="function"){ options.onerror.call(window,{target:thisObj,code:503,message:"System has been used."}); }
        	return ;
		}

		isComplete=false;
		thisObj=this;
    	var defaults={
            width:200,
            height:200,
            times:10,
            timing:200, //ms
            type:"animation",
            playtiming:100,
            format:"png",
            layout:"horizontal",
            reverse:true,
            videoObj:null,
            oncomplete:null,
            onend:null,
            onstart:null,
            onerror:null,
            onwarning:null
        }
        options=$.extend(defaults, config);

		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

        // chekc
        if(!navigator.getUserMedia){
			if(typeof(options.onerror)=="function"){ options.onerror.call(window,{target:thisObj,code:501,message:"Not Support Browser."}); }
        	return ;
        }

        if(videoBox && options.videoObj && ( (options.videoObj.get && videoBox.get(0)!=options.videoObj.get(0)) || (!options.videoObj.get && videoBox.get(0)!=options.videoObj)))
			if(typeof(options.onwarning)=="function"){ options.onwarning.call(window,{target:thisObj,code:202,message:"Camera has been used."}); }


        if(!videoBox){
        	if(!options.videoObj)
	        	videoBox=$('<video/>');
	        else
	        	videoBox=$(options.videoObj);
	        videoBox.attr("autoplay","autoplay");
	    }


	    if(options.type=="animation"){
	    	gifCanvs=[];
	    	for(var i=0;i<options.times;i++){
	    		gifCanvs[i]={};
	    		gifCanvs[i]["dom"]=$('<canvas/>')
	    		gifCanvs[i]["dom"].attr("width",options.width+"px");
		    	gifCanvs[i]["dom"].attr("height",options.height+"px");
		    	gifCanvs[i]["ctx"]=gifCanvs[i]["dom"].get(0).getContext('2d');
	    	}
	    }else{
		    canvasBox=$('<canvas/>');
		    if(options.reverse===true){
			    canvasBox.attr("width",options.width*(options.times*2-1)+"px");
			}else{
			    canvasBox.attr("width",options.width*options.times+"px");
			}
		    canvasBox.attr("height",options.height+"px");
			ctx = canvasBox.get(0).getContext('2d');
		}


		if(!videoInit){
			navigator.getUserMedia({video: true}, function (stream){
				videoBox.get(0).addEventListener("playing",function(e){
					cameraWidth=e.target.videoWidth;
					cameraHeight=e.target.videoHeight;

					if(typeof(options.onstart)=="function"){ options.onstart.call(window,{target:thisObj}); }
					capSize();
					capVideo();
					videoInit=true;
				});
				if (window.URL) {  
					videoBox.attr("src",window.URL.createObjectURL(stream));  
				}else{
					videoBox.attr("src",stream);  
				}
			},function (e) {  
				if(typeof(options.onerror)=="function"){ options.onerror.call(window,{target:thisObj,code:505,message:"Camera Not Create."}); }
			});  
		}else{
			if(typeof(options.onstart)=="function"){ options.onstart.call(window,{target:thisObj}); }
			capSize();
			capVideo();
		}
	
        return this;
	};

	function capSize(){
		var p=options.width/options.height;
		if(cameraWidth>cameraHeight){
			drowSizes=[(cameraWidth-cameraHeight)/2,0,cameraHeight*p,cameraHeight];
		}else{
			drowSizes=[0,(cameraHeight-cameraWidth)/2,cameraWidth*p,cameraWidth];
		}
	}


	function capVideo(){
	    if(options.type=="animation"){
	    	if(gifCanvs[cnt]){
				gifCanvs[cnt]["ctx"].drawImage(videoBox.get(0),drowSizes[0],drowSizes[1],drowSizes[2],drowSizes[3],0,0,options.width,options.height);
	    	}
	    }else{
			ctx.drawImage(videoBox.get(0),drowSizes[0],drowSizes[1],drowSizes[2],drowSizes[3],options.width*cnt,0,options.width,options.height);
			if(options.reverse===true){
				ctx.drawImage(videoBox.get(0),drowSizes[0],drowSizes[1],drowSizes[2],drowSizes[3],options.width*(options.times*2-cnt-2),0,options.width,options.height);
			}
	    }

		if(cnt++==options.times){
			// todo : timing check
			if(typeof(options.onend)=="function"){ options.onend.call(window,{target:thisObj}); }

			if(typeof(options.oncomplete)=="function"){
				var b64;
				if(options.type=="animation"){
			    	var gifEncoder=new GIFEncoder();
					gifEncoder.setRepeat(0);
					gifEncoder.setDelay(options.playtiming);
					gifEncoder.setSize(options.width,options.height);
					gifEncoder.start();

	    			for(var i=0;i<options.times;i++){
	    				gifEncoder.addFrame(gifCanvs[i]["ctx"]);
	    			}
	    			if(options.reverse===true){
		    			for(var i=(options.times-2);i>0;i--){
		    				gifEncoder.addFrame(gifCanvs[i]["ctx"]);
		    			}	    				
	    			}
					gifEncoder.finish();
					b64='data:image/gif;base64,'+encode64(gifEncoder.stream().getData());
				}else if(options.format="jpeg")
					b64=canvasBox.get(0).toDataURL("image/jpeg");
				else
					b64=canvasBox.get(0).toDataURL();
				isComplete=true;
				options.oncomplete.call(window,{target:thisObj,data:b64});
			}

			// init
			cnt=0;
			if(ctx)
				ctx=null;
			if(canvasBox)
				canvasBox.remove();
				// ctx.clearRect(0,0,options.width*10,options.height);
	    	for(var i=0;i<options.times;i++){
	    		if(gifCanvs[i]){
		    		gifCanvs[i]["ctx"]==null;
		    		gifCanvs[i]["dom"].remove();	    			
	    		}
	    	}
	    	gifCanvs[i]=[];

		}else{
			setTimeout(capVideo, options.timing);
		}
	}


})(jQuery);
