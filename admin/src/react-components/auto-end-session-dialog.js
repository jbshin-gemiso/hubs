/* eslint-disable @calm/react-intl/missing-formatted-message*/
/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { withStyles } from 'tss-react/mui';
import withCommonStyles from "../utils/with-common-styles";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

const TIMER_SECONDS = 30;

const styles = withCommonStyles(() => ({
  endSessionMessage: {
    fontSize: "16pt"
  }
}));

class AutoEndSessionDialogComp extends Component {
  state = {
    startedAt: null,
    timerInterval: null,
    secondsRemaining: TIMER_SECONDS,
    sessionEnded: false
  };

  componentDidMount() {
    this.startTimer();
  }

  componentWillUnmount() {
    this.endTimer();
  }

  startTimer = () => {
    const timerInterval = setInterval(() => {
      let secondsRemaining = TIMER_SECONDS;

      if (this.state.timerStartedAt) {
        const secondsSinceStart = (new Date() - this.state.timerStartedAt) / 1000;
        secondsRemaining = Math.max(0, Math.floor(TIMER_SECONDS - secondsSinceStart));
      }

      this.setState({ secondsRemaining });

      if (this.state.secondsRemaining === 0) {
        this.endTimer();
        this.props.onEndSession();
        this.setState({ sessionEnded: true });
      }
    }, 500);

    this.setState({ timerStartedAt: new Date(), timerInterval });
  };

  endTimer = () => {
    clearInterval(this.state.timerInterval);
    this.setState({
      timerStartedAt: null,
      timerInterval: null,
      secondsRemaining: TIMER_SECONDS
    });
  };

  onCancel = () => {
    this.endTimer();
    this.props.onCancel();
  };

  render() {
    const { classes } = this.props;
    return (
      <Dialog open={true}>
        <DialogContent>
          <Typography className={classes.endSessionMessage}>
            {!this.state.sessionEnded
              ? `Auto-ending session in ${this.state.secondsRemaining} seconds.`
              : "Your session has ended reload to start a new one."}
          </Typography>
        </DialogContent>
        {!this.state.sessionEnded ? (
          <Button onClick={this.onCancel}>Cancel</Button>
        ) : (
          <Button onClick={() => location.reload()}>Reload</Button>
        )}
      </Dialog>
    );
  }
}

export const AutoEndSessionDialog = withStyles(AutoEndSessionDialogComp, styles);
