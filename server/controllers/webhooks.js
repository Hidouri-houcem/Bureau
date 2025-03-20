import { Webhook } from "svix";
import User from "../models/User.js";
import Stripe from "stripe"
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";


//API Controller function to manage Clerk User with database

export const ClerkWebhooks = async (req,res)=>{
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        await whook.verify(JSON.stringify(req.body),{
            "svix-id":req.headers["svix-id"],
            "svix-timestamp":req.headers["svix-timestamp"],
            "svix-signature":req.headers["svix-signature"]
        })

        const {data,type} = req.body

        switch (type) {
            case 'user.created': {
                const userData ={
                    _id:data.id,
                    email:data.email_addresses[0].email_address,
                    name : data.first_name + " " + data.last_name,
                    imageUrl : data.image_url,
                }
                await User.create(userData)
                res.json({})
                break;
            }
                
            case 'user.updated' : {
                const userData ={
                    email:data.email_address[0].email_address,
                    name : data.first_name + " " + data.last_name,
                    imageUrl : data.image_url,
                }
                await User.findByIdAndUpdate(data.id,userData)
                res.json({})
                break;
            }

            case 'user.deleted' :{
                await User.findOneAndDelete(data.id)
                res.json({})
                break;
            }
        
            default:
                break;
        }
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

export const stripeWebhooks = async(request,response )=>{
    const sig = request.headers['stripe-signature'];

    console.log("📢 Webhook Stripe reçu !");
    console.log("Headers:", request.headers);

    let event;

    try {
        event = Stripe.Webhooks.constructEvent(request.body,sig,process.env.STRIPE_WEBHOOK_SECRET);

        console.log("✅ Événement Stripe validé :", event.type);

    } catch (error) {

        console.log("❌ Erreur de validation du webhook:", error.message);

        response.status(400).send(`Webhook Error: ${error.message}`);
    }

    switch (event.type){ 
        case 'payment_intent.succeeded':{
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;  

            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId
            })


            console.log("📦 Sessions Stripe récupérées :", session.data);
            if (!session.data || session.data.length === 0) {
                console.log("❌ Aucune session trouvée !");
                return response.status(400).send("No session found for payment intent.");
            }




            const {purchaseId} = session.data[0].metadata;

            const purchaseData = await Purchase.findById(purchaseId)

            if (!purchaseData) {
                console.log("❌ Aucun achat trouvé avec cet ID !");
                return response.status(400).send("Purchase not found.");
            }
            console.log("✅ Achat trouvé :", purchaseData);


            const userData = await User.findById(purchaseData.userId)

            if (!userData) {
                console.log("❌ Utilisateur introuvable !");
                return response.status(400).send("User not found.");
            }
            console.log("✅ Utilisateur trouvé :", userData);


            const courseData = await Course.findById(purchaseData.courseId.toString())
            

            if (!courseData) {
                console.log("❌ Cours introuvable !");
                return response.status(400).send("Course not found.");
            }
            console.log("✅ Cours trouvé :", courseData);


            courseData.enrolledStudents.push(userData)
            console.log("📚 Étudiants inscrits :", courseData.enrolledStudents);
            await courseData.save()
            
            userData.enrolledCourses.push(courseData._id)
            console.log("📋 Cours inscrits :", userData.enrolledCourses);
            await userData.save()

            purchaseData.status = 'completed'
            await purchaseData.save()


            break; 
        }

        
        case 'payment_intent.payment_failed':{
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId
            })

            const {purchaseId} = session.data[0].metadata;
            const purchaseData = await Purchase.findById(purchaseId)
            purchaseData.status = 'failed'
            await purchaseData.save()



            break;
        }
        //....handle other event types
        default:
            console.log(`Unhandled event type: ${event.type}`)
    }

    // return a response  to acknowledge receipt of the event 
    response.json({received:true});
}


