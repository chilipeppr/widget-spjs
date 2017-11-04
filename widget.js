/* global requirejs cprequire cpdefine chilipeppr */
// Defining the globals above helps Cloud9 not show warnings for those variables

// ChiliPeppr Widget/Element Javascript

requirejs.config({
    /*
    Dependencies can be defined here. ChiliPeppr uses require.js so
    please refer to http://requirejs.org/docs/api.html for info.
    
    Most widgets will not need to define Javascript dependencies.
    
    Make sure all URLs are https and http accessible. Try to use URLs
    that start with // rather than http:// or https:// so they simply
    use whatever method the main page uses.
    
    Also, please make sure you are not loading dependencies from different
    URLs that other widgets may already load like jquery, bootstrap,
    three.js, etc.
    
    You may slingshot content through ChiliPeppr's proxy URL if you desire
    to enable SSL for non-SSL URL's. ChiliPeppr's SSL URL is
    https://i2dcui.appspot.com which is the SSL equivalent for
    http://chilipeppr.com
    */
    paths: {
        // Example of how to define the key (you make up the key) and the URL
        // Make sure you DO NOT put the .js at the end of the URL
        // SmoothieCharts: '//smoothiecharts.org/smoothie',
    },
    shim: {
        // See require.js docs for how to define dependencies that
        // should be loaded before your script/widget.
    }
});

// Test this element. This code is auto-removed by the chilipeppr.load()
cprequire_test(["inline:com-chilipeppr-widget-serialport"], function (sp) {
    console.log("test running of " + sp.id);
    
    $('body').css("padding", "20px");

    //sp.init("192.168.1.7");
    /*
    sp.setSingleSelectMode();
    sp.init(null, "tinyg", 115200, "tinyg (or if you are using the Arduino Due or v9 board choose tinygg2)");
    //sp.init(null, "grbl");
    */
    
    sp.init({
      isSingleSelectMode: true,
      defaultBuffer: "nodemcu",
      defaultBaud: 9600,
      bufferEncouragementMsg: 'For your NodeMCU device please choose the "timed" buffer in the pulldown and a 9600 baud rate before connecting.'
    });
		
    sp.consoleToggle();
    
    var test = function() {
        setTimeout(function() {
            for (ctr = 0; ctr < 3; ctr++) {
                //sp.sendBuffered('{"sr":""}\n');
                //sp.sendBuffered('{"qr":""}\n');
                sp.sendBuffered('{"sr":""}\n{"qr":""}\n');
            }
        }, 5000);
    }
    //test()

    var test2 = function() {
        for (ctr = 0; ctr < 30; ctr++) {
            setTimeout(function() {
                sp.sendBuffered('{"sr":""}\n');
                sp.sendBuffered('{"qr":""}\n');
            }, 5000 + (ctr * 2));
        }
    }
    //test2()

    setTimeout(function() {
        chilipeppr.publish("/com-chilipeppr-widget-serialport/requestSingleSelectPort", "");
    }, 2000);
    
    /*
    setTimeout(function() {
        chilipeppr.publish("/" + sp.id + "/send", '{"sr":""}\n{"sr":""}\n{"sr":""}\n{"sr":""}\n'); 
        //chilipeppr.publish("/" + sp.id + "/ws/send", 'send COM22 {"sr":""}\nsend COM22 {"sr":""}\nsend COM22 {"sr":""}\nsend COM22 {"sr":""}\n'); 
    }, 2000);
    setTimeout(function() {
    //    chilipeppr.publish("/" + sp.id + "/ws/send", 'send COM22 {"sr":""}\n'); 
    }, 1000);
    */
    //sp.wsScan();
    
    var testProgrammer = function() {
        var testProgrammerDiv = $("<div></div>").attr("id", "com-chilipeppr-widget-programmer-div");
        $('#com-chilipeppr-widget-serialport').append(testProgrammerDiv);
        
        // Programmer
        // FIDDLE http://jsfiddle.net/chilipeppr/qcduvhkh/11/
        chilipeppr.load(
            "com-chilipeppr-widget-programmer-div",
            "http://fiddle.jshell.net/chilipeppr/qcduvhkh/show/light/"
        );
    }
    testProgrammer();
    
    var testFro = function() {
        setTimeout(function() {
            chilipeppr.publish("/com-chilipeppr-widget-serialport/requestFro", "3.5");
        }, 3000);
    }
    testFro();
    
    var testStatus = function() {
        setTimeout(function() {
            chilipeppr.publish("/com-chilipeppr-widget-serialport/requestStatus", "3.5");
        }, 6000);
    }
    testStatus();
    
    // we need to also load the serial port console to make sure they are synced
    // Inject new div to contain widget or use an existing div with an ID
    $("body").append('<' + 'div id="myDivWidgetSpconsole"><' + '/div>');
    
    chilipeppr.load(
      "#myDivWidgetSpconsole",
      "http://raw.githubusercontent.com/chilipeppr/widget-console/master/auto-generated-widget.html",
    //   "http://widget-console-chilipeppr.c9users.io/widget.html",
      function() {
        // Callback after widget loaded into #myDivWidgetSpconsole
        // Now use require.js to get reference to instantiated widget
        cprequire(
          ["inline:com-chilipeppr-widget-spconsole"], // the id you gave your widget
          function(myObjWidgetSpconsole) {
            // Callback that is passed reference to the newly loaded widget
            console.log("Widget / Serial Port Console v1.7 just got loaded.", myObjWidgetSpconsole);
            myObjWidgetSpconsole.init(true);
          }
        );
      }
    );

} /*end_test*/ );

