//get basic mongo client to go through everything
const MongoClient = require ('mongodb').MongoClient;
const assert = require('assert');
const covidRepo = require('./repos/casesRepository');
const data = require('./casesData.json');

//locally
const url = 'mongodb://localhost:27017';
//name of db we create
const dbName = 'covidbe';

//admin commands to see what we can do
async function main(){
    //open up a client, takes a url as a param
    const client = new MongoClient(url);

    //wait until client.connect returns the promise to proceed
    await client.connect();

    try {
        //load data from covid.js
        const results = await covidRepo.loadData(data);
        assert.strictEqual(data.length, results.insertedCount);

        //get all data from db
        const getData = await covidRepo.get();
        assert.strictEqual(data.length, getData.length);

        //get an article using a query
        const filterData = await covidRepo.get({NIS5: getData[4].NIS5});
        assert.deepStrictEqual(filterData[0], getData[4]);
        console.log(filterData)
        //query with a limit, query is empty so it will return all 50 with a limit of 3
        const limitData = await covidRepo.get({},3);
        assert.strictEqual(limitData.length, 3);


    }catch (error) {
        console.log(error)
    }finally{
        //when the assertion throws an error it will clean itself up, so when we run it again, the bd will have 50 entries
        const admin = client.db(dbName).admin();
        await client.db(dbName).dropDatabase();
        console.log( await admin.listDatabases());
        await client.close();
    }

}
main();