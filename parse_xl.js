const readXl=require('read-excel-file/node');
const Participants=require('./model');
const schema={
	'Name':{
		prop:'name',
		type:String 
	},
	'College name':{
		prop:'college',
		type:String
	},
	'ID':{
		prop:'id',
		type:String
	},
	'User Email':{
		prop:'email',
		type:String
	},
	'Phone number':{
		prop:'phone',
		type:String,
		parse(value){
			return value.toString();
		}
	}
	
}

readXl('./res/sairam.xlsx',{schema}).then(({rows, errors})=>{
		if (!errors.length===0)
			return console.log(errors);
		rows.forEach(element =>{
			let participant={
				name:element.name,
				college:element.college,
				cert_id:element.id,
				email:element.email,
				phone:element.phone
			}
			new Participants(participant).save().then().catch((err)=>{
				console.log("error occured",err);
			})

		});
})