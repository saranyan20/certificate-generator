const mongoose=require('mongoose');
const validator=require('validator');

const monogoURL=process.env.MONGOURL;

mongoose.connect(monogoURL,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology: true
});
const participantsSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        set:(value)=>{
            return value.trim();
        }

    },

    college:{
        type:String,
        required:true,
        trim:true
    },

    cert_id:{
        type:String, 
        required:true,
        set:(value)=>{
            return value.toUpperCase();
        }
    },

   email:{
       type:String,
       require:true,
       lowercase:true,
       trim:true,
       validate(value){
           if(!validator.isEmail(value)){
               throw new Error("Email is invalid");
           }
       }
   } ,
   phone:{
       type:String,
       required:true,
       trim:true,
       set:(value)=>{
           if (value.startsWith('0'))
                return value.substring(1);
            else if(value.startsWith('+91'))
                return value.substring(3);
            else    
                return value;
       }
   } 

}); 

participantsSchema.pre('save',async function(next){
    const user= this;
    let check = await Participants.find({email:user.email});
    if(check.length !=0)
        next(new Error("A user with this Email already exists"));
    next();
})

const Participants=mongoose.model('Participants', participantsSchema);
module.exports=Participants;
// const par1=new Participants({
//     name: "Nandakumar",
//     college:"sairam"
// })
// par1.save().then((member)=>{
//     console.log(member)
// }).catch((err)=>{
//     console.log(err);
// })
