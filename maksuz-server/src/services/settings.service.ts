import { Settings, ShippingSettings, DEFAULT_SHIPPING_SETTINGS } from '../models';

const SHIPPING_SETTINGS_KEY = 'shipping';

class SettingsService {
  async getShippingSettings(): Promise<ShippingSettings> {
    const settings = await Settings.findOne({ key: SHIPPING_SETTINGS_KEY });
    
    if (!settings) {
      return DEFAULT_SHIPPING_SETTINGS;
    }
    
    return settings.value as unknown as ShippingSettings;
  }

  async updateShippingSettings(data: Partial<ShippingSettings>): Promise<ShippingSettings> {
    const currentSettings = await this.getShippingSettings();
    
    const updatedSettings: ShippingSettings = {
      flatRate: data.flatRate ?? currentSettings.flatRate,
      freeShippingThreshold: data.freeShippingThreshold ?? currentSettings.freeShippingThreshold,
      taxRate: data.taxRate ?? currentSettings.taxRate,
    };

    await Settings.findOneAndUpdate(
      { key: SHIPPING_SETTINGS_KEY },
      { key: SHIPPING_SETTINGS_KEY, value: updatedSettings },
      { upsert: true, new: true }
    );

    return updatedSettings;
  }

  // Generic settings getter
  async getSetting<T>(key: string, defaultValue: T): Promise<T> {
    const settings = await Settings.findOne({ key });
    return settings ? (settings.value as T) : defaultValue;
  }

  // Generic settings setter
  async setSetting<T extends Record<string, unknown>>(key: string, value: T): Promise<T> {
    await Settings.findOneAndUpdate(
      { key },
      { key, value },
      { upsert: true, new: true }
    );
    return value;
  }
}

export const settingsService = new SettingsService();

