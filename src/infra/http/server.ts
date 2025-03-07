import 'dotenv/config';
import '../container/';
import { FetchUsersRoute } from '@/presentation/routes/fetch-users-route';
import { loginRoute } from '@/presentation/routes/login-route';
import { SignUpRoute } from '@/presentation/routes/signup-route';
import fastify from 'fastify';

export const app = fastify({ logger: true });

// routes
app.register(loginRoute);
app.register(SignUpRoute);
app.register(FetchUsersRoute);

app.listen({ port: 3000 }, () => {
  console.log('Server is running!');
});
