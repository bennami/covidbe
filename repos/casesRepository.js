const {MongoClient} = require('mongodb');

//locally
const url = 'mongodb://localhost:27017';
//name of db we create
const dbName = 'covid';

function covidRepo(){
    function get(query, limit){
        return new Promise(async (resolve, reject)=>{
            const client = new MongoClient(url);
            try {
                await client.connect();
                const db = client.db(dbName);

                //this returns a cursor, doesnt hit db
                let items = db.collection('cases').find(query);

                //this is how to add the limit to a query
                if (limit > 0){
                    items = items.limit(limit);
                }

                //this returns arrays and hits the db
                resolve(await items.toArray());
                client.close();

            }catch (e) {
                reject(e)

            }
        })
    }
    function loadData(data){
        return new Promise(async(resolve, reject) => {
            const client = new MongoClient(url);
            try{
                await client.connect();
                const db = client.db(dbName);

                results = db.collection('cases').insertMany(data)
                resolve(results);
                client.close();
            }catch (error){
                reject(error)
            }
        })
    }
    return{loadData, get}
}

module.exports = covidRepo();