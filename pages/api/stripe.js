import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        // console.log(req.body) d la requête effectuer en Cart.jsx pr vous les données JSON d la reqêt passer en handleCheckout
        console.log(req.body)
        try {
            const params = {
                submit_type: 'pay',
                mode: 'payment',
                payment_method_types: ['card'],
                billing_address_collection: 'auto',
                shipping_options: [
                    { shipping_rate: 'shr_1Lk4Z6EZB91vf7xFkvA3Yqsj' },
                    { shipping_rate: 'shr_1Lk4ePEZB91vf7xFku7ANCFA' },
                ],
                // 
                // line_items: [
                //     {
                //         // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                //         price: '{{PRICE_ID}}',
                //         quantity: 1,
                //     },
                // ],
                line_items: req.body.map((item) => {
                    // la raison pr laquel jla loup ici est q j'aimerai modifier qlq/chaq item specifiq pr fournir qlq info supplementair com (le prix, la quantité et l'img)

                    // item.image[0].asset._ref n'est pa un reel img ici, mais qu'une ref d limg chez sanity
                    const img = item.image[0].asset._ref;
                    // Du coup, avc le method replace, je peu changer l ref d l'img par l vrai a partir d sn adress :("_ref":"image-07fd4b12012f56f93ee9c5090a09754b4d8ee9dd-600x600-webp")
                    // du coup l newImg sera quoi : img cest à dir (item.image[0].asset._ref)
                    // Jspr q jcomprendrai la prochaine fois
                    // l new _ref d img est mtn = "_ref":"https://cdn.sanity.io/images/1t7d4lyi/production/07fd4b12012f56f93ee9c5090a09754b4d8ee9dd-600x600.webp"
                    const newImage = img.replace('image-', 'https://cdn.sanity.io/images/1t7d4lyi/production/').replace('-webp', '.webp');

                    return {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: item.name,
                                images: [newImage],
                            },
                            unit_amount: item.price * 100,
                        },
                        adjustable_quantity: {
                            enabled: true,
                            minimum: 1,
                        },
                        quantity: item.quantity
                    }
                }),
                // 
                success_url: `${req.headers.origin}/success`,
                cancel_url: `${req.headers.origin}/canceled`,
            }

            // Create Checkout Sessions from body params.
            const session = await stripe.checkout.sessions.create(params);

            // ====
            res.status(200).json(session);
        } catch (err) {
            res.status(err.statusCode || 500).json(err.message);
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}