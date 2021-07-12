import React from "react";

import { Typography, Box } from "@material-ui/core";

interface Props {
  duration: number | undefined;
  storage: number;
  upFront: number;
}

function OrderSummary({ duration, upFront, storage }: Props) {
  return (
    <>
      <Box>
        <Typography variant="body2" gutterBottom>
          Kindly review the information you've provided
        </Typography>
      </Box>
      <Box mt={3}>
        <Typography variant="body1">
          Subscription duration - {duration} months
        </Typography>
        <Typography variant="body2" gutterBottom>
          Your subscription will be renewed every {duration} months.
        </Typography>
      </Box>
      <Box mt={2}>
        <Typography variant="body1">Amount of storage - {storage}GB</Typography>
        <Typography variant="body2" gutterBottom>
          {storage}GB for all your storage needs.
        </Typography>
      </Box>
      <Box mt={2}>
        <Typography variant="body1">
          Upfront payment - {!!upFront ? "Yes" : "No"}
        </Typography>
        <Typography variant="body2" gutterBottom>
          {!!upFront
            ? "You will get a 10% discount off the total cost of your subscription"
            : "You selected the instalment payment plan"}
        </Typography>
      </Box>
    </>
  );
}

export default OrderSummary;
