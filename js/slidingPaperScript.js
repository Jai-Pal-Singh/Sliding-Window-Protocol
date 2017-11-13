globals.pathRectangle = function(x,y,w,h,stroke) {
    var newPathRectangle = new Path.Rectangle({
                                point: [x,y],
                                size: [w,h],
                                strokeColor:'black',
                                fillColor: stroke
                            });
    return newPathRectangle;
}

globals.pathRectangle1 = function(x,y,w,h,stroke) {
    var newPathRectangle = new Path.Rectangle({
                                point: [x,y],
                                size: [w,h],
                                strokeColor:stroke
                                });
    return newPathRectangle;
}

globals.pointText = function(x,y,content,fontSize,stroke) {
    var newPointText = new PointText({
                                point: [x,y],
                                content: content,
                                justification: 'center',
                                fontSize: fontSize,
                                fillColor: stroke
                            });
    return newPointText;
}

globals.initiate = function initiate() {
    project.clear();
    globals.diff = 10;
    globals.startingSequenceNumber = 0;
    globals.currentSenderPacketinArray = 0;
    globals.currentReceiverPacketinArray = 0;
    var distance = 340;
    globals.dT = 1000/60;
    globals.dY = distance*globals.dT/parseInt(globals.e2ed);
    
    for(var i=0;i<100;i++)
    {
        globals.staticSenderPackets[i] = globals.pathRectangle(10+globals.diff,15,20,40,'aquamarine');
        globals.staticReceiverPackets[i] = globals.pathRectangle(10+globals.diff,320,20,40,'white');
        globals.timeOutText[i] = globals.pointText(15+globals.diff,10,'',10,'black');
        
        var content = ((globals.startingSequenceNumber + i )%(globals.maxSequenceNumber+1)).toString(10);
        globals.senderSequenceNumberText[i] = globals.pointText(20+globals.diff,40,content,15,'black');
        globals.receiverSequenceNumberText[i] = globals.pointText(20+globals.diff,345,content,15,'black');
        
        globals.dataPackets[i] = [];
        globals.acknowledgementReceived[i] = 0;
        globals.packetsReceived[i] = 0;
        globals.acknowledgementPackets[i] = [];
        globals.timeOutInt[i] = 0;
        
        globals.diff += 40;
    }
    
    globals.senderWindow = globals.pathRectangle1(45,10,40*globals.sws,50,'black');
    globals.receiverWindow = globals.pathRectangle1(45,315,40*globals.sws,50,'black');
    
    globals.endingSequenceNumber = (globals.startingSequenceNumber + 35)%(globals.maxSequenceNumber+1);
};

globals.initiate();

var lock = 0;

function onMouseDown(event) {
    if(lock == 0)
    {
        for(var i=0;i<100;i++)
        {
            var length = globals.acknowledgementPackets[i].length;
            for(var j=0;j<length;j++)
            {
                if(globals.acknowledgementPackets[i][j].contains(event.point))
                {
                    globals.acknowledgementPackets[i][j].remove();
                    globals.acknowledgementPackets[i].splice(j,1);
                    return;
                }
            }
            var length = globals.dataPackets[i].length;
            for(var j=0;j<length;j++)
            {
                if(globals.dataPackets[i][j].contains(event.point))
                {
                    globals.dataPackets[i][j].remove();
                    globals.dataPackets[i].splice(j,1);
                    return;
                }
            }
        }
    }
}

function onFrame(event)
{    
    if(globals.running == true)
    {
        var windowSize = parseInt(globals.sws);
        var limit = globals.currentSenderPacketinArray + windowSize;
        if(limit > 100) limit = 100;
        for(var i=0;i<limit;i++)
        {
            if(globals.acknowledgementReceived[i] == 0)
            {
                if(globals.timeOutInt[i] <= 0)
                {
                    globals.dataPackets[i].push(globals.pathRectangle(globals.staticSenderPackets[i].position.x-10,15,20,40,'aquamarine'));
                    globals.timeOutInt[i] = globals.timeout;
                    globals.timeOutText[i].content = globals.timeOutInt[i].toString();
                }
                else
                {
                    globals.timeOutInt[i] = (globals.timeOutInt[i] - globals.dT).toFixed(2);
                    globals.timeOutText[i].content = parseInt(globals.timeOutInt[i]).toString();
                }
            }
            else
            {
                globals.timeOutInt[i] = 0;
                globals.timeOutText[i].content = '';
            }

            var length = globals.dataPackets[i].length;
            for(var j=0;j<length;j++)
            {
                if(Math.random() < 0.95 && globals.dataPackets[i][j].position.y < 340) globals.dataPackets[i][j].position.y += globals.dY;
                if(globals.dataPackets[i][j].position.y >= 340)
                {
                    if(globals.dataPackets[i][j].remove())
                    {
                        globals.dataPackets[i].splice(j,1);
                        length--;
                    }
                    j--;
                    globals.staticReceiverPackets[i].fillColor = 'dodgerblue'; globals.acknowledgementPackets[i].push(globals.pathRectangle(globals.staticReceiverPackets[i].position.x-10,320,20,40,'green'));
                    globals.packetsReceived[i] = 1;
                }
            }
        }
        limit = globals.currentReceiverPacketinArray + windowSize;
        if(limit > 100) limit = 100;
        for(var i=0;i<limit;i++)
        {
            length = globals.acknowledgementPackets[i].length;
            for(var j=0;j<length;j++)
            {
                if(Math.random() < 0.95 && globals.acknowledgementPackets[i][j].position.y > 60) globals.acknowledgementPackets[i][j].position.y -= globals.dY;
                if(globals.acknowledgementPackets[i][j].position.y <= 60)
                {
                    if(globals.acknowledgementPackets[i][j].remove())
                    {
                        globals.acknowledgementPackets[i].splice(j,1);
                        length--;
                    }
                    j--;
                    globals.staticSenderPackets[i].fillColor = 'yellow';
                    globals.acknowledgementReceived[i] = 1;
                }
            }
        }
    }
        
    lock = 1;
    var index = globals.currentReceiverPacketinArray;
    var shift = 0;
    for(var z=0;z<100;z++)
    {
        if(globals.packetsReceived[z] != 1) break;
        else shift++;
    }                            
    globals.currentReceiverPacketinArray = shift;
    var positionIndex = globals.currentReceiverPacketinArray;
    var addPosition = 0;
    if(positionIndex == 100)
    {
        addPosition = 40;
        positionIndex--;
    }
    globals.receiverWindow.position.x = addPosition + globals.staticReceiverPackets[positionIndex].position.x - 20 + 40*(parseInt(globals.sws)/2);

    index = globals.currentSenderPacketinArray;
    shift = 0;
    for(var z=0;z<100;z++)
    {
        if(globals.acknowledgementReceived[z] != 1) break;
        else shift++;
    }
    for(var z=0;z<shift;z++)
    {
        globals.timeOutInt[z] = 0;
        globals.timeOutText[z].content = '';
    }
    globals.currentSenderPacketinArray = shift;
    positionIndex = globals.currentSenderPacketinArray;
    addPosition = 0;
    if(positionIndex == 100)
    {
        addPosition = 40;
        positionIndex--;
    }
    globals.senderWindow.position.x = addPosition + globals.staticReceiverPackets[positionIndex].position.x - 20 + 40*(parseInt(globals.sws)/2);
    lock = 0;
}