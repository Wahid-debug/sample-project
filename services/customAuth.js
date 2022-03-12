const customMiddleware = async(req,res,next)=>{
    try{
        const authCredential = {
            auth_key: "Tpdevrewamp@auth",
            client_service: "Tpdevrewamp@client"
        }
        const authKey = req.headers.auth_key;
        const clientService = req.headers.client_service;
        if(authKey == authCredential.auth_key && clientService == authCredential.client_service){   
            next();   
        }else{
             res.status(401).json({ data:null, message: "Unauthorized", code:401})
        }   
    }catch(err){
        console.log(err, "error")
        res.status(500).json({ data:null, message: "Custom middleware error", code:500});
    }
}


module.exports = {customMiddleware}