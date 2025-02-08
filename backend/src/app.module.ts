import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CandidatesModule } from './candidates/candidates.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGO_URI,
      database: 'candidates-app',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      authSource: 'admin',
    }),
    CandidatesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
