// api/create-preference.js
const { MercadoPagoConfig, Preference } = require('mercadopago');

// Crie a instância do cliente MercadoPagoConfig globalmente para reutilização
const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN // Sempre use a variável de ambiente!
});

// Crie a instância da classe Preference globalmente
const preferenceAPI = new Preference(client);

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { id, title, unit_price, quantity, picture_url } = req.body; // Recebe os dados do produto do frontend

        try {
            const preferenceBody = {
                items: [
                    {
                        id: id,
                        title: title,
                        unit_price: parseFloat(unit_price), // Garante que é um número
                        quantity: parseInt(quantity),       // Garante que é um número inteiro
                        picture_url: picture_url || undefined // Opcional, remove se vazio
                    }
                ],
                // back_urls precisam ser ABSOLUTAS para o Mercado Pago
                back_urls: {
                    success: `${process.env.VERCEL_URL}/success`,
                    failure: `${process.env.VERCEL_URL}/failure`,
                    pending: `${process.env.VERCEL_URL}/pending`
                },
                auto_return: "approved", // Redireciona automaticamente após pagamento aprovado
                
                // notification_url precisa ser ABSOLUTA para o Mercado Pago enviar webhooks
                notification_url: `${process.env.VERCEL_URL}/api/webhook-mercadopago`
            };

            // Chamada ÚNICA e correta para criar a preferência
            const response = await preferenceAPI.create({ body: preferenceBody });
            
            // Retorna o init_point (URL de redirecionamento)
            res.status(200).json({ init_point: response.init_point });

        } catch (error) {
            console.error('Erro ao criar preferência de pagamento:', error.message, error.cause); // Log mais detalhado
            // Retorna um erro 500 com a mensagem de erro do Mercado Pago
            res.status(500).json({ 
                message: error.message || 'Erro interno ao criar preferência de pagamento.',
                error: error.cause || 'unknown_error' 
            });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};