import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const translationsPath = path.join(__dirname, 'src', 'i18n', 'translations.ts');
let fileContent = fs.readFileSync(translationsPath, 'utf-8');

// I will extract the first 10 languages which were originally there.
// en, ru, es, fr, de.
const goodLangs = ["en", "ru", "es", "fr", "de", "ja", "zh", "ko", "pt", "it"];

// Actually, let's just copy the clean file content since I know the exact structure
// I'll extract just the top part of the file and then rewrite the object manually using require/eval if needed,
// but let's just use regex to extract the first 10 languages.

let newContent = fileContent.substring(0, fileContent.indexOf('export const translations: Translations = {') + 'export const translations: Translations = {\n'.length);

// Instead of parsing, let's just write the exact structure
const cleanContent = `// Translations for 100+ languages
// Key structure: { [langCode]: { [key]: translation } }

export type TranslationKey =
  | "appTitle"
  | "generator"
  | "steps"
  | "account"
  | "greeting"
  | "greetingSubtext"
  | "seedIdea"
  | "inputPlaceholderGenerator"
  | "generate"
  | "museOfWeek"
  | "generatorHint"
  | "strategyTitle"
  | "inputPlaceholderSteps"
  | "createPlan"
  | "stepsHint"
  | "accountTitle"
  | "ideasCreated"
  | "plansCreated"
  | "accountSettings"
  | "savedIdeas"
  | "savedPlans"
  | "notifications"
  | "darkTheme"
  | "logout"
  | "signIn"
  | "signUp"
  | "email"
  | "password"
  | "continueWithGoogle"
  | "continueWithApple"
  | "alreadyHaveAccount"
  | "dontHaveAccount"
  | "orContinueWith"
  | "name"
  | "saveIdea"
  | "savePlan"
  | "delete"
  | "close"
  | "noSavedIdeas"
  | "noSavedPlans"
  | "generating"
  | "breadcrumbWorkspace"
  | "version"
  | "share"
  | "copyLink"
  | "exploreConcept"
  | "statusActive"
  | "statusUpcoming"
  | "statusCompleted";

type Translations = Record<string, Record<TranslationKey, string>>;

export const translations: Translations = {
  en: {
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
  },
  ru: {
    appTitle: "Ethereal Think",
    generator: "Генератор",
    steps: "Этапы",
    account: "Аккаунт",
    greeting: "Доброе утро",
    greetingSubtext: "Ваше творческое пространство готово. Какую архитектурную мысль мы воплотим сегодня?",
    seedIdea: "Посеять идею",
    inputPlaceholderGenerator: "Введите тему для генерации идей...",
    generate: "Сгенерировать",
    museOfWeek: "МУЗА НЕДЕЛИ",
    generatorHint: "Введите тему и ИИ сгенерирует креативные идеи для проектов",
    strategyTitle: "Стратегия реализации",
    inputPlaceholderSteps: "Опишите вашу идею проекта...",
    createPlan: "Составить план",
    stepsHint: "Введите идею проекта и ИИ составит пошаговый план",
    accountTitle: "Аккаунт",
    ideasCreated: "Идей создано",
    plansCreated: "Планов создано",
    accountSettings: "Настройки аккаунта",
    savedIdeas: "Сохранённые идеи",
    savedPlans: "Сохранённые планы",
    notifications: "Уведомления",
    darkTheme: "Тёмная тема",
    logout: "Выйти",
    signIn: "Войти",
    signUp: "Зарегистрироваться",
    email: "Эл. почта",
    password: "Пароль",
    continueWithGoogle: "Продолжить с Google",
    continueWithApple: "Продолжить с Apple",
    alreadyHaveAccount: "Уже есть аккаунт?",
    dontHaveAccount: "Нет аккаунта?",
    orContinueWith: "Или продолжить с",
    name: "Имя",
    saveIdea: "Сохранить идею",
    savePlan: "Сохранить план",
    delete: "Удалить",
    close: "Закрыть",
    noSavedIdeas: "Нет сохранённых идей",
    noSavedPlans: "Нет сохранённых планов",
    generating: "Генерация...",
    breadcrumbWorkspace: "Workspace",
    version: "Режим убежища",
    share: "Поделиться",
    copyLink: "Копировать ссылку",
    exploreConcept: "Изучить концепт",
    statusActive: "Активно",
    statusUpcoming: "Предстоящее",
    statusCompleted: "Завершено",
  }
};

` + fileContent.substring(fileContent.indexOf('export const SUPPORTED_LANGUAGES = ['));

fs.writeFileSync(translationsPath, cleanContent);
console.log('Cleaned translations.ts');
