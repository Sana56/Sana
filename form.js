const express=require('express');
const bodyParser=require('body-parser');
const mysql=require('mysql');
const path=require('path');
const { query } = require('express');
const router=express.Router();

var helper, hid,eid,CloseId,empName;
//init app
const app=express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use('/', router);
app.set('port', process.env.PORT || 3000)
app.use(express.static(path.join(__dirname, 'public')));

//MYSQL Connection
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "fyp_sahoolat", 
  database: "sahoolatp"
});

 connection.connect(function(err) {
  if (err) throw err
  else
  { console.log("Connected!");}
});

//Home Router
app.get('/', function(req,res){
  res.render('HomePage')
// res.sendFile('HomePage.html',{ root: __dirname})
});
app.get('/homepage', function(req,res){
  res.render('HomePage')
});

//after clicking register or submit
app.post('/submit', function(req, res){
  var firstname=req.body.firstname;
var Fword=firstname.charAt(0);

  var sql= "insert into fyp_helpers(First_Name,Last_Name,Password,Address,Type,Mobile_Number,City,Marital_Status,Age,CNIC_Number,Services,Spouse_CNIC,Spouse_contact,Gender,Reference_Name,Reference_contact,Reference_Relation,language,experience,profile_pic) values('"+req.body.firstname+"','"+req.body.lastname+"','"+req.body.password+"','"+req.body.address+"','"+req.body.workingtype+"','"+req.body.mobile_number+"','"+req.body.city+"','"+req.body.marital_status+"','"+req.body.Age+"','"+req.body.cnic_no+"','"+req.body.skills+"','"+req.body.spouse_cnic+"','"+req.body.spouse_contact+"','"+req.body.gender+"','"+req.body.ref_name+"','"+req.body.ref_contact+"','"+req.body.ref_relation+"','"+req.body.language+"','"+req.body.experience+"','"+Fword+".png"+"')";
  connection.query(sql, function(err, result){
    //res.redirect('detailprofile/'+result.Helper_Id);
    if(err) throw err;
    res.render('data',{title: 'Data Saved', message: 'Successfully Saved'})
     })

console.log(Fword+".png");
 //close connection
 connection.end();
});
app.post('/emp_submit', function(req, res){
  var emp_firstname=req.body.emp_fname;
  var emp_Fword=emp_firstname.charAt(0);
  var sql= "insert into fyp_employers(Employer_Fname,EmployerLname,Email_Address,Employer_Address,Employer_City,Employer_Password,Employer_CNIC,Employer_Contact,preference,empprofile_pic) values('"+req.body.emp_fname+"','"+req.body.emp_lname+"','"+req.body.email+"','"+req.body.emp_address+"','"+req.body.city+"','"+req.body.emp_password+"','"+req.body.emp_cnic+"','"+req.body.emp_contact+"','"+req.body.preference+"','"+emp_Fword+".png"+"')";
  connection.query(sql, function(err){
    if(err) throw err;
    res.render('data',{title: 'Data Saved', message: 'Successfully Saved'})
     })

     console.log(emp_Fword+".png");
 //close connection
 connection.end();
});

app.post('/submitsearch', function(req, res){
  var search=req.body.searchinput;
  connection.query("select * from fyp_helpers where City=?",[search],function(err,rows,field){
    if(err)throw err
    else if(rows.length===0)
    res.render('profiles',{noresultMsg: 'No Result found', helpers: rows})
    else
    res.render('profiles',{helpers: rows, noresultMsg: ""})
    // if
    // console.log("Total Records:- " + rows.length);
  console.log(search);
  })
});

app.post('/empsubmitsearch', function(req, res){
  var empsearch=req.body.searchinput;
  connection.query("select * from fyp_employers where Employer_City=?",[empsearch],function(err,rows,field){
    if(err)throw err
    else if(rows.length===0)
    res.render('EmployerProfiles',{noresultMsg: 'No Result found', employers: rows})
    else
    res.render('EmployerProfiles',{noresultMsg: ' ', employers: rows})
    // if
    // console.log("Total Records:- " + rows.length);
  console.log(empsearch);
  })
});

