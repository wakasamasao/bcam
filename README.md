bcam
====

this jquery plugin is Capture Camera App.

Using sample

$('#hoge').bcam({oncomplete:function(e){
	$('#are').html('<img src="'+e.data+'"/>');
}});

Default Options

width:200, // create image width
height:200, // create image height
times:10, // number of times
timing:200, // capture time (ms)
type:"animation", // animation->gif anime , pict->film roll
playtiming:100, // gif anime play time
format:"png", // png | jpeg
layout:"horizontal", // not use
reverse:true, // After completing animation, does it reverse?
videoObj:null, // Capture Video Object
insertvideo:false, // view Capture Video
oncomplete:null, // Event: Complete
onend:null, // Event: Capture End
onstart:null, // Event: Capture Start
onerror:null, // Event: Error
onwarning:null // Event: Warnig message
