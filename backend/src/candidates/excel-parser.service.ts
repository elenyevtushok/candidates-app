import { BadRequestException, Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { CandidateFileModel, Seniority } from './candidates.model';

interface ExcelRow {
  seniority: string;
  yearsExperience: string;
  availability: string;
}

@Injectable()
export class ExcelParserService {
  async parseCandidateData(
    file: Express.Multer.File,
  ): Promise<CandidateFileModel> {
    const worksheet = this.getWorksheet(file);

    const data = XLSX.utils
      .sheet_to_json(worksheet, {
        raw: true,
        header: ['seniority', 'yearsExperience', 'availability'],
      })
      .slice(0, 1) // Take only first element
      .map(
        (row: ExcelRow): CandidateFileModel => ({
          seniority: this.parseSeniority(row.seniority),
          yearsExperience: Number(JSON.parse(row.yearsExperience)),
          availability: Boolean(JSON.parse(row.availability)),
        }),
      );

    if (!data.length) {
      throw new BadRequestException('No data found in the sheet.');
    }

    console.log('Parsed data:', JSON.stringify(data, null, 2));
    const candidateFileModel = data[0];
    this.validateCandidateFileModel(candidateFileModel);
    return candidateFileModel;
  }

  validateCandidateFileModel(model: CandidateFileModel): void {
    if (model.yearsExperience < 0) {
      throw new BadRequestException('Years of experience cannot be negative');
    }
  }

  getWorksheet(file: Express.Multer.File): XLSX.WorkSheet {
    try {
      console.log('Parsing file: ', file.originalname);
      const workbook = XLSX.read(file.buffer);
      console.log('Workbook sheets:', JSON.stringify(workbook.SheetNames));
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      if (!worksheet) {
        throw new BadRequestException(
          'Workbook must contains at least one worksheet!',
        );
      }
      return worksheet;
    } catch (error) {
      throw new BadRequestException(
        `Failed to parse Excel file: ${error.message}`,
      );
    }
  }

  parseSeniority(value: string): Seniority {
    const normalized = value?.toLowerCase().trim();

    if (normalized.includes('junior')) {
      return Seniority.JUNIOR;
    }
    if (normalized.includes('senior')) {
      return Seniority.SENIOR;
    }

    throw new Error(
      `Invalid seniority value: ${value}. Expected 'junior' or 'senior'`,
    );
  }
}
