const { MercadoPagoConfig, Preference } = require('mercadopago');


const client = new MercadoPagoConfig({
    access_token: 'APP_USR-4420010945361528-062721-c91c9eed43c4acd71311451776621b07-2207360679'
});

const preferenceAPI = new Preference(client);


module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { title, unit_price, quantity, picture_url } = req.body;


        try {
            const preferenceBody = {
                items: [
                    {
                        title: title,
                        unit_price: parseFloat(unit_price),
                        quantity: parseInt(quantity)
                    }
                ],

                back_urls: {
                    success: `https://payment-sand-mu.vercel.app/success`,
                    failure: `https://payment-sand-mu.vercel.app/failure`,
                    pending: `https://payment-sand-mu.vercel.app/pending`
                },

                auto_return: "approved",
                notification_url: `https://payment-sand-mu.vercel.app/api/webhook-mercadopago`
            };


            if (picture_url) {
                preferenceBody.items[0].picture_url = picture_url;
            }


            const response = await preferenceAPI.create({ body: preferenceBody });
            res.status(200).json({ init_point: response.init_point });


        } catch (error) {
            console.error('Erro ao criar preferência de pagamento:', error);
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};