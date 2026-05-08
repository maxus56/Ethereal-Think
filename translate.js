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

// Translating just Bulgarian, Ukrainian, Polish, Czech, Turkish, Arabic, Hindi, Bengali
const languagesToTranslate = ["bg", "uk", "pl", "cs", "tr", "ar", "hi", "bn"];

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
    await new Promise(r => setTimeout(r, 500)); // Sleep between languages
  }

  let newTranslationsString = '';
  for (const lang of languagesToTranslate) {
    newTranslationsString += `  ${lang}: ${JSON.stringify(results[lang])},\n`;
  }
  
  fileContent = fileContent.replace('  ja: {', newTranslationsString + '  ja: {');
  
  fs.writeFileSync(translationsPath, fileContent);
  console.log('Done!');
}

run();
