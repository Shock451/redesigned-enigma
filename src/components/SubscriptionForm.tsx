import React from "react";
import { Formik } from "formik";
import valid from "card-validator";
import * as Yup from "yup";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

import {
  Step,
  StepLabel,
  Typography,
  Button,
  Stepper as MuiStepper,
  FormControl,
  FormHelperText,
  Select,
  MenuItem,
  InputLabel,
  Box,
  TextField as MuiTextField,
  TextFieldProps,
  FormControlLabel,
  Checkbox,
  InputAdornment,
} from "@material-ui/core";

import NumberFormat from "react-number-format";

type ExtendedTextFieldProps = TextFieldProps & {
  format?: string;
};

function TextField(props: ExtendedTextFieldProps) {
  return <MuiTextField {...props} />;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    backButton: {
      marginRight: theme.spacing(1),
    },
    instructions: {
      textAlign: "center",
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      width: "100%",
    },
    priceItem: {
      display: "flex",
      justifyContent: "space-between",
    },
  })
);

interface NumberFormatCustomProps {
  inputRef: (instance: NumberFormat | null) => void;
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  format: string;
}

function NumberFormatCustom(props: NumberFormatCustomProps) {
  const { inputRef, onChange, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
    />
  );
}

const SubscriptionSchema = Yup.object().shape({
  duration: Yup.number().oneOf([3, 6, 12]).required(),
  storage: Yup.number().oneOf([5, 10, 50]).required(),
  upFront: Yup.boolean().required(),
  termsAgreement: Yup.boolean()
    .isTrue("You must accept the terms and conditions to proceed")
    .required(),
  cardNumber: Yup.string()
    .test(
      "test-number",
      "Credit Card number is invalid",
      (value) => valid.number(value).isValid
    )
    .required(),
  expirationDate: Yup.string()
    .test(
      "test-number",
      "Credit Card expiry date is invalid",
      (value) => valid.expirationDate(value).isValid
    )
    .required(),
  cvv: Yup.string()
    .test(
      "test-number",
      "Credit Card security code is invalid",
      (value) => valid.cvv(value).isValid
    )
    .required(),
  email: Yup.string()
    .email("Email address is not valid")
    .required("Email address is required"),
});

