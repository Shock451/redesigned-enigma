import { makeStyles, Theme, createStyles } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    priceItem: {
      display: "flex",
      justifyContent: "space-between",
    },
  })
);

export default useStyles;
