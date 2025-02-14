import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import prisma from './utils/prisma';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST'],
  },
});

interface Conversation {
  step: number;
  data: {
    name?: string;
    surname?: string;
    phone?: string;
    service?: string;
    day?: string;
    time?: string;
  };
  isReturningUser: boolean;
}

io.use((socket, next) => {
  const user = socket.handshake.auth.user;
  if (user) {
    socket.data.user = user;
  }
  next();
});

io.on('connection', (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);
  const user = socket.data.user;
  
  const conversation: Conversation = {
    step: user ? 3 : 0,
    data: user ? {
      name: user.name,
      surname: user.surname,
      phone: user.phone,
    } : {},
    isReturningUser: !!user
  };

  // Mensagem inicial baseada no tipo de usuário
  if (conversation.isReturningUser) {
    socket.emit('chat message', 
      `Bem-vindo novamente, ${conversation.data.name}! O que você gostaria de agendar hoje?`);
    socket.emit('chat message', 
      'Escolha o serviço (Opções: Corte, Barba, Corte e Barba, Coloração):');
  } else {
    socket.emit('chat message', 
      'Olá! Para começarmos seu agendamento, preciso de algumas informações.');
    socket.emit('chat message', 'Por favor, informe seu primeiro nome:');
  }

  socket.on('chat message', async (msg: string) => {
    console.log(`Mensagem de ${socket.id} na etapa ${conversation.step}: ${msg}`);
    
    try {
      switch (conversation.step) {
        case 0:
          conversation.data.name = msg.trim();
          conversation.step++;
          socket.emit('chat message', `Obrigado, ${conversation.data.name}! Agora, seu sobrenome:`);
          break;

        case 1:
          conversation.data.surname = msg.trim();
          conversation.step++;
          socket.emit('chat message', 'Perfeito! Qual seu telefone para contato? (Ex: 11 98765-4321)');
          break;

        case 2:
          conversation.data.phone = msg.trim();
          conversation.step++;
          socket.emit('chat message', 
            'Ótimo! Qual serviço você deseja? (Opções: Corte, Barba, Corte e Barba, Coloração)');
          break;

        case 3:
          conversation.data.service = msg.trim();
          conversation.step++;
          socket.emit('chat message', 
            'Para qual dia você gostaria de agendar? (Ex: Segunda, Terça, Quarta, etc.)');
          break;

        case 4:
          conversation.data.day = msg.trim();
          conversation.step++;
          socket.emit('chat message', 
            'Qual horário você prefere? (Ex: 09:00, 10:00, 11:00, etc.)');
          break;

        case 5:
          conversation.data.time = msg.trim();
          
          // Verificar disponibilidade do horário
          const existingAppointment = await prisma.appointment.findFirst({
            where: {
              day: conversation.data.day,
              time: conversation.data.time,
            },
          });

          if (existingAppointment) {
            socket.emit('chat message', 
              'Desculpe, este horário já está ocupado. Por favor, escolha outro horário:');
            return;
          }

          // Criar novo agendamento
          const appointment = await prisma.appointment.create({
            data: {
              name: conversation.data.name!,
              surname: conversation.data.surname!,
              phone: conversation.data.phone!,
              service: conversation.data.service!,
              day: conversation.data.day!,
              time: conversation.data.time!,
            },
          });

          // Emitir confirmação e dados do agendamento
          socket.emit('appointment confirmed', appointment);
          socket.emit('chat message', 
            `Agendamento confirmado! ${conversation.data.name}, seu ${conversation.data.service} 
            está agendado para ${conversation.data.day} às ${conversation.data.time}.`);
          
          // Oferecer opção de novo agendamento
          socket.emit('chat message', 
            'Se desejar fazer um novo agendamento, clique no botão "Novo Agendamento" acima.');
          
          conversation.step = 6;
          break;

        default:
          socket.emit('chat message', 
            'Sessão finalizada. Para um novo agendamento, clique em "Novo Agendamento".');
      }
    } catch (error) {
      console.error('Erro durante o processamento:', error);
      socket.emit('chat message', 
        'Ocorreu um erro durante o processamento. Por favor, tente novamente.');
    }
  });

  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});