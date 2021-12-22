const functions = require("firebase-functions");
import {functions} from 'firebase-functions'
import {admin} from 'firebase-admin'

// const checkNumber=(myString)=> /\d/.test(myString);
function checkStudent(myString){
    if(myString.slice(2,6)=="p61a"){
        return true;
    }else{
        return false;
    }
} 

const domain="vbithyd.ac.in";

exports.verifyNewUser=functions.auth.user().onCreate(async(user)=>{
    const splitEmail=user.email.split('@');
    if(splitEmail[1]===domain){
        if(checkStudent(splitEmail[0])){
            try{
                await admin.firestore().collection("users").doc(user.email)
                .set({
                    isDomainVerified:true,
                    isEnrolled:false,
                    role:['STUDENT']
                });
            }catch(e){
                functions.logger.log("Domain Verification Unsuccessful - STUDENT");
            }            
        }else{
            try{
                await admin.firestore().collection("faculty").doc(user.email)
                .set({
                    isDomainVerified:true,
                    isEnrolled:false,
                    role:['FACULTY']
                }); 
            }catch(e){
                functions.logger.log("Domain Verification Unsuccessful - FACULTY")
            }                       
        }          
    }
    else{
        try{
            await admin.auth().deleteUser(user.uid);   
        }
        catch(e){
            functions.logger.log("Could not delete User");
        }
    }
});














// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
