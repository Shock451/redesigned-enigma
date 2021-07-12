import React from "react";

import {
  Step,
  StepLabel,
  Typography,
  Button,
  Stepper as MuiStepper,
  Box,
} from "@material-ui/core";

import useStyles from "./styles";
import Form from './Form';

function SubscriptionForm(props: any) {
  const classes = useStyles();
  let { steps, plans } = props;
  const [activeStep, setActiveStep] = React.useState(0);
  const isFinalStep = activeStep === steps.length - 1;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className={classes.root}>
      <MuiStepper activeStep={activeStep} alternativeLabel>
        {steps.map((label: string) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </MuiStepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              Thank you for your purchase!
            </Typography>
            <Box mt={4} textAlign="center">
              <Button onClick={handleReset}>ADD NEW SUBSCRIPTION</Button>
            </Box>
          </div>
        ) : (
          <Form
            plans={plans}
            activeStep={activeStep}
            isFinalStep={isFinalStep}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        )}
      </div>
    </div>
  );
}

export default SubscriptionForm;
