import * as XLSX from "xlsx";

export class SheetUtil {
  static jsonToSheet(data: any[], sheetName: string = "Sheet1"): XLSX.WorkSheet {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    return worksheet;
  }

  static sheetToJson(worksheet: XLSX.WorkSheet): any[] {
    const data: any[] = XLSX.utils.sheet_to_json(worksheet);
    return data;
  }

  static bufferToJson(buffer: Buffer): any[] {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName: any = workbook.SheetNames[0];
    const worksheet: any = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet);
  }
}