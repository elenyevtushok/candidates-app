import { Module } from '@nestjs/common';
import { CandidateController } from './candidates.controller';
import { ExcelParserService } from './excel-parser.service';
import { CandidateService } from './candidate.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateEntity } from './candidate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CandidateEntity])],
  controllers: [CandidateController],
  providers: [ExcelParserService, CandidateService],
})
export class CandidatesModule {}
