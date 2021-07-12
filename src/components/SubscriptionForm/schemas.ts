import * as Yup from "yup";
import valid from "card-validator";

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

export { SubscriptionSchema };
