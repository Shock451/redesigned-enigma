import "./App.css";
import React from "react";
import { Container, Paper } from "@material-ui/core";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import SubscriptionForm from "./components/SubscriptionForm/Subscription";

const PLANS_URL = "https://cloud-storage-prices-moberries.herokuapp.com/prices";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(6, "auto"),
    },
    paper: {
      padding: theme.spacing(6),
      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(3),
      }
    },
  })
);

function App() {
  const classes = useStyles();
  const [plans, setPlans] = React.useState([]);
  const steps = [
    "Subscription Options",
    "Payment Information",
    "Order Summary",
  ];

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(PLANS_URL);
        const data = await res.json();
        setPlans(data["subscription_plans"]);
      } catch (err) {
        console.log("An error occured");
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container maxWidth="sm" className={classes.root}>
      <Paper elevation={2} className={classes.paper}>
        <SubscriptionForm plans={plans} steps={steps} />
      </Paper>
    </Container>
  );
}

export default App;
