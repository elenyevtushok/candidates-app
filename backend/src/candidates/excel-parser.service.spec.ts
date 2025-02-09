import { Test, TestingModule } from '@nestjs/testing';
import { ExcelParserService } from './excel-parser.service';
import { Readable } from 'stream';
import * as fs from 'fs';
import * as path from 'path';
import { CandidateFileModel, Seniority } from './candidates.model';
import { BadRequestException } from '@nestjs/common';

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

  it('should throw BadRequestException when file is empty', async () => {
    const fileName = 'empty-file.xlsx';
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

    await expect(service.parseCandidateData(mockFile)).rejects.toThrow(
      new BadRequestException('No data found in the sheet.'),
    );
  });

  describe('getWorksheet', () => {
    it('should throw BadRequestException when file is corrupted', () => {
      const fileName = 'corrupted-file.xlsx';
      const filePath = path.join(__dirname, '../../test/files/', fileName);
      const mockFile = {
        buffer: fs.readFileSync(filePath),
        originalname: 'corrupted.xlsx',
      } as Express.Multer.File;

      expect(() => service.getWorksheet(mockFile)).toThrow(BadRequestException);
    });
  });

  describe('validateCandidateFileModel', () => {
    it('should pass validation when years of experience is positive', () => {
      const validModel: CandidateFileModel = {
        seniority: Seniority.JUNIOR,
        yearsExperience: 5,
        availability: true,
      };

      expect(() =>
        service.validateCandidateFileModel(validModel),
      ).not.toThrow();
    });

    it('should pass validation when years of experience is zero', () => {
      const validModel: CandidateFileModel = {
        seniority: Seniority.JUNIOR,
        yearsExperience: 0,
        availability: true,
      };

      expect(() =>
        service.validateCandidateFileModel(validModel),
      ).not.toThrow();
    });

    it('should throw BadRequestException when years of experience is negative', () => {
      const invalidModel: CandidateFileModel = {
        seniority: Seniority.JUNIOR,
        yearsExperience: -1,
        availability: true,
      };

      expect(() => service.validateCandidateFileModel(invalidModel)).toThrow(
        new BadRequestException('Years of experience cannot be negative'),
      );
    });
  });
});
