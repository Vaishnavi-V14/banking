const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

let user = null;
let transactions = [];

function page(content) {
return `
<html>
<head>
<title>KodBank</title>

<style>

*{
margin:0;
padding:0;
font-family:Arial;
}

body{
background:#020817;
color:white;
}

/* NAVBAR */

nav{
display:flex;
justify-content:space-between;
align-items:center;
padding:20px 60px;
border-bottom:1px solid #1e293b;
}

.logo{
font-size:22px;
font-weight:bold;
}

.btn{
padding:10px 18px;
border-radius:8px;
border:none;
cursor:pointer;
}

.primary{
background:linear-gradient(90deg,#3b82f6,#14b8a6);
color:white;
}

.outline{
background:transparent;
border:1px solid #334155;
color:white;
}

/* HERO */

.hero{
text-align:center;
padding:120px 20px;
}

.hero h1{
font-size:60px;
margin-bottom:20px;
}

.hero p{
color:#94a3b8;
margin-bottom:30px;
}

/* FORM */

.form-container{
display:flex;
height:100vh;
}

.left{
flex:1;
display:flex;
align-items:center;
justify-content:center;
background:linear-gradient(#0f172a,#0f766e);
}

.right{
flex:1;
display:flex;
align-items:center;
justify-content:center;
}

form{
width:350px;
}

input{
width:100%;
padding:12px;
margin:10px 0;
border-radius:8px;
border:none;
background:#0f172a;
color:white;
}

/* DASHBOARD */

.dashboard{
display:flex;
height:100vh;
}

.sidebar{
width:220px;
background:#020617;
border-right:1px solid #1e293b;
padding:20px;
}

.sidebar h2{
margin-bottom:30px;
}

.menu a{
display:block;
padding:10px;
color:#94a3b8;
text-decoration:none;
margin-bottom:10px;
border-radius:6px;
}

.menu a:hover{
background:#1e293b;
color:white;
}

.main{
flex:1;
padding:60px;
}

.card{
background:linear-gradient(90deg,#3b82f6,#14b8a6);
padding:30px;
border-radius:16px;
width:420px;
margin-bottom:30px;
}

.details{
background:#0f172a;
padding:20px;
border-radius:10px;
width:420px;
}

/* SEND MONEY */

.send-box{
background:#0f172a;
padding:30px;
border-radius:14px;
width:420px;
}

</style>
</head>

<body>
${content}
</body>

</html>
`;
}

/* LANDING PAGE */

app.get("/", (req,res)=>{

res.send(page(`
<nav>
<div class="logo">KodBank</div>

<div>
<a href="/login"><button class="btn outline">Sign In</button></a>
<a href="/register"><button class="btn primary">Get Started</button></a>
</div>
</nav>

<div class="hero">
<h1>Banking made beautifully simple</h1>

<p>Experience next generation digital banking</p>

<a href="/register"><button class="btn primary">Open Account</button></a>
<a href="/login"><button class="btn outline">Sign In</button></a>
</div>
`))

})

/* REGISTER */

app.get("/register",(req,res)=>{

res.send(page(`
<div class="form-container">

<div class="left">
<h1>KodBank</h1>
</div>

<div class="right">

<form method="post" action="/register">

<h2>Create Account</h2>

<input name="username" placeholder="Username" required/>
<input name="email" placeholder="Email" required/>
<input name="phone" placeholder="Phone" required/>
<input name="password" placeholder="Password" required/>

<button class="btn primary" style="width:100%">Create Account</button>

</form>

</div>

</div>
`))

})

app.post("/register",(req,res)=>{

user={
username:req.body.username,
email:req.body.email,
phone:req.body.phone,
password:req.body.password,
balance:100000
}

res.redirect("/login")

})

/* LOGIN */

app.get("/login",(req,res)=>{

res.send(page(`
<div class="form-container">

<div class="left">
<h1>KodBank</h1>
</div>

<div class="right">

<form method="post" action="/login">

<h2>Login</h2>

<input name="username" placeholder="Username"/>
<input name="password" placeholder="Password"/>

<button class="btn primary" style="width:100%">Login</button>

</form>

</div>

</div>
`))

})

app.post("/login",(req,res)=>{

if(user && req.body.username===user.username && req.body.password===user.password){
res.redirect("/dashboard")
}else{
res.send("Invalid Login")
}

})

/* DASHBOARD */

function sidebar(){
return `
<div class="sidebar">

<h2>KodBank</h2>

<div class="menu">
<a href="/dashboard">Dashboard</a>
<a href="/balance">Balance</a>
<a href="/transactions">Transactions</a>
<a href="/send">Send Money</a>
</div>

</div>
`
}

app.get("/dashboard",(req,res)=>{

res.send(page(`
<div class="dashboard">

${sidebar()}

<div class="main">
<h1>Welcome to KodBank</h1>
<p>Hello, ${user.username}. Your secure banking dashboard is ready.</p>
</div>

</div>
`))

})

/* BALANCE */

app.get("/balance",(req,res)=>{

res.send(page(`
<div class="dashboard">

${sidebar()}

<div class="main">

<h1>Account Balance</h1>

<div class="card">
<h3>Total Balance</h3>
<h1>₹${user.balance}</h1>
</div>

<div class="details">
<p><b>Account Holder:</b> ${user.username}</p>
<p><b>Email:</b> ${user.email}</p>
<p><b>Phone:</b> ${user.phone}</p>
<p><b>Account Type:</b> Savings</p>
</div>

</div>

</div>
`))

})

/* SEND MONEY */

app.get("/send",(req,res)=>{

res.send(page(`
<div class="dashboard">

${sidebar()}

<div class="main">

<h1>Send Money</h1>

<div class="send-box">

<p><b>Available Balance</b></p>
<h2>₹${user.balance}</h2>

<form method="post" action="/send">

<input name="amount" placeholder="Enter Amount" required/>
<input name="note" placeholder="Description"/>

<button class="btn primary" style="width:100%">Send Money</button>

</form>

</div>

</div>

</div>
`))

})

app.post("/send",(req,res)=>{

let amount = parseInt(req.body.amount)

if(amount > user.balance){
return res.send("Insufficient Balance")
}

user.balance -= amount

transactions.push({
amount:amount,
note:req.body.note
})

res.redirect("/transactions")

})

/* TRANSACTIONS */

app.get("/transactions",(req,res)=>{

let list=""

transactions.forEach(t=>{
list+=`<p>₹${t.amount} - ${t.note}</p>`
})

if(list==="") list="No transactions yet."

res.send(page(`
<div class="dashboard">

${sidebar()}

<div class="main">

<h1>Transactions</h1>

${list}

</div>

</div>
`))

})

app.listen(3000,()=>{
console.log("Server running http://localhost:3000")
})