router.get('/EmployerData', function(req,res){
  
  res.sendFile('EmployerData.html',{ root: __dirname})
  
 });


router.get('/getajob', function(req,res){
  
    res.sendFile('LoginData.html',{ root: __dirname})
    
   });

// router.get('/detailprofile', function(req,res){
//   ///connection.query("select * from helpers where id=1",function(err,rows,field){
//     //if(err)throw err
    
//    res.sendFile(path.join(__dirname + '/detailprofile.html'), {helper:'Multan'})
  
//   //res.sendFile('detailprofile.html',{ root: __dirname ,helper:helper})
  
//   //})
// });

app.get('/profiles', function(req,res){
  connection.query("select * from fyp_helpers where Helper_id=0 ",function(err,rows,field){
    if(err)throw err
    res.render('profiles',{helpers: rows, noresultMsg: '',myname: 'rate'})
 })
});

app.get('/EmployerProfiles', function(req,res){
  connection.query("select * from fyp_employers",function(err,rows,field){
    if(err)throw err
    res.render('EmployerProfiles',{employers: rows, noresultMsg: ''})
 })
});
app.get('/personalprofile/:id', function(req,res){
  connection.query("select * from fyp_helpers where Helper_id=?",[req.params.id],function(err,rows,field){
   if(err)throw err
   var gender= rows[0].Gender;
   if(gender === 'Male' || gender === 'male')
   res.render('personalprofile',{helpers: rows, mrms: 'Mr.'})
   else
    res.render('personalprofile',{helpers: rows, mrms: 'Ms.'})
    
  
  })
});
app.get('/detailprofile/:id', function(req,res){
   connection.query("select * from fyp_helpers where Helper_id=?",[req.params.id],function(err,rows,field){
    if(err)throw err
    var gender= rows[0].Gender;
    if(gender === 'Male' || gender === 'male')
    res.render('detailprofile',{helpers: rows, mrms: 'Mr.'})
    else
     res.render('detailprofile',{helpers: rows, mrms: 'Ms.'})
     hid=req.params.id;
    console.log(gender);
   })
 });
 app.get('/empdetailprofile/:id', function(req,res){
  connection.query("select * from fyp_employers where Employer_id=?",[req.params.id],function(err,rows,field){
   if(err)throw err
   res.render('empdetailprofiles',{emp: rows})
   eid=req.params.id;
    })
});
app.get('/per_emp_profile/:id', function(req,res){
  connection.query("select * from fyp_employers where Employer_id=?",[req.params.id],function(err,rows,field){
   if(err)throw err
   res.render('personal_emp_profile',{emp: rows})
   
    })
});
app.get('/perconnect',function(req,res){
  connection.query("SELECT connId,concat(Employer_Fname,EmployerLname) AS Emp_Name,connDate,empreview,emprate,empconnstatus,connstatus,service FROM fyp_employers INNER JOIN connections ON fyp_employers.Employer_id=connections.EmployerId where HelperId=?",[hid],function(err,connrows,field){
  if(err)throw err
  res.render('personalconnection',{conn: connrows})
  
   })
  });
 app.get('/connect',function(req,res){
connection.query("SELECT connId,concat(Employer_Fname,EmployerLname) AS Emp_Name,connDate,empreview,emprate,empconnstatus,connstatus,service FROM fyp_employers INNER JOIN connections ON fyp_employers.Employer_id=connections.EmployerId where HelperId=?",[hid],function(err,connrows,field){
if(err)throw err
res.render('connection',{conn: connrows})

 })
});
app.get('/empconnect',function(req,res){
  connection.query("SELECT connId, First_Name,Last_Name,connDate,review,rate,empconnstatus,connstatus,service FROM fyp_helpers INNER JOIN connections ON fyp_helpers.Helper_id=connections.HelperId where EmployerId=?",[eid],function(err,connrows,field){
  if(err)throw err
  res.render('empconnection',{empconn: connrows})
  
   })
  });
  app.get('/perempconnect',function(req,res){
    connection.query("SELECT connId, First_Name,Last_Name,connDate,review,rate,empconnstatus,connstatus,service FROM fyp_helpers INNER JOIN connections ON fyp_helpers.Helper_id=connections.HelperId where EmployerId=?",[eid],function(err,connrows,field){
    if(err)throw err
    res.render('personal_emp_connection',{empconn: connrows})
    
     })
    });
