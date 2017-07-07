

// read block for block
// scan for comments
//    if block.timestamp and comment.created almost same, then create bubble
// scan for votes
//    if vote for an known bubble, then rescale, if changed maxRShares, then rescale all bubbles

const BLOCK_HISTORY = (60 * 60 * 24 * 2) / 3 + (60 * 60 * 12) / 3; // last 3 days

let scannerTimer = null; 
let lastBlock = null;
let currentBlock = null;
let acttime = null;

function processBlock(transactions) {
    for(let tr of transactions) {
        let currentTime = Date.parse(tr.timestamp);
        let op = tr.op[0];
        let opBody = tr.op[1];
        //console.log("op = ", op);
        switch(op) {
            case "commenе":
                if(opBody.parent_author == "") {
                    console.log("got new post");
                    steem.api.getContent(opBody.author, opBody.permlink, function (err, content) {
                        if(!err && content.permlink == opBody.permlink) {
                            console.log("got content", JSON.stringify(content));
                            console.log("time creation diff = ", Math.abs(currentTime - Date.parse(content.created)));
                            if(Math.abs(currentTime - Date.parse(content.created)) < 4000) {
                                addContent(content);
                            }
                        }
                    });
                }
                break;
            case "vote":
                addVote(opBody);
                break;
        }
    }
}

function readNextBlock() {
    if(currentBlock > lastBlock) {
        steem.api.getOpsInBlock(currentBlock, false, function(err, block) {
            if(!err && block) {
                console.log("got current block", currentBlock);
                let ct = document.getElementById("currentTime");
                if(block.length > 0) {
                    ct.innerHTML = block[0].timestamp;
                }
                currentBlock++;
                processBlock(block);
            }
        });
    }
}

function runScanning() {
    steem.config.set('websocket', getWebSocket());
    
    steem.api.getDynamicGlobalProperties(function(err, result) {
        if(err) {
            alert("Unable to communicate with golos");
        }
        acttime = Date.parse(result.time);
        headBlock = result.head_block_number;
        currentBlock = getStartBlock(headBlock);
        lastBlock = currentBlock -1;
        console.log("got head block ", headBlock);
        console.log("gcurrentBlock ", currentBlock);

        //every 3 sekonds a block. Read with less 
        scannerTimer = setInterval(readNextBlock, getDuration());
    });
}


