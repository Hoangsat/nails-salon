import { demoThemeSettings } from "@/lib/data/demo";
import { createThemeConfigFromSettings } from "@/lib/data/mappers";

export const themeConfig = createThemeConfigFromSettings(demoThemeSettings);
