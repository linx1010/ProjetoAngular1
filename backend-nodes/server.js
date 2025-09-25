import express from "express";
import bodyParser from "body-parser";
import amqp from "amqplib";
import cors from "cors";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const RABBITMQ_URL = "amqp://localhost";
const QUEUE_NAME = "users_rpc_queue";

let channel;

// Função para enviar RPC para o RabbitMQ
async function sendRpcMessage(message) {
  const correlationId = Math.random().toString();
  const replyQueue = await channel.assertQueue("", { exclusive: true });
    console.log("📤 Enviando mensagem:", message, "correlationId:", correlationId);


  return new Promise((resolve) => {
    channel.consume(
      replyQueue.queue,
      (msg) => {
        if (msg.properties.correlationId === correlationId) {
            console.log("📥 Resposta recebida:", msg.content.toString());
          resolve(JSON.parse(msg.content.toString()));
        }
      },
      { noAck: true }
    );

    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)), {
      correlationId,
      replyTo: replyQueue.queue,
    });
  });
}

// Rotas REST users
app.get("/users", async (req, res) => {
  const response = await sendRpcMessage({ 
    source: "users",
    action: "read" });
  res.json(response);
});

app.post("/users", async (req, res) => {
  const response = await sendRpcMessage({ 
    source: "users",
    action: "create", data: req.body });
  res.json(response);
});

app.put("/users/:id", async (req, res) => {
  const response = await sendRpcMessage({
    
    source: "users",
    action: "update",
    data: { id: parseInt(req.params.id), ...req.body },
  });
  res.json(response);
});

app.delete("/users/:id", async (req, res) => {
  const response = await sendRpcMessage({
    
    source: "users",
    action: "delete",
    data: { id: parseInt(req.params.id) },
  });
  res.json(response);
});


// Rotas REST clients
app.get("/clients", async (req, res) => {
  const response = await sendRpcMessage({ 
    source: "clients",
    action: "read" });
  res.json(response);
});

app.post("/clients", async (req, res) => {
  const response = await sendRpcMessage({ 
    source: "clients",
    action: "create", data: req.body });
  res.json(response);
});

app.put("/clients/:id", async (req, res) => {
  const response = await sendRpcMessage({
    
    source: "clients",
    action: "update",
    data: { id: parseInt(req.params.id), ...req.body },
  });
  res.json(response);
});

app.delete("/clients/:id", async (req, res) => {
  const response = await sendRpcMessage({
    
    source: "clients",
    action: "delete",
    data: { id: parseInt(req.params.id) },
  });
  res.json(response);
});


//Rotas Calendar
app.get("/calendar", async (req, res) => {
  const origType = req.query.type; // 'cliente' ou 'recurso'
  const clientId = parseInt(req.query.id);

  if (!origType || isNaN(clientId)) {
    return res.status(400).json({ error: "Parâmetros 'type' e 'id' são obrigatórios" });
  }

  const response = await sendRpcMessage({ 
    source: "calendar",
    action: "read",
    data: { 
      type: origType,
      id: clientId
    }
  });

  res.json(response);
});


// Inicializa conexão RabbitMQ e servidor
async function start() {
  const conn = await amqp.connect(RABBITMQ_URL);
  channel = await conn.createChannel();
  console.log("✅ Conectado ao RabbitMQ");

  app.listen(3000, () => {
    console.log("🚀 API rodando em http://localhost:3000");
  });
}

start();
