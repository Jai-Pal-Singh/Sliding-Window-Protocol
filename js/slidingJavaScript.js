/* Declaring Global Variables */
window.globals = {
    running: false,
    
    timeout: 6000,
    sws: 5,
    e2ed: 3000,
    minSequenceNumber: 0,
    maxSequenceNumber: 9,
    
    initiate: null,
    pathRectangle: null,
    pointText: null,
    
    dataPackets: [],
    acknowledgementReceived: [],
    packetsReceived: [],
    acknowledgementPackets: [],
    timeOutInt: [],
    
    senderWindow: null,
    receiverWindow: null,
    
    packetsToBeShown: 100, //Fixed length of packets to be shown
    
    currentSenderPacketinArray: 0,
    currentReceiverPacketinArray: 0,
    diff: 0,
    startingSequenceNumber: 0,
    endingSequenceNumber: 0,
    
    staticSenderPackets: [],
    staticReceiverPackets: [],
    senderSequenceNumberText: [],
    receiverSequenceNumberText: [],
    timeOutText: [],
    
    senderName: null,
    receiverName: null,
    
    dY: 0,
    dT: 0
};

/* Input validation and parameters setting */
function checkParameters(element,limit){
    'use strict';

    element.value = Number(element.value);

    var value;
    value = parseInt(element.value);
    if(value>limit) element.value = parseInt(value/10);
}

function updateParameters() {
    'use strict';

    var t,s,e;
    t = parseInt(document.getElementById('timeout').value);
    if(t < 1000 || t>10000) document.getElementById('timeout').value = 6000;

    s = parseInt(document.getElementById('sws').value);
    if(s < 1 || s > 11) document.getElementById('sws').value = 5;

    e = parseInt(document.getElementById('e2ed').value);
    if(e < 1000 || e > 5000) document.getElementById('e2ed').value = 3000;

    globals.timeout = document.getElementById('timeout').value;
    globals.sws = document.getElementById('sws').value;
    globals.e2ed = document.getElementById('e2ed').value;
    globals.maxSequenceNumber = 2 * globals.sws - 1;
}

/* Main Algorithm */
function startAnimation() {
    'use strict';
    updateParameters();
    globals.initiate();
    globals.running = true;
    document.getElementById('startStopButton').value = 'Stop';
    document.getElementById('startStopButton').setAttribute('onclick', 'stopAnimation()');
}

function stopAnimation() {
    'use strict';
    updateParameters();
    globals.running = false;
    document.getElementById('startStopButton').value = 'Start';
    document.getElementById('startStopButton').setAttribute('onclick', 'startAnimation()');
}