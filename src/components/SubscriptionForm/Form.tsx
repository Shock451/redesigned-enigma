import React from "react";
import { Formik } from "formik";
import valid from "card-validator";

import { SubscriptionSchema } from "./schemas";

import {
  Button,
  FormControl,
  FormHelperText,
  Select,
  MenuItem,
  InputLabel,
  Box,
  FormControlLabel,
  Checkbox,
  InputAdornment,
} from "@material-ui/core";

import CostSummary from "../Summary/CostSummary";
import OrderSummary from "../Summary/OrderSummary";

import NumberFormat from "../CustomNumberFormat";
import TextField from "../CustomTextField";
import useStyles from "./styles";

interface Props {
  handleNext: () => void;
  handleBack: () => void;
  plans: {
    duration_months: number;
    price_usd_per_gb: number;
  }[];
  activeStep: number;
  isFinalStep: boolean;
}

function Form({
  handleNext,
  handleBack,
  plans,
  activeStep,
  isFinalStep,
}: Props) {
  const classes = useStyles();
  return (
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
          let disableNextButton: boolean = false;

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
            (plan: { duration_months: number; price_usd_per_gb: number }) =>
              plan.duration_months === values.duration
          );

          let total: number = 0,
            subtotal: number = 0;

          if (selectedPlan) {
            subtotal =
              values.storage * selectedPlan.price_usd_per_gb * values.duration;
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
                              key={`plan-${plan.duration_months}`}
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
                        With larger storage, you get more space to use backup
                        features
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
                        We currently offer a 10% discount for upfront payment.
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
                        inputComponent: NumberFormat as any,
                      }}
                    />
                    <TextField
                      label="Expiry date"
                      value={values.expirationDate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={classes.formControl}
                      name="expirationDate"
                      id="input-card-expiry-date"
                      error={
                        !!(touched.expirationDate && errors.expirationDate)
                      }
                      helperText={
                        !!(touched.expirationDate && errors.expirationDate)
                          ? errors.expirationDate
                          : ""
                      }
                      InputProps={{
                        inputProps: {
                          format: "##/##",
                          placeholder: "MM/YY" as string,
                          mask: ["M", "M", "Y", "Y"],
                        },
                        inputComponent: NumberFormat as any,
                      }}
                    />
                    <TextField
                      label="Security code (CVV)"
                      value={values.cvv}
                      onChange={handleChange}
                      onBlur={handleBlur}
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
                        inputComponent: NumberFormat as any,
                      }}
                    />
                  </Box>
                )}

                {activeStep === 2 && (
                  <Box>
                    <OrderSummary
                      upFront={values.upFront}
                      storage={values.storage}
                      duration={values.duration}
                    />
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
                          !!(touched.email && errors.email) ? errors.email : ""
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
                          !!(touched.termsAgreement && errors.termsAgreement)
                        }
                      >
                        {!!(touched.termsAgreement && errors.termsAgreement)
                          ? errors.termsAgreement
                          : ""}
                      </FormHelperText>
                    </Box>
                  </Box>
                )}
              </form>
              <CostSummary
                price={selectedPlan?.price_usd_per_gb}
                duration={selectedPlan?.duration_months}
                upFront={values.upFront}
                subtotal={subtotal}
                total={total}
              />
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
                  onClick={() => (isFinalStep ? handleSubmit() : handleNext())}
                >
                  {isFinalStep ? "Confirm Order" : "Next"}
                </Button>
              </Box>
            </Box>
          );
        }}
      </Formik>
    </div>
  );
}

export default Form;
