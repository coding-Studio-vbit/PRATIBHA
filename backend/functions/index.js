const functions = require("firebase-functions");

import {admin} from 'firebase-admin'

exports.verifyNewUser=functions.auth.user().onCreate((user)=>{
    if(user.email.length>10){
        admin.auth().        
    }
    functions.logger.log(user.email);


});














// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
