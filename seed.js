const mongoose=require('mongoose');
const Product=require("./models/Product");
let products=[
    {
        name:"iphone 16 Pro",
        img:"https://images.unsplash.com/photo-1637496652486-99d500bcdd18?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price:160000,
        desc:"jaldi hi tumhe khredenge"

    },
    {
        name:"Apple laptop",
        img:"https://images.unsplash.com/photo-1514826786317-59744fe2a548?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price:120000,
        desc:"bhaut badiya functions h bhaii"
    },
    {
        name:"ipad",
        img:"https://images.unsplash.com/photo-1648806030599-c963fd14a22f?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price:80000,
        desc:"easy to carry"
    },
    {
        name:"Smart Watch",
        img:"https://media.istockphoto.com/id/1189984324/photo/smart-watch-for-branding-and-mock-up-3d-render-illustration.jpg?s=1024x1024&w=is&k=20&c=JhNVh8tcKe1arRvuM6b0IjGDYxO7IJ14Hh-2dF47WuY=",
        price:40000,
        desc:"looks very attractive"
    },
    {
        name:"AirPods",
        img:"https://images.unsplash.com/photo-1525825691042-e14d9042fc70?q=80&w=1474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price:10000,
        desc:"best Airpods ever"
    }
   

]

async function seedDb(){
    await Product.insertMany(products);
    console.log("data seeded successfully");
}

module.exports=seedDb;