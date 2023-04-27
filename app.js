const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const app=express();
app.set('view engine','ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
main()
async function main(){
  await  mongoose.connect('mongodb://127.0.0.1:27017/hostelDB',{useNewUrlParser: true});
}

const problemSchema= new mongoose.Schema({
    sturollNo: String,
    stuName:String,
    hostelName: String,
    roomNumber: Number,
    problemtitle:String,
    problemdes:String

});

const Problem=mongoose.model("Problem", problemSchema);


const userSchema= new mongoose.Schema({
    rollno: String,
    name: String,
    password: String,
})

const User= mongoose.model("User", userSchema);

const adminSchema=new mongoose.Schema({
    username: String,
    password: String
})

const Admin=mongoose.model("Admin",adminSchema);

const admin1=new Admin({
    username:"1122",
    password:"1122"
})
admin1.save();



app.get("/", function(req,res){
    res.render("index");
})



const loginarr=[];

app.post("/login",function(req,res){
    
    const logRollNo= req.body.lrollno;
    const password= req.body.lpsw;

    
    User.findOne({rollno:logRollNo, password: password}).then((login)=>
    {
        if(!login){
            res.render("index2");
        }
        else{
            res.render("student",{name:login.name, rollno: login.rollno})
            loginarr.push(login.rollno);
            loginarr.push(login.name);
        }
    })

})



app.post("/student",function(req,res){
    const logrollno=loginarr[0];
    const password=loginarr[1];
    const hostelname=req.body.hostelName;
    const roomnumber=req.body.roomNumber;
    const problemtitle=req.body.problemTitle;
    const problemdescription=req.body.describeProblem;
    const problem= new Problem({
    sturollNo: logrollno,
    stuName: password,
    hostelName: hostelname,
    roomNumber: roomnumber,
    problemtitle: problemtitle,
    problemdes:problemdescription
    })
    problem.save();
    loginarr.length=0;
    res.redirect("/");
})

app.get("/login",function(req,res){
    res.render("login");
})

app.post("/", function(req,res){
    const rollNo= req.body.rollno;
    const stuName=req.body.name;
    const pswd=req.body.psw;
    const rpassword= req.body.pswrepeat;
    const student= new User({
        rollno: rollNo,
        name: stuName,
        password:pswd
    })
    student.save();
  
    res.redirect("/");
})

app.get("/adminLogin",function(req,res){
    res.render("adminLogin");
})

app.post("/adminLogin",function(req,res){
    const adminUser=req.body.adminUser;
    const adminPsw=req.body.adminPsw;
    console.log(adminUser);
    console.log(adminPsw);
    Admin.findOne({username:adminUser, password:adminPsw}).then((admin)=>{
        
        if(admin){
            Problem.find({}).then((x)=>{

                res.render("admin",{x});
                console.log(x);
            }
            ).catch((err)=>
            console.log(err));
            
        }
        else{
            res.send("incorrect credentials");
        }
    }
    )
    .catch((err)=>console.log(err));
})

app.listen(3000);