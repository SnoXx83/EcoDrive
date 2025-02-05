import dataSource from "../config/db";

console.log("hello world");

const start = async()=>{
    await dataSource.initialize();
}

start();