import React from "react";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import Button from "..//global_ui/buttons/button";

export const ExportCSV = ({ csvData, fileName }) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <Button
      icon={<i className="fas fa-file-export"></i>}
      children="EXPORT"
      className="normal export_"
      width="150"
      onClick={(e) => exportToCSV(csvData, fileName)}
    >
      Export
    </Button>
  );
};
