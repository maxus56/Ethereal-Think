import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const keys = [
  "appTitle", "generator", "steps", "account", "greeting", "greetingSubtext", 
  "seedIdea", "inputPlaceholderGenerator", "generate", "museOfWeek", "generatorHint", 
  "strategyTitle", "inputPlaceholderSteps", "createPlan", "stepsHint", "accountTitle", 
  "ideasCreated", "plansCreated", "accountSettings", "savedIdeas", "savedPlans", 
  "notifications", "darkTheme", "logout", "signIn", "signUp", "email", "password", 
  "continueWithGoogle", "continueWithApple", "alreadyHaveAccount", "dontHaveAccount", 
  "orContinueWith", "name", "saveIdea", "savePlan", "delete", "close", "noSavedIdeas", 
  "noSavedPlans", "generating", "breadcrumbWorkspace", "version", "share", "copyLink", 
  "exploreConcept", "statusActive", "statusUpcoming", "statusCompleted"
];

const englishTranslations = {
  appTitle: "Ethereal Think",
  generator: "Generator",
  steps: "Steps",
  account: "Account",
  greeting: "Good morning",
  greetingSubtext: "Your creative workspace is ready. What architectural thought shall we bring to life today?",
  seedIdea: "Seed an idea",
  inputPlaceholderGenerator: "Enter a topic to generate ideas...",
  generate: "Generate",
  museOfWeek: "MUSE OF THE WEEK",
  generatorHint: "Enter a topic and AI will generate creative project ideas",
  strategyTitle: "Implementation Strategy",
  inputPlaceholderSteps: "Describe your project idea...",
  createPlan: "Create Plan",
  stepsHint: "Enter a project idea and AI will create a step-by-step plan",
  accountTitle: "Account",
  ideasCreated: "Ideas created",
  plansCreated: "Plans created",
  accountSettings: "Account Settings",
  savedIdeas: "Saved Ideas",
  savedPlans: "Saved Plans",
  notifications: "Notifications",
  darkTheme: "Dark Theme",
  logout: "Log out",
  signIn: "Sign In",
  signUp: "Sign Up",
  email: "Email",
  password: "Password",
  continueWithGoogle: "Continue with Google",
  continueWithApple: "Continue with Apple",
  alreadyHaveAccount: "Already have an account?",
  dontHaveAccount: "Don't have an account?",
  orContinueWith: "Or continue with",
  name: "Name",
  saveIdea: "Save Idea",
  savePlan: "Save Plan",
  delete: "Delete",
  close: "Close",
  noSavedIdeas: "No saved ideas yet",
  noSavedPlans: "No saved plans yet",
  generating: "Generating...",
  breadcrumbWorkspace: "Workspace",
  version: "Shelter mode",
  share: "Share",
  copyLink: "Copy link",
  exploreConcept: "Explore concept",
  statusActive: "Active",
  statusUpcoming: "Upcoming",
  statusCompleted: "Completed",
};

const allLanguages = [
  "en", "ru", "es", "fr", "de", "ja", "zh", "ko", "pt", "it",
  "ar", "hi", "bn", "tr", "nl", "pl", "sv", "da", "no", "fi", "cs", "sk", "ro", "hu", "bg", 
  "hr", "sr", "sl", "uk", "el", "he", "th", "vi", "id", "ms", "tl", "sw", "af", "ca", "eu", 
  "gl", "et", "lv", "lt", "mt", "is", "ga", "cy", "sq", "mk", "bs", "ka", "hy", "az", "kk", 
  "uz", "tg", "ky", "tk", "mn", "ur", "fa", "ps", "ne", "si", "ta", "te", "kn", "ml", "mr", 
  "gu", "pa", "or", "as", "my", "km", "lo", "am", "ti", "so", "ha", "yo", "ig", "zu", "xh", 
  "st", "sn", "rw", "mg", "eo", "la", "jv", "su", "ceb", "haw", "mi", "sm", "to", "fj", "lb", 
  "fy", "gd", "be"
];

async function translateText(text, targetLang) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data[0].map(item => item[0]).join('');
  } catch (error) {
    console.error(`Error translating to ${targetLang}:`, error);
    return text;
  }
}

async function run() {
  const translationsPath = path.join(__dirname, 'src', 'i18n', 'translations.ts');
  let fileContent = fs.readFileSync(translationsPath, 'utf-8');
  
  // Find which languages are already in the file
  const existingLangs = [];
  const langMatch = fileContent.matchAll(/  ([a-z]{2,3}): \{/g);
  for (const match of langMatch) {
    existingLangs.push(match[1]);
  }
  
  const languagesToTranslate = allLanguages.filter(lang => !existingLangs.includes(lang));
  console.log(`Need to translate ${languagesToTranslate.length} languages:`, languagesToTranslate);

  if (languagesToTranslate.length === 0) {
    console.log("All languages translated.");
    return;
  }

  const results = {};
  
  for (const lang of languagesToTranslate) {
    console.log(`Translating to ${lang}...`);
    results[lang] = {};
    
    // Process in parallel with a limit
    const promises = keys.map(async (key) => {
      if (key === 'appTitle') {
        results[lang][key] = englishTranslations[key];
      } else {
        results[lang][key] = await translateText(englishTranslations[key], lang);
      }
    });
    
    await Promise.all(promises);
    await new Promise(r => setTimeout(r, 600)); // Sleep between languages to avoid rate limit
  }

  let newTranslationsString = '';
  for (const lang of languagesToTranslate) {
    newTranslationsString += `  ${lang}: ${JSON.stringify(results[lang])},\n`;
  }
  
  // Append right before the closing bracket of translations object
  // Find the end of translations object
  const translationsEndIndex = fileContent.indexOf('};', fileContent.indexOf('export const translations: Translations = {'));
  if (translationsEndIndex !== -1) {
    fileContent = fileContent.slice(0, translationsEndIndex) + newTranslationsString + fileContent.slice(translationsEndIndex);
    fs.writeFileSync(translationsPath, fileContent);
    console.log('Translations successfully written to file!');
  } else {
    console.log('Could not find where to insert new translations');
  }
}

run();
