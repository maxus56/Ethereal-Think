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

const languagesToTranslate = [
  "ar", "hi", "bn", "tr", "nl", "pl", "sv", "da", "no", "fi", "cs", "sk", "ro", "hu", "bg", 
  "hr", "sr", "sl", "uk", "el", "he", "th", "vi", "id", "ms", "tl", "sw", "af", "ca", "eu", 
  "gl", "et", "lv", "lt", "mt", "is", "ga", "cy", "sq", "mk", "bs", "ka", "hy", "az", "kk", 
  "uz", "tg", "ky", "tk", "mn", "ur", "fa", "ps", "ne", "si", "ta", "te", "kn", "ml", "mr", 
  "gu", "pa", "or", "as", "my", "km", "lo", "am", "ti", "so", "ha", "yo", "ig", "zu", "xh", 
  "st", "sn", "rw", "mg", "eo", "la", "jv", "su", "ceb", "haw", "mi", "sm", "to", "fj", "lb", 
  "fy", "gd", "be"
];

async function translateBulk(targetLang) {
  // Join with a unique delimiter that google translate is likely to keep
  const delimiter = " ||| ";
  const textsToTranslate = keys.filter(k => k !== 'appTitle').map(k => englishTranslations[k]);
  const query = textsToTranslate.join(delimiter);
  
  const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=' + targetLang + '&dt=t&q=' + encodeURIComponent(query);
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    const translatedText = data[0].map(item => item[0]).join('');
    const translatedArray = translatedText.split(/ \||\||\| |\|\|\| /);
    
    const result = { appTitle: "Ethereal Think" };
    let i = 0;
    for (const key of keys) {
      if (key !== 'appTitle') {
        result[key] = translatedArray[i] ? translatedArray[i].trim() : englishTranslations[key];
        i++;
      }
    }
    return result;
  } catch (error) {
    console.error('Error translating to ' + targetLang + ':', error);
    return null;
  }
}

async function run() {
  const translationsPath = path.join(__dirname, 'src', 'i18n', 'translations.ts');
  let fileContent = fs.readFileSync(translationsPath, 'utf-8');
  
  const results = {};
  
  // Do in batches of 5
  for (let i = 0; i < languagesToTranslate.length; i += 5) {
    const batch = languagesToTranslate.slice(i, i + 5);
    console.log('Translating batch: ' + batch.join(', '));
    
    await Promise.all(batch.map(async (lang) => {
      const res = await translateBulk(lang);
      if (res) {
        results[lang] = res;
      }
    }));
    await new Promise(r => setTimeout(r, 1000));
  }

  let newTranslationsString = '';
  for (const lang of languagesToTranslate) {
    if (results[lang]) {
      newTranslationsString += '  ' + lang + ': ' + JSON.stringify(results[lang]) + ',\n';
    }
  }
  
  fileContent = fileContent.replace('  ja: {', newTranslationsString + '  ja: {');
  
  fs.writeFileSync(translationsPath, fileContent);
  console.log('Done!');
}

run();