function SubscriptionForm(props: any) {
  const classes = useStyles();
  let { plans, steps } = props;

  const [activeStep, setActiveStep] = React.useState(0);
  
  let disableNextButton: boolean = false;
  const isFinalStep = activeStep === steps.length - 1;
  let total: number = 0.0,
    subtotal: number = 0.0;

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
          <div>
            <Formik
              validateOnMount
              initialValues={{
                duration: 12,
                storage: 5,
                upFront: 0,
                cardNumber: "",
                expirationDate: "",
                cvv: "",
                email: "",
                termsAgreement: false,
              }}
              validationSchema={SubscriptionSchema}
              onSubmit={async (values) => {
                await fetch("https://httpbin.org/post", {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    ...values,
                    upFront: !!values.upFront,
                  }),
                });
                // handle failure here
                handleNext();
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
              }) => {
                if (activeStep === 0) {
                  disableNextButton = !!(
                    errors.duration ||
                    errors.storage ||
                    errors.upFront
                  );
                } else if (activeStep === 1) {
                  disableNextButton = !!(
                    errors.cvv ||
                    errors.cardNumber ||
                    errors.expirationDate
                  );
                } else if (activeStep === 2) {
                  disableNextButton = !!(errors.email || errors.termsAgreement);
                }

                let selectedPlan = plans.find(
                  (plan: {
                    duration_months: number;
                    price_usd_per_gb: number;
                  }) => plan.duration_months === values.duration
                );

                if (selectedPlan) {
                  subtotal =
                    values.storage *
                    selectedPlan.price_usd_per_gb *
                    values.duration;
                  if (!!values.upFront) {
                    total = subtotal - 0.1 * subtotal;
                  } else {
                    total = subtotal;
                  }
                }

                return (
                  <Box>
                    <form onSubmit={handleSubmit}>
                      {activeStep === 0 && (
                        <Box>
                          <FormControl required className={classes.formControl}>
                            <InputLabel id="select-duration-label">
                              Duration of subscription
                            </InputLabel>
                            <Select
                              name="duration"
                              labelId="select-duration-label"
                              id="select-duration"
                              value={values.duration}
                              onChange={handleChange}
                              autoWidth
                            >
                              {plans &&
                                plans.map((plan: any, index: number) => (
                                  <MenuItem
                                    key={`${plan.duration_months}--${index}`}
                                    value={plan.duration_months}
                                  >
                                    {plan.duration_months} Months
                                  </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>
                              The longer the duration, the lower the price
                            </FormHelperText>
                          </FormControl>
                          <FormControl required className={classes.formControl}>
                            <InputLabel id="select-storage-label">
                              Amount of cloud storage (GB)
                            </InputLabel>
                            <Select
                              name="storage"
                              labelId="select-storage-label"
                              id="select-storage"
                              value={values.storage}
                              onChange={handleChange}
                              autoWidth
                            >
                              <MenuItem value={5}>5</MenuItem>
                              <MenuItem value={10}>10</MenuItem>
                              <MenuItem value={50}>50</MenuItem>
                            </Select>
                            <FormHelperText>
                              With larger storage, you get more space to use
                              backup features
                            </FormHelperText>
                          </FormControl>
                          <FormControl required className={classes.formControl}>
                            <InputLabel id="select-payment-plan-label">
                              Do you wish to pay upfront?
                            </InputLabel>
                            <Select
                              name="upFront"
                              labelId="select-payment-plan-label"
                              id="select-payment-plan"
                              value={values.upFront}
                              onChange={handleChange}
                              autoWidth
                            >
                              <MenuItem value={0}>No</MenuItem>
                              <MenuItem value={1}>
                                Yes, I want to pay up-front
                              </MenuItem>
                            </Select>
                            <FormHelperText>
                              We currently offer a 10% discount for upfront
                              payment.
                            </FormHelperText>
                          </FormControl>
                        </Box>
                      )}

                      {activeStep === 1 && (
                        <Box>
                          <TextField
                            label="Card number"
                            onBlur={handleBlur}
                            value={values.cardNumber}
                            onChange={handleChange}
                            fullWidth
                            required
                            className={classes.formControl}
                            name="cardNumber"
                            id="input-card-number"
                            error={!!(touched.cardNumber && errors.cardNumber)}
                            helperText={
                              !!(touched.cardNumber && errors.cardNumber)
                                ? errors.cardNumber
                                : ""
                            }
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  {valid.number(values.cardNumber).card?.type}
                                </InputAdornment>
                              ),
                              inputProps: {
                                mask: "_",
                                format: "#### #### #### ####" as string,
                              },
                              inputComponent: NumberFormatCustom as any,
                            }}
                          />
                          <TextField
                            label="Expiry date"
                            value={values.expirationDate}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            fullWidth
                            required
                            className={classes.formControl}
                            name="expirationDate"
                            id="input-card-expiry-date"
                            error={
                              !!(
                                touched.expirationDate && errors.expirationDate
                              )
                            }
                            helperText={
                              !!(
                                touched.expirationDate && errors.expirationDate
                              )
                                ? errors.expirationDate
                                : ""
                            }
                            InputProps={{
                              inputProps: {
                                format: "##/##",
                                placeholder: "MM/YY" as string,
                                mask: ["M", "M", "Y", "Y"],
                              },
                              inputComponent: NumberFormatCustom as any,
                            }}
                          />
                          <TextField
                            label="Security code (CVV)"
                            value={values.cvv}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            fullWidth
                            required
                            className={classes.formControl}
                            name="cvv"
                            id="input-card-security-code"
                            error={!!(touched.cvv && errors.cvv)}
                            helperText={
                              !!(touched.cvv && errors.cvv) ? errors.cvv : ""
                            }
                            InputProps={{
                              inputProps: {
                                format: "###",
                              },
                              inputComponent: NumberFormatCustom as any,
                            }}
                          />
                        </Box>
                      )}

                      {activeStep === 2 && (
                        <Box>
                          <Box>
                            <Typography variant="body2" gutterBottom>
                              Kindly review the information you've provided
                            </Typography>
                          </Box>
                          <Box mt={3}>
                            <Typography variant="body1">
                              Subscription duration - {values.duration} months
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              Your subscription will be renewed every{" "}
                              {values.duration} months.
                            </Typography>
                          </Box>
                          <Box mt={2}>
                            <Typography variant="body1">
                              Amount of storage - {values.storage}GB
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              {values.storage}GB for all your storage needs.
                            </Typography>
                          </Box>
                          <Box mt={2}>
                            <Typography variant="body1">
                              Upfront payment -{" "}
                              {!!values.upFront ? "Yes" : "No"}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                              {!!values.upFront
                                ? "You will get a 10% discount off the total cost of your subscription"
                                : "You selected the instalment payment plan"}
                            </Typography>
                          </Box>
                          <Box mt={4}>
                            <TextField
                              name="email"
                              required
                              fullWidth
                              className={classes.formControl}
                              value={values.email}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              id="input-email"
                              label="Email address"
                              error={!!(touched.email && errors.email)}
                              helperText={
                                !!(touched.email && errors.email)
                                  ? errors.email
                                  : ""
                              }
                            />
                            <FormControlLabel
                              className={classes.formControl}
                              control={
                                <Checkbox
                                  checked={values.termsAgreement}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  name="termsAgreement"
                                  color="primary"
                                />
                              }
                              label="I have read and agreed with the terms and conditions."
                            />
                            <FormHelperText
                              error={
                                !!(
                                  touched.termsAgreement &&
                                  errors.termsAgreement
                                )
                              }
                            >
                              {!!(
                                touched.termsAgreement && errors.termsAgreement
                              )
                                ? errors.termsAgreement
                                : ""}
                            </FormHelperText>
                          </Box>
                        </Box>
                      )}
                    </form>
                    <Box mt={3} p={2} bgcolor="#EEEEEE">
                      <Box mb={2} className={classes.priceItem}>
                        <Typography variant="body2">Selected plan</Typography>
                        <Typography variant="body2">
                          {selectedPlan?.price_usd_per_gb.toLocaleString(
                            "en-US",
                            {
                              style: "currency",
                              currency: "USD",
                            }
                          )}{" "}
                          / GB for {selectedPlan?.duration_months} months
                        </Typography>
                      </Box>
                      {!!values.upFront && (
                        <>
                          <Box mb={2} className={classes.priceItem}>
                            <Typography variant="body2">Discount</Typography>
                            <Typography variant="body2">10% OFF</Typography>
                          </Box>
                          <Box mb={2} className={classes.priceItem}>
                            <Typography variant="body2">Subtotal</Typography>
                            <Typography variant="body2">
                              {subtotal.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                              })}
                            </Typography>
                          </Box>
                        </>
                      )}
                      <Box className={classes.priceItem}>
                        <Typography variant="body2">Total</Typography>
                        <Typography variant="body2">
                          <b>
                            {total.toLocaleString("en-US", {
                              style: "currency",
                              currency: "USD",
                            })}
                          </b>
                        </Typography>
                      </Box>
                    </Box>
                    <Box mt={6}>
                      <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        className={classes.backButton}
                      >
                        Back
                      </Button>
                      <Button
                        disabled={disableNextButton}
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          isFinalStep ? handleSubmit() : handleNext()
                        }
                      >
                        {isFinalStep ? "Confirm Order" : "Next"}
                      </Button>
                    </Box>
                  </Box>
                );
              }}
            </Formik>
          </div>
        )}
      </div>
    </div>
  );
}

export default SubscriptionForm;
