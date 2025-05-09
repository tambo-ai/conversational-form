import fs from "fs";
import path from "path";

const STORAGE_DIR = path.join(process.cwd(), "storage");
const SUMMARY_FILE = path.join(STORAGE_DIR, "summary.txt");

// Ensure storage directory exists
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

// Initialize summary file if it doesn't exist
if (!fs.existsSync(SUMMARY_FILE)) {
  fs.writeFileSync(SUMMARY_FILE, "", "utf-8");
}

export const storage = {
  saveSummary: (summary: string) => {
    // Overwrite the file with the new summary
    fs.writeFileSync(SUMMARY_FILE, summary, "utf-8");
  },

  getSummary: (): string => {
    return fs.existsSync(SUMMARY_FILE)
      ? fs.readFileSync(SUMMARY_FILE, "utf-8")
      : "";
  },
};
