## JobBot Assessment

An application that implements a subscription order process for a cloud storage provider. 

View it here: https://suborder.herokuapp.com/

Git repository URL: https://github.com/Shock451/redesigned-enigma


### Requirements
- If the user selects upfront payment, the total price should be reduced by 10%
- Current selected subscription and final price should be shown on every step
- Subscription prices should be retrieved from https://cloud-storage-prices-moberries.herokuapp.com/prices
- All parameters should be required
- It should be possible to change steps by clicking on the Next or Back button.
- Every step needs to be completed in order to see the next one.
- Confirm button click handler should send data to the API endpoint https://httpbin.org/post


### Built with
- [React](https://reactjs.org/) - React Framework
- [Material UI](https://material-ui.com/) - React components for faster and easier web development.
- [Formik](https://formik.org/docs/overview) - Build forms in React
- [Yup](https://github.com/jquense/yup) - JavaScript object schema validator


### Process
The subscription order process has 3 steps:
1. Select subscription parameters:
    - Duration: 3/6/12 Months (default: 12)
    - Amount of gigabytes in a cloud: 5/10/50 (default: 5)
    - Upfront payment: yes/no (default: no)
1. Payment data:
    - Credit card number
    - Credit card expiration date
    - Credit card security code
3. Confirmation
    - Summary of the selected subscription including total price and price per GB.
    - Email of the user
    - Terms and conditions agreement checkbox
    - Confirmation button
