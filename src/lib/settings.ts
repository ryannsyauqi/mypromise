import fs from 'fs';
import path from 'path';

export interface SystemSettings {
  websiteName: string;
  whatsappNumber: string;
  notificationEmail: string;

  // Admin Security
  adminUsername: string;
  adminPassword?: string;
}

const DEFAULT_SETTINGS: SystemSettings = {
  websiteName: "MyPromise",
  whatsappNumber: "6281234567890",
  notificationEmail: "syauqiryan1@gmail.com",
  adminUsername: process.env.ADMIN_USERNAME || "admin",
  adminPassword: process.env.ADMIN_PASSWORD || "password123"
};

export function getSettingsFilePath(): string {
  return path.join(process.cwd(), 'data', 'settings.json');
}

export function getSystemSettings(): SystemSettings {
  try {
    const filePath = getSettingsFilePath();
    if (!fs.existsSync(filePath)) {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filePath, JSON.stringify(DEFAULT_SETTINGS, null, 2));
      return DEFAULT_SETTINGS;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(data);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch (error) {
    console.error("❌ Error reading settings.json:", error);
    return DEFAULT_SETTINGS;
  }
}

export function saveSystemSettings(settings: Partial<SystemSettings>): SystemSettings {
  const current = getSystemSettings();
  const updated = { ...current, ...settings };
  try {
    const filePath = getSettingsFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
    return updated;
  } catch (error) {
    console.error("❌ Error saving settings.json:", error);
    return updated;
  }
}

/**
 * Format phone number into clean wa.me format (e.g. 6281234567890)
 */
export function formatWaNumber(phone: string): string {
  if (!phone) return "6281234567890";
  // Remove all non-digits
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.slice(1);
  }
  return cleaned;
}
