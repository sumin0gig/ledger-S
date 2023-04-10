// express server 만들기
const express= require("express");
const cors= require("cors");
const mysql= require('mysql');

// server 생성
const app= express();
// port 번호 지정
const port= 8080;
// 데이터 전송형식 지정 (JSON)
app.use(express.json());
// cors 이슈 방지
app.use(cors());

const conn = mysql.createConnection({
	host: "database-1.cvmqc6bfrssc.ap-northeast-1.rds.amazonaws.com",
	user: "admin",
	password: "sumin98061",
	port : "3306",
	database: "ac-title"
})
conn.connect();

// ------------- addaccounttitle -------------
app.post('/addaccounttitle',(req,res)=>{
	const {title,desc,isFixed}=req.body;
	conn.query("INSERT INTO titletable(`title`, `desc`, `isFixed`) values(?,?,?)",
    [title, desc, isFixed],(error,result,fields)=>{
			result&&res.send("ok");
		})
});
app.get('/addaccounttitle',(req,res)=>{
	conn.query("SELECT * FROM titletable", function(error,result,fields){
		res.send(result);
	})
});
app.delete('/addaccounttitle/:title',(req,res)=>{
	const {title}=req.params;
	conn.query(`delete from titletable where \`desc\`='${title}'`,(error,result,fields)=>{
			console.log(error);
	})
})
app.patch('/addaccounttitle/:id',(req,res)=>{
	const {id}=req.params;
	const {text,fixed}=req.body;
	conn.query(`update titletable set \`desc\`='${text}', isFixed='${fixed}' where id='${id}'`,(error,result,fields)=>{
		res.send(result);
	})
})

// ------------- ledgerenter -------------
app.post('/ledgerenter',(req,res)=>{
	const {l_date,l_title,l_price,l_left,l_right,l_star}=req.body;
	conn.query(`INSERT INTO ledger(l_date,l_title,l_price,l_left,l_right,l_star) values(${l_date},'${l_title}','${l_price}','${l_left}','${l_right}','${l_star}')`
	,(error,result,fields)=>{
	})
})
app.get('/ledgerenter',(req,res)=>{
	conn.query(`SELECT * FROM ledger order by l_date`
	,(error,result,fields)=>{
		res.send(result);
	})
})
app.delete('/ledgerenter/:id',(req,res)=>{
	const {id}=req.params;
	conn.query(`delete from ledger where id=${id}`,(error,result,fields)=>{
	})
})


app.get('/ledgerenter10',(req,res)=>{
	conn.query(`SELECT * FROM ledger order by id desc limit 10`
	,(error,result,fields)=>{
		res.send(result);
	})
})

app.get('/ledgerenterDate/:ol_date/:l_date',(req,res)=>{
	const {ol_date,l_date}=req.params;
	conn.query(`SELECT * FROM ledger where l_date between ${ol_date} and ${l_date} order by l_date`,
	(err,result,fields)=>{
		res.send(result)
	})
})


// ------------- addaccounttitleUpdate -------------

app.patch('/addaccounttitleUpdate/:desc',(req,res)=>{
	const {desc}=req.params;
	const {text}=req.body;
	console.log(desc, text);
	conn.query(`update ledger set l_left='${text}' where l_left='${desc}'`,(error,result,fields)=>{})
	conn.query(`update ledger set l_right='${text}' where l_right='${desc}'`,(error,result,fields)=>{})
})

app.delete('/addaccounttitleUpdate/:desc',(req,res)=>{
	const {desc}=req.params;
	console.log(desc);
	conn.query(`delete from ledger where l_left='${desc}' || l_right='${desc}'`,(error,result,fields)=>{
	})
})

// ------------- fundsstate ------------- 계정과목이 늘어남에 따라 상태가 늘어나야 하므로 삭제 후 JS로 돌림
// app.get('/fundsstate/:l_left',(req,res)=>{
// 	const {l_left}=req.params;
// 	conn.query(`SELECT sum(l_price) as sum_price FROM ledger where l_left='${l_left}'`
// 	,(error,result,fields)=>{
// 		res.send(result);
// 		console.log(result);
// 	})
// })



app.listen(port,()=>{
	console.log('서버 작동중');
})