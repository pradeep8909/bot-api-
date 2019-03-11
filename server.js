
const express = require('express');
const app = express()
app.use(express.static('public'));

const fs = require('fs')
app.use(express.json());
app.post('/session' , (req,res,next) => {
    let responsemsg = "";
    let newSession = {}
    if (!req.body.message || !req.query.email){
      return res.json({errorMsg: "message mein se kuch nhi hai."});
    }else{
    fs.readFile("sessionScheduler.json", 'utf8', (err, data) => {
       const sessionScheduler = JSON.parse(data);
        if (err) {
          console.error("open error:  " + err);
        } else {
        if(req.body.message.toLowerCase().indexOf("i want a new session") > -1){

             if(sessionScheduler.length >=1){
                  console.log("aa")
                  for(let i =0; i<sessionScheduler.length;i++){
                      
                      if(req.query.email== sessionScheduler[i]['emailid']){
                          
                          if(sessionScheduler[i]['Title']==null || sessionScheduler[i]['Time']['from']==null ||sessionScheduler[i]['Date']==null){
                            return res.json({message:" jo class ki details fill nahi ki hai wo fill karo", classinfo: sessionScheduler[i]})
                          }
                      }
                  }
              }
             newSession ={
                    "emailid": req.query.email,
                    "Title": null,
                    "Time": {
                        "from": null,
                        "to": null
                        },
                    "Date": null
                    }
            
            sessionScheduler.push(newSession)
            responsemsg = "Give your class Title";
            }
        else{
            for(let i = 0; i < sessionScheduler.length; i++){
                if(sessionScheduler[i]['emailid']==req.query.email){
                    if(sessionScheduler[i]['Title'] == null){
                        sessionScheduler[i]['Title'] = req.body.message;
                        responsemsg = "Enter Time";
                    }
                    else if(sessionScheduler[i]['Time']['from'] == null){
                        let time= req.body.message.split(' ')
                        sessionScheduler[i]['Time']['from'] = time[0];
                        sessionScheduler[i]['Time']['to'] = time[2];
                        responsemsg = "Enter Date";
                    }
                    else if(sessionScheduler[i]['Date'] == null){
                        sessionScheduler[i]['Date'] = req.body.message;
                        responsemsg = "Completed";
                    }
                    newSession = sessionScheduler[i]
                }
                
            }
        }
    
        fs.writeFile("sessionScheduler.json", JSON.stringify(sessionScheduler, null, 2),(err) => {
            if (err) 
                return console.log(err);
            });
        return res.json({"message":responsemsg,"data": newSession});
        }
    });   
}//file
});

app.get('/session' ,(req,res,next) =>{
    fs.readFile("sessionScheduler.json", 'utf8', (err, data) => {
        const sessionScheduler = JSON.parse(data);
        return res.json(sessionScheduler)
    });
});

app.get('/session/:email' ,(req,res,next) =>{
    fs.readFile("sessionScheduler.json", 'utf8', (err, data) => {
        const sessionScheduler = JSON.parse(data);
        let singleUser = []
        for(let i = 0; i < sessionScheduler.length; i++){
            if(sessionScheduler[i]['emailid']==req.params.email){
                singleUser.push(sessionScheduler[i])
            }
        }
        return res.json(singleUser)
    });
})
app.listen(4001)