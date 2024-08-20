import express from "express";
import dotenv from "dotenv";
import stripe from "stripe";
import { log } from "console";
import bodyParser from "body-parser"

// Load variables
dotenv.config()

// start server
const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

const jsonParser = bodyParser.json();
app.use(jsonParser)
// Home Route
app.get("/",(req,res)=>{
    res.sendFile("index.html",{root:"public"});
})

// Cart
app.get("/cart.html",(req,res)=>{
    res.sendFile("cart.html",{root:"public"});
})

// success
app.get("/success.html",(req,res)=>{
    res.sendFile("success.html",{root:"public"});
})

// cancel
app.get("/cancel.html",(req,res)=>{
    res.sendFile("cancek.html",{root:"public"});
})

// Stripe
let stripeGateWay = stripe(process.env.stripe_key);

app.post("/stripecheckout", async (req, res) => {
    console.log(req.body.items);
    
    if (!Array.isArray(req.body.items)) {
        return res.status(400).json({ error: "Invalid items array" });
    }

    const lineItems = req.body.items.map((item) => {
        const unitAmount = Math.round(parseFloat(item.price) * 100);  // Fixed typo with `parent` to `Math.round`
        console.log("item-price", item.price);
        console.log("unitAmount", unitAmount);
        return {
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.title,
                    images: [item.image],
                },
                unit_amount: unitAmount,
            },
            quantity: item.quantity,
        };
    });

    try {
        const session = await stripeGateWay.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            success_url: `http://localhost:3000/success.html`,
            cancel_url: `http://localhost:3000/cancel.html`,
            billing_address_collection: "required",
            line_items: lineItems,  
        });
        res.json({ url: session.url });
    } catch (error) {
        console.error("Stripe checkout session error:", error);
        res.status(500).json({ error: "Failed to create checkout session" });
    }
});




app.listen(3000,()=>{
    console.log("Listenig to port 3000");
    
})