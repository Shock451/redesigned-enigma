import React from "react";

import { Typography, Box } from "@material-ui/core";
import useStyles from "./styles";

interface Props {
  price: number | undefined;
  duration: number | undefined;
  upFront: number;
  subtotal: number;
  total: number;
}

function CostSummary({ price, duration, upFront, subtotal, total }: Props) {
  const classes = useStyles();

  return (
    <Box mt={3} p={2} bgcolor="#EEEEEE">
      <Box mb={2} className={classes.priceItem}>
        <Typography variant="body2">Selected plan</Typography>
        <Typography variant="body2">
          {price?.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}{" "}
          / GB for {duration} months
        </Typography>
      </Box>
      {!!upFront && (
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
  );
}

export default CostSummary;