app.get('/close/:id',function(req,res){
   CloseId=req.params.id;
//    connection.query("select concat(Employer_Fname,EmployerLname) AS Emp_Name FROM fyp_employers INNER JOIN connections ON fyp_employers.Employer_id=connections.EmployerId where connId=?",[CloseId],function(err,rows,field){
// if(err) throw err
// empName=rows[0].Emp_Name;
// console.log(empName);
  // })
  
});
app.post('/submitRating',function(req,res){
  var review=req.body.comment;
  var ratenum=req.body.num;
  if(review === '' || ratenum === '')
  {
    console.log("No review or rating");
    res.render('error',{title: 'Could not close your connection ', message: 'Please give your ratings and review'})
return;
  }
  var close="Close";
  connection.query("update connections SET connstatus='"+close+"',review='"+review+"',rate='"+ ratenum+"' where connId=?",[CloseId],function(err,rows,field){
 if(err) throw err
 res.render('Successfull',{title: 'Thanks for giving us your review', message: 'Hope You enjoyed working with us'})
console.log("conn id is "+CloseId);
  })
  
});
app.post('/submitempRating',function(req,res){
  var review=req.body.comment;
  var empratenum=req.body.empnum;
  if(review === '' || empratenum === '')
  {
    console.log("No review or rating");
    res.render('error',{title: 'Could not close your connection ', message: 'Please give your review and rating'})
return;
  }
  var close="Close";
  connection.query("update connections SET empconnstatus='"+close+"',empreview='"+review+"',emprate='"+ empratenum+"' where connId=?",[CloseId],function(err,rows,field){
if(err)throw err
res.render('successfull',{title: 'Thanks for giving us your review', message: 'Hope You enjoyed working with us'})
console.log("conn id is "+CloseId);
console.log(empratenum);
  })
  
});



//  app.get('/editprofile/:id',function(req,res){
// connection.query("select * from fyp_helpers where Helper_id=?",[req.params.id],function(err,rows,field){
// if(err)throw err
// update query where id =req.params.id;

