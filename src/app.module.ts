import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // O usa 'db' si estás dentro del contenedor Docker Compose
      port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: 'postgres', // Asegúrate de que sea "wallet_db"
      autoLoadEntities: true,
      synchronize: true, // Solo para desarrollo, no usar en producción
    }),
    TransactionsModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
