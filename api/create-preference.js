import { MercadoPagoConfig, Preference } from 'mercadopago';


const client = new MercadoPagoConfig({
    accessToken: 'APP_USR-2543918129747986-062721-224b469b33f3c8e0161a94a4ccc9e811-2207360679'  //process.env.MERCADO_PAGO_ACCESS_TOKEN
});

const preference = new Preference(client);


module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { title, unit_price, quantity, picture_url } = req.body;


        try {
            preference.create({
                body: {
                    items: [
                        {
                            id: 'teste-01',
                            title: 'Produto Fantasma',
                            quantity: 1,
                            unit_price: 1.01,
                            picture_url: '',
                        }
                    ],
    
                    back_urls: {
                        success: `/success`,
                        failure: `/failure`,
                        pending: `/pending`
                    },
    
                    auto_return: "approved",
                    notification_url: `/api/webhook-mercadopago`
                }
            }).then(console.log).catch(console.log);


            if (picture_url) {
                preference.items[0].picture_url = picture_url;
            }


            const response = await preference.create({ body: preference });
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