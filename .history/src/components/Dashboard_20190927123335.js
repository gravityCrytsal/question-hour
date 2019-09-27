import React, { Component } from 'react';
import withStyles from '@material-ui/styles/withStyles';
import { withRouter } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ReactHtmlParser from 'react-html-parser';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';

import Topbar from './Topbar';
import RadioButton from './RadioButton';
import Back from './common/Back'

const backgroundShape = require('../images/shape.svg');

// const numeral = require('numeral');
// numeral.defaultFormat('0,000');

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.primary['A100'],
    overflow: 'hidden',
    background: `url(${backgroundShape}) no-repeat`,
    backgroundSize: 'cover',
    backgroundPosition: '0 400px',
    marginTop: 10,
    padding: 20,
    paddingBottom: 200
  },
  grid: {
    margin: `0 ${theme.spacing(2)}px`
  },
  smallContainer: {
    width: '60%'
  },
  bigContainer: {
    width: '100%'
  },
  stepContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  stepGrid: {
    width: '80%'
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  outlinedButtom: {
    textTransform: 'uppercase',
    margin: theme.spacing(1)
  },
  stepper: {
    backgroundColor: 'transparent'
  },
  paper: {
    padding: theme.spacing(3),
    textAlign: 'left',
    color: theme.palette.text.secondary
  },
  topInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 42
  },
  formControl: {
    width: '100%'
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  borderColumn: {
    borderBottom: `1px solid ${theme.palette.grey['100']}`,
    paddingBottom: 24,
    marginBottom: 24
  },
  flexBar: {
    marginTop: 32,
    display: 'flex',
    justifyContent: 'center'
  },
  result: {
    float: 'right',
    display: 'inline-block',
    zIndex: 1000
  },
})

const getSteps = () => {
  return [
    'Info',
    'Bank',
    'Loan details',
    'Terms',
    'Confirm',
    'Done'
  ];
}

class Dashboard extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      error: null,
      value: null,
      activeStep: 0,
      isLoaded: false,
      loading: true,
      questions: [],
      answeredQuestions: [],
      checkedValue: false
    };
    this.xx = [];
    this.changeText = this.changeText.bind(this);
    this.verifyAnswerArray = this.verifyAnswerArray.bind(this);
  }

  componentDidMount() {
    this.callQuestionApi();
  }
  changeText(answer, question) {
    // console.log(answer, question);
    var x = {};
    x = { 'question': question, correctAnswer: answer };

    this.xx.push(x);
    // console.log(this.xx);
    this.setState({
      answeredQuestions: this.xx
    }, );
  }
  correctAnswerArray(param) {

    var a = [];
    var x = {};
    param.map((v, k) => {
      x = { 'question': v.question, correctAnswer: v.correct_answer };
      a.push(x);
    });
    // console.log(a);
    // this.verifyAnswerArray();
    return a;
  }
  verifyAnswerArray() {
    const { questions, answeredQuestions } = this.state;
    console.log(questions, answeredQuestions);
    let x = {};
    let a = [];
    if (answeredQuestions.length === 10) {
      answeredQuestions.forEach(function (answererd) {
        x.isCorrectAnswer = true;
        questions.forEach(function (original) {
          if (original.question === answererd.question && original.correctAnswer === answererd.correctAnswer) {
            x.isCorrectAnswer = true;
          } else {
            x.isCorrectAnswer = false;
          }
        });
        a.push(x);
        console.log(a);

      });
    }

  }
  callQuestionApi() {
    fetch("https://opentdb.com/api.php?amount=10&difficulty=hard&type=boolean")
      .then(res => res.json())
      .then(
      (result) => {
        // console.log(JSON.stringify(result.results), 0, null);
        this.setState({
          questions: this.correctAnswerArray(result.results),
          loading: false,
        });
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        this.setState({
          loading: false,
          error
        });
      }
      );
  }


  render() {

    const { classes } = this.props;
    const { questions, loading } = this.state;
    // const correctAnswerArray = this.correctAnswerArray(questions);
    const steps = getSteps();
    const { activeStep } = this.state;

    return (
      <React.Fragment>
        <CssBaseline />
        <Topbar />
        <div className={classes.root}>
          <Grid container justify="center">
            <Grid spacing={10} alignItems="center" justify="center" container className={classes.grid}>
              <Grid item xs={12}>
                <Back />
                <Link className={classes.result}>
                  <Button color='primary' variant="contained" onClick={this.verifyAnswerArray} >
                    Submit
            </Button>
                </Link>
                <div className={classes.stepContainer}>
                  <div className={classes.bigContainer}>
                    <Stepper classes={{ root: classes.stepper }} activeStep={activeStep} alternativeLabel>
                      {steps.map(label => {
                        return (
                          <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                          </Step>
                        );
                      })}
                    </Stepper>
                  </div>
                  <Fade
                    in={loading}
                    style={{
                      transitionDelay: loading ? '800ms' : '0ms',
                    }}
                    unmountOnExit
                  >
                    <CircularProgress style={{ marginBottom: 32, width: 100, height: 100 }} />
                  </Fade>
                  {/* <ReactRadioButtonGroup name="number" options={["One", "Two", "Three"]} value="Three" /> */}

                  {questions.map((k, v) => {
                    return (
                      <div className={classes.bigContainer} key={v + 1}>
                        <Paper className={classes.paper}>
                          <div className={classes.topInfo}>
                            <div>
                              <Typography variant="subtitle1" style={{ fontWeight: 'bold' }} gutterBottom>
                                {v + 1}.  {ReactHtmlParser(k.question)}
                              </Typography>
                              {/* <Typography variant="body1" gutterBottom> */}
                              <RadioButton key={'radio' + v + 1} id={'radioID' + v + 1} props={{
                                answeredQuestions: this.state.answeredQuestions,
                                checkedValue: this.state.checkedValue,
                                changeText: this.changeText,
                                name: 'radioID' + v + 1,
                                question: k.question
                              }} />
                              {/* </Typography> */}
                            </div>
                          </div>
                        </Paper>
                      </div>)
                  })};

                </div>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </React.Fragment >
    )
  }
}

export default withRouter(withStyles(styles)(Dashboard));
