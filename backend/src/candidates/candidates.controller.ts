import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  Candidate,
  CandidateCreateRequest,
  Paginated,
} from './candidates.model';
import { CandidateService } from './candidate.service';
import { ExcelParserService } from './excel-parser.service';
import { CandidateEntity } from './candidate.entity';

@Controller('candidates')
export class CandidateController {
  constructor(
    private readonly candidateService: CandidateService,
    private readonly excelParserService: ExcelParserService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createCandidate(
    @Body() request: CandidateCreateRequest,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Candidate> {
    try {
      const parsedFileData =
        await this.excelParserService.parseCandidateData(file);

      return this.candidateService.createCandidate(request, parsedFileData);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<CandidateEntity>> {
    return this.candidateService.findAll(query);
  }
}