cpdefine("inline:com-chilipeppr-widget-serialport", ["chilipeppr_ready", "jquerycookie"], function () {
    return {
        id: "com-chilipeppr-widget-serialport",
        name: "Widget / Serial Port JSON Server",
        desc: "The essential widget if you want your workspace to talk to the Serial Port JSON Server (SPJS). This widget enables numerous pubsub signals so you can publish to SPJS and receive data back when you subscribe to the appropriate signals.",
        url: "(auto fill by runme.js)",       // The final URL of the working widget as a single HTML file with CSS and Javascript inlined. You can let runme.js auto fill this if you are using Cloud9.
        fiddleurl: "(auto fill by runme.js)", // The edit URL. This can be auto-filled by runme.js in Cloud9 if you'd like, or just define it on your own to help people know where they can edit/fork your widget
        githuburl: "(auto fill by runme.js)", // The backing github repo
        testurl: "(auto fill by runme.js)",   // The standalone working widget so can view it working by itself
        publish: {
            '/list' : "Sends the list of serial ports shown in this widget including the connect state so other widgets/elements in ChiliPeppr can use the list including knowing what serial ports to send/recv from. Send in /getList and get back a /list with the JSON payload of the list.", 
            '/listAfterMetaDataAdded' : "Similar to /list but the list will have meta data added to it like an image, or default baud rates, or a modified friendly name. It may even be marked as deleted for dual port scenarios where a port may be considered the 2nd port.", 
            '/ws/onconnect' : 'When the websocket connects. This widget currently supports only a single websocket. In the future, multiple websockets will be supported and a ws identifier will be attached. For now, you will receive the string "connected" in the payload. The 2nd parameter will be the websocket in case you need it like to retrieve the IP address of SPJS. For multiple websockets an additional parameter will be published with the ws:// url',
            '/ws/ondisconnect' : "When the websocket disconnects.", 
            '/ws/sys' : "A system message. Mostly for visual display like an error.",
            '/ws/recv' : "A signal published when the websocket receives data from the serial port server. The serial port, i.e. COM21, the websocket identifier, and data are sent.",
            '/onportopen' : 'Published when the Serial Port JSON Server tells us a port was opened. This could happen from the user clicking to open, or if another browser or websocket client opens it, we will fire off this signal as well. The payload looks like {Cmd: "Open", Desc: "Got register/open on port.", Port: "COM22", Baud: 115200, BufferType: "tinyg"} ',
            '/onportclose' : 'Published when the Serial Port JSON Server tells us a port was closed. This could happen from the user clicking to close, or if another browser, or SPJS, or websocket client closes it, we will fire off this signal. The payload looks like {Cmd: "Close", Desc: "Got unregister/close on port.", Port: "COM22", Baud: 115200} ',
            '/onportopenfail' : 'Published when the Serial Port JSON Server tells us a port was attempting to be opened but failed for some reason. This could happen from the user clicking to open, or if another browser tries to open, but an error arose such as the port being locked by another process. The payload looks like {Cmd: "OpenFail", Desc: "Got error reading on port. ", Port: "COM22", Baud: 115200}',
            '/recvline' : "We publish this signal in tandem with /ws/recv but we only publish this signal per newline. That way your widget can consume per line data which is typically the way you want it. We recommend you subscribe to this channel instead of /ws/recv to have less work to do of looking for newlines. When in setSingleSelectMode() we will only send you data for the port that is selected (in green in UI). You will not get this signal for secondary ports that are open. For secondary ports, you need to subscribe to /ws/recv and do lower level parsing.",
            '/recvVersion' : "We send you this back if you published a /requestVersion signal. This is so other widgets can pivot off of what version of Serial Port JSON Server is running. For example, the Arduino/Atmel programmer sends in a /requestVersion to get a callback on /recvVersion to determine if you are at version 1.83 or above to know whether you have the correct functionality.",
            '/recvSingleSelectPort' : "In case any other widget/element wants to know what port is single selected (when in setSingleSelectMode()), they can send a signal to /requestSingleSelectPort and we'll respond back with this signal with an object like: " + JSON.stringify({
                "Name": "COM22",
                "Friendly": "USB Serial Port (COM22)",
                "IsOpen": true,
                "Baud": 115200,
                "RtsOn": true,
                "DtrOn": false,
                "BufferAlgorithm": "tinyg",
                "AvailableBufferAlgorithms": [
                    "default",
                    "tinyg",
                    "dummypause"
                ],
                "Ver": 1.7
            }, undefined, 2) + ". Will send back a null if no ports or no singleSelectPort is defined.",
            '/onQueue' : 'This signal is published when a command is queued on SPJS. Payload is {"Id":"123", "D":"G0 X1\n", "QCnt":1, "Port":"COM2"}. You get the data back because if another browser sent into the SPJS, you get that data reflected in other browsers which is important for synchronizing. See /jsonSend for more info.', 
            '/onWrite' : 'This signal is published when a command is written to the serial port on SPJS. Payload is {"Id":"123", "QCnt":0, "Port":"COM2"}. The serial command is not reiterated in this signal like it is in /onQueue. See /jsonSend for more info.', 
            '/onComplete' : 'This signal is published when a command is done being written on SPJS and is known to have been processed by the serial device. Payload is {"Id":"123"}. Please note that sometimes /onComplete could come back before /onWrite due to the multi-threaded nature of serial ports and writing/reading as well as network congestion. See /jsonSend for more info.' ,
            '/onError' : 'This signal is published when a command produces an error in the CNC controller either due to a gcode syntax problem, or an unsupported gcode command.  This signal can be used by the cnc-interface widget to handle for errors, or pause/cancel gcode execution so that the problem can be rectified.',
            '/onBroadcast' : 'This signal is published when we see a broadcast message come in from SPJS and we simply regurgitate it out on this signal for any widget to listen to. To send a broadcast signal into SPJS you just use the command \"broadcast blah blah\" and then SPJS re-broadcasts that to all listeners with a packet like {Cmd:\"Broadcast\", Msg:\"blah blah\"}. For example, the ShuttleXpress CNC jog shuttle connects to SPJS on its own and when you click buttons on the device it broadcasts them to SPJS so widgets inside ChiliPeppr can respond to those clicks.',
            '/onAnnounce' : 'This signal is published when we see an announce message come in from SPJS and we simply regurgitate it out on this signal for any widget to listen to. An announce signal is part of the Cayenn protocol. Basically an IoT device like an ESP8266 sends in a UDP broadcast to the network announcing its existence. SPJS listens for those and then sends a copy of the announcement to any SPJS listeners, like us. Then this SPJS widget publishes it out so other widgets inside ChiliPeppr can listen for the message.',
            '/onFeedRateOverride' : 'This signal is published when we get a feed rate override update from SPJS. It will contain the payload similar to {"Cmd":"FeedRateOverride","Desc":"Providing you status of feed rate override.","Port":"COM7","FeedRateOverride":0,"IsOn":false}',
            '/recvStatus' : 'Send in a /requestStatus and we will send you back a /recvStatus letting you know if SPJS is connected or not to the Serial Port JSON Server. The payload that comes to you in /recvStatus looks like {"Connected":true, "Websocket": ws } or {"connected":false, "websocket":null}. If you want to be pushed an event when the socket connects or disconnects you should subscribe to /ws/onconnect and /ws/ondisconnect'
        },
        subscribe: {
            '/ws/send' : `This widget subscribes to this signal so anybody can publish 
to SPJS by publishing here. You can send any command that SPJS supports. Please see the 
docs for all support SPJS commands on Github at 
<a target="_blank" href="https://github.com/chilipeppr/serial-port-json-server#supported-commands">https://github.com/chilipeppr/serial-port-json-server#supported-commands</a>.
<br><br>
Example<br>
chilipeppr.publish("/com-chilipeppr-widget-serialport/ws/send", "send COM22 G0 X0\\n");
<br><br>
Example of sending non-buffered command<br>
chilipeppr.publish("/com-chilipeppr-widget-serialport/ws/send", "sendnobuf /dev/ttyUSB0 M3 S1000\\n");
`,
            '/send' : `This widget subscribes to this signal whereby you can simply send 
to this pubsub channel (instead of /ws/send which is lower level) and the widget will
send to the default serial ports that you are connected to (the green highlight in the UI). 
Most serial devices expect newline characters, so you should send those in your string as 
this pubsub channel does not add them.
<br><br>
Example<br>
chilipeppr.publish("/com-chilipeppr-widget-serialport/send", "G1 X10 F500\\n");
`,
            '/jsonSend' : '<p>This signal is like /send but a more structured version where you can send us commands like {"D": "G0 X1\n", "Id":"123"} or an array like [{"D": "G0 X1\n", "Id":"123"}, {"D": "G0 X2\n", "Id":"124"}] and then this widget will send callback signals in order of /onQueue, /onWrite, /onComplete. The payload is {"Id":"123"} on each of those.</p> <p>The SPJS has 3 steps to get your command to the serial device. Step 1 is /onQueue and this will come back immediately when SPJS has taken your command and queued it to memory/disk. Step 2 is /onWrite when SPJS actually has written your command to the serial device. If the device takes a while to execute the command it could be a bit of time until that command is physically executed. Step 3 is /onComplete which is SPJS attempting to watch for a response from the serial device to determine that indeed your command is executed. Please note /onComplete can come back prior to /onWrite based on your serial device and how fast it may have executed your serial command.</p> <p>You can omit the Id if you do not care about tracking. You will get callbacks with an empty Id so you will not be able to match them up. If you send in /jsonSend {"D": "G0 X1\nG0 X0\n", "Id":"123"} you will get back /onQueue [{"D":"G0 X1\n","Id":"123","Buf":"Buf"},{"D":"G0 X0\n","Id":"123-part-2-2","Buf":"Buf"}] because technically those are 2 commands with one Id. Some commands sent into Serial Port JSON Server get additional commands auto-added. For example, if you send in a command to TinyG that would put it in text mode, SPJS appends a command to put TinyG back in JSON mode. In those cases you will get parts added to your command and will see that in the response.</p>',
            '/getlist' : "In case any other widget/element wants to request the list at any time, they can send a signal to this channel and we'll respond back with a /list",
            '/requestVersion' : "Send in this signal to get back a /recvVersion. This is so other widgets can pivot off of what version of Serial Port JSON Server is running. For example, the Arduino/Atmel programmer sends in a /requestVersion to get a callback on /recvVersion to determine if you are at version 1.83 or above to know whether you have the correct functionality.",
            '/requestSingleSelectPort' : "In case any other widget/element wants to know what port is single selected (when in setSingleSelectMode()), they can send a signal to this channel and we'll respond back with a /recvSingleSelectPort with an object like: " + JSON.stringify({
                "Name": "COM22",
                "Friendly": "USB Serial Port (COM22)",
                "IsOpen": true,
                "Baud": 115200,
                "RtsOn": true,
                "DtrOn": false,
                "BufferAlgorithm": "tinyg",
                "AvailableBufferAlgorithms": [
                    "default",
                    "tinyg",
                    "dummypause"
                ],
                "Ver": 1.7
            }, undefined, 2) + ". Will send back a null if no ports or no singleSelectPort is defined.",
            '/requestFro' : 'Send in this signal to have this widget send in a request to SPJS for the Feed Rate Override status on the singleSelectPort, i.e. the port that is hilited green. This widget will send SPJS something like "fro COM7" and then the data will come back and a publish will occur on /onFeedRateOverride. If you send in an empty payload this will simply request the status. If you send in a float or integer it will actually set the Feed Rate Override multiplier to that value.',
            '/requestStatus' : 'If you want to request the connected/disconnected status of this widget, you can send this pubsub signal in and we will send you back the connected status in the /recvStatus signal. We will also include the websocket object in case you were interested in it. Please see docs for /recvStatus for further info.'
        },
        foreignPublish: {
            '/com-chilipeppr-elem-flashmsg/flashmsg' : "We publish system messages from the serial port server to the flash message element to display informational messages to the user.",
            '/com-chilipeppr-interface-cnccontroller/plannerpause' : 'We publish a planner pause if we see that the buffer count in the Serial Port JSON Server gets above 20,000.',
            '/com-chilipeppr-interface-cnccontroller/plannerresume' : 'We publish a planner resume when we get back to 15,000.'
        },
        isWsConnected: false,
        host: null,
        portlist: null,
        conn: null,     // the websocket we're connected to (eventually make this an array so we can have multiple websockets)
        isSingleSelectMode: false,  // means you can multiple open ports, or only open one
        singleSelectPort: null,     // this will get set to the last port opened based on cookie or click
        buffertype: null, // holds what buffertype to request on the "open comPort baud buffertype" command, if null we just don't send
        defaultBaud: null, // holds default baud to put in the pulldown menu
        defaultOptions: null, // holds the options passed in on an object
        isInitted: false, // keep track in case user calls init() twice (like i've done)
        init: function (host, buffertype, defaultBaud, buffertypeDescription) {
            
            if (this.isInitted) {
            	console.warn("you just initted the serial port json server widget again? huh? returning");
              return;
            }
            this.isInitted = true;

            console.group("init of serial port widget");
            
            // see if we were passed a buffertype
            // this is an extra command now that the serial port json
            // server supports buffer algorithms for specific types
            // of hardware. by default no buffer flow control is needed
            // like if you're controlling an arduino
            // but in the case of tinyg and grbl it helps to have buffer
            // flow be very close to the serial port itself
            // so the serial port json server supports algorithms to be
            // added via github and compiled in. you may request
            // that algorithm here globally, or per serial port
            // it's best to not do this globally since the goal of 
            // chilipeppr is to allow multiple serial port devices at
            // the same time to control things like probes while sending
            // gcode
            
            // see if an options object was passed in instead of 
            // individual parameters
            if (host && typeof host === "object") {
              var opt = host;
              
              this.defaultOptions = opt;
            	if ('isSingleSelectMode' in opt) this.setSingleSelectMode();
              if ('defaultBuffer' in opt) buffertype = opt.defaultBuffer;
              if ('defaultBaud' in opt) defaultBaud = opt.defaultBaud;
              if ('bufferEncouragementMsg' in opt) buffertypeDescription = opt.bufferEncouragementMsg;
            }
            
            if (buffertype != null && buffertype.length > 0) {
                this.buffertype = buffertype;
                console.log("we have a buffertype being requested. buffertype:", this.buffertype);
                // if they gave a description use that
                var mydescription = '"' + buffertype + '"';
                if (buffertypeDescription != null && buffertypeDescription.length > 0) {
                    mydescription = buffertypeDescription;
                }
                // also add extra msg to encourage the buffer choice
                $('.com-chilipeppr-widget-serialport-bufferindicator').removeClass("hidden").find('.buffername').text(mydescription);
                
                // set the buffer encouragement to be the full passed in
                // description if the caller called us with the new defaultOptions
                // value
                if (this.defaultOptions && 'bufferEncouragementMsg' in this.defaultOptions) {
                  $('.com-chilipeppr-widget-serialport-bufferindicator').text(
                    this.defaultOptions.bufferEncouragementMsg
                  );
                }

                // Cheating a bit here, bu this seems to be the new std
                // default baud rate out there
                this.defaultBaud = 115200;
            }
            
            if (defaultBaud) {
                console.log("setting defaultBaud:", defaultBaud);
                this.defaultBaud = defaultBaud;
            }

            this.btnBarSetup();
            this.consoleSetup();
            this.statusWatcher();
            this.wsConnect(null);
            //this.wsConnect(null, host);
            
            // allow dedupe mode
            var that = this;
            chilipeppr.subscribe("/" + this.id + "/dedupeOn", this, function (msg) {
                console.log("spjs widget now in dedupe mode");
                that.isInDeDupeMode = true;
            });
            chilipeppr.subscribe("/" + this.id + "/dedupeOff", this, function (msg) {
                console.log("spjs widget no longer in dedupe mode");
                that.isInDeDupeMode = false;
            });
            
            // setup onconnect pubsub event
            chilipeppr.subscribe("/" + this.id + "/ws/onconnect", this, function (msg) {
                this.getPortList();
            });

            // setup recv pubsub event
            // this is when we receive data from the serial port
            chilipeppr.subscribe("/" + this.id + "/ws/recv", this, function (msg) {
                this.onWsMessage(msg);
            });

            // setup low-level send pubsub event
            // this is when a widget sends data to the serial port
            chilipeppr.subscribe("/" + this.id + "/ws/send", this, function (msg) {
                this.wsSend(msg);
            });
            
            // setup send pubsub event
            // this is when a widget sends data to the serial port
            // this only supports singleSelectMode()
            chilipeppr.subscribe("/" + this.id + "/send", this, function (msg) {
                this.send(msg);
            });
            
            // setup jsonSend pubsub event
            // this is when a widget sends data to the serial port
            // in a structured way so they can get callbacks
            // this only supports singleSelectMode()
            chilipeppr.subscribe("/" + this.id + "/jsonSend", this, function (json) {
                this.sendViaJson(json);
            });
            
            // Allow others to request our serial port list
            chilipeppr.subscribe("/" + this.id + "/getlist", this, function () {
                chilipeppr.publish("/" + this.id + "/list", this.portlist);
            });

            var that = this;
            
            // show last remote host, if there is one
            if ($.cookie('lasthost')) {
                var lasthost = $.cookie('lasthost');
                lasthost = lasthost.replace(/ws:\/\/(.*):.*/, "$1");
                $('#com-chilipeppr-widget-serialport-host').val(lasthost);
            }
            
            // setup convenience localhost href click
            $('.spjs-connect2localhost').click(function() {
                $('#com-chilipeppr-widget-serialport-host').val("localhost");
                that.onRemoteHostConnect();
            });
            $('.spjs-connect2localhostSSL').click(function() {
                $('#com-chilipeppr-widget-serialport-host').val("wss://localhost:8990/ws");
                that.onRemoteHostConnect();
            });
            
            // if connect btn or enter key on remote host connect
            var remoteCon = $('#com-chilipeppr-widget-serialport-hostbtn');
            remoteCon.click(function() {
                that.onRemoteHostConnect();
            });
            $('#com-chilipeppr-widget-serialport-host').keypress(function(event){
                //console.log("got keypress. event:", event);
                var keycode = (event.keyCode ? event.keyCode : event.which);
                if (keycode == '13'){
                    that.onRemoteHostConnect(); 
                }
            });
            
            // setup the port scan button
            $('#com-chilipeppr-widget-serialport-scanbtn').click(function() {
                var subnet = $('#com-chilipeppr-widget-serialport-scan').val();
                that.wsScan(null, subnet);
            });
            
            // cleanup popovers that are getting created by some other widget's code
            //$('.com-chilipeppr-widget-serialport').find('.popover').remove();
            
            // setup requestSingleSelectPort pubsub event
            chilipeppr.subscribe("/" + this.id + "/requestSingleSelectPort", this, function (msg) {
                this.publishSingleSelectPort();
            });
            
            // subscribe to our own /onportopen signal to hide the buffer encouragement msg
            chilipeppr.subscribe("/" + this.id + "/onportopen", this.hideBufferEncouragement.bind(this));
            chilipeppr.subscribe("/" + this.id + "/list", this.bufferEncouragement.bind(this));
            
            this.initBody();
            
            console.log("setting up onPlannerResumeSetup");
            this.onPlannerResumeSetup();
            
            // setup cloud servers
            this.setupCloudServers();
            
            // make it so the pubsub signals of /requestVersion and /recvVersion
            // work
            this.setupVersionPubSub();
            
            // setup /requestFro
            this.setupFroPubSub();
            
            this.setupStatusPubSub();
            
            this.setupRecentServerList();
            this.showRecentServerList();
            
            this.setupSubnetScan();
            
            console.log(this.name + " done loading.");
            console.groupEnd();
        },
        setupSubnetScan: function() {
            window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;   //compatibility for firefox and chrome
            var pc = new RTCPeerConnection({iceServers:[]}), noop = function(){};      
            pc.createDataChannel("");    //create a bogus data channel
            pc.createOffer(pc.setLocalDescription.bind(pc), noop);    // create offer and set local description
            pc.onicecandidate = function(ice){  //listen for candidate events
                if(!ice || !ice.candidate || !ice.candidate.candidate)  return;
                var myIP = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate)[1];
                console.log('my IP: ', myIP);
                var subnet = myIP.replace(/\d+$/, "*");
                console.log("my IP subnet:", subnet);
                $('#com-chilipeppr-widget-serialport-scan').val(subnet);
                pc.onicecandidate = noop;
            };    
        },
        setupRecentServerList: function() {
          var that = this;
        	$('.com-chilipeppr-widget-serialport-install .btn-reset-recent-server-list').click(function() {
            localStorage.setItem('com-chilipeppr-widget-serialport-serverList', null);
            that.showRecentServerList();
          })
        },
        showRecentServerList: function() {
        	//debugger;
        	var serverList = this.serverListGet();
          var elOuter = $('.com-chilipeppr-widget-serialport-install .recent-server-list-wrapper');
          var el = $('.com-chilipeppr-widget-serialport-install .recent-server-list');
          var that = this;
          console.log("showRecentServerList:", serverList)
          if (serverList && Object.keys(serverList).length > 0) {
          	// show it
            el.empty();
            for (var key in serverList) {
            	var val = serverList[key];
              var elWs = $(val);
              elWs.click(key, function(evt) {
                console.log("got click. evt:", evt, "data:", evt.data);
                that.disconnect();
                that.wsConnect(evt.data);              
              });
              
              el.append(elWs);
              el.append("<br>");
            }
            elOuter.removeClass("hidden");
          } else {
          	// hide it
            el.html("(none)");
            elOuter.addClass("hidden");
          }
        },
        setupStatusPubSub: function() {
          chilipeppr.subscribe("/" + this.id + "/requestStatus", this, this.onRequestStatus);        
        },
        onRequestStatus: function() {
          chilipeppr.publish('/' + this.id + '/recvStatus', {
          	connected: this.isWsConnected,
            websocket: this.conn
          });
        },
        setupFroPubSub: function() {
            chilipeppr.subscribe("/" + this.id + "/requestFro", this, this.onRequestFro);
        },
        onRequestFro: function(payload) {
            var multiplier = "";
            if (payload) {
                multiplier = payload;
            }
            chilipeppr.publish('/com-chilipeppr-widget-serialport/ws/send', 'fro ' + this.singleSelectPort + " " + multiplier + "\n");
        },
        version: null,
        versionFloat: 0.0,
        setupVersionPubSub: function() {
            chilipeppr.subscribe("/" + this.id + "/requestVersion", this, this.onRequestVersion);
        },
        onRequestVersion: function() {
            chilipeppr.publish("/" + this.id + "/recvVersion", this.versionFloat);
        },
        onVersion: function(version) {
            
            console.log("got version cmd. version:", version);
            this.version = version;
            this.versionFloat = parseFloat(version);
            $('.com-chilipeppr-widget-serialport .serial-port-version').text(" v" + version + " ");
            
            // Handle functionality buttons show/hidden based on version here
            if ( this.versionFloat >= 1.76) {
                // show restart button
                 $('.com-chilipeppr-widget-serialport .btn.spjs-restart').parent().removeClass("hidden");
            } else {
                // hide restart button
                 $('.com-chilipeppr-widget-serialport .btn.spjs-restart').parent().addClass("hidden");
            }
            
            
            // Handle informational message here
            if ( this.versionFloat >= 1.80) {
                
                $('.com-chilipeppr-widget-serialport-version-yours').text(version);
                $('.com-chilipeppr-widget-serialport-version').addClass('hidden');
                
            } else if (version == "1.6" || version == "1.2" || version == "1.3" || version == "1.3.1" || version == "1.4" || version == "1.5" || version == "snapshot") {
                
                $('.com-chilipeppr-widget-serialport-version-yours').text(version);
                //$('.com-chilipeppr-widget-serialport-version').addClass('hidden');
                $('.com-chilipeppr-widget-serialport-version-fullmsg').html(
                    "You are running version " + version + " of the Serial Port JSON Server. You MUST upgrade to the new 1.7 version as the Serial Port JSON Server has moved to a more stuctured send to enable onQueue, onWrite, and OnComplete events.<br/><br/>To upgrade, " + 
                    '<button type="button" class="btn btn-xs btn-default disconnect-inline" data-toggle="popover" data-placement="auto" data-container="body" data-content="Disconnect from serial port server" data-trigger="hover" data-original-title="" title=""><span class="glyphicon glyphicon-remove-sign"></span></button>' +
                    " disconnect from the websocket server and click the correct platform to download the binary for.");
                $('.com-chilipeppr-widget-serialport-version-fullmsg .disconnect-inline').click(this.disconnect.bind(this));
                /*
            } else if (version == "1.2") {
                $('.com-chilipeppr-widget-serialport-version-fullmsg').html("You are running version 1.2 of the Serial Port JSON Server. If you are running a TinyG, you should upgrade to the new 1.6 version as the Serial Port JSON Server now supports buffer flow control plugins. A plugin has been written for TinyG that puts the control closer to the serial port to ensure no lost Gcode. If you are running an alternate workspace, you're all set, although you could still upgrade.<br/><br/>To upgrade, disconnect from the websocket server and click the correct platform to download the binary for.");
                */
            } else {
                if (version != null && version != "")
                    $('.com-chilipeppr-widget-serialport-version-yours').text(version);
                $('.com-chilipeppr-widget-serialport-version').removeClass('hidden');
            }
        },
        resetVersion: function() {
            // turn off the version msg in UI
            // to handle earlier versions that don't send a version num
            // default to always showing. then onVersion will hide for us
            $('.com-chilipeppr-widget-serialport-version-yours').text("1.1");
            // no longer doing this as of Jan 25 2015 cuz version 1.1 is SOOOOO old nobody
            // has it anymore
            //$('.com-chilipeppr-widget-serialport-version').removeClass('hidden');            
        },
        hideVersion: function() {
            $('.com-chilipeppr-widget-serialport-version').addClass('hidden');
            $('.com-chilipeppr-widget-serialport .panel-heading .serial-port-version').text('');
        },
        resetSpjsName: function() {
            $('.com-chilipeppr-widget-serialport .panel-heading .hosttitle').text('');
        },
        onSpjsName: function(spjsName) {
            $('.com-chilipeppr-widget-serialport .panel-heading .hosttitle').text(spjsName);
        },
        setupCloudServers: function() {
            
            // make everything clickable
            $('.com-chilipeppr-widget-serialport-body .cloud-card').click(this.onCloudServerClick.bind(this));
            
        },
        onCloudServerClick: function(evt) {
            console.log("got onCloudServerClick. evt:", evt, "data:", evt.data);
            var wsUrl = $(evt.currentTarget).data("ws");
            console.log("url from data attrib:", wsUrl);
            this.disconnect();
            this.wsConnect(wsUrl);
        },
        showBufferEncouragement: function() {
            $('.com-chilipeppr-widget-serialport-bufferindicator').removeClass('hidden');
        },
        hideBufferEncouragement: function() {
            $('.com-chilipeppr-widget-serialport-bufferindicator').addClass('hidden');
        },
        bufferEncouragement: function(list, arg2) {
            console.log("got bufferEncouragement port list:", list, "arg2:", arg2);
            //$('.com-chilipeppr-widget-serialport-bufferindicator').addClass('hidden');
            // see if we're being asked to show a default buffer. if we are then we need
            // to analayze the current port list to see if anything is open with that buffer
            // set. if it is we can hide the encouragement msg. if it's not, we should show the msg
            //debugger;
            var that = this;
            if (this.buffertype != null && list != null && list.length > 0) {
                // yes, the instantiator wants a certain type of buffer to be used
                var isAnythingConnectedWithTheBufferWeWant = false;
                // process whole port list
                list.forEach(function(item) {
                    //debugger;
                    if (item.IsOpen && item.BufferAlgorithm.startsWith(that.buffertype)) {
                        isAnythingConnectedWithTheBufferWeWant = true;
                    }
                });
                
                if (isAnythingConnectedWithTheBufferWeWant)
                    this.hideBufferEncouragement();
                else
                    this.showBufferEncouragement();
            }
        },
        publishSingleSelectPort: function() {
            console.log("got publishSingleSelectPort. isSingleSelectMode:", this.isSingleSelectMode, "singleSelectPort:", this.singleSelectPort, "portlist:", this.portlist);
            var port = null;
            var that = this;
            if (this.portlist && this.portlist != null) {
                this.portlist.forEach(function(item) {
                    console.log("item:", item);
                    if (item.Name == that.singleSelectPort) {
                        console.log("found it. item.Name:", item.Name);
                        port = item;
                    }
                });
            }
            chilipeppr.publish("/com-chilipeppr-widget-serialport/recvSingleSelectPort", port);
        },
        onRemoteHostConnect: function() {
            console.log("onRemoteHostConnect");
            var host = $('#com-chilipeppr-widget-serialport-host').val();
            $('#com-chilipeppr-widget-serialport-hostconnectmsg').html(
                "Trying to connect to " +
                $('#com-chilipeppr-widget-serialport-host').val() + "...");
            this.wsConnect(host, function() {
                $('#com-chilipeppr-widget-serialport-hostconnectmsg').html("Last connect successful.");
            }, function() {
                $('#com-chilipeppr-widget-serialport-hostconnectmsg').html("Failed to connect to host.");
            });
        },
        setSingleSelectMode: function() {
            this.isSingleSelectMode = true;
            //var ver = " v" + this.version;
            //if (this.version == null) ver = "";
            $('.com-chilipeppr-widget-serialport .panel-heading .subtitle').html('Single Port Mode');            
            this.singleSelectPort = $.cookie("singleSelectPort");
            console.log("setSingleSelectMode. port:", this.singleSelectPort);
        },
        getPortListCount: 0,
        getPortList: function () {
            if (this.isWsConnected) {
                this.getPortListCount = 0;
                this.wsSend("list");
            } else {
                if (this.getPortListCount > 5) {
                    // give up, so we don't get in endless loop
                    this.publishSysMsg("Tried to get serial port list, but we are not connected to serial port json server.");
                } else {
                    this.getPortListCount++;
                    this.wsConnect();
                }
            }

        },
        btnBarSetup: function () {
            var that = this;
            
            /*
            $('.com-chilipeppr-widget-serialport .btn').tooltip({
                animation: true,
                delay: 100,
                //container: 'body'
            });
            */
            $('.com-chilipeppr-widget-serialport .btn').popover({
                animation: true,
                delay: 100,
                //container: 'body'
            });
            
            $('.com-chilipeppr-widget-serialport .btn.refresh').click(function () {
                $('.com-chilipeppr-widget-serialport-disconnected .refresh').prop('disabled', true);
                that.getPortList();
            });
            $('#com-chilipeppr-widget-serialport-tbar-showhideconsole').click(
                this.consoleToggle.bind(this)
            );
            $('#com-chilipeppr-widget-serialport-tbar-showhidestatus').click(
                this.statusToggle.bind(this)
            );
            $('#com-chilipeppr-widget-serialport-tbar-refresh').click(function () {
                that.getPortList();
            });
            $('#com-chilipeppr-widget-serialport-tbar-reconws').click(function () {
                that.wsConnect();
            });
            $('#com-chilipeppr-widget-serialport-tbar-disconws').click(this.disconnect.bind(this));
            $('.com-chilipeppr-widget-serialport .btn.disconnect').click(this.disconnect.bind(this));
            
            // the new restart command
            $('.com-chilipeppr-widget-serialport .btn.spjs-restart').click(function () {
                that.restartSpjs();
            });
            
            this.forkSetup();

        },
        restartSpjs: function() {
            this.wsSend("restart");
        },
        exitSpjs: function() {
            this.wsSend("exit");
        },
        disconnect: function() {
            //console.log("got forced disconnect, so wiping cookie storing lasthost");
            //$.removeCookie('lasthost', { path: '/' }); // => true
            console.log("closing websocket:", this.conn);
            if (this.conn) {
                this.conn.close();
                $('.com-chilipeppr-widget-serialport-install').removeClass('hidden');
            }
        },
        consoleToggle: function() {
            var con = $('.com-chilipeppr-widget-serialport-console');
            var coni = $('.com-chilipeppr-widget-serialport-consoleinput');
            if (con.hasClass('hidden')) {
                // the console is hidden, so let's show
                con.removeClass('hidden');
                coni.removeClass('hidden');
                this.logIsShowing = true;
            } else {
                // it's showing, so they want to hide it
                con.addClass('hidden');
                coni.addClass('hidden');
                this.logIsShowing = false;
            }
            
        },
        statusToggle: function() {
            var stat = $('.com-chilipeppr-widget-serialport-status');
            if (stat.hasClass('hidden')) {
                // the status is hidden, so let's show
                stat.removeClass('hidden');
            } else {
                // it's showing, so they want to hide it
                stat.addClass('hidden');
            }
        },
        history: [], // store history of commands so user can iterate back
        historyLastShownIndex: null,    // store last shown index so iterate from call to call
        pushOntoHistory: function(cmd) {
            this.history.push(cmd);
            
            // push onto dropup menu
            //var el = $('<li><a href="javascript:">' + cmd + '</a></li>');
            //$('#com-chilipeppr-widget-spconsole-consoleform .dropdown-menu').append(el);
            //el.click(cmd, this.onHistoryMenuClick.bind(this));
        },
        onHistoryMenuClick: function(evt) {
            console.log("got onHistoryMenuClick. data:", evt.data);
            $("#com-chilipeppr-widget-spconsole-consoleform input").val(evt.data);
            //return true;
        },
        consoleSetup: function () {
            // subscribe to websocket events
            chilipeppr.subscribe("/" + this.id + "/ws/recv", this, function (msg) {
                var msg = $("<div/>").text(msg);
                this.appendLog(msg);
            });

            var that = this;
            $("#com-chilipeppr-widget-serialport-consoleform").submit(function (evt) {
                evt.preventDefault();
                
                console.log("got submit on form");
                if (!that.isWsConnected) {
                    return false;
                }
                var msg = $('#com-chilipeppr-widget-serialport-consoleform input');
                if (!msg.val()) {
                    return false;
                }
                
                // push onto history stack
                if (msg.val().length > 0) {
                    //console.log("pushing msg to history. msg:", msg.val());
                    that.pushOntoHistory(msg.val());
                    
                }

                //that.wsSend(msg.val() + "\n");
                //that.send(msg.val() + "\n");
                //that.sendBuffered(msg.val() + "\n");
                that.sendFromConsole(msg.val() + "\n");
                that.appendLogEchoCmd(msg.val());
                msg.val("");
                
                // reset history on submit
                that.historyLastShownIndex = null;

                return false;
            });
            
            // show history by letting user do up/down arrows
            $("#com-chilipeppr-widget-serialport-consoleform").keydown(function(evt) {
                //console.log("got keydown. evt.which:", evt.which, "evt:", evt);
                if (evt.which == 38) {
                    // up arrow
                    if (that.historyLastShownIndex == null)
                        that.historyLastShownIndex = that.history.length;
                    that.historyLastShownIndex--;
                    if (that.historyLastShownIndex < 0) {
                        console.log("out of history to show. up arrow.");
                        that.historyLastShownIndex = 0;
                        return;
                    }
                    $("#com-chilipeppr-widget-serialport-consoleform input").val(that.history[that.historyLastShownIndex]);
                } else if (evt.which == 40) {
                    if (that.historyLastShownIndex == null)
                        return;
                        //that.historyLastShownIndex = -1;
                    that.historyLastShownIndex++;
                    if (that.historyLastShownIndex >= that.history.length) {
                        console.log("out of history to show. down arrow.");
                        that.historyLastShownIndex = that.history.length;
                        $("#com-chilipeppr-widget-serialport-consoleform input").val("");
                        return;
                    }
                    $("#com-chilipeppr-widget-serialport-consoleform input").val(that.history[that.historyLastShownIndex]);
                }
            });


        },
        log: null,
        logIsShowing: false,
        appendLogOld: function (msg) {
            // don't do this if log not showing
            if (!this.logIsShowing) {
                //console.log("being asked to append, but log is not showing. exiting.");
                return;
            }
            
            if (this.log == null) this.log = $('.com-chilipeppr-widget-serialport-console-log');
            var log = this.log;
            var d = log[0];
            var doScroll = d.scrollTop == d.scrollHeight - d.clientHeight;
            // see if log is too long
            if (log.text().length > 5000) {
                // truncating log
                console.log("Truncating log.");
                log.text(log.text().substring(log.text().length-2500));
            }
            msg.appendTo(log);
            if (doScroll) {
                d.scrollTop = d.scrollHeight - d.clientHeight;
            }
        },
        appendLogEchoCmd: function(msg) {
            //console.log("appendLogEchoCmd. msg:", msg);
            var msg2 = $("<div class=\"out\"/>").text("" + msg);
            //console.log(msg2);
            this.appendLog(msg2);
        },
        logEls: {
            log: null,
            logOuter: null,
        },
        appendLog: function (msg) {
            // don't do this if log not showing
            if (!this.logIsShowing) {
                //console.log("being asked to append, but log is not showing. exiting.");
                return;
            }
            //console.log("appendLog. msg:", msg);
            if (this.logEls.log == null) {
                console.log("lazy loading logEls. logEls:", this.logEls);
                this.logEls.log = $('.com-chilipeppr-widget-serialport-console-log pre');
                this.logEls.logOuter = $('.com-chilipeppr-widget-serialport-console-log');
            }
            //console.log("logEls:", this.logEls);
            //console.log(this.logEls.logOuter);
            var d = this.logEls.logOuter[0];
            var doScroll = d.scrollTop == d.scrollHeight - d.clientHeight;
            var log = this.logEls.log;
            if (log.html().length > 50000) {
                // truncating log
                console.log("Truncating log.");
                /*
                var logHtml = log.html().split(/\n/);
                var sliceStart = logHtml.length - 200;
                if (sliceStart < 0) sliceStart = 0;
                log.html(logHtml.slice(sliceStart).join("\n"));
                */
                var loghtml = log.html();
                log.html("--truncated--" + loghtml.substring(loghtml.length - 2500));
            }
            if (msg.appendTo)
                msg.appendTo(log);
            else
                log.html(log.html() + msg);
            
            //if (doScroll) {
                d.scrollTop = d.scrollHeight - d.clientHeight;
            //}
        },
        // TODO: Make all buffered sending work on multiple ports. For now it's just single select port.
        sendbuf: [],
        isSendBufWaiting: false, // true if we're waiting for "Queue" response
        sendBuffered: function(msg) {
            
            // in this method we'll queue to an array and then work the array when we see a WriteQueuedBuffered back
            console.log("inside sendBuffered. msg:", msg);
            
            // push msg onto stack
            this.sendbuf.push(msg);
            
            // only trigger buffer send if we aren't waiting
            setTimeout(this.sendBufferedDoNext.bind(this), 10);
            
        },
        sendBufferedDoNext: function() {
            
            if (this.sendbuf.length == 0) {
                console.log("no more items on buffer so exiting and not queuing for next");
                this.appendLog("(No more items on buffer.)");
                return;
            }
            
            if (this.isSendBufWaiting) {
                console.log("isSendBufWaiting is true, so returning.");
                return;
            }

            var msg = this.sendbuf.join("");
            this.sendbuf = []; // clear buffer to empty array
            console.log("sendBufferedDoNext. full join of buf. msg:", msg);
            /*
            // shift off of the sendbuf queue
            var msg = this.sendbuf.shift();
            console.log("sendBufferedDoNext. msg:", msg);
            */
            
            if (this.isSingleSelectMode) {
                if (this.singleSelectPort != null && this.singleSelectPort.length > 1) {
                    
                    console.log("setting isSendBufWaiting to true. sending to port:", this.singleSelectPort, "msg:", msg);
                    msg = "send " + this.singleSelectPort + " " + msg;
                    this.isSendBufWaiting = true; // make sure we wait
                    this.wsSend(msg);
                    
                } else {
                    this.publishSysMsg("Tried to send a serial port message, but there is no port selected.");
                }
            } else {
                this.publishSysMsg("Not in single select mode so don't know what port to send to.");
            }
            
            // subscribe to /recv pubsub response to wait until we see a queue buffered response
            
            // otherwise send off
            //this.send(msg);
            
            // then call next item without using stack and tiny yield
            //setTimeout(this.sendBufferedDoNext.bind(this), 1); // 1 ms
        },
        sendBufferedOnWsRecv: function(data) {
            console.log("got sendBufferedOnWsRecv. setting isSendBufWaiting to false. data:", data);
            this.isSendBufWaiting = false; // mark to false cuz if we're queued we can now move forward
            setTimeout(this.sendBufferedDoNext.bind(this), 10); // 1 ms
        },
        // TODO: Make all json buffered sending work on multiple ports. For now it's just single select port.
        sendbufjson: [],
        isSendBufWaitingJson: false, // true if we're waiting for "Queue" response
        clearBuffer: function() {
            this.sendbufjson = [];
            this.isSendBufWaitingJson = false;
        },
        sendBufferedJson: function(msg) {
            
            // in this method we'll queue to an array and then work the array when we see a WriteQueuedBuffered back
            console.log("inside sendBufferedJson. msg:", msg);
            
            // push msg onto stack
            this.sendbufjson.push(msg);
            
            // only trigger buffer send if we aren't waiting
            setTimeout(this.sendBufferedDoNextJson.bind(this), 10);
            
        },
        sendBufferedDoNextJson: function() {
            //console.group("serial port widget - sendBufferedDoNextJson");
            console.log("sendBufferedDoNextJson. sendbufjson:", this.sendbufjson);
            
            if (this.sendbufjson.length == 0) {
                //console.log("no more items on json buffer so exiting and not queuing for next");
                this.appendLog("(No more items on json buffer.)");
                //console.groupEnd();
                return;
            }
            
            if (this.isSendBufWaitingJson) {
                console.log("isSendBufWaitingJson is true, so returning.");
                //console.groupEnd();
                return;
            }

            //var msg = this.sendbufjson.join("");
            //console.log("sendBufferedDoNextJson. full join of buf. msg:", msg);
            
            if (this.isSingleSelectMode) {
                if (this.singleSelectPort != null && this.singleSelectPort.length > 1) {
                    
                    console.log("setting isSendBufWaitingJson to true. sending to port:", this.singleSelectPort);
                    
                    var payload = {
                        P: this.singleSelectPort,
                        Data: this.sendbufjson
                    }
                    // TODO: GET IN CORRECT FORMAT
                    var msg = "sendjson " + JSON.stringify(payload);
                    this.isSendBufWaitingJson = true; // make sure we wait
                    this.wsSend(msg);
                    
                } else {
                    this.publishSysMsg("Tried to send a serial port message, but there is no port selected.");
                }
            } else {
                this.publishSysMsg("Not in single select mode so don't know what port to send to.");
            }
            
            this.sendbufjson = []; // clear buffer to empty array
            //console.groupEnd();
        },
        sendBufferedOnWsRecvJson: function(data) {
            //console.log("got sendBufferedOnWsRecvJson. setting isSendBufWaitingJson to false. data:", data);
            this.isSendBufWaitingJson = false; // mark to false cuz if we're queued we can now move forward
            setTimeout(this.sendBufferedDoNextJson.bind(this), 10); // 1 ms
        },
        sendFromConsole: function(msg) {
            this.wsSend(msg);
        },
        sendViaJson: function(json) {
            //console.group("serial port widget - sendViaJson");
            console.log("sendViaJson. json:", json);
            
            // we should be passed json that looks like
            //  {"D": "G0 X1\n", "Id":"123"} 
            // ensure it can be parsed
            if ("D" in json) {
                // we are good
                // push msg onto stack
                this.sendbufjson.push(json);
                
                // only trigger buffer send if we aren't waiting
                setTimeout(this.sendBufferedDoNextJson.bind(this), 1);
            } else if (Array.isArray(json)) {
                // its an array of commands
                this.sendbufjson = this.sendbufjson.concat(json);
                // only trigger buffer send if we aren't waiting
                setTimeout(this.sendBufferedDoNextJson.bind(this), 1);                
            } else {
                console.error("Sent incorrectly formatted object. You must provide the D parameter in your object to send commands to the serial port via JSON.");
                
            }
            
            //console.groupEnd();
        },
        onQueuedJson: function(data) {
            // we got a queued msg. good. fire off event
            //console.group("serial port widget - onQueuedJson");
            
            // tell the json buffer it can send the next command
            this.sendBufferedOnWsRecvJson();
            
            //console.log("data:", data);
            //var json = $.parseJSON(data);
            //console.log("parsed:", json);
            for (var ctr = 0; ctr < data.Data.length; ctr++) {
                var payload = { 
                    Id: data.Data[ctr].Id, 
                    Buf: data.Data[ctr].Buf
                    //Parts: data.Data[ctr].Parts 
                };
                if ('D' in data.Data[ctr]) payload["D"] = data.Data[ctr].D;
                chilipeppr.publish("/" + this.id + "/onQueue", payload);                
            }
            //console.groupEnd();
        },
        onQueuedText: function(data) {
            // we got a queued msg. good. fire off event
            console.group("serial port widget - onQueuedText");
            
            // tell the buffer it can send the next command
            this.sendBufferedOnWsRecv();
            
            if (this.versionFloat >= 1.7) {
                
                console.log("data:", data);
                //var json = $.parseJSON(data);
                //console.log("parsed:", json);
                for (var ctr = 0; ctr < data.Ids.length; ctr++) {
                    var payload = { 
                        Id: data.Ids[ctr],
                        //Buf: data.Type[ctr],
                        QCnt: data.QCnt,
                        Port: data.Port
                    }
                    if ('D' in data) payload["D"] = data.D[ctr];
                    chilipeppr.publish("/" + this.id + "/onQueue", payload);                
                }
            } else {
                console.log("not running 1.7 or later of SPJS. your version:", this.versionFloat);
            }
            console.groupEnd();
        },
        onWriteJson: function(data) {
            // we got a write msg. good. fire off event
            //console.group("onWriteJson");
            console.log("onWriteJson. data:", data);
            var payload = { Id: data.Id, QCnt: data.QCnt, Port: data.P };
            chilipeppr.publish("/" + this.id + "/onWrite", payload);                
            //console.groupEnd();
        },
        onCompleteJson: function(data) {
            // we got a complete msg. good. fire off event
            //console.group("onCompleteJson");
            console.log("onCompleteJson. data:", data);
            var payload = { Id: data.Id };
            chilipeppr.publish("/" + this.id + "/onComplete", payload);                
            //console.groupEnd();
        },
        onErrorJson: function(data){
            // we got an error message from cnc controller. bad. notify widgets
            //console.group("onCompleteJson");
            //console.log("data:", data);
            var payload = { Id: data.Id };
            chilipeppr.publish("/" + this.id + "/onError", payload);                
            //console.groupEnd();
        },
        onBroadcast: function(data){
            //console.log("onBroadcast data:", data);
            chilipeppr.publish("/" + this.id + "/onBroadcast", data.Msg);                
        },
        onAnnounce: function(data){
            //console.log("onBroadcast data:", data);
            
            // let's tweak the data. if we get this format
            /*
            Addr: {},
            Announce: "i-am-a-client",
            DeviceId: "chip:10833368-flash:1458415-mac:18:fe:34:a5:4d:d8",
            JsonTag: "{"Icon":"http:\/\/chilipeppr.com\/img\/dispenser.jpg","Name":"Dispenser DMP-10","WidgetUrl":"https:\/\/github.com\/chilipeppr\/widget-dispenser\/auto-generated.html","Widget":"com-chilipeppr-widget-dispenser","Desc":"Techcon DMP-10 auger with stepper and linear slide"}"
            Widget: "com-chilipeppr-widget-dispenser"
            */
            // convert JsonTag to a parsed Tag
            if ('JsonTag' in data && data.JsonTag.length > 0) {
                console.log("About to parse JsonTag:", data.JsonTag, " len of JsonTag:", data.JsonTag.length);
                data.Tag = JSON.parse(data.JsonTag);
            }
            chilipeppr.publish("/" + this.id + "/onAnnounce", data);                
        },
        onFeedRateOverride: function(data) {
            chilipeppr.publish("/" + this.id + "/onFeedRateOverride", data);       
        },
        send: function(msg) {
            // this method is called when we get a publish on our pubsub channel of /send
            /*
            if (this.version != null && this.versionFloat >= 1.7) {
                // we have a modern spjs that supports buffering
                //console.log("using new sendBuffered")
                this.sendBufferedJson(msg);
            } else if (this.version != null && this.versionFloat >= 1.4) {
            */
            if (this.version != null && this.versionFloat >= 1.4) {
                // we have a modern spjs that supports buffering
                //console.log("using new sendBuffered")
                this.sendBuffered(msg);
            } else {
                // we have old server, send as before
                //console.log("using old sendNoBuf(). msg:", msg);
                this.sendNoBuf(msg);
            }
        },
        sendNoBuf: function(msg) {
            // this was called send() before, but rewrote it to branch if we have a later version of
            // serial port json server that allows buffering
            
            // we have to figure out what port to send to which depends on whether we're in multi mode or single mode
            var listOfPortsToSendTo = [];
            
            if (this.isSingleSelectMode) {
                if (this.singleSelectPort != null && this.singleSelectPort.length > 1) 
                    listOfPortsToSendTo.push(this.singleSelectPort);
                else
                    this.publishSysMsg("Tried to send a serial port message, but there is no port selected.");

            } else {
                // TODO push open ports onto array instead
            }
            var that = this;
            $.each(listOfPortsToSendTo, function(i, port) {
                console.log("sending to port:", port, "msg:", msg);
                msg = "send " + port + " " + msg;
                that.wsSend(msg);
            });

        },
        wsSend: function (msg) {
            if (this.isWsConnected) {
                this.conn.send(msg);
            } else {
                this.publishSysMsg("Tried to send message, but we are not connected to the Serial Port JSON Server.");
            }
        },
        serialSaveCookie: function(portname, baud, isrts, isdtr, buffer) {
            /*var settings = '{ "baud" : ' + baud + ',' +
                ' "isRts" : ' + isrts + ',' +
                ' "isDtr" : ' + isdtr + ' }';*/
            var settings = JSON.stringify({ baud:baud, isRts:isrts, isDtr:isdtr, buffer:buffer });
            
            // store our port/baud settings in cookie for convenience
            $.cookie('port-' + portname, settings, {
                expires: 365,
                path: '/'
            });

        },
        serialGetCookie: function(portname) {
            // get cookies that may have been stored for the previous settings
            // of the baud, rts, dtr settings
            // make sure we loaded jquery.cookie plugin
            var settings = $.cookie('port-' + portname);
            //console.log("getCookie:", settings);
            if (settings) {
                settings = $.parseJSON(settings);
                //console.log("just evaled settings: ", settings);
            }
            return settings;
        },
        serialConnect: function (portname, baud, buffer) {

            // reset the sendBuffer waiting flag cuz state unknown now
            this.isSendBufWaiting = false;
            this.isSendBufWaitingJson = false;
            
            // save the cookie for future convenience so we can load the baud and other stuff
            // so the user can be lazy
            this.serialSaveCookie(portname, baud, null, null, buffer);
            
            // if we are not ajax server connected, try to reconnect
            var that = this;
            var buf = "";
            if (buffer != null && buffer.length > 0)
                buf = " " + buffer;

            /*
            if (that.buffertype == null) 
                buf = "";
            else
                buf = " " + that.buffertype; // add space for after baud
            */
            
            if (!this.isWsConnected) {
                this.wsConnect(function () {
                    chilipeppr.publish("/" + that.id + "/ws/send",
                        "open " + portname + " " + baud + buf);
                });
            } else {
                chilipeppr.publish("/" + this.id + "/ws/send",
                    "open " + portname + " " + baud + buf);
            }
        },
        serialDisconnect: function (portname) {

            // if we are not ajax server connected, try to reconnect
            var that = this;
            if (!this.isWsConnected) {
                this.wsConnect(function () {
                    chilipeppr.publish("/" + that.id + "/ws/send",
                        "close " + portname);
                });
            } else {
                chilipeppr.publish("/" + this.id + "/ws/send",
                    "close " + portname);
            }
        },
        reconMsgShow: function() {
            $('.com-chilipeppr-widget-serialport-disconnected').removeClass('hidden');
            // undisable the reconnect btn
            $('.com-chilipeppr-widget-serialport-disconnected .refresh').prop('disabled', false);
        },
        reconMsgHide: function() {
            $('.com-chilipeppr-widget-serialport-disconnected').addClass('hidden');
        },
        wsWasEverConnected: false,
        wsConnect: function (hostname, onsuccess, onfail) {
            
            console.log("websocket connect. hostname:", hostname);
            
            // make sure other sockets are disconnected. this was extra important because if you port
            // scanned and got a bunch of server results and clicked a bunch quickly, you'd get multiple
            // socket connections going
            if (this.conn) this.conn.close();
            
            // since we are newly connecting, hide version UI (it will reshow after connect)
            this.resetVersion();
            // since newly connecting, hide the hostname
            this.resetSpjsName();
            
            // reset the sendBuffer waiting flag cuz state unknown now
            this.isSendBufWaiting = false;
            
            if (window["WebSocket"]) {
                var host = hostname;
                if (!host) {
                    // see if cookie
                    if ($.cookie('lasthost')) {
                        console.log("there is a previous hostname. use it.", $.cookie('lasthost'));
                        host = $.cookie('lasthost');
                    } else {
                        host = "localhost";
                    }
                }
                var fullurl;
                if (host.match(/^ws/))
                    fullurl = host;
                else if (host.match(/:\d+$/))
                    fullurl = "ws://" + host + "/ws";
                else
                    fullurl = "ws://" + host + ":8989/ws";
                    
                // see if we need wss://
                if (location.protocol === 'https:') {
                    // page is secure
                    console.log("this page requires ssl");
                    
                    if (fullurl.match(/wss/i)) {
                        // we're good to try cuz they want wss
                        console.log("good, user wants wss. host:", fullurl);
                    } else {
                        console.log("the websocket host url is not wss. host:", fullurl);
                        if (onfail) onfail.apply(that);
                        return;
                    }
                }
                
                this.conn = new WebSocket(fullurl);
                this.activehost = host;
                console.log(this.conn);
                var that = this;
                that.conn.onopen = function (evt) {
                    that.wsWasEverConnected = true;
                    that.reconMsgHide();
                    that.onWsConnect(evt);
                    $.cookie('lasthost', that.conn.url, {
                        expires: 365,
                        path: '/'
                    });
                    if (onsuccess) onsuccess.apply(that);
                    
                    var slist = that.serverListGet();
                    if (that.conn.url in slist) {
                    	// ignore
                    } else {
                    	// the url we just opened is not in recent list
                      // so add it
                      that.serverListSet(that.conn.url, '<a href="javascript:">' + that.conn.url + '</a>');
                      that.showRecentServerList();
                      
                    }
        
                };
                that.conn.onerror = function (evt) {
                    console.log(evt);
                    that.publishSysMsg("Serial port ajax error.");
                    if (onfail) onfail.apply(that);
                };
                that.conn.onclose = function (evt) {
                    if (that.wsWasEverConnected) that.reconMsgShow();
                    that.onWsDisconnect(evt);
                }
                that.conn.onmessage = function (evt) {
                    that.publishMsg(evt.data);
                };
            } else {
                this.publishSysMsg("Your browser does not support WebSockets.");
            }
        },
        wsScan: function (callback, subnet) {
            // this method will scan your local subnet
            // for hosts
            if (window["WebSocket"]) {
                console.log("starting scan of network for serial port servers...");
                var validAddrs = [];
                var that = this;
                if (subnet)
                    subnet = subnet.replace("*", "");
                else
                    subnet = "192.168.1.";
                var scancntsuccess = 0;
                var scancnterr = 0;
                var cnt = $('#com-chilipeppr-widget-serialport-scanresultcnt');
                cnt.text("Starting scan of " + subnet + "*");
                $('#com-chilipeppr-widget-serialport-scanresult').html("");
                var ctr2 = 1; // keep 2nd ctr so we can increment inside the settimeout
                for (var ctr = 1; ctr < 255; ctr++) {
                //for (var ctr = 1; ctr <= 26; ctr++) {
                
                  setTimeout(function() {
                    var conn = new WebSocket("ws://" + subnet + ctr2++ + ":8989/ws");
                    console.log("attempting to connect to conn url:", conn.url);
                    conn.onopen = function (evt) {
                      scancntsuccess++;
                      console.log("found a server. ip:", evt.target.url, "evt:", evt, "this:", this);
                      validAddrs.push(evt.target);
                      console.log("found one:", validAddrs);
                      var server = $("<div><a href=\"javascript:\">" + evt.target.url + "</a></div>");
                      server.click(evt.target.url, function(evt) {
                        console.log("got click. evt:", evt, "data:", evt.data);
                        that.wsConnect(evt.data);
                      });
                      $('#com-chilipeppr-widget-serialport-scanresult').append(server);
                      that.el = server;
                      var that2 = this;
                      setTimeout(function() { 
                        // close this websocket 2 seconds later
                        that2.close();
                        //that.el.append(" *");
                      }, 1000);
                      
                      // now lets keep a static storage of the existence of this item as well
                      // to make scan easier in the future
                      that.serverListSet(evt.target.url, "initted");
                      
                    };
                    conn.onmessage = function (evt) {
                      // see what version and what hostname
                      console.log("msg from scan of ws:", evt.data, "evt:", evt, "conn:", conn, "conn.url:", conn.url);
                      if (evt.data.match(/^{/)) {
                        // it's json
                        var d = $.parseJSON(evt.data);
                        if ('Version' in d) {
                          that.el.append("&nbsp;<span>v" + d.Version + "</span>");
                          that.serverListSet(conn.url, that.el.html());
                          
                        } else if ('Hostname' in d) {
                          that.el.append("&nbsp;<span>" + d.Hostname + "</span>");
                          that.serverListSet(conn.url, that.el.html());
                        }
                      }
                    };
                    conn.onerror = function(evt) {
                      scancnterr++;
                      //console.log("error opening url:", evt.target.url, evt);

                      cnt.text("Found " + scancntsuccess + ", Scanned " + (scancntsuccess + scancnterr));
                    };
                  }, ctr * 100);
                  
                };
                //console.log("done scanning network. found:", validAddrs);
                return validAddrs;
            }                
        },
        serverListSet: function(key, val) {
          // now lets keep a static storage of the existence of this item as well
          // to make scan easier in the future
          var serverList = this.serverListGet();
          serverList[key] = val;
          var txt = JSON.stringify(serverList);
          localStorage.setItem("com-chilipeppr-widget-serialport-serverList", txt);
          console.log("serverList:", serverList, "txt:", txt);
          },
        serverListGet: function() {
          var serverList = localStorage.getItem("com-chilipeppr-widget-serialport-serverList");
          console.log("got localStorage item:", serverList);
          if (serverList) {
          	serverList = JSON.parse(serverList);
            if (!serverList || serverList == null || serverList == "null") serverList = {};
            console.log("after parse:", serverList);
            
          } else {
          	console.log("got null so setting empty obj");
          	serverList = {};
          }
          return serverList;
        },
        lastMsg: null,
        lastMsgTime: 0,
        publishSysMsg: function (msg) {
            chilipeppr.publish("/" + this.id + "/ws/sys", msg);
            var now = Date.now();
            if (this.lastMsg == msg && now - this.lastMsgTime < 20000) {
                // skip publish
                console.log("skipping publish. same msg or too fast.");
            } else {
                chilipeppr.publish("/com-chilipeppr-elem-flashmsg/flashmsg", "Serial Port System Message", msg);
                this.lastMsg = msg;
                this.lastMsgTime = now;
            }
        },
        deDupeLastMsg: null,
        isInDeDupeMode: false,
        publishMsg: function (msg) {
            if (this.isInDeDupeMode) {
                console.log("in dedupe mode, so checking. msg:", msg, "lastMsg:", this.deDupeLastMsg);
                if (this.deDupeLastMsg == msg) {
                    // found dedupe, so don't publish
                    console.log("dedupe");
                    // this.deDupeLastMsg = msg;
                    return;
                }
            }
            chilipeppr.publish("/" + this.id + "/ws/recv", msg);
            
            if (this.isInDeDupeMode) this.deDupeLastMsg = msg;
        },
        dataBuffer: {},
        onWsMessage: function (msg) {
            //console.log("inside onWsMessage. msg: " + msg);
            if (msg.match(/^\{/)) {
                // it's json
                //console.log("it is json");
                var data = null;
                //try {
                    data = $.parseJSON(msg);
                /*
                } catch (e) {
                    // error
                    console.log("got error parsing json from CNC controller. msg:", msg);
                    // try some cleanup based on some anomalies we've seen
                    msg = msg.replace(/\{"sr"\{"sr"\:/, '{"sr":');
                    msg = msg.replace(/\{"r"\{"sr"\:/, '{"sr":');
                    data = $.parseJSON(msg);
                }
                */
                if (data && data.Cmd && data.Cmd == "OpenFail") {
                    // we tried to open the serial port, but it failed. usually access denied.
                    this.onPortOpenFail(data);
                } else if (data && data.Cmd && data.Cmd == "Open") {
                    // the port was opened, possibly by other browser or even locally from sys tray
                    this.onPortOpen(data);
                } else if (data && data.Cmd && data.Cmd == "Close") {
                    // the port was closed, possibly by other browser or even locally from sys tray
                    this.onPortClose(data);
                } else if (data && data.Cmd && data.Cmd == "Queued") {
                    // we need to watch for queues being done so we know to send next
                    // is it a json queued response or text mode queued response
                    if ("Data" in data) {
                        // it is a json mode response
                        this.onQueuedJson(data);
                    } else {
                        this.onQueuedText(data); 
                        //this.sendBufferedOnWsRecv(data);
                    }
                    // update prog bar of buffer
                    this.onUpdateQueueCnt(data);
                } else if (data && data.Cmd && data.Cmd == "Write") {
                    // update prog bar of buffer. this would decrement prog bar cuz a dequeue happened
                    // see if we have an Id resposne, if so it is from
                    // a json send and we need to see the response
                    if ("Id" in data) {
                        this.onWriteJson(data);
                    }
                    this.onUpdateQueueCnt(data);
                } else if (data && data.Cmd && (data.Cmd == "Complete" || data.Cmd == "CompleteFake")) {
                    this.onCompleteJson(data);
                } else if (data && data.Cmd && data.Cmd == "Error") {   
                    //if cnc returns error, publish error signal.
                    this.onErrorJson(data);
                } else if (data && data.Cmd && data.Cmd == "Broadcast") {   
                    // if spjs returns broadcast, publish broadcast signal.
                    this.onBroadcast(data);
                } else if (data && 'Announce' in data) {   
                    // if spjs returns an announce msg from a Cayenn device (IoT device), publish broadcast signal.
                    this.onAnnounce(data);
                } else if (data && data.Cmd && data.Cmd == "FeedRateOverride") {   
                    // if spjs returns FeedRateOverride, publish onFeedRateOverride signal.
                    this.onFeedRateOverride(data);
                } else if (data && data.SerialPorts) {
                    // we got a serial port list
                    console.log("got serial port list");
                    console.log(data);
                    this.onPortList(data.SerialPorts);
                } else if (data && data.Version) {
                    this.onVersion(data.Version);
                } else if (data && data.Hostname) {
                    this.onSpjsName(data.Hostname);
                } else if (data && data.P && data.D) {
                    
                    // we got actual raw serial port data
                    // we need to parse into newlines and buffer
                    // for the next time we get here and only fire off
                    // a publish per newline
                    
                    if (this.isSingleSelectMode && this.singleSelectPort == data.P) {
                        
                        //console.log("this:", this);
                        //console.log("dataBuffer:", this.dataBuffer);
                        //console.log("p:", data.P, "d:", data.D);
                        //console.log(this.dataBuffer[data.P]);
                        if(!(data.P in this.dataBuffer))
                            this.dataBuffer[data.P] = data.D;
                        else
                            this.dataBuffer[data.P] += data.D;
                        //console.log(this.dataBuffer[data.P]);
                        //console.log("dataBuffer:", this.dataBuffer);
                        
                        //var portBuf = this.dataBuffer[data.P];
                        
                        // see if we got newline
                        while (this.dataBuffer[data.P].match(/\n/)) {
                            //console.log("we have a newline.");
                            var tokens = this.dataBuffer[data.P].split(/\n/);
                            var line = tokens.shift() + "\n";
                            this.dataBuffer[data.P] = tokens.join("\n");
                            //console.log("publishing line:", line);
                            //console.log("new buffer:", this.dataBuffer[data.P], "len:", this.dataBuffer[data.P].length);
                            
                            // do some last minute cleanup
                            // THIS IS NOT GOOD, BUT SEEING TINYG SHOWING BAD DATA
                            // THIS IS ALSO NOT THE RIGHT SPOT SINCE THIS SERIAL PORT WIDGET IS SUPPOSED
                            // TO BE GENERIC. Remove when TinyG has no problems.
                            line = line.replace(/\{"sr"\{"sr"\:/, '{"sr":');
                            line = line.replace(/\{"r"\{"sr"\:/, '{"sr":');
                            
                            chilipeppr.publish("/" + this.id + "/recvline", {
                                ws: this.conn.url,
                                port: data.P,
                                dataline: line
                            });
                            
                        }
                    } else {
                        console.log("have a /recvline to publish, but since in single select mode we don't have a match to the selected port so ignoring.");
                    }
                    
                }
                
            } else if (msg.match(/We could not find the serial port/)) {
                // kind of a hack to send publishSysMsg when we get this
                // the serial-port-json-server should be changed to send this as json
                this.publishSysMsg(msg);
            }
        },
        configSendCtr: 0,
        onPortOpen: function(data) {
            console.group("onPortOpen");
            console.log("Open a port: ", data, data.Port);
            var portname = data.Port;
            // swap back weird characters
            portname = this.toSafePortName(portname);
            console.log("got onPortOpen. portname to use for dom lookups:", portname);
            $('#' + portname + "Cb").prop('checked', true);
            $('#' + portname + "Row .glyphicon-exclamation-sign").addClass("hidden");
            if (this.isSingleSelectMode) {
                console.log("got port open but in single select mode.");
                // hilite this port
                $('.com-chilipeppr-widget-serialport-portlist > tbody > tr').removeClass("success");
                $('#' + portname + "Row").addClass("success");
                this.singleSelectPort = data.Port;
                // save cookie, but let path be to this workspace so other workspaces using this
                // widget leave their own default last singleSelectPort
                $.cookie("singleSelectPort", data.Port, { expires: 365 * 10 });
            }
            
            // publish /ws/onconnect
            chilipeppr.publish('/' + this.id + '/ws/onconnect', data, {websocket:this.conn, host:this.activehost});
            
            // publish /onportopen
            chilipeppr.publish('/' + this.id + '/onportopen', data);
            
            // if user has a startup script for this port, let's run it here
            console.log("seeing if we should run a startup script. data:", data);
            var portid = data.Port;
            var url = this.conn.url;
            var key = "portid:" + portid + ",url:" + url;
            var script = localStorage.getItem(key, $('#com-chilipeppr-serialport-modalconfig textarea').val());
            console.log("the script key:", key, "val is:", script);
            
            // only send this config info like 1 second later
            var that = this;
            setTimeout(function() {
                chilipeppr.publish("/com-chilipeppr-widget-serialport/jsonSend", {Id:"startup" +  that.configSendCtr++, D:script});
            }, 3000);
            
            console.groupEnd();

        },
        onPortClose: function(data) {
            console.log("Close a port: ", data, data.Port);
            var portname = data.Port;
            portname = this.toSafePortName(portname);
            $('#' + portname + "Cb").prop('checked', false);
            $('#' + portname + "Row .glyphicon-exclamation-sign").addClass("hidden");
            
            // publish /onportclose
            chilipeppr.publish('/' + this.id + '/onportclose', data);
        },
        onPortOpenFail: function(data) {
            console.log("Opening a port failed: ", data, data.Port);
            var portname = data.Port;
            portname = this.toSafePortName(portname);
            $('#' + portname + "Cb").prop('checked', false);
            //$('#' + portname + "Row .glyphicon-exclamation-sign").prop("title", data.Desc);
            $('#' + portname + "Row .glyphicon-exclamation-sign").removeClass("hidden");
            $('#' + portname + "Row .glyphicon-exclamation-sign").tooltip({
                title: data.Desc,
                animation: true,
                delay: 100,
                container: 'body'
            });
            // publish /onportopenfail
            chilipeppr.publish('/' + this.id + '/onportopenfail', data);
        },
        toSafePortName: function(portname) {
            // we need to convert vals that could show up in the port name
            // with vals that are safe to use in the DOM as id's
            portname = portname.replace(/\//g, "-fslash-");
            portname = portname.replace(/\./g, "-dot-");
            return portname;
        },
        fromSafePortName: function(safeportname) {
            safeportname = safeportname.replace(/-fslash-/g, "/");
            safeportname = safeportname.replace(/-dot-/g, ".");
            return safeportname;
        },
        onPlannerResumeSetup: function() {
            chilipeppr.subscribe('/com-chilipeppr-interface-cnccontroller/plannerresume', this.onPlannerResume.bind(this));
        },
        // called when we see '/com-chilipeppr-interface-cnccontroller/plannerresume'
        onPlannerResume: function() {
            this.isPlannerPaused = false;
        },
        queueMax: {}, // stores max vals we've seen
        queueEls: {}, // stores dom elements so don't have to look up each time
        sendPauseAt: 20000, // we will ask the Gcode widget to pause send if our buffer gets this high
        sendResumeAt: 15000, // we will send resume when buffer gets back here
        isPlannerPaused: false,
        onUpdateQueueCnt: function(data) {
            // we'll get json like this so we know our buffer state in spjs
            // {"Cmd":"Queued","QCnt":6,"Type":["Buf","Buf","Buf","Buf","Buf"],...,"Port":"COM22"}
            
            console.log("got onUpdateQueueCnt. data:", data);
            var port = data.Port;
            if ('P' in data) port = data.P;
            var i = this.toSafePortName(port);
            if (data.Cmd == "Queued" || data.Cmd == "Write") {
                var val = data.QCnt;
                
                // fire off a pubsub for QCnt
                //chilipeppr.publish("/" + this.id + "/qcnt", val);
                
                // see if we need to pause or resume
                if (this.isPlannerPaused) {
                    if (val < this.sendResumeAt) {
                        // send resume
                        chilipeppr.publish('/com-chilipeppr-interface-cnccontroller/plannerresume');
                        this.isPlannerPaused = false;
                    }
                } else {
                    if (val > this.sendPauseAt) {
                        this.isPlannerPaused = true;
                        chilipeppr.publish('/com-chilipeppr-interface-cnccontroller/plannerpause');
                    }
                }
                
                // recalc max value
                if (!(i in this.queueMax) || this.queueMax[i] < val) {
                    this.queueMax[i] = val;
                    $('#' + i + "BufferProgBar").attr('aria-valuemax', val);
                } 
                var valpct = (val / this.queueMax[i]) * 100;
                $('#' + i + "BufferProgBar").css('width', valpct+'%').attr('aria-valuenow', val).parent().removeClass("hidden");
                var color = "white";
                if (valpct < 30.0) color = "black";
                $('#' + i + "BufferProgBar span").text(val).css('color', color);
            }
        },
        // try to detect the type of serial port this is. as of version 1.82
        // spjs reports back vids/pids and better port names on all OS's so
        // we can do our best job detecting
        deviceMeta: {
            "ftdi_or_tinyg" : {
                vidpids: [{vid:"0403", pid:"6015"}],
                //regexp: /tinyg v2/i,
                //name: "TinyG v8",
                buffer: "tinyg",
                baud: "115200",
                img: "http://chilipeppr.com/img/icons/tinyg-ftdi-icon.jpg"
            },
            "tinyg" : {
                //vidpids: [{vid:"0403", pid:"6015"}],
                vidpids: [{vid:"", pid:""}],
                name: "TinyG v8",
                buffer: "tinyg",
                baud: "115200",
                img: "http://chilipeppr.com/img/boards/tinyg.jpg"
            },
            "tinygv9" : {
                vidpids: [{vid:"", pid:""}],
                name: "TinyG v9",
                //regexp: /tinyg v2/i,
                buffer: "tinygg2",
                baud: "115200",
                img: "http://chilipeppr.com/img/boards/tinygv9.jpg"
            },
            "tinygg2" : {
                vidpids: [{vid:"1D50", pid:"606D"}],
                name: "TinyG G2",
                regexp: /tinyg v2/i,
                removeRelatedNames: true,
                //removeBuffer: true,
                removeBaud: true,
                buffer: "tinygg2",
                baud: "115200",
                img: "http://chilipeppr.com/img/boards/tinygv9.jpg"
            },
            "arduino_due_x_dbg" : {
                vidpids: [{vid:"2341", pid:"003D"}],
                regexp: /arduino due programming/i,
                removeBuffer: true,
                removeBaud: true,
                buffer: "default",
                baud: "9600",
                img: "http://chilipeppr.com/img/boards/duetrans100wide150tall.png"
            },
            "uno" : {
                vidpids: [{vid:"2341", pid:"0043"}, {vid:"2341", pid:"0001"}, {vid:"2A03", pid:"0043"}],
                regexp: /arduino uno/i,
                name: "Arduino Uno",
                buffer: "default",
                img: "http://chilipeppr.com/img/boards/uno150w101h.png"
            },
            "yun" : {
                vidpids: [{vid:"2341", pid:"0041"}, {vid:"2341", pid:"8041"}, {vid:"2A03", pid:"0041"}, {vid:"2A03", pid:"8041"}],
                //regexp: /arduino uno/i,
                name: "Arduino Yun",
                buffer: "default",
                img: "http://chilipeppr.com/img/boards/yun.jpg"
            },
            "mega2560" : {
                vidpids: [{vid:"2341", pid:"0042"}],
                //regexp: /arduino mega2560/i,
                name: "Arduino Mega2560",
                buffer: "default",
                img: "http://chilipeppr.com/img/boards/mega.jpg"
            },
            // "ch340" : {
            //     vidpids: [{vid:"1A86", pid:"7523"}],
            //     //regexp: /arduino mega2560 clone/i,
            //     name: "CH340 Generic",
            //     // buffer: "default",
            //     img: "http://chilipeppr.com/img/boards/megaCh340.jpg"
            // },
            "nodemcu" : {
                vidpids: [{vid:"10c4", pid:"ea60"}],
                name: "NodeMCU / CP2102",
                buffer: "nodemcu",
                baud: "115200",
                img: "https://github.com/chilipeppr/workspace-nodemcu/raw/master/nodemcu.jpg"
            }
        },
        setPortItemsFromMetaData: function(dm /*device meta*/, item /*port*/, portlistIndex) {
            
            console.log("setting port data from device meta. port:", item, "device meta:", dm);
            
            // attach the meta to the item for later reference
            item.meta = dm;
            
            // set the img if there is one
            if ('img' in dm && dm.img.length > 0) item.img = dm.img;
            
            // override the friendly name if there is one
            if ('name' in dm && dm.name.length > 0) {
                item.Friendly = dm.name + " (" + item.Name.replace("/dev/", "") + ")";
                item.DisplayName = dm.name;
            } else {
                // if we don't have an enhanced name, use the ugly USB name if there was
                // one
                item.DisplayName = item.Friendly;
            }
            
            // set the buffer if we have one
            if ('buffer' in dm && dm.buffer) {
                item.metaBuffer = dm.buffer;
            }
            
            // set the baud if we have one
            if ('baud' in dm && dm.baud) {
                item.metaBaud = dm.baud;
            }
            
            if ('removeBuffer' in dm && dm.removeBuffer) item.removeBuffer = true;
            if ('removeBaud' in dm && dm.removeBaud) item.removeBaud = true;
            
            // see if this wants us to remove related names/ports
            if ('removeRelatedNames' in dm && dm.removeRelatedNames && 'RelatedNames' in item && item.RelatedNames) {
                
                console.log("yes, they want us to remove related ports");
                
                // override the friendly name if there is one
                if ('name' in dm && dm.name.length > 0) {
                    item.Friendly = dm.name + " (" + 
                        item.Name.replace("/dev/", "") + " & " +
                        item.RelatedNames.join(", ").replace("/dev/", "") +
                        ")";
                }
                /*if ('name' in dm && dm.name.length > 0) {
                    item.Friendly = dm.name + " <small><br>" + 
                        item.Name.replace("/dev/", "") + " & " +
                        item.RelatedNames.join(", ").replace("/dev/", "") +
                        "</small>";
                }*/
                
                for (var i = 0; i < item.RelatedNames.length; i++) {
                    var portToDelete = item.RelatedNames[i];
                    // now we have to loop thru the portlist and delete the value
                    // but since we're already iterating the array of objects, let's just
                    // mark as deleted
                    for (var portindex in this.portlist) {
                        var port = this.portlist[portindex];
                        if (port.Name == portToDelete) {
                            console.log("found port to delete. port:", port.Name);
                            port.isDeleted = true;
                            break;
                        }
                    }
                }
            }
            
            this.portlist[portlistIndex] = item;
            console.log("at finish of setting port info from meta data. item:", this.portlist[portlistIndex]);
        },
        isInitting: true, // the first time thru onPortList assume we are in initting mode because SPJS may already be connected to a port and if so we want to publish signals to other widgets indicating so
        onPortList: function (portlist) {
            console.group("serial port widget onPortList");
            //console.log("inside onPortList");
            var html = "";
            var htmlFirst = ""; // show the connected ports first in the HTML
            var that = this;
            this.portlist = portlist;
            
            // publish the port list for other listeners
            chilipeppr.publish("/com-chilipeppr-widget-serialport/list", portlist);

            // now build the UI
            
            // keep flag for whether we know what all these devices are
            // thus we can hide the buffer encouragement flag
            var areAllDevicesKnown = true;
            
            // get arduino icon
            var arduinoIcon = $('#com-chilipeppr-icon-arduino');
            //arduinoIcon.removeClass("hidden");
            console.log("arduinoIcon:", arduinoIcon); //, "html:", arduinoIcon.parent.html());
            
            if (portlist.length > 0) {
                $.each(portlist, function (portlistIndex, item) {
                    console.log("looping thru ports. item:", item);
                    
                    // see if this is deleted
                    if (item.isDeleted) {
                        console.log("this port is deleted so skipping");
                        return;
                    }
                    
                    // create friendly version of port name
                    item.DisplayPort = item.Name.replace("/dev/", "");
                    
                    var rowClass = "";
                    if (item.Name == that.singleSelectPort) {
                        rowClass = "success";
                    }
                    var i = item.Name;
                    i = that.toSafePortName(i);
                    console.log("the port name we will use is:", i);
                    
                    // create available algorithms dropdown
                    var availArgsHtml = "";
                    if ('AvailableBufferAlgorithms' in item) {
                        // we are on a version of the server that gives us this
                        availArgsHtml = "<td><select id=\"" + i + "Buffer\" class=\"com-chilipeppr-widget-serialport-buffer\" class=\"form-control\">";
                        //availArgsHtml += "<option></option>"
                        item.AvailableBufferAlgorithms.forEach(function(alg) {
                            //console.log("algorithm:", alg);
                            availArgsHtml += "<option value=\"" + alg + "\">" + alg + "</option>";
                        });
                        availArgsHtml += "</select>" + 
                            //"</td>" + 
                            "";
                    }
                    
                    // check if we have meta data for this serial port device
                    // we can do this by checking vid/pid or a regexp on Friendly name
                    console.log("looking for vid/pid or regexp:", item.UsbVid, item.UsbPid, item.regexp);
                    
                    var foundMeta = false;
                    
                    for (var key in that.deviceMeta) {
                        var dm = that.deviceMeta[key];
                        
                        console.log("working on device meta:", dm);
                        
                        // try out the vid/pid match. we get back vendor id
                        // and product id from spjs now cuz it iterates USB data
                        var isMatchOnVidPid = false;
                        
                        for (var indx = 0; indx < dm.vidpids.length; indx++) {
                            var cvp = dm.vidpids[indx];
                            
                            // see if device meta even has vid/pid defined and if they match
                            if ('UsbVid' in item && cvp.vid.length > 0 && cvp.pid.length > 0 && item.UsbVid.toLowerCase() == cvp.vid.toLowerCase() && item.UsbPid.toLowerCase() == cvp.pid.toLowerCase() ) {
                                
                                console.log("we have a match on vid/pid");
                                isMatchOnVidPid = true;
                                foundMeta = true;
                                item.devicekey = key;
                                that.setPortItemsFromMetaData(dm, item, portlistIndex);
                                
                                break;
                            }
                        }
                        
                        if (isMatchOnVidPid) {
                            console.log("since found vid/pid, break the for loop that is looping on meta data, cuz we're done");
                            break;
                        }
                        
                        // if no match on vid/pid, see if regexp match
                        if ('regexp' in dm && dm.regexp) {
                            // there is a regexp to test on, give it a try
                            console.log("looking for regexp:", dm.regexp);
                            if (item.Friendly.match(dm.regexp)) {
                                // we got a match, awesome
                                console.log("we got a match on regexp on friendly");
                                
                                foundMeta = true;
                                item.devicekey = key;
                                that.setPortItemsFromMetaData(dm, item, portlistIndex);
                                
                            }
                        }
                    }
                    
                    // see if we had meta data
                    if (foundMeta) {
                        // good, we had meta data
                        console.log("we had a match on meta data for this port, so known device");
                    } else {
                        // we did not have meta data, that means an unknown,
                        // so we have to show buffer encouragement
                        console.log("we did not have meta data for this port.");
                        areAllDevicesKnown = false;
                    }
                    
                    
                    // if no img, set to empty
                    var imgTag = "";
                    if ('img' in item && item.img.length > 0) 
                        imgTag = " src=\"" + item.img + "\" ";
                    else
                        imgTag = " style=\"width:0;\" ";

                    var row = "<tr id=\"" + i + "Row\" class=\"" + rowClass + "\"><td  style=\"cursor:pointer;\">" +
                        "<input id=\"" + i + "Cb\" type=\"checkbox\" style=\"cursor:pointer;\"/> <span class=\"glyphicon glyphicon-exclamation-sign text-danger hidden\" data-toggle=\"tooltip\" data-placement=\"auto\"></span>" +
                        "</td><td id=\"" + i + "Img\" class=\"deviceImgTd\" style=\"cursor:pointer;\"><img class=\"deviceimg\" " + imgTag + " /></td>" +
                        "</td><td id=\"" + i + "Friendly\" style=\"cursor:pointer;\">" + item.Friendly + "</td>" +
                        availArgsHtml +
                        //"<td>" + 
                        //"<br>" +
                        "<select id=\"" + i + "Baud\" class=\"com-chilipeppr-widget-serialport-baud\" class=\"form-control\">" +
                        that.getBaudRates() +
                        "</select>" + 
                        "</td>" +
                        
                        "<td>" + 
                        "<div class=\"btn-group-vertical\" role=\"group\">" +
                        "<button id=\"" + i + "Config\" class=\"btn btn-xs btn-default btn-top\" data-toggle=\"popover\" data-placement=\"auto\" data-container=\"body\" data-content=\"Startup script for this serial port.\" data-trigger=\"hover\"><span class=\"glyphicon glyphicon-cog\"></span></button>" + 
                        "<button id=\"" + i + "Program\" class=\"btn btn-xs btn-default btn-middle com-chilipeppr-serialport-programmerBtn\" data-toggle=\"popover\" data-placement=\"auto\" data-container=\"body\" data-content=\"Program the board's firmware.\" data-trigger=\"hover\"><span class=\"glyphicon\">" +  
                        //arduinoIcon[0].innerHTML + 
                        arduinoIcon.html() + 
                        "</span></button>" + 
                        "<button id=\"" + i + "SetDefault\" class=\"btn btn-xs btn-default btn-bottom com-chilipeppr-serialport-setDefaultBtn\" data-toggle=\"popover\" data-placement=\"auto\" data-container=\"body\" data-content=\"Manually set this port to the default port (green).\" data-trigger=\"hover\"><span class=\"glyphicon glyphicon-ok\"></span></button>" +  
                        "</div>" +
                        "</td>" +
                        
                        "</tr>";
                    if ('IsOpen' in item && item.IsOpen == true)
                        htmlFirst += row;
                    else
                        html += row;
                });
            } else {
                // no serial ports in list
                html = '<div class="alert alert-danger" style="margin-bottom:0;">No serial ports found on your Serial Port JSON Server.</div>';
            }
            html = htmlFirst + html;
            $('.table.com-chilipeppr-widget-serialport-portlist tbody').html(html);
            
            console.log("about to do baud/buffer override for isopen, cookie, meta, etc");
            $.each(portlist, function (i, item) {
                // now set the values from the cookie so we make their life easier
                var cookie = that.serialGetCookie(item.Name);
                //console.log("got cookie for ", item.Name, " cookie:", cookie);
                //console.log(cookie.baud);
                
                var i = that.toSafePortName(item.Name);
                
                //debugger;
                
                // do baud
                if ('metaBaud' in item && item.metaBaud) {
                    // we found the baud in our meta data, which means
                    // we let it override everything
                    $('#' + i + "Baud").val(item.metaBaud);
                } else if (cookie && cookie.baud) {
                    // choose baud stored in the cookie
                    $('#' + i + "Baud").val(cookie.baud);
                } else {
                    // if no cookie then fallback to default
                    // for the workspace type we're in
                    if (that.defaultBaud) {
                        $('#' + i + "Baud").val(that.defaultBaud);
                    }
                }
                
                // see if they want to hide the baud rate
                if ('removeBaud' in item && item.removeBaud) {
                    $('#' + i + "Baud").addClass("hidden");
                }
                
                // now set the values for the bufferflow
                if ('metaBuffer' in item && item.metaBuffer) {
                    // we found the buffer in our meta data, which means
                    // we let it override everything
                    $('#' + i + "Buffer").val(item.metaBuffer);
                } else if (cookie && cookie.buffer) {
                    // choose baud stored in the cookie
                    $('#' + i + "Buffer").val(cookie.buffer);
                } else {
                    // if no cookie, fallback to default
                    if ('buffertype' in that && that.buffertype && that.buffertype.length > 0) {
                        $('#' + i + "Buffer").val(that.buffertype);
                    }
                }
                
                // see if they want to hide the baud rate
                if ('removeBuffer' in item && item.removeBuffer) {
                    $('#' + i + "Buffer").addClass("hidden");
                    // set colspan one wider than it is now
                    
                }
                
                // we may have set the default vals from the cookie, but now override
                // based on what the serial port server has open and what those settings are
                if (item.IsOpen) {
                    $('#' + i + "Cb").prop('checked', item.IsOpen);
                    // choose baud it was opened at
                    $('#' + i + "Baud").val(item.Baud);
                    // choose buffer it was opened as
                    $('#' + i + "Buffer").val(item.BufferAlgorithm);
                    // lock pulldown
                    $('#' + i + "Buffer").prop("disabled", true);
                    //debugger;
                    // see if open as a true buffer and then add a buffer bar
                    if (that.versionFloat >= 1.4) {
                        console.log("adding buffer bar");
                        $('#' + i + "Buffer").parent().append(
                            '<div class="progress hidden com-chilipeppr-widget-serialport-progbar">' +
                            '<div id="' + i + 'BufferProgBar" class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="10" style="width: 80%;">' +
                            '    <span class="" style="min-width:20px;padding-left:3px;">Unknown</span>' +
                            '</div>' +
                            '</div>');
                    }
                    
                    // if isInitting then fire off fake onportopen signals
                    // as if user just opened this port
                    if (that.isInitting) {
                        chilipeppr.publish("/com-chilipeppr-widget-serialport/onportopen", item);
                    }
                }
                
                // set default buffer based on what was set (if anything) in this.bufferType
                // but only do it if item is not open and there's no cookie
                if (item.IsOpen == false && cookie && !('buffer' in cookie) && that.buffertype != null) {
                    console.log("setting default buffer type cuz item not open, no cookie, and is a default buf type. item:", item);
                    $('#' + i + "Buffer").val(that.buffertype);
                }

                // pass my item inside the data val on the click event
                $('#' + i + "Cb").parent().click({that:that,port:item}, that.onPortCbClicked);
                $('#' + i + "Friendly").click({that:that,port:item}, that.onPortFriendlyClicked);
                $('#' + i + "Img").click({that:that,port:item}, that.onPortFriendlyClicked);
                
                // if they click the config button
                $('#' + i + "Config").click({that:that,port:item}, that.onPortConfigClicked.bind(that));

                // if they click the programmer button
                $('#' + i + "Program").click({that:that,port:item}, that.onPortProgramClicked.bind(that));

                // if they click the set default button
                $('#' + i + "SetDefault").click({that:that,port:item,rowName:i}, that.onPortSetDefaultClicked.bind(that));
            });

            // set isInitting to false, that means only the 1st time
            // thru this method will we do any isInitting code
            if (that.isInitting) {
                console.log("setting isInitting to false so don't run init code again on port list");
                that.isInitting = false;
            }
            
            // now do last check on whether to hide buffer encouragement
            console.log("about to check if we need to hide buffer encouragement. areAllDevicesKnown:", areAllDevicesKnown);
            if (areAllDevicesKnown == true) {
                // we can hide buffer encouragement
                console.log("cuz all devices are known, we can safely hide");
                this.hideBufferEncouragement();
            }
            
            this.showAllPopovers();
            
            // publish the port list for other listeners
            chilipeppr.publish("/com-chilipeppr-widget-serialport/listAfterMetaDataAdded", portlist);

            console.groupEnd();
            
        },
        showAllPopovers: function() {
            $('.com-chilipeppr-widget-serialport .btn').popover({
                animation: true,
                delay: 100,
                //container: 'body'
            });
        },
        hideAllPopovers: function() {
            $('.com-chilipeppr-widget-serialport .btn').popover('hide');
        },
        onPortSetDefaultClicked: function(evt) {
            console.log("set default btn clicked for evt.data:", evt.data, "this.conn:", this.conn);
        
            // hilite this port
            var data = evt.data;
            $('.com-chilipeppr-widget-serialport-portlist > tbody > tr').removeClass("success");
            $('#' + data.rowName + "Row").addClass("success");
            this.singleSelectPort = data.port.Name;
            
            // now publish for other listeners who want to know if single select port changed
            this.publishSingleSelectPort();
            
            // reset the is waiting flag just to make sure things are sort of reset
            // so that commands still go out to this new serial port we just changed to
            this.isSendBufWaitingJson = false;
        },
        onPortProgramClicked: function(evt) {
            console.log("programmer btn got clicked for evt.data:", evt.data, "this.conn:", this.conn);
            this.hideAllPopovers();
            var port = evt.data.port.Friendly;
            var portid = evt.data.port.Name;
            var that = this;
            cprequire(
                ["inline:com-chilipeppr-widget-programmer"],
                function (programmer) {
                    programmer.init();
                    programmer.show({
                        port: portid,
                        device: evt.data.port.devicekey, //'arduino_due_x_dbg',
                        //url: 'http://synthetos.github.io/g2/blahblah.bin'
                        spjsVersion: that.versionFloat
                    });
                }
            );
        },
        onPortConfigClicked: function(evt) {
            console.log("config got clicked for evt.data:", evt.data, "this.conn:", this.conn);
            this.hideAllPopovers();
            var port = evt.data.port.Friendly;
            var portid = evt.data.port.Name;
            var url = this.conn.url;
            var key = "portid:" + portid + ",url:" + url;
            var script = localStorage.getItem(key, $('#com-chilipeppr-serialport-modalconfig textarea').val());
            
            $('#com-chilipeppr-serialport-modalconfig textarea').val(script);
            
            $('#com-chilipeppr-serialport-modalconfig .modalconfig-port').text(port);
            $('#com-chilipeppr-serialport-modalconfig .modalconfig-url').text(this.conn.url);
            $('#com-chilipeppr-serialport-modalconfig .modalconfig-portid').text(portid);
            $('#com-chilipeppr-serialport-modalconfig .modalconfig-save-btn').data('id', portid);
            // unbind all previous click events
            $('#com-chilipeppr-serialport-modalconfig .modalconfig-save-btn').off("click");
            /// rebind new click event
            $('#com-chilipeppr-serialport-modalconfig .modalconfig-save-btn').click(evt.data, this.onPortConfigModalSave.bind(this));

            $('#com-chilipeppr-serialport-modalconfig').modal('show');
            
            // now check user
            this.checkLogin();
        },
        onPortConfigModalSave: function(evt) {
            console.log("got save on port config modal. evt.data:", evt.data);
            
            // save to local config
            var portid = evt.data.port.Name;
            var url = this.conn.url;
            var key = "portid:" + portid + ",url:" + url;
            var val = $('#com-chilipeppr-serialport-modalconfig textarea').val();
            // ensure newline at end
            if (val.match(/\n$/)) {
                console.log("there was newline at end. good.");
            } else {
                val += "\n";
                console.log("there was no newline, so added one.");
            }
            console.log("saving config for port key:", key, "val:", val, {key:key, val:val});
            localStorage.setItem(key, val);
            $('#com-chilipeppr-serialport-modalconfig').modal('hide');
            
            chilipeppr.publish("/com-chilipeppr-elem-flashmsg/flashmsg", "Saved Startup Script for " + portid, "Saved your startup script. It will be run when you connect to the port.");
        
            // now, let's also save this to ChiliPeppr cloud storage
            var that = this;
            var cpkey = "com-chilipeppr-serialport-script-" + Date.now() + "-" + evt.data.port.DisplayPort;
            var cpval = {
                portid: portid,
                port: evt.data.port,
                url: url,
                script: val,
                saveDate: Date.now()
            }
            var cpvalstr = encodeURIComponent(JSON.stringify(cpval));
            var cpvalstr = JSON.stringify(cpval);
            var amp = encodeURIComponent("&");
            cpvalstr = cpvalstr.replace(/&/, amp);
            console.log("about to save to chilipeppr cloud. cpkey:", cpkey, "cpval:", cpval, "cpvalstr:", cpvalstr);
            var url = "http://www.chilipeppr.com/dataput?key=" + cpkey + "&val=" + cpvalstr + "&callback=?";
            // url = encodeURI(url);
            console.log("len of url:", url.length, "url:", url);
            var jqxhr = $.ajax({
              url: url,
              dataType: 'jsonp',
            //   jsonpCallback: 'serialport_dataputCallback',
              cache: false,
            }).done(function(data) {
              console.log(data);
            });
            
        },
        currentUser: null,
        checkLogin: function() {
          var that = this;
          var jqxhr = $.ajax({
              url: "http://www.chilipeppr.com/datalogin?callback=?",
              dataType: 'jsonp',
              jsonpCallback: 'headerpanel_dataloginCallback',
              cache: true,
            }).done(function(data) {
              console.log(data);
              if (data.CurrentUser != undefined && data.CurrentUser != null) {
                console.log("user logged in ", data.CurrentUser);
                that.currentUser = data.CurrentUser;
                $('#com-chilipeppr-serialport-modalconfig .alert-warning .msg').text("User logged in as " + that.currentUser.Email + ". Saved config scripts available in menu to right.");
                // $('#com-chilipeppr-hdr-login').text(data.CurrentUser.Email);
                // $('#com-chilipeppr-hdr-dd-login').addClass("hidden");
                // $('#com-chilipeppr-hdr-dd-logout').prop('href', data.LogoutUrl);
                // // if they click their login id log them out
                // $('#com-chilipeppr-hdr-login').prop('href', data.LogoutUrl);
                that.getUserDataKeysFromChiliPepprStorage();
              } else {
                console.log("user NOT logged in");
                $('#com-chilipeppr-serialport-modalconfig .alert-warning .msg').text("User not logged in so can't show saved configs or save your new one.");
                // $('#com-chilipeppr-hdr-login').text("Login");
                // $('#com-chilipeppr-hdr-dd-login').removeClass("hidden");
                // $('#com-chilipeppr-hdr-dd-logout').addClass("hidden");
                // $('#com-chilipeppr-hdr-dd-login').prop('href', data.LoginUrl);
                // $('#com-chilipeppr-hdr-dd-login').prop('target', "new");
                // $('#com-chilipeppr-hdr-login').prop('href', data.LoginUrl);
                // $('#com-chilipeppr-hdr-login').prop('target', "new");
              }
            })
            .fail(function() {
              console.warn("Failed to make the ajax call to check ChiliPeppr login status");
            })
        },
        getUserDataKeysFromChiliPepprStorage: function() {

            console.log("Doing getUserDataKeysFromChiliPepprStorage");
            
            // this queries chilipeppr's storage facility to see what
            // keys are available for the user
            //   $('#com-chilipeppr-serialport-modalconfig .alert-warning').addClass('hidden');
            
            
            var that = this;
            var jqxhr = $.ajax({
                dataType: 'jsonp',
                cache: false,
                url: "http://www.chilipeppr.com/datagetallkeys?callback=?",
                //jsonpCallback: 'yourworkspacesCallback',
            })
            .done(function(data) {
            
                // see if error
                if (data.Error) {
                  // we got json, but it's error
                  $('#com-chilipeppr-serialport-modalconfig .alert-warning .msg')
                      .html("<p>We can't retrieve your data from ChiliPeppr because you are not logged in. Please login to ChiliPeppr to see your list of available data keys.</p><p>Error: " + data.Msg + "</p>")
                      .removeClass('hidden');
                  return;
                }
                
                // wipe previous menu items
                $('#com-chilipeppr-serialport-modalconfig .dropdown-menu .recent-file-item').remove();
                
                // loop thru keys and get com-chilipeppr-serialport ones
                var keys = [];
                var keylist = ""; //"<ol>";
                data.forEach(function(item) {
                    console.log("item:", item);
                    if (item.Name && item.Name.match(/com-chilipeppr-serialport-script-/)) {
                        // we have a serial port config file
                        keys.push({
                          name: item.Name,
                          created: item.CreateDate,
                          size: item.ValueSize
                        });
                        //   keylist += "<li>" + item.Name + "</li>";
                        //   keylist += '<li class="recent-file-item"><a href="javascript:">' + item.Name + ' <span class="lastModifyDate">' + item.CreateDate + '</span> ' + item.ValueSize / 1024 + 'KB</a></li>'
                        
                        // append this item to the pulldown menu
                        var itemname = item.Name.replace(/com-chilipeppr-serialport-script-\d+-/, "");
                        var recentLastModified = item.CreateDate;
                        var rlm = new Date(recentLastModified);
                        var recentSize = item.ValueSize;
                        var rsize = parseInt(recentSize / 1024);
                        if (rsize == 0) rsize = 1;
                        var li = $('<li class="recent-file-item ' + item.Name + '"><a xhref="">' + 
                            itemname + ' <span class="lastModifyDate">' +  rlm.toLocaleString() + '</span> ' + 
                            rsize + 'KB</a></li>');
                        // li.click(item, that.onCloudScriptFileClicked.bind(that));
                        $('#com-chilipeppr-serialport-modalconfig .dropdown-menu').prepend(li);
                        
                        // now fire off sub-lookup for this item to load all data
                        var jqxhr = $.ajax({
                            dataType: 'jsonp',
                            cache: false,
                            url: "http://www.chilipeppr.com/dataget?key=" + item.Name + "&callback=?",
                        })
                        .done(function(data) {
                            console.log("got data back from dataget call. data:", data);
                            if ("Value" in data) {
                                var meta = JSON.parse(data.Value);
                                console.log("meta:", meta);
                                var table = "<table class=\"table table-striped table-condensed\" style=\"font-size:11px;margin-bottom: 0;\"><tr>";
                                if ("port" in meta) {
                                    if ("img" in meta.port) table += "<td rowspan=\"2\"><img style=\"width:50px;xpadding-right:10px;\" src=\"" + meta.port.img + "\" /></td>";
                                    if ("DisplayName" in meta.port) table += "<td>" + meta.port.DisplayName + "</td>";
                                    // if ("DisplayPort" in meta.port) table += "<td>" + meta.port.DisplayPort + "</td>";
                                    if ("url" in meta) table += "<td>" + meta.url + "</td>";
                                }
                                table += "</tr>";
                                if ("script" in meta) {
                                    var scr = meta.script.substring(0, 100);
                                    if (meta.script.length > 100) scr += "...";
                                    table += "<tr><td colspan=\"3\" xstyle=\"font-family:monospace\"><pre class=\"script-code\">" + 
                                    scr + "</pre></td></tr>";
                                }
                                table += "</table>";
                                var tableEl = $(table);
                                $('.' + data.Name + " a").append(tableEl);
                                
                                // make click event
                                var payload = data;
                                payload.meta = meta;
                                $('.' + data.Name + " a").click(payload, that.onCloudScriptFileClicked.bind(that));
                            }
                        });
                    }
                }
            );
            //   keylist += "</ol>";
            
            //   $('#com-chilipeppr-serialport-modalconfig .dropdown-menu').html(keylist);
            console.log("added keylist:", keylist);
            
            });
        },
        onCloudScriptFileClicked: function(evt) {
            // put the script into the textarea
            console.log("being asked to insert saved cloud script. evt:", evt);
            
            $('#com-chilipeppr-serialport-modalconfig textarea').val(evt.data.meta.script);
        },
        onPortFriendlyClicked: function(evt) {
            console.log("got onPortFriendlyClicked: ", evt);
            var item = evt.data.port;
            var that = evt.data.that;
            var isSelected = false;
            var i = that.toSafePortName(item.Name);
            if ($('#' + i + "Cb").is(":checked")) isSelected = true;
            if (isSelected) {
                // then we want to close, so uncheck
                $('#' + i + "Cb").prop('checked', false);
            } else {
                $('#' + i + "Cb").prop('checked', true);
            }
            // call the checkbox click event as if we had clicked it
            that.onPortCbClicked(evt);
        },
        onPortCbClicked: function(evt) {
            console.log("got onPortClicked: ", evt);
            var item = evt.data.port;
            var that = evt.data.that;
            console.log(item);
            // see if selected/unselected to know if close/open
            var isSelected = false;
            var i = that.toSafePortName(item.Name);
            if ($('#' + i + "Cb").is(":checked")) isSelected = true;
            
            //console.log("isSelected:", isSelected);
            if (isSelected) {
                // open the port
                // get baud rate picked
                var baud = $('#' + i + "Baud").val();
                var buffer = $('#' + i + "Buffer").val();
                that.serialConnect(item.Name, baud, buffer);
                //that.publishSysMsg("Serial port " + port.Friendly + " opened with baud rate " + baud);
            } else {
                // close the port
                $('#' + i + "Buffer").prop("disabled", false);

                that.serialDisconnect(item.Name);
                //that.publishSysMsg("Serial port " + port.Friendly + " closed");
            }
        },
        bufferAlgorithms: null,
        getBufferAlgorithms: function() {
            if (this.bufferAlgorithms == null) {
                console.log("Need to load algorithms from serial port json server");
                this.wsSend("bufferalgorithms");
                
            }
        },
        getBaudRates : function() {
            var bauds = ["2,400", "4,800", "9,600", "19,200", "38,400", "57,600", "115,200", "230,400"];
            var baudHtml = "";
            $.each(bauds, function(i, item) {
                var clean = item.replace(/,/, "");
                baudHtml += "<option value=\"" + clean + "\">" + item + "</option>";
            });
            return baudHtml;
        },
        onWsConnect: function (event) {
            this.isWsConnected = true;
            //console.log(this.conn);
            //console.log(event);
            chilipeppr.publish("/" + this.id + "/ws/onconnect", "connected", {websocket:this.conn, host:this.activehost});
            // also publish status
            this.onRequestStatus();
            //this.publishSysMsg("Serial port ajax connection opened at " + this.conn.url + ", readyState: " + this.conn.readyState);
            
            // no longer hiding cuz in its own tab
            //$('.com-chilipeppr-widget-serialport-install').addClass('hidden');
            
            // 
            
            // because we're hiding a large mess of text, we should trigger
            // a resize to make sure other widgets reflow since the scroll bar
            // or other stuff may need repositioned
            $(window).trigger('resize'); 
            
            // show the "Port List" tab
            $('a[href=#com-chilipeppr-widget-serialport-portstab]').tab('show');
            
            // hide the warning
            $('#com-chilipeppr-widget-serialport .spjs-notconnectedwarning').addClass("hidden");
            
        },
        onWsDisconnect: function (event) {
            this.hideVersion();
            this.resetSpjsName();
            this.isWsConnected = false;
            chilipeppr.publish("/" + this.id + "/ws/ondisconnect", "disconnected");
            // also publish status
            this.onRequestStatus();
            this.publishSysMsg("Serial port ajax connection closed. " +
                "readyState: " + this.conn.readyState);
            
            // show the warning
            $('#com-chilipeppr-widget-serialport .spjs-notconnectedwarning').removeClass("hidden");

        },
        statusWatcher: function () {
            // This method subscribes to "/ws/sys" and updates the UI with
            // the latest msg
            chilipeppr.subscribe("/" + this.id + "/ws/sys", this, function (msg) {
                $('.com-chilipeppr-widget-serialport-status .well.well-sm').text(msg);
            });
        },
        initBody: function(evt) {
            $('#' + this.id + ' .hidebody').click(this.toggleBody.bind(this));
            var config = localStorage.getItem("/" + this.id + "/body");
            if (config == "hidden")
                this.hideBody();
            else
                this.showBody();
        },
        toggleBody: function(evt) {
            if ($('.' + this.id + '-body').hasClass('hidden'))
                this.showBody(evt);
            else
                this.hideBody(evt);
        },
        showBody: function(evt) {
            $('.' + this.id + '-body').removeClass('hidden');
            $('.' + this.id + '-ftr').removeClass('hidden');
            $('#' + this.id + ' .hidebody span').addClass('glyphicon-chevron-up');
            $('#' + this.id + ' .hidebody span').removeClass('glyphicon-chevron-down');
            if (!(evt == null)) localStorage.setItem("/" + this.id + "/body", "visible");
            $(window).trigger('resize');
        },
        hideBody: function(evt) {
            $('.' + this.id + '-body').addClass('hidden');
            $('.' + this.id + '-ftr').addClass('hidden');
            $('#' + this.id + ' .hidebody span').removeClass('glyphicon-chevron-up');
            $('#' + this.id + ' .hidebody span').addClass('glyphicon-chevron-down');
            if (!(evt == null)) localStorage.setItem("/" + this.id + "/body", "hidden");
        },
        forkSetup: function () {
            var topCssSelector = '.com-chilipeppr-widget-serialport';
            //$(topCssSelector + ' .fork').prop('href', this.fiddleurl);
            //$(topCssSelector + ' .standalone').prop('href', this.url);
            //$(topCssSelector + ' .fork-name').html(this.id);

            $(topCssSelector + ' .panel-title').popover({
                title: this.name,
                content: this.desc,
                html: true,
                delay: 1000,
                animation: true,
                trigger: 'hover',
                placement: 'auto'
            });

            // load the pubsub viewer / fork element which decorates our upper right pulldown
            // menu with the ability to see the pubsubs from this widget and the forking links
            var that = this;
            chilipeppr.load(
                "http://raw.githubusercontent.com/chilipeppr/widget-pubsubviewer/master/auto-generated-widget.html",
                // "http://fiddle.jshell.net/chilipeppr/zMbL9/show/light/", 
                function() {
                require(['inline:com-chilipeppr-elem-pubsubviewer'], function(pubsubviewer) {
                    pubsubviewer.attachTo($(topCssSelector + ' .panel-heading .dropdown-menu'), that);
                });
            });

        },

    }
});