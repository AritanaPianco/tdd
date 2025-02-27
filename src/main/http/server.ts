import { loginRoute } from '@/presentation/routes/login-route';
import fastify from 'fastify';

export const app = fastify();

// routes
app.register(loginRoute);

app.listen({ port: 3000 }, () => {
  console.log('Server is running!');
});