// })
// });
var helperEditID, empEditID,empFword,hfword;
var helper_fname, helper_lname,address,jobtype,helper_number,city,marital_status, age, helper_cnic, services,spouse_cnic,spouse_number,gender,reference_name,reference_number,reference_relation;
var employer_fname,employer_lname,employer_email, employer_address,employer_city,employer_password,employer_cnic,employer_number,emp_jobtype;
app.get('/editprofile/:id',function(req,res){
  connection.query("select * from fyp_helpers where Helper_id=?",[req.params.id],function(err,rows,field){
  if(err)throw err
  res.render('editHelpersprofile',{helpers: rows})
  helperEditID=req.params.id;

  })
});
app.post('/edit',function(req,res){
  
   helper_fname=req.body.helper_fname;
   helper_lname=req.body.helper_lname;
	 address=req.body.helper_address;
	 jobtype=req.body.jobtype;
   helper_number=req.body.helper_number;
   city=req.body.city;
   marital_status=req.body.marital_status;
   age=req.body.age;
   helper_cnic=req.body.helper_cnic;
   services=req.body.check;
   spouse_cnic=req.body.spouse_cnic;
   spouse_number=req.body.spouse_number;
	 gender=req.body.optradio;
	 reference_name=req.body.reference_name;
	 reference_number=req.body.reference_number; 
	 reference_relation=req.body.reference_relation; 
res.redirect('/submitChange/'+helperEditID+'');

});
app.get('/submitChange/:helperEditID',function(req,res){
  hFword=helper_fname.charAt(0);
  connection.query("update fyp_helpers SET First_Name='"+helper_fname+"', Last_Name='"+helper_lname+"',Address='"+address+"',Type='"+jobtype+"',Mobile_Number='"+helper_number+"',City='"+city+"',Marital_Status='"+marital_status+"',Age='"+age+"',CNIC_Number='"+helper_cnic+"',Services='"+services+"',Spouse_CNIC='"+spouse_cnic+"',Spouse_Contact='"+spouse_number+"',Reference_Name='"+reference_name+"',Reference_Contact='"+reference_number+"',Reference_Relation='"+reference_relation+"',profile_pic='"+hFword+".png"+"' where Helper_id=?",[req.params.helperEditID],function(err,rows,field){
  if(err)throw err
  res.render('data',{title: 'Data Saved', message: 'Successfully Edited'})
 })
});
app.get('/editEmpprofile/:id',function(req,res){
  connection.query("select * from fyp_employers where Employer_id=?",[req.params.id],function(err,rows,field){
  if(err)throw err
  res.render('editEmployersprofile',{employers: rows})
  empEditID=req.params.id;
})
});
app.post('/editEmp',function(req,res){
   employer_fname=req.body.employer_fname;
   employer_lname=req.body.employer_lname;
   employer_email=req.body.employer_email;
	 employer_address=req.body.employer_address;
   employer_city=req.body.city;
   employer_cnic=req.body.employer_cnic;
   employer_number=req.body.employer_number;
   emp_jobtype=req.body.jobtype;
res.redirect('submitEmpChange/'+empEditID+'');
});
app.get('/submitEmpChange/:empEditID',function(req,res){
  empFword=employer_fname.charAt(0);
  connection.query("update fyp_employers SET Employer_Fname='"+employer_fname+"', EmployerLname='"+employer_lname+"',Employer_Address='"+employer_address+"',Email_Address='"+employer_email+"',Employer_Contact='"+employer_number+"',Employer_City='"+employer_city+"',Employer_CNIC='"+employer_cnic+"',empprofile_pic='"+empFword+".png"+"',preference='"+ emp_jobtype+"' where Employer_id=?",[req.params.empEditID],function(err,rows,field){
    if(err)throw err
    res.render('data',{title: 'Data Changed', message: 'Successfully Edited'})
   })

});


 app.get('/cooking',function(req,res){

connection.query("select * from fyp_helpers where Services=?",['Cooking'],function(err,rows,field){
  if(err)throw err
  else if(rows.length===0)
  res.render('profiles',{noresultMsg: 'No Search found', helpers: rows})
  else
  res.render('profiles',{helpers: rows, noresultMsg: ""})
});
 })

 app.get('/cleaning',function(req,res){

  connection.query("select * from fyp_helpers where Services=?",['Cleaning'],function(err,rows,field){
    if(err)throw err
    else if(rows.length===0)
    res.render('profiles',{noresultMsg: 'No Search found', helpers: rows})
    else
    res.render('profiles',{helpers: rows, noresultMsg: ""})
  });
   })
   app.get('/beauty',function(req,res){

    connection.query("select * from fyp_helpers where Services=?",['Beautician'],function(err,rows,field){
      if(err)throw err
      else if(rows.length===0)
      res.render('profiles',{noresultMsg: 'No Search found', helpers: rows})
      else
      res.render('profiles',{helpers: rows, noresultMsg: ""})
    });
     })
     app.get('/babysitter',function(req,res){

      connection.query("select * from fyp_helpers where Services=?",['Baby sitting'],function(err,rows,field){
        if(err)throw err
        else if(rows.length===0)
        res.render('profiles',{noresultMsg: 'No Search found', helpers: rows})
        else
        res.render('profiles',{helpers: rows, noresultMsg: ""})
      });
       })
  router.get('/faqs',function(req,res){
     res.sendFile('FAQS.html',{ root: __dirname})
       });
       router.get('/postjob',function(req,res){
        res.sendFile('Job post.html',{ root: __dirname})
          });
          router.get('/contact',function(req,res){
            res.sendFile('contact.html',{ root: __dirname})
              });    
module.exports = router;

app.listen(3000, ()=>console.log("Running on Port 3000..."));

