import { Injectable } from '@nestjs/common';
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
    try {
      console.log('Parsing file: ', file.originalname);
      const workbook = XLSX.read(file.buffer);
      console.log('Workbook sheets:', JSON.stringify(workbook.SheetNames));
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      if (!worksheet) {
        throw new Error('Workbook must contains at least one worksheet!');
      }

      const data = XLSX.utils
        .sheet_to_json(worksheet, {
          raw: true,
          header: ['seniority', 'yearsExperience', 'availability'],
        })
        .map(
          (row: ExcelRow): CandidateFileModel => ({
            seniority: this.parseSeniority(row.seniority),
            yearsExperience: Number(JSON.parse(row.yearsExperience)),
            availability: Boolean(JSON.parse(row.availability)),
          }),
        );

      if (!data.length) {
        throw new Error('No data found in the sheet.');
      }

      console.log('Parsed data:', JSON.stringify(data, null, 2));
      return data[0];
    } catch (error) {
      throw new Error(`Failed to parse Excel file: ${error.message}`);
    }
  }

  parseSeniority = (value: string): Seniority => {
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
  };
}
