import { useEffect } from 'react';

export default function GuidedDemoTour({
  open,
  steps = [],
  currentStep,
  onNext,
  onBack,
  onSkip,
  onFinish,
  onStepView,
}) {
  const step = steps[currentStep];

  useEffect(() => {
    if (!open || !step?.targetId) return undefined;

    const target = document.getElementById(step.targetId);
    if (!target) return undefined;

    target.classList.add('demo-tour-target', 'demo-tour-active');
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });

    return () => {
      target.classList.remove('demo-tour-target', 'demo-tour-active');
    };
  }, [currentStep, open, step]);

  useEffect(() => {
    if (!open || !step) return;
    onStepView?.(step, currentStep);
  }, [currentStep, onStepView, open, step]);

  if (!open || !step) return null;

  const isLastStep = currentStep === steps.length - 1;

  return (
    <>
      <div className="demo-tour-backdrop" onClick={onSkip} />
      <div className="demo-tour-panel">
        <div className="demo-tour-header">
          <span className="demo-tour-counter">
            Step {currentStep + 1} of {steps.length}
          </span>
          <button className="action-btn small" onClick={onSkip}>
            Skip
          </button>
        </div>
        <div className="demo-tour-body">
          <h3>{step.title}</h3>
          <p>{step.copy}</p>
        </div>
        <div className="demo-tour-actions">
          <button className="action-btn small" onClick={onBack} disabled={currentStep === 0}>
            Back
          </button>
          {!isLastStep ? (
            <button className="action-btn small primary" onClick={onNext}>
              Next
            </button>
          ) : (
            <button className="action-btn small primary" onClick={onFinish}>
              Finish
            </button>
          )}
        </div>
      </div>
    </>
  );
}
