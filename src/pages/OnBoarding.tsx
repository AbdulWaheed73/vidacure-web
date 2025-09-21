import { useState, useEffect } from "react";
import {
  OnboardingContext,
  type OnboardingData,
  PersonalInfoStep,
  PhysicalDetailsStep,
  HealthBackgroundStep,
  MedicalHistoryStep,
  WelcomeScreen,
  OnboardingProgressBar,
  Header,
  Button,
  type PersonalInfo,
  type PhysicalDetails,
  type HealthBackground,
  type MedicalHistory,
} from "@/components/onboarding";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants";
import type { User } from "@/types";
import {
  validatePersonalInfo,
  validatePhysicalDetails,
  validateHealthBackground,
  validateMedicalHistory,
  getValidationErrors,
  transformFormDataToQuestionnaire,
} from "@/components/onboarding";
import { submitQuestionnaire } from "@/services/questionnaire";
import { api } from "@/services/api";



// Main Onboarding Flow Component
const OnboardingFlow = ({ user }: { user: User | null }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showErrors, setShowErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    personalInfo: {
      fullName: user?.name || "",
      dateOfBirth: "",
      gender: "",
      email: "",
    },
    physicalDetails: {
      height: "",
      currentWeight: "",
      goalWeight: "",
      lowestWeight: "",
      highestWeight: "",
      expectedWeightLoss: "",
      waistCircumference: "",
      bmi: "",
    },
    healthBackground: {
      smokingStatus: "",
      smokingAlcoholDetails: "",
      physicalActivity: "",
      activityLevel: "",
      eatingHabits: "",
      sugarIntake: "",
      carbohydrateIntake: "",
      processedFoodIntake: "",
      previousWeightLoss: "",
      weightLossDuration: "",
    },
    medicalHistory: {
      illnesses: "",
      medications: "",
      conditions: [],
      familyHistory: [],
    },
  });

  // Initialize form with BankID data when user becomes available
  useEffect(() => {
    if (user && user.name && !data.personalInfo.fullName) {
      setData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          fullName: user.name
        }
      }));
    }
    setIsLoading(false);
  }, [user, data.personalInfo.fullName]);

  const updateData = (step: keyof OnboardingData, newData: PersonalInfo | PhysicalDetails | HealthBackground | MedicalHistory) => {
    setData((prev) => ({
      ...prev,
      [step]: newData,
    }));

    // Remove auto-save - only submit when form is complete
  };

  // Remove auto-save functionality - not needed

  const validateCurrentStep = (): boolean => {
    let isValid = false;
    let stepData: PersonalInfo | PhysicalDetails | HealthBackground | MedicalHistory;
    
    switch (currentStep) {
      case 1:
        stepData = data.personalInfo;
        isValid = validatePersonalInfo(stepData);
        break;
      case 2:
        stepData = data.physicalDetails;
        isValid = validatePhysicalDetails(stepData);
        break;
      case 3:
        stepData = data.healthBackground;
        isValid = validateHealthBackground(stepData);
        break;
      case 4:
        stepData = data.medicalHistory;
        isValid = validateMedicalHistory(stepData);
        break;
      default:
        isValid = true;
    }
    
    if (!isValid && currentStep > 0) {
      const errors = getValidationErrors(currentStep, stepData!);
      setValidationErrors(errors);
      setShowErrors(true);
    } else {
      setValidationErrors([]);
      setShowErrors(false);
    }
    
    return isValid;
  };

  const handleNext = () => {
    if (currentStep === 0) {
      // Welcome screen - no validation needed
      setCurrentStep(currentStep + 1);
      return;
    }
    
    if (validateCurrentStep()) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
        setShowErrors(false);
        setValidationErrors([]);
      } else {
        // Handle final form submission
        handleFinalSubmission();
      }
    }
  };

  // Final submission handler
  const handleFinalSubmission = async () => {
    try {
      setIsLoading(true);

      // Separate email from questionnaire data
      const { email, ...personalInfoWithoutEmail } = data.personalInfo;
      const dataWithoutEmail: OnboardingData = {
        ...data,
        personalInfo: {
          ...personalInfoWithoutEmail,
          email: "" // Exclude email from questionnaire
        }
      };

      const questionnaire = transformFormDataToQuestionnaire(dataWithoutEmail);

      // Submit questionnaire and email separately
      await Promise.all([
        submitQuestionnaire(questionnaire),
        api.patch('/api/patient/profile', { email })
      ]);

      // Refresh auth status to get updated hasCompletedOnboarding flag
      // await checkAuthStatus();

      // alert(`Questionnaire submitted successfully! Thank you for completing your health assessment.`);

      // Navigate to booking page after completing onboarding
      navigate(ROUTES.PATIENT_APPOINTMENTS);

    } catch (error: any) {
      console.error('Submission error:', error);
      alert(`Submission failed: ${error.message}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowErrors(false);
      setValidationErrors([]);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeScreen />;
      case 1:
        return <PersonalInfoStep />;
      case 2:
        return <PhysicalDetailsStep />;
      case 3:
        return <HealthBackgroundStep />;
      case 4:
        return <MedicalHistoryStep />;
      default:
        return <WelcomeScreen />;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
      case 2:
      case 3:
      case 4:
        return "Get Started";
      default:
        return "";
    }
  };

  return (
    <OnboardingContext.Provider
      value={{ data, updateData, currentStep, setCurrentStep, validationErrors, showErrors, user }}
    >
      <div className="min-h-screen bg-[#e6f9f6]">
        <Header />

        <div className="flex items-center justify-center p-8">
          <div className="bg-white rounded-[16px] shadow-lg max-w-[806px] w-full p-12">
            <div className="flex flex-col gap-8">
              {/* Header Section */}
              {currentStep > 0 && (
                <>
                  <h1 className="font-sora font-bold text-[36px] text-[#282828] leading-[1.2]">
                    {getStepTitle()}
                  </h1>
                  <OnboardingProgressBar currentStep={currentStep} />
                </>
              )}

              {/* Step Content */}
              <div className="flex-1">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00a38a]"></div>
                    <span className="ml-3 text-[#282828]">Loading...</span>
                  </div>
                ) : (
                  renderStep()
                )}
              </div>

              {/* Validation Errors */}
              {showErrors && validationErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-[12px] p-4">
                  <h3 className="font-sora font-semibold text-red-800 mb-2">
                    Please complete the following required fields:
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index} className="text-red-700 font-manrope text-[14px]">
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Navigation Buttons */}
              {currentStep > 0 && (
                <>
                  <div className="w-full h-px bg-[#b0b0b0] rounded-[1000px]" />

                  <div className="flex items-center justify-between">
                    {currentStep > 1 ? (
                      <Button variant="outline" onClick={handleBack} className={isLoading ? "opacity-50 cursor-not-allowed" : ""}>
                        ← Back
                      </Button>
                    ) : (
                      <div />
                    )}

                    <div className="flex items-center gap-3">
                      <Button 
                        onClick={handleNext} 
                        className={isLoading ? "opacity-50 cursor-not-allowed" : ""}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            {currentStep === 4 ? "Submitting..." : "Loading..."}
                          </>
                        ) : (
                          currentStep === 4 ? "Complete" : "Next"
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* <Alert>
                    <AlertDescription className="text-[12px] text-center">
                      * Your data is secure and encrypted. We comply with
                      healthcare privacy standards.
                      <br />
                      Backed by licensed professionals and real clinical
                      outcomes.
                    </AlertDescription>
                  </Alert> */}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </OnboardingContext.Provider>
  );
};
export default OnboardingFlow;