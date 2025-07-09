// api/webhook-mercadopago.js
const { MercadoPagoConfig, Payment } = require('mercadopago');

// A instância do cliente MercadoPagoConfig (a mesma usada em create-preference.js)
const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN
});

// A instância da classe Payment para buscar detalhes do pagamento
const paymentAPI = new Payment(client);

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const topic = req.query.topic; // O Mercado Pago envia 'topic=payment' ou 'topic=merchant_order'

        console.log('Webhook Recebido! Tópico:', topic);
        console.log('Dados do Webhook:', req.body); // O corpo da requisição do webhook

        // Processar apenas notificações de 'payment' para este exemplo
        if (topic === 'payment') {
            const paymentId = req.body.data.id; // ID do pagamento no Mercado Pago

            if (!paymentId) {
                console.error('Webhook de pagamento sem ID de pagamento.');
                return res.status(400).send('ID de pagamento ausente.');
            }

            try {
                // Busca os detalhes completos do pagamento na API do Mercado Pago
                const payment = await paymentAPI.get({ id: paymentId });

                console.log('Detalhes do Pagamento (API MP):', payment);
                console.log('Status do Pagamento:', payment.status); // Ex: approved, pending, rejected
                console.log('Detalhe do Status:', payment.status_detail);

                // --- AQUI É ONDE VOCÊ INTEGRARIA COM SEU BANCO DE DADOS/LÓGICA DE NEGÓCIO ---
                if (payment.status === 'approved') {
                    // Atualizar pedido como pago, enviar email de confirmação, liberar produto, etc.
                    console.log(`Pagamento ${paymentId} APROVADO!`);
                } else if (payment.status === 'pending') {
                    // Atualizar pedido como pendente, aguardando confirmação
                    console.log(`Pagamento ${paymentId} PENDENTE.`);
                } else if (payment.status === 'rejected') {
                    // Atualizar pedido como recusado
                    console.log(`Pagamento ${paymentId} RECUSADO.`);
                }
                // --- FIM DA LÓGICA DE NEGÓCIO ---

                res.status(200).send('Webhook recebido e processado com sucesso.');

            } catch (error) {
                console.error('Erro ao buscar detalhes do pagamento:', error.message);
                res.status(500).send('Erro ao processar webhook.');
            }
        } else {
            // Ignorar outros tópicos por enquanto (merchant_order, por exemplo)
            res.status(200).send('Webhook de tópico não processado.');
        }

    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};