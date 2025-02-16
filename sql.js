import pg from 'pg';

const db = new pg.Client({
    user:'postgres',
    host:'localhost',
    database:'patientsrecord',
    password: process.env.SQL,
    port: process.env.PORT1
})

db.connect()


const isExist = (email,data, callback) => {
    db.query('SELECT * FROM patients WHERE email = $1', [email], (err, res) => {
        if (err) {
            console.error('Error during SELECT:', err);
            return callback(err, null);
        }
        callback(null, res.rows.length > 0, res.rows[0]); 
    });
};



const updateRow = (report1,visits)=>{
    db.query('UPDATE patients SET no_of_visits = $1, report = $2',[visits+1,report1],(err,res)=>{
        if(err)
            console.log(err.stack)
        else{
            console.log("Successfully updated")
        }
    })
}



const insertRow = (name,email,report)=>{
    db.query('insert into patients(name,email,no_of_visits,report) values ($1,$2,1,$3)',[name,email,report],(err,res)=>{
        if(err)
            console.log(err.stack)
        else{
            console.log("Successfully insterted")
        }
    })
}

export {isExist,insertRow,updateRow}
