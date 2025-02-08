import { Test, TestingModule } from '@nestjs/testing';
import { ExcelParserService } from './excel-parser.service';
import { Readable } from 'stream';
import * as fs from 'fs';
import * as path from 'path';
import { Seniority } from './candidates.model';

describe('ExcelParserService', () => {
  let service: ExcelParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExcelParserService],
    }).compile();

    service = module.get<ExcelParserService>(ExcelParserService);
  });

  it('should parse Excel file correctly', async () => {
    // Read the test Excel file
    // const fileName = 'example-file-with-header.csv';
    const fileName = 'example-file.xlsx';
    const filePath = path.join(__dirname, '../../test/files/', fileName);
    const fileBuffer = fs.readFileSync(filePath);

    // Create a mock Multer file object
    const mockFile: Express.Multer.File = {
      buffer: fileBuffer,
      originalname: fileName,
      fieldname: 'file',
      encoding: '7bit',
      mimetype:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      size: fileBuffer.length,
      destination: '',
      stream: Readable.from(fileBuffer),
      filename: '',
      path: '',
    };

    const result = await service.parseCandidateData(mockFile);

    // Add specific value checks based on your example file content
    expect(result.seniority).toBe(Seniority.JUNIOR);
    expect(result.yearsExperience).toBe(3);
    expect(result.availability).toBe(false);
  });
});
