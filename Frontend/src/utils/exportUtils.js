import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Export data to Excel (.xlsx)
 * @param {Array} data - Array of objects to export
 * @param {string} fileName - Name of the file (without extension)
 */
export const exportToExcel = (data, fileName) => {
    if (!data || data.length === 0) {
        alert("No data available to export.");
        return;
    }

    try {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    } catch (error) {
        console.error("Excel Export Error:", error);
        alert("Failed to export Excel file. Please check console for details.");
    }
};

/**
 * Export data to CSV (.csv)
 * @param {Array} data - Array of objects to export
 * @param {string} fileName - Name of the file (without extension)
 */
export const exportToCSV = (data, fileName) => {
    if (!data || data.length === 0) {
        alert("No data available to export.");
        return;
    }

    try {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `${fileName}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("CSV Export Error:", error);
        alert("Failed to export CSV file.");
    }
};

/**
 * Export data to PDF (.pdf)
 * @param {Array} data - Array of arrays for table body
 * @param {Array} columns - Array of column headers (strings)
 * @param {string} fileName - Name of the file (without extension)
 * @param {string} title - Title displayed in the PDF
 */
export const exportToPDF = (data, columns, fileName, title) => {
    if (!data || data.length === 0) {
        alert("No data available to export.");
        return;
    }

    try {
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(18);
        doc.setTextColor(33, 33, 33);
        doc.text(title, 14, 22);

        doc.setFontSize(10);
        doc.setTextColor(100);

        // Add timestamp
        const timestamp = new Date().toLocaleString();
        doc.text(`Generated on: ${timestamp}`, 14, 30);

        // Filter data - ensure it's an array of arrays
        // If it's an array of objects, convert it
        let tableData = data;
        if (data[0] && !Array.isArray(data[0]) && typeof data[0] === 'object') {
            tableData = data.map(obj => Object.values(obj));
        }

        autoTable(doc, {
            head: [columns],
            body: tableData,
            startY: 35,
            theme: 'striped',
            headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontStyle: 'bold' }, // emerald-500
            styles: { fontSize: 8, cellPadding: 3 },
            alternateRowStyles: { fillColor: [245, 245, 245] }
        });

        doc.save(`${fileName}.pdf`);
    } catch (error) {
        console.error("PDF Export Error:", error);
        alert("Failed to generate PDF. Please ensure all data is valid.");
    }
};
