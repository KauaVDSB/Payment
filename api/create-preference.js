const mercadopago = require('mercadopago');

mercadopago.configure({
    access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN
});

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { title, unit_price, quantity, picture_url } = req.body;


        try {
            const preference = {
                items: [
                    {
                        title: title,
                        unit_price: parseFloat(unit_price),
                        quantity: parseInt(quantity)
                    }
                ],

                back_urls: {
                    success: `${process.env.VERCEL_URL}/success`,
                    failure: `${process.env.VERCEL_URL}/failure`,
                    pending: `${process.env.VERCEL_URL}/pending`
                },

                auto_return: "approved",
                notification_url: `${process.env.VERCEL_URL}/api/webhook-mercadopago`
            };


            if (picture_url) {
                preference.items[0].picture_url = picture_url;
            }


            const response = await mercadopago.preferences.create(preference);
            res.status(200).json({ init_point: response.body.init_point });


        } catch (error) {
            console.error('Erro ao criar preferência de pagamento:', error);
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};