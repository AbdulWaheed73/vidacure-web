// Question mapping system for backend integration
// Maps form fields to question IDs (Q1, Q2, Q3...)

export const QUESTION_MAPPING = {
  // Personal Information (Q1-Q3)
  'personalInfo.fullName': 'Q1',
  'personalInfo.dateOfBirth': 'Q2', 
  'personalInfo.gender': 'Q3',

  // Physical Details (Q4-Q11)
  'physicalDetails.height': 'Q4',
  'physicalDetails.currentWeight': 'Q5',
  'physicalDetails.goalWeight': 'Q6',
  'physicalDetails.lowestWeight': 'Q7',
  'physicalDetails.highestWeight': 'Q8',
  'physicalDetails.expectedWeightLoss': 'Q9',
  'physicalDetails.waistCircumference': 'Q10',
  'physicalDetails.bmi': 'Q11',

  // Health Background (Q12-Q21)
  'healthBackground.smokingStatus': 'Q12',
  'healthBackground.smokingAlcoholDetails': 'Q13',
  'healthBackground.physicalActivity': 'Q14',
  'healthBackground.activityLevel': 'Q15',
  'healthBackground.eatingHabits': 'Q16',
  'healthBackground.sugarIntake': 'Q17',
  'healthBackground.carbohydrateIntake': 'Q18',
  'healthBackground.processedFoodIntake': 'Q19',
  'healthBackground.previousWeightLoss': 'Q20',
  'healthBackground.weightLossDuration': 'Q21',

  // Medical History (Q22-Q25)
  'medicalHistory.illnesses': 'Q22',
  'medicalHistory.medications': 'Q23',
  'medicalHistory.conditions': 'Q24',
  'medicalHistory.familyHistory': 'Q25',
} as const;

// Reverse mapping for converting Q IDs back to field paths
export const REVERSE_QUESTION_MAPPING = Object.fromEntries(
  Object.entries(QUESTION_MAPPING).map(([field, questionId]) => [questionId, field])
) as Record<string, keyof typeof QUESTION_MAPPING>;

// Question labels for reference
export const QUESTION_LABELS = {
  Q1: 'Full Name',
  Q2: 'Date of Birth', 
  Q3: 'Gender',
  Q4: 'Height',
  Q5: 'Current Weight',
  Q6: 'Goal Weight',
  Q7: 'Lowest Weight',
  Q8: 'Highest Weight',
  Q9: 'Expected Weight Loss',
  Q10: 'Waist Circumference',
  Q11: 'BMI',
  Q12: 'Smoking Status',
  Q13: 'Smoking/Alcohol Details',
  Q14: 'Physical Activity',
  Q15: 'Activity Level',
  Q16: 'Eating Habits',
  Q17: 'Sugar Intake',
  Q18: 'Carbohydrate Intake',
  Q19: 'Processed Food Intake',
  Q20: 'Previous Weight Loss',
  Q21: 'Weight Loss Duration',
  Q22: 'Illnesses',
  Q23: 'Medications',
  Q24: 'Medical Conditions',
  Q25: 'Family History',
} as const;

// Type definitions
export type QuestionId = keyof typeof QUESTION_LABELS;
export type FieldPath = keyof typeof QUESTION_MAPPING;

// Backend questionnaire format
export interface QuestionnaireAnswer {
  questionId: string;
  answer: string;
}

export interface QuestionnaireData {
  questionnaire: QuestionnaireAnswer[];
}